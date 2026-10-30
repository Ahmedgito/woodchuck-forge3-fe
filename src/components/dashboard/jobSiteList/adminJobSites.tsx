'use client'

import { useEffect, useState } from 'react'
import { Input } from 'antd'
import { Typography, Button, Row, Col } from 'antd'
import { MESSAGES, ROLES } from '@/src/utils/constants/app-constants'
import AdminJobSiteListing from './adminJobSiteListing'
import CreateJobSiteModal from '../create-job-site'
import { getClients, getEndClientJobsiteOwners } from '@/src/services/global'
import { useLoader } from '@/src/utils/context/loader-context'
import debounce from '@/src/utils/functions/debounce'
import { filterUsersBySearch } from '@/src/utils/functions/filterUsersBySearch'
import EmptyData from '../../settings/empty-data'
import { AdminJobSiteLogo } from '@/src/utils/constants/svgIcons'

const { Title } = Typography

interface AdminJobSitesProps {
  userRole: string | null
  userId: number | null | undefined
}

const AdminJobSites: React.FC<AdminJobSitesProps> = ({
  userRole,
  userId,
}) => {
  const { setLoading } = useLoader()
  const [clients, setClients] = useState<any>([])
  const [clientId, setClientId] = useState<number | null>()
  const [clientName, setClientName] = useState<string | null>()
  const [createJobSite, setCreateJobSite] = useState(false)
  const [pagination, setPagination] = useState(1)
  const [hasNextPage, setHasNextPage] = useState<boolean>()
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [clientUpdated, setClientUpdated] = useState<number | null | undefined>(
    null
  )
  const fetchAllClients = async () => {
    let page = 1
    let allClients: any[] = []
    let hasMore = true

    while (hasMore) {
      const result = await getClients(page)
      allClients = [...allClients, ...result.data.data.data]
      hasMore = result.data.data.hasNextPage
      page += 1
    }

    return allClients
  }

  const getAllClients = async () => {
    try {
      setLoading(true)
      const trimmedSearch = searchTerm?.trim()

      if (trimmedSearch) {
        const allClients = await fetchAllClients()
        setClients(filterUsersBySearch(allClients, trimmedSearch))
        setHasNextPage(false)
      } else {
        let result: any = null
        if (pagination > 1) {
          result = await getClients(pagination)
        } else {
          result = await getClients()
        }
        setHasNextPage(result.data.data.hasNextPage)
        if (pagination > 1) {
          setClients((prevClients: any) => [
            ...prevClients,
            ...result.data.data.data,
          ])
        } else {
          setClients(result.data.data.data)
        }
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      // alert('Error fetching Job Site Data' + err)
    }
  }

  const fetchAllEndClientJobSiteOwners = async () => {
    let page = 1
    let allClients: any[] = []
    let hasMore = true

    while (hasMore) {
      const result = await getEndClientJobsiteOwners(page)
      allClients = [...allClients, ...result.data.data.data]
      hasMore = result.data.data.hasNextPage
      page += 1
    }

    return allClients
  }

  const getEndClientsJobSites = async (
    pagination?: number,
    searchTerm?: string | null
  ) => {
    try {
      setLoading(true)
      const trimmedSearch = searchTerm?.trim()

      if (trimmedSearch) {
        const allClients = await fetchAllEndClientJobSiteOwners()
        setClients(filterUsersBySearch(allClients, trimmedSearch))
        setHasNextPage(false)
      } else {
        let result: any = null
        if (pagination && pagination > 1) {
          result = await getEndClientJobsiteOwners(pagination)
        } else {
          result = await getEndClientJobsiteOwners()
        }
        setHasNextPage(result.data.data.hasNextPage)
        if (pagination && pagination > 1) {
          setClients((prevClients: any) => [
            ...prevClients,
            ...result.data.data.data,
          ])
        } else {
          setClients(result.data.data.data)
        }
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      // alert('Error fetching Job Site Data' + err)
    }
  }

  useEffect(() => {
    if (createJobSite) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = 'unset'
    }
  }, [createJobSite])

  useEffect(() => {
    if (userRole === ROLES.END_CLIENT) {
      getEndClientsJobSites(pagination, searchTerm)
    } else {
      getAllClients()
    }
  }, [pagination, searchTerm])
  const handlePagination = () => {
    if (hasNextPage) {
      setPagination((prevPagination) => prevPagination + 1)
    } else {
      setPagination(1)
    }
  }

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPagination(1)
      setSearchTerm(event.target.value)
    },
    500
  )

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col
          xl={16}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          className="flex items-center"
        >
          <Title className="mb-0">{MESSAGES.CLIENTS}</Title>
        </Col>

        <Col xl={8} lg={12} md={12} sm={24} xs={24} className="form-section">
          <Input
            className="field-white"
            placeholder={MESSAGES.FIND_CLIENT}
            allowClear
            prefix={<AdminJobSiteLogo />}
            onChange={handleSearch}
          />
        </Col>
      </Row>

      {clients?.map((client: any, index: number) => (
        <>
          <AdminJobSiteListing
            index={index}
            client={client}
            setClientId={setClientId}
            setClientName={setClientName}
            setCreateJobSite={setCreateJobSite}
            clientUpdated={clientUpdated}
            userRole={userRole}
            userId={userId}
            onRefresh={() => getAllClients()}
          />
        </>
      ))}
      <Row justify={'center'}>
        <Col>
          {hasNextPage && (
            <Button onClick={handlePagination}>{MESSAGES.SHOW_MORE}</Button>
          )}
        </Col>
      </Row>
      {clients.length === 0 && <EmptyData />}
      {createJobSite && (
        <CreateJobSiteModal
          isOpen={createJobSite}
          clientId={clientId}
          clientName={clientName}
          setIsModalOpen={(val) => setCreateJobSite(val)}
          onRefresh={() => setClientUpdated(clientId)}
          currentTab={MESSAGES.CLIENTS}
        />
      )}
    </>
  )
}

export default AdminJobSites
