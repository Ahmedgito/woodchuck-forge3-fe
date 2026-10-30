'use client'
import VerifyAccountFormComponent from './components/confirmForm'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLoader } from '@/src/utils/context/loader-context'
import { confirmVerifyToken } from '@/src/services/auth'

const VerifyAccount = () => {
  const searchParams = useSearchParams()
  const [validHash, setValidHash] = useState(false)
  const router = useRouter()
  const hashToken = searchParams.get('hash')
  const { setLoading } = useLoader()
  const verifyHash = async () => {
    try {
      setLoading(true)
      let result = await confirmVerifyToken(hashToken as string)
      if (result.status === 200) {
        setValidHash(true)
      }
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      if (err.response.status === 400) {
        router.replace('/error-page?error=setup-user-exists')
      } else {
        router.replace('error-page?error=setup-invalid-link')
      }
    }
  }
  useEffect(() => {
    if (hashToken) {
      verifyHash()
    }
  }, [hashToken])
  return <>{validHash && <VerifyAccountFormComponent />}</>
}

export default VerifyAccount
