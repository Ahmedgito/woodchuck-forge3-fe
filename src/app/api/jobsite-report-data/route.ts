// app/api/report-data/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server'

let cachedReport: any = null // store in-memory (or use Redis for scaling)

export async function POST(req: NextRequest) {
  const data = await req.json()
  cachedReport = data // Save temporarily
  return NextResponse.json({ status: 'stored' })
}

export async function GET() {
  if (!cachedReport) {
    return NextResponse.json({ status: 'no-data' }, { status: 404 })
  }
  const data = cachedReport
  cachedReport = null
  return NextResponse.json(data)
}
