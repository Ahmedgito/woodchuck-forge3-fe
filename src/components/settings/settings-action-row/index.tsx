'use client'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Modal, Space } from 'antd'

interface Props {
  /** true when the form has unsaved changes */
  isDirty: boolean
  onSave?: () => void
  saveDisabled?: boolean
}

export const HOME_PAGE_LABEL = 'Home page'
export const SAVE_CHANGES_LABEL = 'Save changes'

/**
 * Action row of the settings page: "Home page" (a Next.js Link rendered as an
 * Ant Design default button; always visible and enabled) precedes
 * "Save changes" in DOM and visual order. With unsaved changes a plain click is
 * intercepted and a confirmation dialog is shown before leaving.
 */
const SettingsActionRow: React.FC<Props> = ({
  isDirty,
  onSave,
  saveDisabled,
}) => {
  const router = useRouter()

  const handleHomeClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDirty) return // clean form: the Link navigates to /
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
      return // new tab / window clicks pass through
    }
    e.preventDefault()
    Modal.confirm({
      title: 'Leave without saving?',
      content: 'You have unsaved changes. If you leave, they will be lost.',
      okText: 'Leave and discard changes',
      cancelText: 'Stay on this page',
      okButtonProps: { danger: true },
      onOk: () => router.push('/'),
    })
  }

  return (
    <Space className="settings-action-row" data-testid="settings-action-row">
      <Link href="/" passHref legacyBehavior>
        <Button href="/" onClick={handleHomeClick}>
          {HOME_PAGE_LABEL}
        </Button>
      </Link>
      <Button
        type="primary"
        htmlType="button"
        disabled={saveDisabled}
        onClick={onSave}
      >
        {SAVE_CHANGES_LABEL}
      </Button>
    </Space>
  )
}

export default SettingsActionRow
