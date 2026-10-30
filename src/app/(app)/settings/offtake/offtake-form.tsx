'use client'
import React, { useEffect, useState } from 'react'
import { USER_TYPE } from '@/utils/constants/types'
import {
  MESSAGES,
  ROLES_ENUM,
  FORM_TYPES,
} from '@/utils/constants/app-constants'
import { CREATE_CLIENT_SCHEMAS } from '@/utils/constants/schemas'
import { USER_INITIAL_STATE } from '@/src/utils/constants/initial-states'
import { useTriggerNotification } from '@/src/utils/context/notification-context'
import { useLoader } from '@/src/utils/context/loader-context'
import { createClient, getClient, updateClient } from '@/src/services/global'
import ClientForm from '@/src/components/settings/setting-forms/common-client-form'

export default function OfftakeForm(props: {
  id: number | null | undefined
  setIsModalOpen: (_: boolean) => void
  onRefresh: () => void
}) {
  const [edit, setEdit] = useState(false)
  const [offtakeObject, setOfftakeObject] = useState(USER_INITIAL_STATE)
  const [initialEmail, setInitialEmail] = useState('')
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  useEffect(() => {
    if (props.id) {
      setEdit(true)
      getOfftakeData(props.id)
    }
  }, [props.id])

  const getOfftakeData = async (id: number | null) => {
    try {
      setLoading(true)
      const result = await getClient(id)
      const offtakeData = result.data.data
      const normalizedData: USER_TYPE = {
        id: offtakeData.id ?? 0,
        username: offtakeData.username ?? '',
        email: offtakeData.email ?? '',
        name: offtakeData.name ?? '',
        company: offtakeData.company ?? '',
        phone: offtakeData.phone ?? '',
        billing_details_name: offtakeData.billing_details_name ?? '',
        billing_details_street: offtakeData.billing_details_street ?? '',
        billing_details_city: offtakeData.billing_details_city ?? '',
        billing_details_state: offtakeData.billing_details_state ?? '',
        billing_details_zipcode: offtakeData.billing_details_zipcode ?? '',
        billing_details_country: offtakeData.billing_details_country ?? '',
        photo: offtakeData.photo ?? '',
      }
      setOfftakeObject(normalizedData)
      setInitialEmail(offtakeData.email ?? '')
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_OFFTAKE
      )
    }
  }

  const upsertOfftake = async (formData: FormData) => {
    try {
      setLoading(true)
      formData.append('role', JSON.stringify({ id: ROLES_ENUM.OFFTAKE }))
      if (edit) {
        const email = formData.get('email') as string
        if (email === initialEmail) {
          formData.delete('email')
        }
        await updateClient(props.id, formData)
      } else {
        await createClient(formData)
      }
      props.onRefresh()
      props.setIsModalOpen(false)
      triggerNotification(
        'success',
        MESSAGES.SUCCESS,
        edit
          ? MESSAGES.OFFTAKE_SUCCESSFULLY_UPDATED
          : MESSAGES.OFFTAKE_SUCCESSFULLY_CREATED
      )
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        err.response?.data?.errors?.email === 'emailAlreadyExists' ||
          err.response?.data?.errors?.includes('email must be unique')
          ? MESSAGES.EMAIL_ALREADY_EXISTS
          : MESSAGES.SOMETHING_WENT_WRONG
      )
    }
  }

  return (
    <ClientForm
      initialValues={offtakeObject}
      validationSchema={CREATE_CLIENT_SCHEMAS}
      onSubmit={upsertOfftake}
      title={MESSAGES.OFFTAKES}
      formType={FORM_TYPES.OFFTAKE}
    />
  )
}
