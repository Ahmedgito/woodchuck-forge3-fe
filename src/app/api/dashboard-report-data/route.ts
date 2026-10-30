// app/api/dashboard-report-data/route.ts
import { NextRequest, NextResponse } from 'next/server'

const cache = new Map<string, any>() // Or use Redis for distributed setup

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  console.log('sessionId', sessionId)
  if (!sessionId)
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })

  const data = await req.json()
  cache.set(sessionId, data)
  return NextResponse.json({ status: 'stored' })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  if (!sessionId)
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })

  const data = cache.get(sessionId)
  if (!data) return NextResponse.json({ status: 'no-data' })

  cache.delete(sessionId) // Optional: clear after reading once
  return NextResponse.json(data)
}
