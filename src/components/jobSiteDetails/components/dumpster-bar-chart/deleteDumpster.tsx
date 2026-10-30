import React from 'react'
import styles from './styles.module.scss'
import { Image } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

type Props = {
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>
}

function DeleteDumpster({ setIsDelete }: Props) {
  return (
    <div className={styles.alert_box}>
      <span className={styles.alert_icon}>
        <Image src={'/images/warning-icon.svg'} preview={false} />
      </span>
      <span className={styles.alert_text}>
        Are you sure you want to delete this vessel?
      </span>
      <CloseOutlined
        className={styles.alert_close}
        onClick={() => setIsDelete(false)}
      />
    </div>
  )
}

export default DeleteDumpster
