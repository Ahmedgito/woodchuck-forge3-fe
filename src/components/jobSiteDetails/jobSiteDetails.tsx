import Header from './components/header'
import { useEffect, useRef, useState } from 'react'
import { Divider, Row, Col, Typography, Button } from 'antd'
import {
  closeJobSiteDetails,
  getNotificationsByJobisiteId,
  updateJobSite,
} from '@/src/services/jobsite'
import {
  CAMERA_DROPDOWN_TYPE,
  COMBINED_LOCATION_TYPE,
  CREATE_JOB_SITE,
  DUMPSTER_ALERT_TYPE,
  DUMPSTER_GRAPH_TYPE,
  DUMPSTER_LOCATION_OPTIONS,
  DUMPSTER_OPTIONS,
  GET_WASTE_STREAM_JOB_SITE_FORM_TYPE,
  HAULER_TYPE,
  NOTIFICATION_TYPE,
  REPORT_IMAGE,
  USER_TYPE,
  WASTE_TYPE,
} from '@/src/utils/constants/types'
import {
  JOB_SITE_STATUS,
  MESSAGES,
  NOTIFICATION_STATUS,
  PDF_EXPORT,
} from '@/src/utils/constants/app-constants'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import SupervisorSection from './components/supervisorSection'
import JobSiteInfoSection from './components/jobSiteInfoSection'
import ConfirmationModal from './components/modal/closeJobSiteModal'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/src/utils/context/socket-context'
import { useLoader } from '@/src/utils/context/loader-context'
import { ROLES } from '@/src/utils/constants/app-constants'
import { useSession } from 'next-auth/react'
import JobsiteReport from './components/jobSiteReport'
import jsPDF from 'jspdf'
import {
  renderDOMInChunks,
  renderSingleCanvas,
  createOptimalPDF,
} from '@/src/utils/pdf-chunk-renderer'
import AddressSection from './components/addressSection'
import { Form, Formik } from 'formik'
import { ADD_JOB_SITE_SCHEMA } from '@/src/utils/constants/schemas'
import { extractRequiredProperties } from '@/src/utils/functions/extractFunctions'
//import { Title } from 'chart.js'
import CreateOrEditDumpsterLocationModal from './components/modal/dumpsterLocationModal'
import { createTriggerNotification } from '@/src/utils/functions/notificationUtils'
import {
  fetchAlertsData,
  fetchEndClientData,
  fetchJobSitesWasteStreams,
  fetchLiveDumpsteraData,
  fetchUnassociatedCameraData,
  fetchdumpsterLocation,
} from '@/src/app/(app)/settings/dataFetchers'
//import './style.scss'
import { fetchDiversionStats } from '../dashboard/dashboardStats/dashboardDataFetcher'
import {
  fetchHaulerData,
  fetchCombinedLocationData,
  fetchWasteStreamData,
  fetchdumpsterOption,
} from '@/src/app/(app)/settings/dataFetchers'
// import JSZip from 'jszip'
// import { saveAs } from 'file-saver'
import { JobSiteDetailsLogo } from '@/src/utils/constants/svgIcons'
import AddEndClientModal from './components/modal/editClientModal'
import WasteStream from '../dashboard/create-job-site/components/wasteStream'
import DumpsterChartContainer from './components/dumpsterChartContainer'
import { fetchDumpsterStats } from './jobSiteDataFetchers'

const { Link, Title } = Typography
export default function JobSiteDetails({
  id,
  jobSiteDetailsData,
  getJobSiteData,
  jobsiteClient,
}: {
  id: number | null | undefined
  jobSiteDetailsData: CREATE_JOB_SITE
  getJobSiteData: (_: number | null | undefined) => Promise<void>
  jobsiteClient?: USER_TYPE
}) {
  const [confirmationModal, setConfirmationModal] = useState<boolean>()
  const [disabled, setDisabled] = useState<boolean>(true)
  const [startDateFilter, setStartDateFilter] = useState<string | Date>()
  const [endDateFilter, setEndDateFilter] = useState<string>()
  const [userRole, setUserRole] = useState<string | null>('')
  const { notificationReceived, setNotificationReceived } = useSocket() || {}
  const { setLoading } = useLoader()
  const [refresh, setRefresh] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const triggerNotification = useTriggerNotification()
  const trigger = createTriggerNotification(triggerNotification)

  const router = useRouter()
  const { data: session, status } = useSession()
  const targetRef = useRef<HTMLDivElement>(null)
  const [editMode, setEditMode] = useState(false)
  const [dumpsterLocationModal, setDumpsterLocationModal] = useState(false)
  const [endClientModal, setEndClientModal] = useState(false)
  const [wasteStreamAdded, setWasteStreamAdded] = useState(false)
  const [wasteStreamData, setWasteStreamData] = useState<
    GET_WASTE_STREAM_JOB_SITE_FORM_TYPE[]
  >([])
  const [dumpsterList, setDumpsterList] = useState<DUMPSTER_LOCATION_OPTIONS>(
    []
  )
  const [nextId, setNextId] = useState(1)
  const [classLength, setClassLength] = useState(0)
  const [dotRemove, setdotRemove] = useState(false)
  const [locationList, setLocationList] = useState<COMBINED_LOCATION_TYPE[]>([])
  const [liveDumpsterList, setLiveDumpster] = useState<any[]>([])
  const [wasteStreamList, setWasteStreamList] = useState<WASTE_TYPE[]>([])
  const [dumpsterOptions, setdumpsterOptions] = useState<DUMPSTER_OPTIONS>([])
  const [dumpsterStats, setDumpsterStats] =
    useState<DUMPSTER_GRAPH_TYPE | null>(null)
  const [endClients, setEndClients] = useState<USER_TYPE[]>([])
  const [haulerList, setHauler] = useState<HAULER_TYPE[]>([])
  const [alertData, setAlertData] = useState<DUMPSTER_ALERT_TYPE[]>([])
  const [cameraData, setCameraData] = useState<CAMERA_DROPDOWN_TYPE[]>([])
  const [pageRefresh, setPageRefresh] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [treeStats, setTreeStats] = useState()
  const [images, setImages] = useState<REPORT_IMAGE[]>([])
  const [reporting, setReporting] = useState(false)
  const [display, setDisplay] = useState('none')
  const [startExport, setStartExport] = useState(false)
  const [imagesCount, setImagesCount] = useState(0)
  const isDemo = process.env.NEXT_PUBLIC_ISDEMO === 'true'
  const [isNewWasteStream, setIsNewWasteStream] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (pageRefresh) {
        if (startDateFilter && endDateFilter) {
          await Promise.all([
            fetchDiversionStats({
              setState: setTreeStats,
              setLoading: setLoading,
              triggerNotification: trigger,
              startDate: startDateFilter,
              endDate: endDateFilter,
              jobSiteId: id,
              clientId: jobSiteDetailsData?.clientId,
            }),
            fetchDumpsterStats({
              setState: setDumpsterStats,
              setLoading: setLoading,
              triggerNotification: trigger,
              startDate: startDateFilter,
              endDate: endDateFilter,
              id: id,
              reporting: false,
            }),
          ])
        }
      }
    }
    fetchData()
  }, [startDateFilter, endDateFilter, id, pageRefresh])

  useEffect(() => {
    if (startDateFilter && endDateFilter) {
      const date = new Date(endDateFilter ?? new Date())
      const lastDayOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
      )
        .toISOString()
        .split('T')[0]
      fetchDiversionStats({
        setState: setTreeStats,
        setLoading: setLoading,
        triggerNotification: trigger,
        startDate: startDateFilter,
        endDate: lastDayOfMonth,
        jobSiteId: id,
        clientId: jobSiteDetailsData?.clientId,
      })
    }
  }, [startDateFilter, endDateFilter, id])

  useEffect(() => {
    const refresh = async () => {
      setLoading(true)
      setIsRefreshing(true)
      try {
        await Promise.all([
          fetchJobSitesWasteStreams({
            setState: setWasteStreamData,
            setLoading: setLoading,
            triggerNotification: trigger,
            id: id,
            setClassLength: setClassLength,
          }),
          fetchdumpsterLocation({
            setState: setDumpsterList,
            setLoading: setLoading,
            triggerNotification: trigger,
            id: id,
          }),
          fetchdumpsterOption({
            setState: setdumpsterOptions,
            setLoading: setLoading,
            triggerNotification: trigger,
          }),
          fetchHaulerData({
            setState: setHauler,
            setLoading: setLoading,
            triggerNotification: trigger,
          }),
          fetchWasteStreamData({
            setState: setWasteStreamList,
            setLoading: setLoading,
            triggerNotification: trigger,
          }),
          fetchCombinedLocationData({
            setState: setLocationList,
            setLoading: setLoading,
            triggerNotification: trigger,
          }),
          fetchLiveDumpsteraData({
            id: id,
            setState: setLiveDumpster,
            setLoading: setLoading,
            triggerNotification: trigger,
          }),
          fetchEndClientData({
            setState: setEndClients,
            setLoading: setLoading,
            triggerNotification: trigger,
          }),
          fetchUnassociatedCameraData({
            setState: setCameraData,
            setLoading: setLoading,
            triggerNotification: trigger,
          }),
          fetchAlertsData({
            id: id,
            setState: setAlertData,
            setLoading: setLoading,
            triggerNotification: trigger,
          }),
          getJobSiteData(id),
        ])
      } catch (error) {
        triggerNotification(
          'error',
          MESSAGES.ERROR,
          MESSAGES.SOMETHING_WENT_WRONG
        )
      } finally {
        setIsRefreshing(false)
        setWasteStreamAdded(false)
        setLoading(false)
      }
      setPageRefresh(false)
    }
    pageRefresh && refresh()
  }, [id, pageRefresh])

  useEffect(() => {
    if (status === 'authenticated') {
      setUserRole(session?.user.role.enum)
    }
  }, [status, session?.user.id])

  useEffect(() => {
    if (userRole === ROLES.ADMIN) {
      setIsAdmin(true)
    }
  }, [userRole])

  useEffect(() => {
    if (
      isAdmin &&
      jobSiteDetailsData?.status?.name === JOB_SITE_STATUS.ACTIVE
    ) {
      setDisabled(false)
    }
  }, [isAdmin, jobSiteDetailsData])

  const exportReport = async () => {
    if (targetRef?.current) {
      try {
        const waitForPlotly = new Promise((resolve) => {
          const timeout = setTimeout(
            () => resolve(true),
            PDF_EXPORT.PLOTLY_TIMEOUT
          )
          const handlePlotlyReady = () => {
            clearTimeout(timeout)
            window.removeEventListener('plotly-chart-ready', handlePlotlyReady)
            resolve(true)
          }
          window.addEventListener('plotly-chart-ready', handlePlotlyReady)
        })

        await waitForPlotly

        // Check if DOM is too large for a single canvas render
        const domHeight = targetRef.current.scrollHeight
        const maxSafeCanvasHeight = PDF_EXPORT.MAX_SAFE_CANVAS_HEIGHT
        const shouldChunkRender = domHeight > maxSafeCanvasHeight

        const margin = PDF_EXPORT.MARGIN
        const pageWidth = PDF_EXPORT.PAGE_WIDTH
        const pageHeight = PDF_EXPORT.PAGE_HEIGHT
        const contentWidth = pageWidth - margin * 2
        const contentHeight = pageHeight - margin * 2

        let pdf: jsPDF

        // Render DOM to PDF using appropriate strategy
        if (shouldChunkRender) {
          // For chunk rendering, use standard PDF
          pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [PDF_EXPORT.PAGE_WIDTH, PDF_EXPORT.PAGE_HEIGHT],
          })

          await renderDOMInChunks({
            element: targetRef.current,
            pdf,
            margin,
            contentWidth,
            contentHeight,
          })
        } else {
          // For single canvas, create PDF with optimal dimensions
          pdf = await createOptimalPDF(targetRef.current, margin)

          await renderSingleCanvas({
            element: targetRef.current,
            pdf,
            margin,
            contentWidth,
            contentHeight,
          })
        }

        const isAdminUser = session?.user.role.enum === ROLES.ADMIN
        const jobSiteTitle = jobSiteDetailsData?.title
        const clientName = jobsiteClient?.name

        const filename =
          isAdminUser && jobSiteTitle && clientName
            ? `${clientName}-${jobSiteTitle}.pdf`
            : jobSiteTitle
              ? `${jobSiteTitle}.pdf`
              : 'job-site-stats.pdf'

        pdf.save(filename)

        setStartExport(false)
        setDisplay('none')
        setReporting(false)
        setImages([])
        setImagesCount(0)
        setLoading(false)
      } catch (error) {
        console.error('Error generating PDF:', error)
        setLoading(false)
        setReporting(false)
      }
    }
  }

  useEffect(() => {
    if (images.length === imagesCount && reporting) {
      setLoading(true)
      exportReport()
    }
  }, [images])

  useEffect(() => {
    if (reporting) {
      const timeout = setTimeout(() => {
        if (reporting) {
          setLoading(true)
          exportReport()
        }
      }, 10000)

      return () => clearTimeout(timeout)
    }
  }, [reporting])

  const [notifications, setNotifications] = useState<NOTIFICATION_TYPE[]>()

  // useEffect(() => {
  //   notificationReceived && fetchNotifications()
  // }, [notificationReceived])

  // useEffect(() => {
  //   if (isAdmin) {
  //     fetchNotifications()
  //   }
  // }, [isAdmin])

  const fetchNotifications = async () => {
    console.log('fetching notifications in js details')
    try {
      setLoading(true)
      const result = await getNotificationsByJobisiteId(id as number, 1)
      const pendingNotifications = result.data.data.data.filter(
        (notification: NOTIFICATION_TYPE) =>
          notification.smsDumpster.status === NOTIFICATION_STATUS.REQUEST
      )
      setNotifications(pendingNotifications)
      setRefresh((prevState) => !prevState)
      setNotificationReceived && setNotificationReceived(false)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  const onUpdateJobSite = async (payload: CREATE_JOB_SITE) => {
    const extractedPayload = extractRequiredProperties(payload)
    if (!id) return
    try {
      setLoading(true)
      await updateJobSite(id, extractedPayload)
      await getJobSiteData(id)

      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.JOB_SITE_DETAILS_UPDATED_SUCCESS
      )
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
    setEditMode(!editMode)
  }

  const handleCloseJob = async () => {
    try {
      setLoading(true)
      await closeJobSiteDetails(id)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.JOB_SITE_DETAILS_DELETED_SUCCESS
      )
      setLoading(false)
      router.push('/')
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  const handleAddWasteStream = () => {
    setWasteStreamData([...wasteStreamData])
    setNextId(nextId + 1)
    setWasteStreamAdded(true)
    setdotRemove(true)
  }
  const handleDeleteWasteStream = (
    id: number,
    firstEntry: boolean | undefined
  ) => {
    if (firstEntry) {
      setWasteStreamData(
        wasteStreamData.filter((wasteStream) => wasteStream.id !== id)
      )
      setWasteStreamAdded(false)
    }
  }
  const handleDumpsterModal = () => {
    setDumpsterLocationModal(true)
  }

  const handleEndClientModal = () => {
    setEndClientModal(true)
  }
  return (
    <section className="container white-area">
      {/* <MapComponent /> */}
      <br />
      <Header
        jobDetails={jobSiteDetailsData}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
        setStartDateFilter={setStartDateFilter}
        setEndDateFilter={setEndDateFilter}
        notifications={notifications as NOTIFICATION_TYPE[]}
        onRefresh={fetchNotifications}
        dumpsterStats={dumpsterStats}
        exportReport={() => {
          setLoading(true)
          setDisplay('block')
          setReporting(true)
        }}
        treeStats={treeStats}
        uploadImage={true}
        pageRefresh={pageRefresh}
        setPageRefresh={setPageRefresh}
      />
      <DumpsterChartContainer
        jobSiteDetailsData={jobSiteDetailsData}
        disabled={disabled}
        pageRefresh={pageRefresh}
        setPageRefresh={setPageRefresh}
        setImagesCount={setImagesCount}
        wasteStreamList={wasteStreamList}
        dumpsterOptions={dumpsterOptions}
        startDateFilter={startDateFilter}
        endDateFilter={endDateFilter}
      />
      {/* {!isDemo && (
        <ActiveDumpster
          id={id}
          liveDumpsterList={liveDumpsterList}
          setPageRefresh={setPageRefresh}
          disabled={disabled}
        />
      )} */}
      {/* {wasteStreamData.map((wasteStream, index) => {
        return (
          <JobSiteWasteStreamForm
            dotRemove={dotRemove}
            setdotRemove={setdotRemove}
            index={index}
            dumpsterList={dumpsterList}
            key={wasteStream.id}
            firstEntry={wasteStream.firstEntry || false}
            wasteStreamData={wasteStream}
            handleDelete={() =>
              handleDeleteWasteStream(wasteStream.id, wasteStream.firstEntry)
            }
            handleDumpsterModal={() => handleDumpsterModal()}
            setaddbutton={setWasteStreamAdded}
            addButton={wasteStreamAdded}
            totalItems={classLength}
            dumpsterOptions={dumpsterOptions}
            wasteStreamList={wasteStreamList}
            locationList={locationList}
            haulerList={haulerList}
            formDisabled={disabled}
            setRefresh={setPageRefresh}
            isRefreshing={isRefreshing}
          />
        )
      })} */}
    
      <WasteStream
        dumpsterOptions={dumpsterOptions}
        wasteStreamList={wasteStreamList}
        locationList={locationList}
        jobSiteId={id}
        haulerList={haulerList}
        wasteStreamData={wasteStreamData}
        setRefresh={setPageRefresh}
        isRefreshing={isRefreshing}
        dumpsterList={dumpsterList}
        cameraData={cameraData}
        alertData={alertData}
        disabled={disabled}
        setIsNewWasteStream={setIsNewWasteStream}
        isNewWasteStream={isNewWasteStream}
      />
      <Divider />
      <Title level={5} className="sub-head mb-4">
        {MESSAGES.JOB_SITE_OVERVIEW}
      </Title>
      <Formik
        initialValues={jobSiteDetailsData}
        validationSchema={ADD_JOB_SITE_SCHEMA}
        onSubmit={(values) => {
          onUpdateJobSite(values)
        }}
        enableReinitialize
      >
        {({
          errors,
          values,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row className="form-section">
              <Col span={24} className="jobsite-form px-5 py-3">
                <Row gutter={[24, 16]}>
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <AddressSection
                      disabled={disabled}
                      addressDetails={jobSiteDetailsData}
                      onChange={handleChange}
                      edit={editMode}
                      values={values}
                      touched={touched}
                      errors={errors}
                      onBlur={handleBlur}
                      setFieldValue={setFieldValue}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <SupervisorSection
                      values={values}
                      disabled={disabled}
                      jobSiteDetails={jobSiteDetailsData}
                      onChange={handleChange}
                      editSupervisor={editMode}
                      errors={errors}
                      touched={touched}
                      onBlur={handleBlur}
                    />
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <JobSiteInfoSection
                      values={values}
                      jobSiteDetails={jobSiteDetailsData}
                      jobsiteClient={jobsiteClient}
                      endClients={endClients}
                      handleEndClientModal={handleEndClientModal}
                      onChange={handleChange}
                      editInfo={editMode}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      onBlur={handleBlur}
                    />
                  </Col>

                  {!disabled && !editMode && (
                    <Link
                      className="sub-head flex items-center change-btn"
                      onClick={() => setEditMode(!editMode)}
                    >
                      <i className="icon-pencil mr-1"></i>
                      {MESSAGES.CHANGE}
                    </Link>
                  )}
                </Row>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24} className="mt-5">
                {editMode && (
                  <Button type="primary" htmlType="submit">
                    {MESSAGES.SAVE}
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      {!disabled && (
        <Row gutter={[16, 16]}>
          <Col span={24} className="mt-5 red">
            <Link
              onClick={() => setConfirmationModal(true)}
              className="font-bold flex items-center font-inter"
            >
              <JobSiteDetailsLogo />
              <span className="ml-2">{MESSAGES.CLOSE_JOB_SITE}</span>
            </Link>
          </Col>
        </Row>
      )}
      {confirmationModal && (
        <ConfirmationModal
          isOpen={confirmationModal}
          title={MESSAGES.ARE_U_SURE_CLOSE_THIS_JOB_SITE}
          closeButtonText={MESSAGES.CLOSE_JOB_SITE}
          keepButtonText={MESSAGES.KEEP_JOB_SITE}
          setIsModalOpen={setConfirmationModal}
          onConfirmation={handleCloseJob}
        />
      )}
      {dumpsterLocationModal && (
        <CreateOrEditDumpsterLocationModal
          isOpen={dumpsterLocationModal}
          dumpsterLocation={undefined}
          jobSiteId={id}
          jobsiteTitle={jobSiteDetailsData?.title as string}
          setIsModalOpen={setDumpsterLocationModal}
          setRefresh={setRefresh}
          onRefresh={() =>
            fetchdumpsterLocation({
              setState: setDumpsterList,
              setLoading: setLoading,
              triggerNotification: trigger,
              id: id,
            })
          }
        />
      )}
      {endClientModal && (
        <AddEndClientModal
          isOpen={endClientModal}
          setIsModalOpen={setEndClientModal}
          onRefresh={() =>
            fetchEndClientData({
              setState: setEndClients,
              setLoading: setLoading,
              triggerNotification: trigger,
            })
          }
        />
      )}
      {reporting && (
        <JobsiteReport
          targetRef={targetRef}
          jobDetails={jobSiteDetailsData}
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
          treeStats={treeStats}
          reporting={reporting}
          pageRefresh={pageRefresh}
          display={display}
          treeGraphProps={{
            clientId: jobSiteDetailsData?.clientId,
            photo: jobSiteDetailsData?.photo,
            showImage: jobSiteDetailsData?.photo ? true : false,
            isActiveJobsite:
              jobSiteDetailsData?.status?.name === JOB_SITE_STATUS.ACTIVE,
          }}
          setPageRefresh={setPageRefresh}
          setImages={setImages}
          setImagesCount={setImagesCount}
          wasteStreamList={wasteStreamList}
          dumpsterStats={dumpsterStats}
          dumpsterOptions={dumpsterOptions}
        />
      )}
    </section>
  )
}
