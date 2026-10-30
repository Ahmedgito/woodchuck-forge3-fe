import { Col, Row, Typography } from 'antd'
import styles from './styles.module.scss'
import EmptyData from '@/src/components/settings/empty-data'
import { GRAPH_CLIENT, GRAPH_WASTE_STREAM } from '@/src/utils/constants/types'
import {
  computeColumnWidth,
  wasteStreamChartLineStyle,
} from '@/src/utils/functions/wasteStreamChartLineStyle'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import { toPng } from 'html-to-image'
import { useEffect, useRef } from 'react'
import { useDashboardStats } from '@/src/utils/context/dashboard-report-context'

interface WasteStreamGraphProps {
  clients: GRAPH_CLIENT[]
  clientIds: number[]
  wasteStreamData: GRAPH_WASTE_STREAM[]
  totalMoved?: number
  showTotalMoved?: boolean
  reporting?: boolean
  exportMode?: boolean
  monthName: string
  dataFetched?: boolean
}

const WasteStreamGraph: React.FC<WasteStreamGraphProps> = ({
  clients,
  clientIds,
  wasteStreamData,
  totalMoved,
  showTotalMoved = false,
  reporting,
  exportMode,
  monthName,
  dataFetched,
}) => {
  console.log('wasteStreamData', wasteStreamData)
  const imageRef = useRef<HTMLDivElement>(null)
  const emptyImageRef = useRef<HTMLDivElement>(null)
  const { setImages } = useDashboardStats()

  const onExport = async () => {
    if (imageRef.current === null) {
      return
    }

    // Calculate actual content width based on dynamic content
    const baseWidth = 170
    const columnWidth = 84 + 16
    const totalStatsWidth = 100

    const dynamicWidth =
      baseWidth +
      columnWidth * wasteStreamData.length +
      (showTotalMoved ? totalStatsWidth : 0)
    const actualHeight =
      wasteStreamData.length === 0 ? 400 : imageRef.current.scrollHeight

    const dataUrl = await toPng(imageRef.current, {
      cacheBust: true,
      width: dynamicWidth,
      height: actualHeight,
      skipFonts: true,
      fontEmbedCSS: "'Pathway Extreme', sans-serif'",
      pixelRatio: window.devicePixelRatio || 1,
    })
    setImages((prevImages: any) => [...prevImages, { monthName, dataUrl }])
  }

  useEffect(() => {
    if (reporting && dataFetched && imageRef.current) {
      onExport()
    }
  }, [wasteStreamData, dataFetched])
  return (
    <Row gutter={24} align={'stretch'} className={styles.bar_chart_wrapper}>
      <Col span={24}>
        {wasteStreamData.length === 0 ? (
          <div ref={imageRef} className={styles.white_bg}>
            <EmptyData />
          </div>
        ) : (
          <div
            className={
              !reporting && !exportMode ? styles.x_auto : styles.white_bg
            }
            ref={imageRef}
          >
            <Row
              align={'stretch'}
              gutter={[24, 24]}
              wrap={false}
              className="mx-0"
            >
              <Col className={styles.col_values}>
                <div className={styles.labels}>
                  {clients.map((item, index) => (
                    <h4
                      key={index}
                      style={{ marginTop: `${item.height}px` }}
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                  ))}
                  <h3
                    style={{
                      marginTop: `${clients.length * 50 + 82}px`,
                      color: 'rgb(59, 0, 98)',
                    }}
                  >
                    {MESSAGES.DUMPSTER}
                  </h3>
                </div>
              </Col>

              <Col flex={'auto'}>
                <Row
                  align={'stretch'}
                  gutter={16}
                  className={styles.bar_chart}
                  wrap={false}
                >
                  {wasteStreamData.map(
                    (wasteStream: GRAPH_WASTE_STREAM, index: number) => {
                      const colWidth = computeColumnWidth(wasteStream?.tons)
                      return (
                        <Col
                          key={index}
                          style={{ width: colWidth }}
                          className={wasteStreamChartLineStyle(
                            styles,
                            wasteStream.name
                          )}
                        >
                          <h5>{wasteStream.name}</h5>
                          <span className={styles.distance}>
                            {wasteStream.dumpster_weight}
                          </span>

                          <div
                            className={styles.bar_line}
                            style={{ height: `${clientIds.length * 50}px` }}
                          >
                            {clients.map((client: GRAPH_CLIENT) =>
                              Object.keys(client).map((key, i) => {
                                if (key === wasteStream.key && client[key]) {
                                  return (
                                    <span
                                      key={i}
                                      className={`${styles.bar_value}`}
                                      style={{ top: `${client.height}px` }}
                                    >
                                      {`${Math.round(Number(client[key]))} tn`}
                                    </span>
                                  )
                                }
                                return null
                              })
                            )}
                          </div>
                          <span className={styles.bar_legend}>
                            {wasteStream.moved}
                          </span>
                        </Col>
                      )
                    }
                  )}

                  {showTotalMoved && (
                    <Col
                      flex={'100px'}
                      className="flex self-stretch items-start justify-end flex-col black"
                    >
                      <Typography.Text className="font-medium">
                        {MESSAGES.TOTAL_MOVED}
                      </Typography.Text>
                      <Typography.Title
                        className={`mt-0 ${styles.graph_value}`}
                        level={3}
                      >
                        <span className="font-black">{totalMoved}</span>
                      </Typography.Title>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </Col>
    </Row>
  )
}

export default WasteStreamGraph
