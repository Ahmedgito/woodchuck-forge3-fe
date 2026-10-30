'use client'

import { Card, Col, Row, Typography, Button, Tooltip, Tag } from 'antd'
import {
  JOB_SITE_STATUS,
  JOB_STATUS,
  MESSAGES,
} from '@/src/utils/constants/app-constants'
import { JOB_SITE_TYPE } from '@/src/utils/constants/types'
import DoughnutChart from '../../shared/charts/doughnutChart'
import { useRouter } from 'next/navigation'
import GenieButtonWrapper from '../../shared/hocs/genie-wrapper'

const JobSiteCard = ({ jobSite }: { jobSite: JOB_SITE_TYPE }) => {
  const router = useRouter()
  const { Title, Text } = Typography
  const cardBoard: number = jobSite.cardBoard || 0
  const wasteHauling: number = jobSite.wasteHauling || 0
  const metal: number = jobSite.metal || 0
  const plastic: number = jobSite.plastic || 0
  const concrete: number = jobSite.concrete || 0

  return (
    <>
      <Col xs={24} sm={24} md={12} lg={8} xl={6}>
        <Card>
          {jobSite.status.id === JOB_STATUS.ACTIVE ? (
            <Text className="status mt-0 mb-5">{JOB_SITE_STATUS.ACTIVE}</Text>
          ) : (
            <Text className="status mt-0 mb-5">{MESSAGES.CLOSED}</Text>
          )}
          <Typography className="flex flex-col gap-7 for-mobile-jobsite-card">
            <Col span={24}>
              <Row align="middle" gutter={[16, 16]}>
                <Col span={12}>
                  <DoughnutChart
                    diverted={Number(jobSite.woodWasteDiverted)}
                    refused={100 - Number(jobSite.woodWasteDiverted)}
                    customOptions={{ cutout: 28, radius: 48 }}
                  />
                </Col>
                <Col span={12}>
                  <div className="green flex flex-nowrap items-center mb-2">
                    <Title level={3}>
                      <i className="icon-recycled"></i>{' '}
                    </Title>
                    <Tooltip
                      title={
                        Math.round(Number(jobSite.biomassForCleanEnergy) || 0) +
                        ' tn'
                      }
                    >
                      <Title level={5} className="my-0">
                        {Math.round(Number(jobSite.biomassForCleanEnergy) || 0)}{' '}
                        <span>tn</span>
                      </Title>
                    </Tooltip>
                  </div>
                  <Text className="donut-side-txt">
                    {MESSAGES.CLEAN_ENERGY}
                  </Text>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Title level={4}>{jobSite.title && jobSite.title}</Title>

              <Text className="text-color">
                <i className="icon-map-marker"></i>{' '}
                {jobSite.address?.addressFull || jobSite.address?.addressLine1}
              </Text>

              <div className="mt-1">
                <Row justify="space-between">
                  <Text className="diverted">{MESSAGES.CARD_BOARD}</Text>
                  <Text className="diverted font-bold">
                    {Math.round(Number(cardBoard))} {MESSAGES.METRIC_TONS}
                  </Text>
                </Row>

                <Row justify="space-between">
                  <Text className="refused">{MESSAGES.WASTE_HAULING}</Text>
                  <Text className="refused font-bold">
                    {Math.round(Number(wasteHauling))} {MESSAGES.METRIC_TONS}
                  </Text>
                </Row>

                <Row justify="space-between">
                  <Text className="data-blue">{MESSAGES.METAL}</Text>
                  <Text className="data-blue">
                    {Math.round(Number(metal))} {MESSAGES.METRIC_TONS}
                  </Text>
                </Row>

                <Row justify="space-between">
                  <Text className="data-orange">{MESSAGES.PLASTIC}</Text>
                  <Text className="bold data-orange">
                    {Math.round(Number(plastic))} {MESSAGES.METRIC_TONS}
                  </Text>
                </Row>

                <Row justify="space-between">
                  <Text className="data-conc">{MESSAGES.CONCRETE}</Text>
                  <Text className="bold data-conc">
                    {Math.round(Number(concrete))} {MESSAGES.METRIC_TONS}
                  </Text>
                </Row>

                <Row justify="end" className="border-top gap-6">
                  <Text className="total font-bold">
                    {MESSAGES.TOTAL_TONNAGE}
                  </Text>
                  <Text className="total font-bold">
                    {Math.round(Number(cardBoard)) +
                      Math.round(Number(wasteHauling)) +
                      Math.round(Number(metal)) +
                      Math.round(Number(plastic)) +
                      Math.round(Number(concrete)) +
                      Math.round(Number(jobSite.biomassForCleanEnergy))}{' '}
                    {MESSAGES.METRIC_TONS}
                  </Text>
                </Row>

                <div className="mt-2 border-top pt-2">
                  <Row justify="space-between" align="middle">
                    <Text className="font-bold">
                      {MESSAGES.CARBON_CREDIT_DOLLARS}
                    </Text>
                    <Text className="font-bold">
                      {MESSAGES.DOLLAR}
                      {Number(
                        jobSite?.carbonCredit?.carbonCreditDollars ?? 0
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </Row>
                  <Row justify="start" className="mt-1">
                    <Tooltip
                      title={
                        jobSite?.status?.name === JOB_SITE_STATUS.ACTIVE
                          ? MESSAGES.ESTIMATED_TOOLTIP
                          : MESSAGES.CONFIRMED_TOOLTIP
                      }
                    >
                      <Tag
                        color={
                          jobSite?.status?.name === JOB_SITE_STATUS.ACTIVE
                            ? 'green'
                            : 'blue'
                        }
                      >
                        {jobSite?.status?.name === JOB_SITE_STATUS.ACTIVE
                          ? MESSAGES.ESTIMATED
                          : MESSAGES.CONFIRMED}
                      </Tag>
                    </Tooltip>
                  </Row>
                </div>
              </div>
            </Col>
          </Typography>
          <Row>
            <Button
              type="primary"
              onClick={() => router.push(`/jobSites?id=${jobSite.id}`)}
            >
              {MESSAGES.SEE_DETAILS}
            </Button>
          </Row>
          <GenieButtonWrapper
            hint="see_details_jobsite"
            className="justify-center mt-2 see-details-button-title"
          >
            <></>
          </GenieButtonWrapper>
        </Card>
      </Col>
    </>
  )
}

export default JobSiteCard
