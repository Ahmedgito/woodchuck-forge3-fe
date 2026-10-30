import React from 'react'
import { Field, FieldProps } from 'formik'
import { ColorPicker } from 'antd'
import type { ColorPickerProps } from 'antd/es/color-picker'

interface ColorPickerFieldProps extends ColorPickerProps {
  name: string
  label: string
}

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  name,
  label,
  ...props
}) => (
  <Field name={name}>
    {({ field, meta, form }: FieldProps<string>) => {
      // field.value is the correct nested value from Formik
      const currentValue = field.value ?? props.value ?? '#1677ff' // fallback color

      return (
        <>
          <ColorPicker
            {...props}
            // pass the actual nested value (hex string) to AntD
            value={currentValue}
            onChange={(color) => {
              // set hex string back into Formik
              form.setFieldValue(name, color.toHexString())
            }}
            showText={(color) => (
              <span className="color-picker-span flex justify-between">
                <span className="font-medium ml-2">{label}</span>
                <span className="font-medium">{color.toHexString()}</span>
              </span>
            )}
            className="color-picker justify-start pl-2"
          />
          {meta.touched && meta.error ? (
            <div className="error">{meta.error}</div>
          ) : null}
        </>
      )
    }}
  </Field>
)

export default ColorPickerField
