//import "./style.scss"
import React from 'react'
import { Col, Row } from 'antd'
const FooterComponent = () => {
  return (
    <>
      <footer>
        <Row>
          <Col span={24}>
            {' '}
            <h1>Footer</h1>{' '}
          </Col>
        </Row>
      </footer>
    </>
  )
}

export default FooterComponent
