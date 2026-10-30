import { NextResponse } from 'next/server'
import { auth } from '../auth/[...nextauth]/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function GET() {
  try {
    const session = await auth()
    const accessToken = session?.token?.accessToken ?? null

    if (!accessToken) {
      return errorResponse('Unauthorized - No access token found', 401)
    }

    const apiKey = await fetchApiKey(accessToken)
    if (!apiKey) {
      return errorResponse('API key not found', 400)
    }

    const exportData = await fetchExportData(apiKey)

    return NextResponse.json(exportData, { status: 200 })
  } catch (error: any) {
    return errorResponse(error.message || 'Unexpected server error', 500)
  }
}

async function fetchApiKey(accessToken: string): Promise<string | null> {
  const res = await fetch(`${API_BASE_URL}/v1/users/me/api-key`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch API key (status: ${res.status})`)
  }

  const data = await res.json()
  return data?.data?.apiKey ?? null
}

async function fetchExportData(apiKey: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/v1/export/user`, {
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch export data (status: ${res.status})`)
  }

  return res.json()
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}
