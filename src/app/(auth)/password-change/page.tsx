'use client'
import ResetPasswordFormComponent from './components/passwordChange'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLoader } from '@/src/utils/context/loader-context'
import { verifyToken } from '@/src/services/auth'

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const [validHash, setValidHash] = useState(false)
  const router = useRouter()
  const hashToken = searchParams.get('hash')
  const { setLoading } = useLoader()
  const verifyHash = async () => {
    try {
      setLoading(true)
      let result = await verifyToken(hashToken as string)
      if (result.status === 200) {
        setValidHash(true)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      router.replace('error-page?error=reset')
    }
  }
  useEffect(() => {
    if (hashToken) {
      verifyHash()
    }
  }, [hashToken])
  return <>{validHash && <ResetPasswordFormComponent />}</>
}

export default ResetPassword
