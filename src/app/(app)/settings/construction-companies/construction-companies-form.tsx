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

export default function ConstructionCompaniesForm(props: {
  id: number | null | undefined
  setIsModalOpen: (value: boolean) => void
  onRefresh: () => void
}) {
  const [edit, setEdit] = useState(false)
  const [clientObject, setClientObject] = useState(USER_INITIAL_STATE)
  const [initialEmail, setInitialEmail] = useState('')
  const triggerNotification = useTriggerNotification()
  const { setLoading } = useLoader()

  useEffect(() => {
    if (props.id) {
      setEdit(true)
      getClientData(props.id)
    }
  }, [props.id])

  const getClientData = async (id: number | null) => {
    try {
      setLoading(true)
      const result = await getClient(id)
      const clientData = result.data.data
      const normalizedData: USER_TYPE = {
        id: clientData.id ?? 0, // Assuming id is never null
        username: clientData.username ?? '',
        email: clientData.email ?? '',
        name: clientData.name ?? '',
        company: clientData.company ?? '',
        phone: clientData.phone ?? '',
        billing_details_name: clientData.billing_details_name ?? '',
        billing_details_street: clientData.billing_details_street ?? '',
        billing_details_city: clientData.billing_details_city ?? '',
        billing_details_state: clientData.billing_details_state ?? '',
        billing_details_zipcode: clientData.billing_details_zipcode ?? '',
        billing_details_country: clientData.billing_details_country ?? '',
        photo: clientData.photo ?? '',
      }
      setClientObject(normalizedData)
      setInitialEmail(clientData.email ?? '')
      setLoading(false)
    } catch (err) {
      setLoading(false)
      triggerNotification(
        'error',
        MESSAGES.ERROR,
        MESSAGES.SOMETHING_WENT_WRONG_CLIENT
      )
    }
  }

  const removeEmptyStrings = (obj: any) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ''))
  }
  const upsertClient = async (formData: FormData) => {
    try {
      setLoading(true)
      formData.append(
        'role',
        JSON.stringify({ id: ROLES_ENUM.GENERAL_CONTRACTOR })
      )

      if (edit) {
        // since the call is of patch we need to check if the email was updated else a email uniqueness validation error is thrown
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
          ? MESSAGES.CLIENT_SUCCESSFULLY_UPDATED
          : MESSAGES.CLIENT_SUCCESSFULLY_CREATED
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
      initialValues={clientObject}
      validationSchema={CREATE_CLIENT_SCHEMAS}
      onSubmit={upsertClient}
      title={MESSAGES.CLIENTS}
      formType={FORM_TYPES.CONSTRUCTION_COMPANY}
    />
  )
}
