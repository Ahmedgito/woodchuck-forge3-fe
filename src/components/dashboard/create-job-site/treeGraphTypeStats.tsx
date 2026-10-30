'use client'

import { Col, Row, Typography, Image } from 'antd'
import WoodWaste from '@public/wood-waste-collect.svg'
import WoodDivert from '@public/wood-waste-divert.svg'
import LinkArrow from '@public/arrow.svg'
import { WASTE_STATS } from '@/src/utils/constants/types'
import {
  MESSAGES,
  WASTE_STREAM_STRINGS,
} from '@/src/utils/constants/app-constants'
import GenieButtonWrapper from '../../shared/hocs/genie-wrapper'
const TypeStats = ({
  data,
  mute,
}: {
  data: WASTE_STATS | undefined
  mute: boolean
}) => {
  const { Title, Text } = Typography

  return (
    <section className="detail-stats my-5 flex flex-col gap-8">
      <Row gutter={[16, 16]}>
        <Col
          xl={24}
          lg={24}
          md={24}
          sm={24}
          xs={24}
          className="text-center mb-5 mt-0"
        >
          <Title className="main-title mb-0 mt-3" level={1}>
            <span className="font-bold">{data?.wood_waste_diverted || 0}%</span>{' '}
            {WASTE_STREAM_STRINGS.heading}
          </Title>
          <Title className="mt-0 sub-head" level={5}>
            {data?.total_wood_waste_diversion || 0}%{' '}
            {WASTE_STREAM_STRINGS.TOTAL_WASTE_DIVERSION}
          </Title>
        </Col>
      </Row>

      <Row gutter={{ xs: 8 }}>
        <Col
          xl={{ span: 4, offset: 6 }}
          lg={{ span: 5, offset: 5 }}
          md={{ span: 6, offset: 3 }}
          sm={{ span: 6, offset: 2 }}
          xs={{ span: 9, offset: 0 }}
        >
          <Image src={WoodWaste.src} preview={false} />
          <Title className="mt-2 mb-0" level={2}>
            <span className="font-black">
              {Math.round(Number(data?.wood_waste_collected) || 0)} {MESSAGES.METRIC_TONS}
            </span>
          </Title>
          <Text className="font-medium">
            {WASTE_STREAM_STRINGS.WOOD_WASTE_COLLECTED}
          </Text>
        </Col>

        <Col
          xl={4}
          lg={4}
          md={6}
          sm={8}
          xs={6}
          className="flex items-center justify-center"
        >
          <GenieButtonWrapper
            hint="wood_waste_diversion_stats"
            className="justify-center genie-wood-waste-diversion"
          >
            <Image src={LinkArrow.src} preview={false} />
          </GenieButtonWrapper>
        </Col>

        <Col xl={10} lg={10} md={9} sm={8} xs={9}>
          <Image src={WoodDivert.src} preview={false} />
          <Title className="mt-2 mb-0" level={2}>
            <span className="font-black">
              {Math.round(Number(data?.total_waste_diversion) || 0)} {MESSAGES.METRIC_TONS}
            </span>
          </Title>
          <Text className="font-medium">{MESSAGES.WOOD_WASTE_DIVERTED}</Text>
        </Col>
      </Row>

      <Row className='other-waste-streams mt-16' justify='center'>
        <Col>
          <Title className="mt-2 mb-0 text-center" level={3}>{MESSAGES.OTHER_WASTE_STREAMS}:</Title>
        </Col>
      </Row>

      <Row gutter={[16, 24]} className='mt-10'>
        <Col
          xl={5}
          lg={5}
          md={12}
          sm={12}
          xs={12}
          className="flex flex-col gap-2 flex-responsive"
        >
          <div className="lime">
            <Title level={2}>{MESSAGES.CARD_BOARD}</Title>
            <Title className="mt-0 mb-0" level={2}>
              <span className="font-black">
                {Math.round(Number(data?.card_board?.delivered) || 0)} {MESSAGES.METRIC_TONS}
              </span>
            </Title>
          </div>
          {/* {!mute && (
            <Text className="state-value">
              {WASTE_STREAM_STRINGS.DELIVERED_TO}{' '}
              {data?.card_board?.delivered_to}{' '}
            </Text>
          )} */}
          <Text className="state-value">
            <b className="font-bold">
              {Math.round(Number(data?.card_board?.transport_co2) || 0)} {MESSAGES.METRIC_TONS}{' '}
            </b>
            {WASTE_STREAM_STRINGS.TRANSPORT + ' ' + WASTE_STREAM_STRINGS.CO2}
          </Text>
          <div className="mt-5">
            <div className="lime">
              <Title className="mt-0 mb-0" level={2}>
                {MESSAGES.DOLLAR} {Math.round(Number(data?.card_board?.recycling_rebate) || 0)}
              </Title>
            </div>
            <Text className="state-value">{MESSAGES.RECYCLING_REBATES}</Text>
          </div>
        </Col>

        <Col
          xl={5}
          lg={5}
          md={12}
          sm={12}
          xs={12}
          className="flex flex-col gap-2"
        >
          <div className="black">
            <Title level={2}>{MESSAGES.WASTE_HAULING}</Title>
            <Title className="mt-0 mb-0" level={2}>
              <span className="font-black">
                {' '}
                {Math.round(Number(data?.waste_hauling?.delivered) || 0)} {MESSAGES.METRIC_TONS}
              </span>
            </Title>
          </div>
          {/* {!mute && (
            <Text className="state-value">
              {WASTE_STREAM_STRINGS.DELIVERED_TO}{' '}
              {data?.waste_hauling?.delivered_to}
            </Text>
          )} */}
          <Text className="state-value">
            <b className="font-bold">
              {Math.round(Number(data?.waste_hauling?.transport_co2) || 0)} {MESSAGES.METRIC_TONS}{' '}
            </b>
            {WASTE_STREAM_STRINGS.TRANSPORT + ' ' + WASTE_STREAM_STRINGS.CO2}
          </Text>
        </Col>

        <Col
          xl={5}
          lg={5}
          md={12}
          sm={12}
          xs={12}
          className="flex flex-col gap-2"
        >
          <div className="brown sky-blue">
            <GenieButtonWrapper hint="waste_diversion_statistics_tonnage">
              <Title level={2}>{MESSAGES.METAL}</Title>
            </GenieButtonWrapper>
            <Title className="mt-0 mb-0" level={2}>
              <span className="font-black">
                {Math.round(Number(data?.metal?.delivered) || 0)} {MESSAGES.METRIC_TONS}
              </span>
            </Title>

          </div>
          {/* {!mute && (
            <Text className="state-value">
              {WASTE_STREAM_STRINGS.DELIVERED_TO} {data?.metal?.delivered_to}
            </Text>
          )} */}
          <Text className="state-value">
            <b className="font-bold">
              {Math.round(Number(data?.metal?.transport_co2) || 0)} {MESSAGES.METRIC_TONS}{' '}
            </b>
            {WASTE_STREAM_STRINGS.TRANSPORT + ' ' + WASTE_STREAM_STRINGS.CO2}
          </Text>
        </Col>

        <Col
          xl={5}
          lg={5}
          md={12}
          sm={12}
          xs={12}
          className="flex flex-col gap-2"
        >
          <div className="purple light-orange">
            <Title level={2}>{MESSAGES.PLASTIC}</Title>
            <Title className="mt-0 mb-0" level={2}>
              <span className="font-black">
                {Math.round(Number(data?.plastic?.delivered) || 0)} {MESSAGES.METRIC_TONS}
              </span>
            </Title>
          </div>
          {/* {!mute && (
            <Text className="state-value">
              {WASTE_STREAM_STRINGS.DELIVERED_TO} {data?.plastic?.delivered_to}
            </Text>
          )} */}
          <Text className="state-value">
            <b className="font-bold">
              {Math.round(Number(data?.plastic?.transport_co2) || 0)} {MESSAGES.METRIC_TONS}{' '}
            </b>
            {WASTE_STREAM_STRINGS.TRANSPORT + ' ' + WASTE_STREAM_STRINGS.CO2}
          </Text>
        </Col>

        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          xl={4}
          className="flex flex-col gap-2"
        >
          <div className="concrete">
            <Title level={2}>{MESSAGES.CONCRETE}</Title>
            <Title className="mt-0 mb-0" level={2}>
              <span className="font-black">
                {Math.round(Number(data?.concrete?.delivered) || 0)} {MESSAGES.METRIC_TONS}
              </span>
            </Title>
          </div>
          <Text className="state-value">
            <b className="font-bold">
              {Math.round(Number(data?.concrete?.transport_co2) || 0)} {MESSAGES.METRIC_TONS}{' '}
            </b>
            {WASTE_STREAM_STRINGS.TRANSPORT + ' ' + WASTE_STREAM_STRINGS.CO2}
          </Text>
        </Col>
      </Row>
    </section>
  )
}
export default TypeStats
