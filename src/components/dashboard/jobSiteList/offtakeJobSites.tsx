'use client'

import { useEffect, useState } from 'react'
import { Input, Typography, Button, Row, Col } from 'antd'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import AdminJobSiteListing from './adminJobSiteListing'
import CreateJobSiteModal from '../create-job-site'
import { getOfftakes } from '@/src/services/global'
import { useLoader } from '@/src/utils/context/loader-context'
import debounce from '@/src/utils/functions/debounce'
import EmptyData from '../../settings/empty-data'
import { AdminJobSiteLogo } from '@/src/utils/constants/svgIcons'

const { Title } = Typography

interface OfftakeJobSitesProps {
  userRole: string | null
  userId: number | null | undefined
}

const OfftakeJobSites: React.FC<OfftakeJobSitesProps> = ({ userRole, userId }) => {
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

  const getAllClients = async () => {
    try {
      setLoading(true)
      let result: any = null

      if (pagination > 1) {
        result = await getOfftakes(pagination, searchTerm)
      } else if (searchTerm) {
        result = await getOfftakes(pagination, searchTerm)
      } else {
        result = await getOfftakes()
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

      setLoading(false)
    } catch (err) {
      setLoading(false)
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
    getAllClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setSearchTerm(event.target.value)
      setPagination(1)
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
          <Title className="mb-0">{MESSAGES.OFFTAKES}</Title>
        </Col>

        <Col xl={8} lg={12} md={12} sm={24} xs={24} className="form-section">
          <Input
            className="field-white"
            placeholder={MESSAGES.FIND_OFFTAKE}
            allowClear
            prefix={<AdminJobSiteLogo />}
            onChange={handleSearch}
          />
        </Col>
      </Row>

      {clients?.map((client: any, index: number) => (
        <AdminJobSiteListing
          key={client?.id ?? index}
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
          currentTab={MESSAGES.OFFTAKES}
        />
      )}
    </>
  )
}

export default OfftakeJobSites

