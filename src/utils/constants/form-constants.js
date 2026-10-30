import ConfidenceLevelTooltip from '@/src/components/dashboard/create-job-site/components/confidenceLevelToolTip'
import { Popover, Image } from 'antd'
import { VESSEL_WEIGHT_TYPE } from './app-constants'

export const CREATE_JOB_SITE_FORM = {
  STREET: 'Street',
  CITY: 'City',
  STATE: 'State',
  ZIP: 'ZIP',
  NAME: 'Name',
  EMAIL: 'Email',
  PHONE: 'Phone',
  SIZE_IN_SQFT: 'Size in sqft',
  DATE_OF_COMPLETION: 'Date of Completion',
  HAULER: 'Hauler',
  MMR_LOCATION: 'MMR Location',
  TITLE: 'Job Site Title',
  SUSTAINABILITY_GOAL: 'Sustainability  Goal in %:',
  SMS_PHONE: 'SMS Phone:',
  JS_TITLE: 'JS Title:',
  SIZE: 'Size:',
  COMPLETION_BY: 'Completion by:',
  BTU_CALCULATION: 'Power Plant for BTU Calculation ',
  START_DATE: 'Start Date',
  END_CLIENT: 'End Client',
}

export const GLOBAL_DATA_FORM = {
  MMR_MACOMB: 'Distance of MMR Macomb TO CMS miles',
  MMR_LIVONIA: 'Distance of MMR Livonia TO CMS miles',
  TONAGE_10YRD: 'Tonage: 10YRD',
  TONAGE_20YRD: 'Tonage: 20YRD',
  TONAGE_30YRD: 'Tonage: 30YRD',
  TONAGE_40YRD: 'Tonage: 40YRD',
  SUPERVISOR_ONBOARDING: 'Supervisor onboarding',
  AUTO_RESPONSE: 'Auto response',
}

export const RESET_PASSWORD_FORM = {
  PASSWORD: 'Password',
  CONFIRM_PASSWORD: 'Confirm Password',
}

export const DUMPSTERS = ['10', '20', '30', '40']

export const PHONE_MASK = '+1 (000) 000-0000'

export const LOCATION_FORM = {
  NAME: 'Name',
  TYPE: 'Type',
  MILES: 'In Miles',
  TO: 'To',
  ADDRESS: 'Address',
}
export const MASK = [
  '+',
  '1',
  ' ',
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
]
export const FORM_LABELS = {
  USERNAME: 'User Name',
  EMAIL: 'Email',
  DISPLAY_NAME: 'Display Name',
  COMPANY: 'Company',
  PHONE: 'Phone',
  BILLING_COMPANY_NAME: 'Company Name',
  STREET: 'Street',
  CITY: 'City',
  STATE: 'State',
  ZIP: 'ZIP',
  COUNTRY: 'Country',
  WASTE_STREAM: 'Waste Stream',
  VESSEL: 'Vessel',
  VESSEL_LOCATION: 'Vessel Location',
  CARBON_CREDIT: 'CO₂ Credit',
  CAMERA: 'Camera (Optional)',
  ADDITIONAL_CAMERA: 'Additional Camera (Optional)',
  FILL_LEVEL: 'Fill Level Max',
  CONFIDENCE_LEVEL: 'Confidence Level Min',
  ALERT: 'Alert',
  DISTANCE_TO: 'Distance To',
  PROCESSING_LOCATION: 'Processing Location',
  HAULER: 'Hauler',
  END_POINT: 'End Point',
  DISPLAY_ONLY: 'Display on reports.',
  RECYCLING_REBATE: 'Recycling Rebate',
}

export const BUTTONS = {
  REGISTER: 'Register',
  BACK: 'Back',
  NEXT: 'Next',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
}

export const FORM_TITLES = {
  REGISTER: 'Register',
}

export const WASTE_STREAM_STEPS = [
  {
    title: 'Describe your new waste stream:',
  },
  {
    title: 'Set up your camera(s):',
  },
  {
    title: 'Tell us where the vessel will be going:',
  },
  {
    title: 'Add another destination?',
  },
  {
    title: 'Save this waste stream and exit',
  },
]

export const getDynamicFormFields = (
  index,
  disabled = false,
  className = '',
  labelClassName = ''
) => {
  const DYNAMIC_STEP_FIELDS = {
    1: [
      {
        name: 'cameraId',
        label: 'Camera (Optional)',
        type: 'selector',
        placeholder: 'Select Camera',
        isSelector: true,
        allowClear: true,
        //span: 6,
        labelClassName: labelClassName,
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 6,
      },
      {
        name: 'additionalCameraId',
        label: (
          <span className="additional-camera-id">
            Additional Camera (Optional)
          </span>
        ),
        type: 'selector',
        placeholder: 'Select Camera',
        isSelector: true,
        allowClear: true,
        disabled: disabled,
        className: className,
        //span: 6,
        labelClassName: labelClassName,
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 6,
      },
      {
        name: 'fillLevel',
        label: 'Fill Level Max',
        type: 'number',
        placeholder: '0',
        allowClear: false,
        disabled: disabled,
        isMandatory: !disabled,
        className: className,
        //span: 3,
        suffix: '%',
        labelClassName: labelClassName,
        xs: 12,
        sm: 12,
        md: 8,
        lg: 3,
        xl: 3,
      },
      {
        name: 'confidenceLevel',
        label: (
          <span className="confidence-level-label">Confidence Level Min</span>
        ),
        type: 'number',
        placeholder: '0',
        allowClear: false,
        disabled: disabled,
        isMandatory: !disabled,
        className: className,
        //span: 3,
        xs: 12,
        sm: 12,
        md: 8,
        lg: 3,
        xl: 3,
        suffix: '%',
        isTooltip: true,
        labelClassName: labelClassName,
        ToolipComponent: (
          <div className="waste-stream-info-btn">
            <Popover content={<ConfidenceLevelTooltip />}>
              <Image
                src={'/images/chart/info-icon.svg'}
                preview={false}
                className="cursor-pointer mt-2"
              />
            </Popover>
          </div>
        ),
      },
      {
        name: 'alertId',
        label: 'Alert',
        type: 'selector',
        placeholder: 'Select Recipient',
        isSelector: true,
        allowClear: true,
        //span: 6,
        xs: 12,
        sm: 12,
        md: 8,
        lg: 6,
        xl: 6,
        disabled: disabled,
        isMandatory: !disabled,
        className: className,
        labelClassName: labelClassName,
      },
    ],
    2: [
      {
        name: 'distance',
        label: 'Distance To',
        type: 'number',
        placeholder: '0',
        allowClear: false,
        isMandatory: false,
        //span: 4,
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
        labelClassName: labelClassName,
      },
      {
        name: 'locationId',
        secondaryName: 'powerplantId',
        label: 'Processing Location',
        type: 'selector',
        placeholder: 'Select Location',
        isSelector: false,
        allowClear: false,
        isMandatory: true,
        //span: 6,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 6,
        labelClassName: labelClassName,
      },
      {
        name: 'haulerId',
        label: 'Hauler',
        type: 'selector',
        placeholder: 'Select Hauler',
        isSelector: true,
        allowClear: true,
        isMandatory: false,
        //span: 6,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 6,
        labelClassName: labelClassName,
      },
    ],
    3: [
      {
        name: 'distance_2',
        label: 'Distance To',
        type: 'number',
        placeholder: '0',
        allowClear: false,
        isMandatory: false,
        //span: 4,
        xs: 12,
        sm: 12,
        md: 4,
        lg: 4,
        xl: 4,
        labelClassName: labelClassName,
      },
      {
        name: 'locationId_2',
        secondaryName: 'powerplantId_2',
        label: 'End Point',
        type: 'selector',
        placeholder: 'Select End Point',
        isSelector: false,
        allowClear: false,
        isMandatory: false,
        //span: 6,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 6,
        labelClassName: labelClassName,
      },
      {
        name: 'haulerId_2',
        label: 'Hauler',
        type: 'selector',
        placeholder: 'Select Hauler',
        isSelector: true,
        allowClear: true,
        isMandatory: false,
        //span: 6,
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 6,
        labelClassName: labelClassName,
      },
    ],
  }

  return DYNAMIC_STEP_FIELDS[index]
}

export const ADD_VESSEL_FORM_OPTIONS = [
  {
    label: 'Estimated Weight',
    value: VESSEL_WEIGHT_TYPE.ESTIMATED,
  },
  {
    label: 'Confirmed Weight',
    value: VESSEL_WEIGHT_TYPE.CONFIRMED,
  },
]

export const WASTE_STREAM_FORM_INITIAL_VALUES = {
  name: '',
  colorCodeEst: '',
  colorCodeReal: '',
  wasteStreamTypes: [
    {
      name: '',
      colorCodeEst: '',
      colorCodeReal: '',
      vessels: [],
    },
  ],
}
