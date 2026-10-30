import React from 'react'
import { Form, Checkbox, Row, Col } from 'antd'

import { Rule } from 'antd/es/form'

interface FormatSelectorProps {
  name?: string
}
export const EXPORT_FORMATS_RULES: Rule[] = [
  {
    type: 'array',
    required: true,
    min: 1,
    message: 'Select at least one format',
  },
]
const FormatSelector: React.FC<FormatSelectorProps> = ({
  name = 'formats',
}) => {
  return (
    <Form.Item name={name} className="export-format-icons-group">
      <Checkbox.Group>
        <Row justify="center" align="middle" gutter={[32, 16]}>
          <Form.Item name="formats" rules={EXPORT_FORMATS_RULES}>
            <Checkbox.Group>
              <Row
                justify="center"
                align="middle"
                className="mt-10 mb-15"
                gutter={[32, 16]}
              >
                <Col>
                  <div className="export-format-icons">
                    <Checkbox value="pdf" />
                    <img src="/images/pdf-icon.svg" alt="pdf-icon" />
                  </div>
                </Col>

                <Col>
                  <div className="export-format-icons">
                    <Checkbox value="excel" />
                    <img src="/images/sheets-icon.svg" alt="sheets-icon" />
                  </div>
                </Col>

                <Col>
                  <div className="export-format-icons">
                    <Checkbox value="csv" />
                    <img src="/images/csv-file-icon.svg" alt="csv-file-icon" />
                  </div>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Row>
      </Checkbox.Group>
    </Form.Item>
  )
}

export default FormatSelector
