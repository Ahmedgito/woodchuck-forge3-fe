import { NextResponse } from 'next/server'
import { autologinOnPasswordReset } from '@services/auth'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let token: string | undefined

    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}))
      token = body?.token
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData()
      token = String(form.get('token') || '')
    } else {
      const url = new URL(request.url)
      token = url.searchParams.get('token') || undefined
    }

    if (!token) {
      return NextResponse.json(
        { status: 'error', message: 'Token is required' },
        { status: 400 }
      )
    }

    const res = await autologinOnPasswordReset({ token })
    if (res?.data?.status === 'success') {
      return NextResponse.json({ status: 'success', data: res.data.data })
    }

    return NextResponse.json(
      { status: 'error', message: res?.data?.message || 'AutoLogin failed' },
      { status: 401 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
