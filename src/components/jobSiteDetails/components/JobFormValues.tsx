import React from 'react'
import { Row, Col, Typography } from 'antd'

const { Text } = Typography

interface Props {
  details: { label?: string | number; value?: string | number }[]
}

const JobFormValues: React.FC<Props> = ({ details }) => {
  return (
    <>
      {details.map(
        (detail, index) =>
          detail.value && (
            <React.Fragment key={index}>
              {detail.label ? (
                <>
                  <Row
                    gutter={[
                      { xs: 0, xl: 0 },
                      { xs: 0, xl: 0 },
                    ]}
                    className="field"
                  >
                    <Col
                      xl={8}
                      lg={8}
                      md={8}
                      sm={8}
                      xs={24}
                      className="flex items-center justify-end lg-justify-start"
                    >
                      <label className="font-medium text-right lg-text-left mx-2 lg-mx-0 lg-mr-2 my-0 sm-my-2">
                        {detail.label}
                      </label>
                    </Col>
                    <Col
                      xl={16}
                      lg={16}
                      md={16}
                      sm={16}
                      xs={24}
                      className="flex items-center"
                    >
                      <span className="data-field flex items-center font-medium text-right flex-grow-1">
                        {detail.value}
                      </span>
                    </Col>
                  </Row>
                </>
              ) : (
                <Col span={24}>
                  <span className="data-field flex items-center font-medium flex-grow-1 mb-3">
                    {detail.value}
                  </span>
                </Col>
              )}
            </React.Fragment>
          )
      )}
    </>
  )
}

export default JobFormValues
