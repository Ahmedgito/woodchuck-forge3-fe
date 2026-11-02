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

/**
 * "Home page" action for the settings action row.
 * - Q-1 (AC-4): always visible; when the form is dirty, ask to confirm
 *   (Modal.confirm) before leaving, and keep the edits if the user stays.
 * - Q-2 (AC-5): secondary/outline button (SecondaryButton), htmlType="button"
 *   so it never submits the form, navigating client-side to "/" via the router.
 */

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
