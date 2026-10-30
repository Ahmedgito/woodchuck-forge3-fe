import React from 'react'
import { Select, Typography } from 'antd'

interface Props {
  value?: any // TODO: use correct type
  placeholder?: string
  className?: string
  cssClassName?: string
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
  title?: string
  allowClear?: boolean
  showError?: boolean
  onClear?: () => void
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
}

const SelectComponent: React.FC<Props> = ({
  value,
  placeholder,
  className,
  cssClassName,
  options,
  disabled,
  onChange,
  errors = {},
  showError,
  touched = {},
  name,
  title,
  allowClear,
  onClear,
  getPopupContainer,
}) => {
  return (
    <>
      <Select
        value={value}
        //style={{ width: 250 }}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        className={`${className} ${value ? 'selected-field' : ''} ` || ''}
        disabled={disabled || false}
        title={title || ''}
        allowClear={allowClear}
        onClear={onClear}
        popupClassName={cssClassName}
        getPopupContainer={getPopupContainer}
        virtual={false}
      />
      {showError && errors[name] && touched[name] && (
        <Typography.Text className="error-label">
          {errors[name]}
        </Typography.Text>
      )}
    </>
  )
}

export default SelectComponent
