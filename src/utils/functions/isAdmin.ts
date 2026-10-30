import { auth } from '@/src/app/api/auth/[...nextauth]/auth'

export const isAdmin = async (): Promise<boolean> => {
  try {
    const session = await auth()

    if (!session) {
      return false
    }

    // Assuming session contains user information with role details
    const user = session.user

    // Check if the user has the role of admin and the role id is 1
    if (user.role.name.toLowerCase() === 'admin' && user.role.id === 1) {
      return true
    }

    return false
  } catch (error) {
    console.error('Error occurred while checking admin status:', error)
    return false
  }
}
