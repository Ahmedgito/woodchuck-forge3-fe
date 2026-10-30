const HEIC_BRANDS = new Set([
  'heic',
  'heix',
  'hevc',
  'hevx',
  'heim',
  'heis',
  'hevm',
  'hevs',
  'mif1',
  'msf1',
])

type IsoBox = {
  offset: number
  length: number
  kind: string
  start: number
  version?: number
  boxes?: IsoBox[]
}

function toUint8Array(input: ArrayBuffer | Buffer | Uint8Array): Uint8Array {
  if (input instanceof Uint8Array) {
    return input
  }

  if (typeof Buffer !== 'undefined' && input instanceof Buffer) {
    return input
  }

  return new Uint8Array(input)
}

function readUint32(buf: Uint8Array, offset: number): number {
  return new DataView(buf.buffer, buf.byteOffset + offset, 4).getUint32(0, false)
}

function readUint16(buf: Uint8Array, offset: number): number {
  return new DataView(buf.buffer, buf.byteOffset + offset, 2).getUint16(0, false)
}

function readUint8(buf: Uint8Array, offset: number): number {
  return buf[offset]
}

function readString(buf: Uint8Array, offset: number, length: number): string {
  return String.fromCharCode(...buf.subarray(offset, offset + length))
}

function readUintBytes(buf: Uint8Array, offset: number, size: number): number {
  if (size === 1) return readUint8(buf, offset)
  if (size === 2) return readUint16(buf, offset)
  if (size === 4) return readUint32(buf, offset)
  if (size === 8) {
    return Number(
      new DataView(buf.buffer, buf.byteOffset + offset, 8).getBigUint64(0, false)
    )
  }
  return 0
}

function getNibbles(buf: Uint8Array, offset: number): [number, number] {
  const value = readUint8(buf, offset)
  return [value >> 4, value & 0x0f]
}

function parseBoxHead(buf: Uint8Array, offset: number): IsoBox {
  let length = readUint32(buf, offset)
  const kind = readString(buf, offset + 4, 4)
  let start = offset + 8

  if (length === 1) {
    length = readUintBytes(buf, offset + 8, 8)
    start += 8
  }

  return { offset, length, kind, start }
}

function parseBoxFullHead(buf: Uint8Array, box: IsoBox): void {
  if (box.version !== undefined) {
    return
  }

  const versionFlags = readUint32(buf, box.start)
  box.version = versionFlags >> 24
  box.start += 4
}

function parseBoxes(buf: Uint8Array, offset: number, end: number): IsoBox[] {
  const boxes: IsoBox[] = []

  while (offset < end - 4) {
    const box = parseBoxHead(buf, offset)
    if (box.length === 0 || box.length > buf.length) {
      break
    }

    boxes.push(box)
    offset += box.length
  }

  return boxes
}

function findBox(buf: Uint8Array, parent: IsoBox, kind: string): IsoBox | undefined {
  if (!parent.boxes) {
    parent.boxes = parseBoxes(buf, parent.start, parent.offset + parent.length)
  }

  return parent.boxes.find((box) => box.kind === kind)
}

function findExifLocIdInIinf(buf: Uint8Array, box: IsoBox): number | undefined {
  parseBoxFullHead(buf, box)
  let offset = box.start
  let count = readUint16(buf, offset)
  offset += 2

  while (count--) {
    const infe = parseBoxHead(buf, offset)
    parseBoxFullHead(buf, infe)
    const infeOffset = infe.start

    if (infe.version !== undefined && infe.version >= 2) {
      const idSize = infe.version === 3 ? 4 : 2
      const name = readString(buf, infeOffset + idSize + 2, 4)

      if (name === 'Exif') {
        return readUintBytes(buf, infeOffset, idSize)
      }
    }

    offset += infe.length
  }

  return undefined
}

function findExtentInIloc(
  buf: Uint8Array,
  box: IsoBox,
  wantedLocId: number
): [number, number] | undefined {
  parseBoxFullHead(buf, box)
  let offset = box.start
  const [offsetSize, lengthSize] = getNibbles(buf, offset++)
  const [baseOffsetSize, indexSize] = getNibbles(buf, offset++)
  const itemIdSize = box.version === 2 ? 4 : 2
  const constMethodSize = box.version === 1 || box.version === 2 ? 2 : 0
  const extentSize = indexSize + offsetSize + lengthSize
  const itemCountSize = box.version === 2 ? 4 : 2
  let itemCount = readUintBytes(buf, offset, itemCountSize)
  offset += itemCountSize

  while (itemCount--) {
    const itemId = readUintBytes(buf, offset, itemIdSize)
    offset += itemIdSize + constMethodSize + 2 + baseOffsetSize
    const extentCount = readUint16(buf, offset)
    offset += 2

    if (itemId === wantedLocId) {
      return [
        readUintBytes(buf, offset + indexSize, offsetSize),
        readUintBytes(buf, offset + indexSize + offsetSize, lengthSize),
      ]
    }

    offset += extentCount * extentSize
  }

  return undefined
}

export function isHeicOrHeifBuffer(input: ArrayBuffer | Buffer | Uint8Array): boolean {
  const buf = toUint8Array(input)

  if (buf.length < 12 || readString(buf, 4, 4) !== 'ftyp') {
    return false
  }

  const ftypLength = readUint32(buf, 0)
  let offset = 8

  while (offset < ftypLength) {
    if (HEIC_BRANDS.has(readString(buf, offset, 4))) {
      return true
    }
    offset += 4
  }

  return false
}

export function extractHeicExifSegment(
  input: ArrayBuffer | Buffer | Uint8Array
): Uint8Array | null {
  const buf = toUint8Array(input)

  if (!isHeicOrHeifBuffer(buf)) {
    return null
  }

  let nextBoxOffset = readUint32(buf, 0)
  let meta = parseBoxHead(buf, nextBoxOffset)

  while (meta.kind !== 'meta') {
    nextBoxOffset += meta.length

    if (nextBoxOffset >= buf.length) {
      return null
    }

    meta = parseBoxHead(buf, nextBoxOffset)
  }

  parseBoxFullHead(buf, meta)

  const iinf = findBox(buf, meta, 'iinf')
  const iloc = findBox(buf, meta, 'iloc')

  if (!iinf || !iloc) {
    return null
  }

  const exifLocId = findExifLocIdInIinf(buf, iinf)

  if (exifLocId === undefined) {
    return null
  }

  const extent = findExtentInIloc(buf, iloc, exifLocId)

  if (!extent) {
    return null
  }

  let [exifOffset, exifLength] = extent
  const nameSize = readUint32(buf, exifOffset)
  exifOffset += 4 + nameSize
  exifLength -= 4 + nameSize

  if (exifLength <= 0 || exifOffset + exifLength > buf.length) {
    return null
  }

  return buf.subarray(exifOffset, exifOffset + exifLength)
}
