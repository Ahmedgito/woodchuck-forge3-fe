import { NextRequest, NextResponse } from 'next/server'
import { extractImageMetadataFromBuffer } from '@/src/utils/extractImageMetadataCore'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const imageUrl = new URL(request.url).searchParams.get('url')
  if (!imageUrl) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status }
      )
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const metadata = await extractImageMetadataFromBuffer(buffer)

    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Image metadata extraction failed:', error)
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'file required' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const metadata = await extractImageMetadataFromBuffer(buffer)

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Image metadata extraction failed:', error)
    return NextResponse.json({ error: 'Extraction failed' }, { status: 500 })
  }
}
