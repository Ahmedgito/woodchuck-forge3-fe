'use client'
import { Button, Space } from 'antd'
import { useRouter } from 'next/navigation'
import { MESSAGES } from '@/src/utils/constants/app-constants'

type SettingsActionBarProps = {
  onSave?: () => void
  saveDisabled?: boolean
}

export default function SettingsActionBar({
  onSave,
  saveDisabled = false,
}: SettingsActionBarProps) {
  const router = useRouter()

  return (
    <Space className="settings-action-bar" size={8}>
      <Button htmlType="button" onClick={() => router.push('/')}>
        {MESSAGES.HOME_PAGE}
      </Button>
      <Button
        type="primary"
        htmlType="button"
        disabled={saveDisabled}
        onClick={onSave}
      >
        {MESSAGES.SAVE_CHANGES}
      </Button>
    </Space>
  )
}
