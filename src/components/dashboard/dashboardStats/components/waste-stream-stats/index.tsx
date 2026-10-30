import { ROLES } from '@/src/utils/constants/app-constants'
import { useUser } from '@/src/utils/context/user-context'
import AdminWasteStreamStats from './adminWasteStreamStats'
import ClientWasteStreamStats from './clientWasteStreamStats'

interface Props {
  reporting?: boolean
  setImages?: React.Dispatch<React.SetStateAction<any>>
  setImagesCount?: React.Dispatch<React.SetStateAction<any>>
  startDateFilter?: string | Date | undefined
  endDateFilter?: string | Date | undefined
}

const WasteStreamStats: React.FC<Props> = (props) => {
  const { user } = useUser()
  return (
    <>
      {(user?.role.enum === ROLES.ADMIN ||
        user?.role.enum === ROLES.POWER_PLANT ||
        user?.role.enum === ROLES.END_CLIENT ||
        user?.role.enum === ROLES.CMS) && (
        <AdminWasteStreamStats {...props} />
      )}
      {(user?.role.enum === ROLES.GENERAL_CONTRACTOR ||
        user?.role.enum === ROLES.MANUFACTURER ||
        user?.role.enum === ROLES.OFFTAKE) && (
        <ClientWasteStreamStats {...props} />
      )}
    </>
  )
}

export default WasteStreamStats
