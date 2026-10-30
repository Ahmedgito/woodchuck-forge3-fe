import React from 'react'
import { Input, Typography } from 'antd'
import { MaskedInput } from 'antd-mask-input'
import { MaskType } from 'antd-mask-input/build/main/lib/MaskedInput'

interface Props {
  name: string
  value: string | number | undefined
  type?: string
  placeholder?: string
  errors: { [key: string]: any }
  className?: string
  disabled?: boolean
  allowClear?: boolean
  touched: { [key: string]: any }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  mask?: MaskType | null
  variant?: 'outlined' | 'borderless' | 'filled' | undefined
  Labelname?: string
  restrictNegativeValue?: boolean
  step?: string
}

const InputComponent: React.FC<Props> = ({
  name,
  value,
  type,
  placeholder,
  errors,
  className,
  disabled,
  allowClear,
  touched,
  onChange,
  onBlur,
  mask,
  variant,
  Labelname,
  restrictNegativeValue,
  step,
  ...rest
}) => {
  // const [phoneNumber, setPhoneNumber] = useState<string>()

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!phoneNumber) setPhoneNumber(value as string)
  //   }, 1000)
  // }, [value])

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      type === 'number' &&
      restrictNegativeValue &&
      (event.key === '-' || event.key === 'e' || event.key === 'E')
    ) {
      event.preventDefault()
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      type === 'number' &&
      restrictNegativeValue &&
      event.target.value !== ''
    ) {
      event.target.value = event.target.value.replace(/-/g, '')
    }
    onChange(event)
  }

  const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    // Prevent scroll from changing number input value
    if (type === 'number') {
      event.currentTarget.blur()
    }
  }

  return (
    <>
      {mask ? (
        <MaskedInput
          name={name}
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={className || ''}
          mask={mask}
        />
      ) : (
        <>
          <Input
            className={` ${variant === 'borderless' ? 'placeholder-right' : ''} ${className} ${value ? 'selected-field' : ''} `}
            variant={variant}
            name={name}
            value={value}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            onWheel={handleWheel}
            type={type || 'text'}
            placeholder={placeholder}
            onBlur={onBlur}
            disabled={disabled || false}
            allowClear={allowClear || false}
            step={step}
            {...rest}
          />

          {variant === 'borderless' && (
            <span className="input-box-span">{Labelname}</span>
          )}
        </>
      )}

      {errors[name] && touched[name] && (
        <Typography.Text className="error-label">
          {errors[name]}
        </Typography.Text>
      )}
    </>
  )
}

export default InputComponent
