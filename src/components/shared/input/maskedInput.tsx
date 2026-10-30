import { MASK, PHONE_MASK } from '@/src/utils/constants/form-constants'
import React from 'react'
import MaskedInput from 'react-text-mask'
interface Props {
  name: string
  value: string | number | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: { [key: string]: any }
  touched: { [key: string]: any }
  disabled?: boolean
}
const CustomMaskedInput: React.FC<Props> = ({
  name,
  value,
  onChange,
  onBlur,
  errors,
  touched,
  disabled = false,
}) => {
  return (
    <div>
      <MaskedInput
        className={`ant-input ant-input-outlined ${disabled ? 'ant-input-disabled' : ''}`}
        name={name}
        mask={MASK}
        defaultValue={value}
        guide={false}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={PHONE_MASK}
        disabled={disabled}
      />
      {touched && errors && (
        <div className="error" style={{ color: 'red' }}>
          {errors[name]}
        </div>
      )}
    </div>
  )
}

export default CustomMaskedInput
