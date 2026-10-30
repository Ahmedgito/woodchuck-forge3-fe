import { auth } from '@/src/app/api/auth/[...nextauth]/auth'

interface Role {
  id: number
  name: string
  __entity: string
}
export const getUserRole = async (): Promise<Role | null> => {
  try {
    const session = await auth()

    if (!session) {
      return null
    }

    // Assuming session contains user information with role details
    const role = session.role
    return role
  } catch (error) {
    console.error('Error occurred while checking admin status:', error)
    return null
  }
}
