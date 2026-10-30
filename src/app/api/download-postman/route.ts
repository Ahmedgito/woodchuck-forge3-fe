import { NextResponse } from 'next/server'

export async function GET() {
  const fileUrl = process.env.NEXT_PUBLIC_POSTMAN_COLLECTION_URL
  if (!fileUrl) {
    return NextResponse.json(
      { error: 'POSTMAN collection URL not configured' },
      { status: 500 }
    )
  }
  const response = await fetch(fileUrl)

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: response.status }
    )
  }

  const blob = await response.blob()

  return new NextResponse(blob, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition':
        'attachment; filename="WoodChuck.postman_collection.json"',
    },
  })
}
