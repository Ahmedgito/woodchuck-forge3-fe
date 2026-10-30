import React from 'react'
import { Button, ButtonProps } from 'antd'

type Props = ButtonProps & {
  children: React.ReactNode
}

const SecondaryButton: React.FC<Props> = ({
  className = '',
  children,
  ...rest
}) => {
  const combinedClassName = `${className} secondary`.trim()

  return (
    <Button type="default" className={combinedClassName} {...rest}>
      {children}
    </Button>
  )
}

export default SecondaryButton
