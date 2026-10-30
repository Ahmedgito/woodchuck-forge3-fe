import { NextRequest, NextResponse } from 'next/server'

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

    const inputBuffer = Buffer.from(await response.arrayBuffer())
    const convert = (await import('heic-convert')).default
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.85,
    })

    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('HEIC conversion failed:', error)
    return NextResponse.json({ error: 'Conversion failed' }, { status: 500 })
  }
}
