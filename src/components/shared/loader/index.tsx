import React from 'react'
import { Spin } from 'antd'

interface FSLtypes {
  show: boolean | undefined
}

const FullScreenLoader = (props: FSLtypes) => {
  const { show } = props
  return (
    <>
      <Spin spinning={show} fullscreen />
    </>
  )
}

export { FullScreenLoader }
