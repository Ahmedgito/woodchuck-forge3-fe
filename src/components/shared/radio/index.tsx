import React from 'react'
import { Radio, Space, Typography } from 'antd'

interface Props {
  value?: any
  className?: string
  options:
    | {
        label?: string | number | undefined
        value: string | number | undefined
      }[]
    | any
  disabled?: boolean
  onChange: (value: any) => void
  errors?: { [key: string]: any }
  touched?: { [key: string]: any }
  name: string
  showError?: boolean
}

const RadioComponent: React.FC<Props> = ({
  value,
  className,
  options,
  disabled,
  onChange,
  errors = {},
  showError,
  touched = {},
  name,
}) => {
  return (
    <>
      <Radio.Group
        value={value}
        onChange={onChange}
        className={className || ''}
        disabled={disabled || false}
        name={name}
      >
        <Space direction="vertical" className="w-full" size="middle">
          {options.map((option: any, index: number) => (
            <Radio value={option.value} key={index}>
              <Typography.Text>{option.label}</Typography.Text>
            </Radio>
          ))}
        </Space>
      </Radio.Group>
      {showError && errors[name] && touched[name] && (
        <Typography.Text className="error-label">
          {errors[name]}
        </Typography.Text>
      )}
    </>
  )
}

export default RadioComponent
