import LoginFormComponent from './components'
import { auth } from '@/auth/auth'
import { redirect } from 'next/navigation'
import './style.module.scss'

const Login = async () => {
  const session = await auth()
  if (session?.status == 'authenticated') {
    redirect('/')
  }

  return (
    <>
      <LoginFormComponent />
    </>
  )
}

export default Login
