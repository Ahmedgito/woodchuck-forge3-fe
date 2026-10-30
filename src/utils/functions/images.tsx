import { toPng } from 'html-to-image'

export const createImage = async ({
  ref,
  width,
}: {
  ref: any
  width: number
}) => {
  const dataUrl = await toPng(ref.current, {
    cacheBust: true,
    width,
    skipFonts: true,
    fontEmbedCSS: "'Pathway Extreme', sans-serif'",
  })

  return dataUrl
}
