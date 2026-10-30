import { NextRequest, NextResponse } from 'next/server'
// this is a simple proxy for external images to avoid CORS issues in PDF export
export async function GET(request: NextRequest) {
  const imageUrl = new URL(request.url).searchParams.get('url')
  if (!imageUrl)
    return NextResponse.json({ error: 'URL required' }, { status: 400 })

  try {
    const response = await fetch(imageUrl)
    if (!response.ok)
      return NextResponse.json(
        { error: 'Failed to fetch' },
        { status: response.status }
      )

    const imageBuffer = await response.arrayBuffer()
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}
