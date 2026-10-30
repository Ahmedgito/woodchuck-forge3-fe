import { Input, Typography } from 'antd'

interface Props {
  name: string
  value: string | number | undefined
  type?: string
  placeholder?: string
  minRows: number
  maxRows: number
  disabled?: boolean
  touched: { [key: string]: any }
  onChange: (values: any) => void
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void
  restrictNegativeValue?: boolean
  errors: { [key: string]: any }
}

const MultiLineInput: React.FC<Props> = ({
  name,
  value,
  type,
  placeholder,
  errors,
  touched,
  disabled,
  onChange,
  onBlur,
  restrictNegativeValue,
  minRows,
  maxRows,

  ...rest
}) => {
  const { TextArea } = Input

  return (
    <>
      <TextArea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled || false}
        autoSize={{ minRows: minRows, maxRows: maxRows }}
        {...rest}
      />
      {errors[name] && touched[name] && (
        <Typography.Text className="error-label">
          {errors[name]}
        </Typography.Text>
      )}
    </>
  )
}

export default MultiLineInput
