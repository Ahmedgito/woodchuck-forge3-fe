import React from 'react'
import styles from '../style.module.scss'

type Props = {
  title: string
}

function CameraException({ title }: Props) {
  return (
    <div className={styles.cameraContainer}>
      <h1>{title}</h1>
    </div>
  )
}

export default CameraException
