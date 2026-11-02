'use client'
import React from 'react'
import { Modal } from 'antd'
import { useRouter } from 'next/navigation'
import { MESSAGES } from '@/src/utils/constants/app-constants'
import SecondaryButton from '@/src/components/common/secondaryButton'

type Props = {
  /** True when the surrounding form has unsaved changes. */
  dirty?: boolean
}

const HOME_ROUTE = '/'

const HomePageButton: React.FC<Props> = ({ dirty = false }) => {
  const router = useRouter()

  const goHome = () => router.push(HOME_ROUTE)

  const handleClick = () => {
    if (!dirty) {
      goHome()
      return
    }
    Modal.confirm({
      title: MESSAGES.UNSAVED_CHANGES_TITLE,
      content: MESSAGES.UNSAVED_CHANGES_CONTENT,
      okText: MESSAGES.LEAVE_PAGE,
      cancelText: MESSAGES.STAY_ON_PAGE,
      onOk: goHome,
    })
  }

  return (
    <SecondaryButton htmlType="button" onClick={handleClick}>
      {MESSAGES.HOME_PAGE}
    </SecondaryButton>
  )
}

export default HomePageButton
