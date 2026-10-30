'use client'
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Typography, Row, Col } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { ERROR_TYPES, MESSAGES } from '@/src/utils/constants/app-constants'
import InputComponent from '../../shared/input'
import {
  createClientUsers,
  getClientUserById,
  updateSubUser,
} from '@/src/services/global'
import { resetUserPassword } from '@/src/services/user'
import { CreateUser } from '@/src/utils/constants/types'
import { CLIENT_USERS_FORM_SCHEMA } from '@/src/utils/constants/schemas'
import { useLoader } from '@/src/utils/context/loader-context'
import CustomMaskedInput from '../../shared/input/maskedInput'
import SecondaryButton from '../../common/secondaryButton'
import { useSession } from 'next-auth/react'
const { Title } = Typography
import '../style.scss'

export interface FormValues {
  username: string
  email: string
  phone: string
}

interface ClientUserFormProps {
  userId?: number
  setIsModalOpen: (isOpen: boolean) => void
  refetchUsers: () => void
  deleteUser?: (id: number) => void
}
const { Text } = Typography
export default function ClientUserForm({
  userId,
  setIsModalOpen,
  refetchUsers,
  deleteUser = () => {},
}: ClientUserFormProps) {
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()
  const { data: session } = useSession()
  const isSubUser = session?.user?.isSubUser
  const [initialValues, setInitialValues] = useState<FormValues>({
    username: '',
    email: '',
    phone: '',
  })

  const getUserData = async () => {
    if (userId === undefined) return
    try {
      setLoading(true)
      const result = await getClientUserById(userId)
      setInitialValues({
        username: result.data.data.username || '',
        email: result.data.data.email || '',
        phone: result.data.data.phone || '',
      })
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
  useEffect(() => {
    if (userId) {
      getUserData()
    } else {
      setInitialValues({ username: '', email: '', phone: '' })
    }
  }, [userId])

  const handleResetPassword = async () => {
    try {
      setLoading(true)
      await resetUserPassword(initialValues.email)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        MESSAGES.PASSWORD_RESET_SUCCESS
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
  }
  const onSubmit = async (values: CreateUser) => {
    try {
      setLoading(true)

      if (userId) {
        const { email, ...rest } = values
        await updateSubUser(userId, {
          username: rest.username,
          phone: rest.phone,
        })
      } else {
        await createClientUsers(values)
      }
      refetchUsers()
      setIsModalOpen(false)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        userId
          ? MESSAGES.CLIENT_USER_SUCCESSFULLY_UPDATED
          : MESSAGES.CLIENT_USER_SUCCESSFULLY_CREATED
      )
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      const errors = err.response?.data?.errors || {}
      if (
        errors.email === ERROR_TYPES.EMAIL_ALREADY_EXISTS ||
        errors?.includes?.('email must be unique')
      ) {
        triggerNotification(
          'error',
          MESSAGES.ERROR,
          MESSAGES.EMAIL_ALREADY_EXISTS
        )
      } else if (errors.subUser === ERROR_TYPES.MAX_SUB_USERS_REACHED) {
        triggerNotification(
          'error',
          MESSAGES.ERROR,
          MESSAGES.MAX_SUBUSERS_REACHED
        )
      } else {
        triggerNotification(
          'error',
          MESSAGES.ERROR,
          MESSAGES.SOMETHING_WENT_WRONG
        )
      }
    }
  }

  return (
    <>
      <Title level={3}>{userId ? 'EDIT USER' : 'ADD A USER'}</Title>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={CLIENT_USERS_FORM_SCHEMA}
        onSubmit={onSubmit}
      >
        {({ errors, handleChange, handleBlur, values, touched }) => (
          <Form className="client-user-form">
            {/* Full Name */}
            <Title level={4} className="mb-10 font-bold">
              {MESSAGES.USERINFO}
            </Title>
            <div className="mb-4 validation-note-user-form ">
              <span className="text-red-500">* </span>
              <Text className="validationText">{MESSAGES.REQUIRED_NOTE}</Text>
            </div>
            <div className="field w-full">
              <label htmlFor="username">
                <span className="text-red-500">*</span> {MESSAGES.FULL_NAME}
              </label>
              <InputComponent
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                disabled={!!isSubUser}
              />
            </div>
            {/* Phone Number */}

            <div className="field w-full">
              <label htmlFor="email">
                <span className="text-red-500">*</span> {MESSAGES.EMAIL}
              </label>
              <InputComponent
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                disabled={userId ? true : !!isSubUser}
              />
            </div>

            {/* Phone Number */}
            <div className="field w-full">
              <label htmlFor="phone">{MESSAGES.PHONE_NUMBER}</label>
              <CustomMaskedInput
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={errors}
                touched={touched}
                disabled={!!isSubUser}
              />
            </div>

            {/* Reset Password Section - Only show for sub users */}
            {isSubUser && (
              <>
                <Row>
                  <Col xs={8} sm={8} md={8} lg={12} xl={12}></Col>
                  <Col
                    xs={16}
                    sm={16}
                    md={16}
                    lg={12}
                    xl={12}
                    className="text-right"
                  >
                    <Button
                      type="text"
                      onClick={handleResetPassword}
                      className="edit-icon font-inter font-medium reset"
                      icon={<SyncOutlined />}
                    >
                      {MESSAGES.RESET_PASSWORD}
                    </Button>
                  </Col>
                </Row>
              </>
            )}

            {!isSubUser && (
              <div className="client-users-form__button-container actions-buttons">
                <SecondaryButton type="default" htmlType="submit">
                  {userId ? MESSAGES.UPDATE : MESSAGES.SAVE}
                </SecondaryButton>
                {userId && (
                  <Button
                    className="delete-button-edit-subuser"
                    type="default"
                    danger
                    onClick={() => deleteUser(userId)}
                  >
                    {MESSAGES.DELETE_USER}
                  </Button>
                )}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  )
}
