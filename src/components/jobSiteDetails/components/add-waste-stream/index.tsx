import { Row, Col, Button } from 'antd'
import styles from './style.module.scss'
import InputComponent from '@/src/components/shared/input'
import { Form, Formik } from 'formik'
import SelectComponent from '@/src/components/shared/select'
import { PlusCircleFilled, PlusOutlined } from '@ant-design/icons'

export default function AddWasteStream({}: {}) {
  let option = [
    {
      label: 'Option 1',
      value: 'Option 1',
    },
    {
      label: 'Option 2',
      value: 'Option 2',
    },
    {
      label: 'Option 3',
      value: 'Option 3',
    },
  ]
  return (
    <>
      <Formik
        initialValues={{}}
        // validationSchema={ADD_JOB_SITE_SCHEMA}
        onSubmit={(values) => {
          // onUpdateJobSite(values)
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
          validateForm,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit} className={styles.add_waste_form}>
            <Row
              align={'middle'}
              gutter={[6, 16]}
              wrap={false}
              className={styles.row_head}
            >
              <Col xs={24} sm={12} md={4} lg={4}>
                <h3>WASTE STREAMS</h3>
              </Col>
              <Col xs={24} sm={12} md={4} lg={3}>
                <h3>Dumpster</h3>
              </Col>
              <Col xs={24} sm={12} md={5} lg={5}>
                <h3>Dumpster location</h3>
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <h3>Delivery location</h3>
              </Col>
              <Col xs={24} sm={12} md={3} lg={2}>
                <h3>DISTANCE</h3>
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <h3>HAULER</h3>
              </Col>
            </Row>
            <Row
              align={'middle'}
              gutter={[6, 16]}
              wrap={false}
              className={styles.form_row}
            >
              <Col xs={24} sm={12} md={4} lg={4}>
                <InputComponent
                  name="WASTE STREAMS"
                  value="Wood Waste"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={3}>
                <InputComponent
                  name="Off Roll 30YD"
                  value="Off Roll 30YD"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={5} lg={5}>
                <InputComponent
                  name="Job Site"
                  value="Job Site"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <InputComponent
                  name="MMR Macomb"
                  value="MMR Macomb"
                  disabled={true}
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={3} lg={2}>
                <InputComponent
                  name="distance"
                  value="45"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <InputComponent
                  name="Blue Ridge Disposal Co."
                  value="Blue Ridge Disposal Co."
                  className={styles.textfield}
                  onChange={handleChange}
                  disabled={true}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <a href="js:" title="Change" className={styles.change_icon}>
                <i className="icon-pencil"></i>
                Change
              </a>
            </Row>
            <Row
              align={'middle'}
              gutter={[6, 16]}
              wrap={false}
              className={styles.form_row}
            >
              <Col xs={24} sm={12} md={4} lg={4}>
                <InputComponent
                  name="WASTE STREAMS"
                  value="Wood Waste"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={3}>
                <InputComponent
                  name="Off Roll 30YD"
                  value="Off Roll 30YD"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={5} lg={5}>
                <InputComponent
                  name="Job Site"
                  value="Job Site"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <InputComponent
                  name="MMR Macomb"
                  value="MMR Macomb"
                  disabled={true}
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={3} lg={2}>
                <InputComponent
                  name="distance"
                  value="45"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <InputComponent
                  name="Blue Ridge Disposal Co."
                  value="Blue Ridge Disposal Co."
                  className={styles.textfield}
                  onChange={handleChange}
                  disabled={true}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <a href="js:" title="Change" className={styles.change_icon}>
                <i className="icon-pencil"></i>
                Change
              </a>
            </Row>
            <Row
              align={'middle'}
              gutter={[6, 16]}
              wrap={false}
              className={styles.form_row}
            >
              <Col xs={24} sm={12} md={4} lg={4}>
                <InputComponent
                  name="WASTE STREAMS"
                  value="Wood Waste"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={3}>
                <InputComponent
                  name="Off Roll 30YD"
                  value="Off Roll 30YD"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={5} lg={5}>
                <InputComponent
                  name="Job Site"
                  value="Job Site"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <InputComponent
                  name="MMR Macomb"
                  value="MMR Macomb"
                  disabled={true}
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={3} lg={2}>
                <InputComponent
                  name="distance"
                  value="45"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <InputComponent
                  name="Blue Ridge Disposal Co."
                  value="Blue Ridge Disposal Co."
                  className={styles.textfield}
                  onChange={handleChange}
                  disabled={true}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <a href="js:" title="Change" className={styles.change_icon}>
                <i className="icon-pencil"></i>
                Change
              </a>
            </Row>
            <Row
              align={'middle'}
              gutter={[6, 16]}
              wrap={false}
              className={` ${styles.form_row} ${styles.form_row_last}`}
            >
              <Col xs={24} sm={12} md={4} lg={4}>
                <InputComponent
                  name="WASTE STREAMS"
                  value="Wood Waste"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={3}>
                <InputComponent
                  name="Off Roll 30YD"
                  value="Off Roll 30YD"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={5} lg={5}>
                <InputComponent
                  name="Job Site"
                  value="Job Site"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={true}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <InputComponent
                  name="MMR Macomb"
                  value="MMR Macomb"
                  disabled={true}
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={3} lg={2}>
                <InputComponent
                  name="distance"
                  value="45"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <InputComponent
                  name="Blue Ridge Disposal Co."
                  value="Blue Ridge Disposal Co."
                  className={styles.textfield}
                  onChange={handleChange}
                  disabled={true}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                />
              </Col>
              <a href="js:" title="Change" className={styles.change_icon}>
                <i className="icon-pencil"></i>
                Change
              </a>
            </Row>
            <Row
              align={'middle'}
              gutter={[6, 16]}
              className={styles.form_select_row}
            >
              <Col xs={24} sm={12} md={4} lg={4}>
                <SelectComponent
                  name="Select Waste Stream"
                  errors={errors}
                  touched={touched}
                  showError={true}
                  className="form_select"
                  value={'Select Waste Stream'}
                  onChange={handleChange}
                  options={option}
                  placeholder="Select Waste Stream"
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={3}>
                <SelectComponent
                  name="Dumpster Type/Size"
                  errors={errors}
                  touched={touched}
                  showError={true}
                  className="form_select"
                  value={'Dumpster Type/Size'}
                  onChange={handleChange}
                  options={option}
                  placeholder="Dumpster Type/Size"
                />
              </Col>
              <Col xs={24} sm={12} md={5} lg={5}>
                <Row align={'middle'} gutter={[6, 16]} wrap={false}>
                  <Col flex={'auto'}>
                    <SelectComponent
                      name="Select Dumpster Location"
                      errors={errors}
                      touched={touched}
                      showError={true}
                      className="form_select"
                      value={'Select Dumpster Location'}
                      onChange={handleChange}
                      options={option}
                      placeholder="Select Dumpster Location"
                    />
                  </Col>
                  <Col flex={'32px'}>
                    <PlusCircleFilled className={styles.add_icon} />
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <SelectComponent
                  name="Select Delivery Location"
                  errors={errors}
                  touched={touched}
                  showError={true}
                  className="form_select"
                  value={'Select Delivery Location'}
                  onChange={handleChange}
                  options={option}
                  placeholder="Select Delivery Location"
                />
              </Col>
              <Col xs={24} sm={12} md={3} lg={2}>
                <InputComponent
                  name="distance"
                  value="45"
                  className={styles.textfield}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={errors}
                  disabled={true}
                  touched={touched}
                />
              </Col>
              <Col xs={24} sm={12} md={4} lg={5}>
                <SelectComponent
                  name="Select Hauler"
                  errors={errors}
                  touched={touched}
                  showError={true}
                  className="form_select"
                  value={'Select Hauler'}
                  onChange={handleChange}
                  options={option}
                  placeholder="Select Hauler"
                />
              </Col>
            </Row>
            <Row align={'middle'} gutter={[6, 16]} justify={'end'}>
              <Col>
                <Button type="primary" className={styles.add_button}>
                  Create Waste Stream
                </Button>
              </Col>
            </Row>

            <Row align={'middle'} gutter={[6, 16]} className={styles.row_head}>
              <Col>
                <h3 className="my-3">ADD WASTE STREAMS</h3>
                <Button type="primary" className="size-60">
                  <PlusOutlined />
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  )
}
