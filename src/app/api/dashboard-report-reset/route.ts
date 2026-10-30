// app/api/dashboard-report-reset/route.ts
import { NextResponse, NextRequest } from 'next/server'

let resetSessions = new Set<string>()

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  if (!sessionId)
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
  resetSessions.add(sessionId)
  return NextResponse.json({ status: 'ok' })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  if (!sessionId)
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
  const shouldReset = resetSessions.has(sessionId)
  if (shouldReset) resetSessions.delete(sessionId)
  return NextResponse.json({ reset: shouldReset })
}
