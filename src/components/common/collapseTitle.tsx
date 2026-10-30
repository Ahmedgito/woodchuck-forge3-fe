'use client'

import { Button, Typography, Row, Col } from 'antd'
import { ReactNode } from 'react'

interface Props {
  title: string | ReactNode
  state?: boolean
  setState?: React.Dispatch<React.SetStateAction<boolean>>
  buttonText?: ReactNode
  addIcon?: boolean
  text?: string
  onButtonClick?: (e: React.MouseEvent<HTMLElement>) => void
  disableButton?: boolean
}

const CollapseTitle: React.FC<Props> = ({
  title,
  state,
  setState,
  buttonText,
  addIcon = true,
  text,
  onButtonClick,
  disableButton = false,
}) => {
  const { Title } = Typography

  return (
    <Row gutter={[16, 0]} className="api-toggle">
      <Col
        xl={16}
        lg={16}
        md={12}
        sm={12}
        xs={24}
        className="flex items-center"
      >
        <Title level={4} className="mb-0">
          {title}
        </Title>
      </Col>

      <Col
        xl={8}
        lg={8}
        md={12}
        sm={12}
        xs={24}
        className="flex justify-end items-center gap-4"
      >
        {text && (
          <Typography.Text className="mr-2 font-inter">{text} </Typography.Text>
        )}
        {buttonText && (
          <Button
            size="small"
            className="icon-button mb-0 secondary"
            disabled={disableButton}
            onClick={(e) => {
              e.stopPropagation()
              onButtonClick
                ? onButtonClick(e) // ✅ custom handler
                : setState && setState(!state) // ✅ fallback
            }}
          >
            {addIcon && <i className="icon-plus"></i>}
            {buttonText}
          </Button>
        )}
      </Col>
    </Row>
  )
}
export default CollapseTitle
