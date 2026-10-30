import { Col, Row, Image, Typography } from 'antd'
import styles from './styles.module.scss'
import TypeStats from '../../../create-job-site/treeGraphTypeStats'
import { WASTE_STATS } from '@/src/utils/constants/types'
import {
  DISPLAY_MAP_ROLES,
  HIDE_GRAPH,
  MESSAGES,
  WASTE_STREAM_STRINGS,
} from '@/src/utils/constants/app-constants'
import { roundToNearestMillion } from '@/src/utils/functions/roundToNearestMillion'
import { Dispatch, SetStateAction, memo } from 'react'
import Graph from './graph'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'
interface Props {
  data: WASTE_STATS | undefined
  powerPlantName?: string | undefined
  clientId: number | null | undefined
  reporting?: boolean
  photo?: string
  mute: boolean
  setRefresh?: Dispatch<SetStateAction<boolean>>
  isPowerPlant?: boolean
  showImage?: boolean
  fromDashboard?: boolean
  userRole?: string
  isActiveJobsite?: boolean
}
const { Text, Title } = Typography

const TreeGraphComponent: React.FC<Props> = ({
  data,
  clientId,
  reporting = false,
  photo,
  mute,
  showImage,
  isPowerPlant,
  fromDashboard = false,
  userRole,
  isActiveJobsite,
}) => {
  const canShowGraph =
    fromDashboard && (!userRole || HIDE_GRAPH.includes(userRole))
  return (
    <div className='dashboard-screen'>
      {data && (
        <>
          <div className="grey-area pt-5 pb-5">
            <Row gutter={[24, 24]} align={'middle'}>
              {!canShowGraph && (
                <>
                  <Col span={24}>
                    <h2 className={`${styles.heading} grey-color`}>
                      {WASTE_STREAM_STRINGS.heading}
                    </h2>
                  </Col>
                  <Col span={24}>
                    <Graph
                      stats={data}
                      reporting={reporting}
                      photo={photo}
                      clientId={clientId}
                      isPowerPlant={isPowerPlant}
                      showImage={showImage}
                      isActiveJobsite={isActiveJobsite}
                    />
                  </Col>
                </>
              )}
              {/* <Col span={24}>
              <Row
                gutter={[24, 24]}
                align={'middle'}
                className="justify-between md-justify-start new-graph-values"
              >
                <Col className={styles.chart_summary}>
                  <Row align={'middle'} wrap={false} gutter={12}>
                    <Col className={styles.icon_wrap}>
                      <Image
                        src={'/images/total-diverted-icon.svg'}
                        alt={WASTE_STREAM_STRINGS.totalDiverted}
                        preview={false}
                        className={styles.tree_img}
                      />
                    </Col>
                    <Col>
                      <h4>
                        {data?.total_diverted || 0}{" "}
                        {MESSAGES.METRIC_TONS}
                      </h4>
                      <p>{WASTE_STREAM_STRINGS.totalDiverted}</p>
                    </Col>
                  </Row>
                </Col>
                <Col className={styles.chart_summary}>
                  <Row align={'middle'} wrap={false} gutter={12}>
                    <Col className={styles.icon_wrap}>
                      <Image
                        src={'/images/co2-icon.svg'}
                        alt={WASTE_STREAM_STRINGS.totalCo2Diverted}
                        preview={false}
                        className={styles.tree_img}
                      />
                    </Col>
                    <Col>
                      <h4>
                        {data?.total_co2_diverted || 0}{" "}
                        {MESSAGES.METRIC_TONS}
                      </h4>
                      <p>{WASTE_STREAM_STRINGS.totalCo2Diverted}</p>
                    </Col>
                  </Row>
                </Col>
                <Col className={styles.chart_summary}>
                  <Row align={'middle'} wrap={false} gutter={12}>
                    <Col className={styles.icon_wrap}>
                      <Image
                        src={'/images/target-icon.svg'}
                        alt={WASTE_STREAM_STRINGS.clientDiversionGoal}
                        preview={false}
                        className={styles.tree_img}
                      />
                    </Col>
                    <Col>
                      <h4>{data?.client_diversion_goal || 0}%</h4>
                      <p>
                        {mute
                          ? `average ${WASTE_STREAM_STRINGS.clientDiversionGoal}`
                          : WASTE_STREAM_STRINGS.clientDiversionGoal}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col className={styles.chart_summary}>
                  <Row align={'middle'} wrap={false} gutter={12}>
                    <Col className={styles.icon_wrap}>
                      <Image
                        src={'/images/c-icon.svg'}
                        alt={WASTE_STREAM_STRINGS.chuckResult}
                        preview={false}
                        className={styles.tree_img}
                      />
                    </Col>
                    <Col>
                      <h4>{data?.chuck_result || 0}%</h4>
                      <p>
                        {mute
                          ? `average ${WASTE_STREAM_STRINGS.chuckResult}`
                          : WASTE_STREAM_STRINGS.chuckResult}
                      </p>
                    </Col>
                  </Row>
                </Col>
                <Col className={styles.chart_summary}>
                  <Row align={'middle'} wrap={false} gutter={12}>
                    <Col className={styles.icon_wrap}>
                      <Image
                        src={'/images/leaf-icon.svg'}
                        alt={WASTE_STREAM_STRINGS.cleanEnergyBtus}
                        preview={false}
                        className={styles.tree_img}
                      />
                    </Col>
                    <Col>
                      <h4>
                        {roundToNearestMillion(data?.clean_energy || 0)}{' '}
                        {WASTE_STREAM_STRINGS.BTU}
                      </h4>
                      <p>{WASTE_STREAM_STRINGS.cleanEnergyBtus}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col> */}
              <Col span={24}>
                {/* First row: Total Wood Waste Collected - centered */}
                {userRole && DISPLAY_MAP_ROLES.includes(userRole) && (
                  <>
                    <Row
                      gutter={[24, 24]}
                      align="middle"
                      justify="center"
                      className="new-graph-values new-map-graph-values"
                    >
                      <Col>
                        <div className="green-text">
                          <Title level={2}>
                            {Math.round(data?.wood_waste_collected ?? data?.wood_waste ?? 0)}{' '}
                            <span> {MESSAGES.METRIC_TONS}</span>
                          </Title>
                          <Title className="mt-0 mb-0" level={3}>
                            <span>
                              {' '}
                              {WASTE_STREAM_STRINGS.totalWoodWasteCollected}
                            </span>
                          </Title>
                          <Title className="mt-0 mb-0" level={3}>
                            <span className="bold-tons">
                             ${Math.round(data?.carbon_credit_dollars ?? 0)}{' '}
                              
                            </span>
                            <span>
                              {' '}
                              {WASTE_STREAM_STRINGS.carbonCreditsGenerated}
                            </span>
                          </Title>
                          <Title className="mt-10 mb-0 black" level={3}>
                            Converted into:
                          </Title>
                        </div>
                      </Col>
                    </Row>
                    {/* Second row: 4 columns - Black text */}
                    <Row
                      gutter={[24, 24]}
                      align="top"
                      justify="space-between"
                      className="new-graph-values new-map-graph-values"
                    >
                      <Col flex="1">
                        <div className="green-text">
                          <span className="pointers">P1</span>
                          <Title level={2}>
                            {Math.round(data?.remanufacturing ?? 0)}{' '}
                            <span> {MESSAGES.METRIC_TONS}</span>
                          </Title>
                          <Title className="mt-0 mb-0" level={3}>
                            <span> {WASTE_STREAM_STRINGS.remanufacturing}</span>
                          </Title>
                        </div>
                      </Col>

                      <Col flex="1">
                        <div className="green-text">
                          <span className="pointers">P2-3</span>
                          <Title level={2}>
                          {Math.round(data?.biomass_clean_energy ?? 0)}{' '}
                            <span> {MESSAGES.METRIC_TONS}</span>
                          </Title>
                          <Title className="mt-0 mb-0" level={3}>
                            <span>
                              {' '}
                              {WASTE_STREAM_STRINGS.biomassCleanEnergy}
                            </span>
                          </Title>
                        </div>
                      </Col>

                      <Col flex="1">
                        <div className="green-text">
                          <span className="pointers">P4-5</span>
                          <Title level={2}>
                            {Math.round(data?.industrial_product ?? 0)}{' '}
                            <span> {MESSAGES.METRIC_TONS}</span>
                          </Title>
                          <Title className="mt-0 mb-0" level={3}>
                            <span>
                              {WASTE_STREAM_STRINGS.industrialProduct}
                            </span>
                          </Title>
                        </div>
                      </Col>

                      <Col flex="1">
                        <div className="green-text">
                          <Title level={2}>
                            {Math.round(data?.landfill ?? 0)}{' '}
                            <span> {MESSAGES.METRIC_TONS}</span>
                          </Title>
                          <Title className="mt-0 mb-0" level={3}>
                            <span> {WASTE_STREAM_STRINGS.landfill}</span>
                          </Title>
                        </div>
                      </Col>
                    </Row>
                  </>
                )}

                {/* Third row: Green text metrics - 5 equally spaced items */}
                <Row
                  gutter={[24, 24]}
                  align="top"
                  justify="space-between"
                  className="new-graph-values new-map-graph-values"
                >
                  <Col flex="1">
                    <GenieButtonWrapper
                      hint="co2e_carbon_impact"
                      position="top"
                      className="display-block for-co2"
                    >
                      <div className="chart_summary">
                        <div className={styles.icon_wrap}>
                          <Image
                            src="/images/co2-icon.svg"
                            alt={WASTE_STREAM_STRINGS.totalCo2Diverted}
                            preview={false}
                            className={styles.tree_img}
                          />
                        </div>
                        <h4>
                          {Math.round(data?.total_co2_diverted ?? 0)}{' '}
                          <span>{MESSAGES.METRIC_TONS}</span>
                        </h4>
                        <p>{WASTE_STREAM_STRINGS.totalCo2Diverted}</p>
                      </div>
                    </GenieButtonWrapper>
                  </Col>

                  <Col flex="1">
                    <GenieButtonWrapper
                      hint="transport_co2"
                      position="top"
                      className="display-block for-co2"
                    >
                      <div className="chart_summary">
                        <div className={styles.icon_wrap}>
                          <Image
                            src="/images/icon-truck.svg"
                            alt={WASTE_STREAM_STRINGS.totalCo2Diverted}
                            preview={false}
                            className={styles.tree_img}
                          />
                        </div>
                        <h4>
                          {Math.round(data?.transport_co2 ?? 0)}{' '}
                          <span>{MESSAGES.METRIC_TONS}</span>
                        </h4>
                        <p>
                          {WASTE_STREAM_STRINGS.TRANSPORT}{' '}
                          {WASTE_STREAM_STRINGS.CO2}
                        </p>
                      </div>
                    </GenieButtonWrapper>
                  </Col>

                  <Col flex="1">
                    <GenieButtonWrapper
                      hint="net_co2_avoided"
                      position="top"
                      className="display-block for-co2"
                    >
                      <div className="chart_summary">
                        <div className={styles.icon_wrap}>
                          <Image
                            src="/images/icon-co2-avoided.svg"
                            alt={WASTE_STREAM_STRINGS.totalCo2Diverted}
                            preview={false}
                            className={styles.tree_img}
                          />
                        </div>
                        <h4>
                          {Math.round(data?.net_co2_avoided ?? 0)}{' '}
                          <span>{MESSAGES.METRIC_TONS}</span>
                        </h4>
                        <p>
                          {WASTE_STREAM_STRINGS.NET} {WASTE_STREAM_STRINGS.CO2}{' '}
                          {WASTE_STREAM_STRINGS.AVOIDED}
                        </p>
                      </div>
                    </GenieButtonWrapper>
                  </Col>

                  <Col flex="1">
                    <GenieButtonWrapper
                      hint="diversion_rate"
                      position="top"
                      className="display-block for-co2"
                    >
                      <div className="chart_summary">
                        <div className={styles.icon_wrap}>
                          <Image
                            src="/images/total-diverted-icon.svg"
                            alt={WASTE_STREAM_STRINGS.totalDiverted}
                            preview={false}
                            className={styles.tree_img}
                          />
                        </div>
                        <h4>
                          {data?.diverted_percentage || 0}{' '}
                          <span>{MESSAGES.PERCENTAGE}</span>
                        </h4>
                        <p>{WASTE_STREAM_STRINGS.PERC_DIVERTED}</p>
                      </div>
                    </GenieButtonWrapper>
                  </Col>

                  <Col flex="1">
                    <GenieButtonWrapper
                      hint="mwh_energy_equivalent"
                      position="top"
                      className="display-block for-co2"
                    >
                      <div className="chart_summary">
                        <div className={styles.icon_wrap}>
                          <Image
                            src="/images/leaf-icon-2.svg"
                            alt={WASTE_STREAM_STRINGS.cleanEnergyBtus}
                            preview={false}
                            className={styles.tree_img}
                          />
                        </div>
                        <h4 className="text-transformation">
                          {roundToNearestMillion(Number(Math.round(data?.clean_energy)) || 0)}{' '}
                          <span>{WASTE_STREAM_STRINGS.MWH}</span>
                        </h4>
                        <p>{WASTE_STREAM_STRINGS.cleanEnergyBtus}</p>
                      </div>
                    </GenieButtonWrapper>
                  </Col>

                  
                </Row>
              </Col>
            </Row>
          </div>
          <section className="mb-40 new-graph-type-stats pl-12">
            <TypeStats data={data} mute={mute} />
          </section>
        </>
      )}
    </div>
  )
}

const TreeGraph = memo(TreeGraphComponent)
TreeGraph.displayName = 'TreeGraph'

export default TreeGraph
