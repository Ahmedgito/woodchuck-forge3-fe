import { NextResponse } from 'next/server'
import { resetPassword, verifyAccount } from '@/src/services/user'

export async function POST(request: Request) {
  try {
    const { password, hash, action } = await request.json()

    if (!password || !hash) {
      return NextResponse.json(
        { status: 'error', message: 'Missing fields' },
        { status: 400 }
      )
    }

    if (!password || !hash) {
      return NextResponse.json(
        { status: 'error', message: 'Password and hash are required' },
        { status: 400 }
      )
    }

    const res =
      action === 'verify'
        ? await verifyAccount({ password, hash })
        : await resetPassword({ password, hash })

    if (res?.data?.status === 'success') {
      return NextResponse.json({ status: 'success', data: res.data.data })
    }

    return NextResponse.json(
      {
        status: 'error',
        message:
          res?.data?.message ||
          (action === 'verify' ? 'Verify failed' : 'Reset failed'),
      },
      { status: 400 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', message: err?.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
