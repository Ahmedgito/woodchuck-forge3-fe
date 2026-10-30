import * as Yup from 'yup'
import { isValidPhoneNumber } from 'libphonenumber-js'
import {
  JOBSITE_CONSTANT,
  ROLES_ENUM,
  SCHEMAS_CONSTANT,
  VESSEL_WEIGHT_TYPE,
} from './app-constants'

const zipCodeReqExp = /(^\d{5}$)|(^\d{5}-\d{4}$)/
const EMAIL_REGX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const alphabeticFieldSchema = () => {
  return Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .matches(/^[A-Za-z\s]+$/, JOBSITE_CONSTANT.ALPHABETS_ONLY)
    .required('Required')
}

const numericFieldSchema = () => {
  return Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .matches(/^[0-9]*$/, JOBSITE_CONSTANT.NUMBERS_ONLY)
    .required('Required')
}

const alphaNumericFieldSchema = () => {
  return Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .matches(/^[A-Za-z0-9]*$/, JOBSITE_CONSTANT.ALPHA_NUMERIC_ONLY)
    .required('Required')
}

const addressFieldSchema = () => {
  return Yup.object()
    .shape({
      addressFull: Yup.string().required('Address is required'),
      addressLine1: Yup.string().required('Address line 1 is required'),
      addressLine2: Yup.string().nullable(),
      city: Yup.string().nullable(),
      state: Yup.string().nullable(),
      postalCode: Yup.string().nullable(),
      country: Yup.string().required('Country is required'),
      lat: Yup.number().required('Latitude is required'),
      lng: Yup.number().required('Longitude is required'),
    })
    .required('Address is required')
}

const BILLING_SCHEMA = {
  billing_details_name: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50),
  billing_details_street: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .max(100, SCHEMAS_CONSTANT.MIN3_MAX_100),

  billing_details_city: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50),

  billing_details_state: Yup.string()
    .min(1, SCHEMAS_CONSTANT.MIN1_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN1_MAX_50),

  billing_details_zipcode: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50),

  billing_details_country: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50),
}

export const CREATE_CLIENT_SCHEMAS = Yup.object().shape({
  username: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required')
    .matches(EMAIL_REGX, 'Invalid email'),
  name: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .required('Required'),
  company: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .required('Required'),
  phone: Yup.string()
    .required('Required')
    .test('phone', 'Phone number is not valid', (str) => {
      return isValidPhoneNumber(str, 'US')
    }),
  ...BILLING_SCHEMA,
})

export const ADD_HAULER_SCHEMA = Yup.object().shape({
  name: alphabeticFieldSchema(),
  email: Yup.string()
    .email('Invalid email')
    .required('Required')
    .matches(EMAIL_REGX, 'Invalid email'),
  phone: Yup.string()
    .required('Required')
    .test('phone', 'Phone number is not valid', (value) => {
      return isValidPhoneNumber(value, 'US')
    }),
  // dumpsterSize: Yup.array()
  //   .min(1, 'Atleast 1 dumpster size must be selected')
  //   .required('required'),
  street: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .max(100, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .nullable()
    .optional(),
  city: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .max(100, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .nullable()
    .optional(),
  state: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .max(100, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .nullable()
    .optional(),
  zip: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .max(100, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .matches(/^[A-Za-z0-9]*$/, JOBSITE_CONSTANT.ALPHA_NUMERIC_ONLY)
    .nullable()
    .optional(),
  country: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .max(100, SCHEMAS_CONSTANT.MIN3_MAX_100)
    .nullable()
    .optional(),
})

export const ADD_GLOBAL_DATA_SCHEMA = Yup.object().shape({
  distanceMmrMacomb: Yup.number()
    .required('Required')
    .positive('Enter a positive number'),
  distanceMmrLivonia: Yup.number()
    .required('Required')
    .positive('Enter a positive number'),
  tonage10yrd: Yup.number()
    .required('Required')
    .positive('Enter a positive number'),
  tonage20yrd: Yup.number()
    .required('Required')
    .positive('Enter a positive number'),
  tonage30yrd: Yup.number()
    .required('Required')
    .positive('Enter a positive number'),
  tonage40yrd: Yup.number()
    .required('Required')
    .positive('Enter a positive number'),
  supervisorOnboarding: Yup.string().required('Required'),
  autoResponse: Yup.string().required('Required'),
})

export const ADD_JOB_SITE_SCHEMA = Yup.object().shape({
  address: addressFieldSchema(),
  sustainabilityGoal: Yup.number()
    .min(1, 'Must be at least 1')
    .max(100, 'Must be at most 100')
    .typeError('Must be a valid number')
    .required('Required')
    .test(
      'is-positive',
      'Must be a non-negative number',
      (value) => value !== undefined && value !== null && value >= 0
    ),
  name: alphabeticFieldSchema(),
  email: Yup.string()
    .email('Invalid email')
    .required('Required')
    .matches(EMAIL_REGX, 'Invalid email'),
  phone: Yup.string()
    .required('Required')
    .test('phone', 'Phone number is not valid', (str) => {
      return isValidPhoneNumber(str, 'US')
    }),
  title: alphabeticFieldSchema(),
  size: Yup.number()
    .min(0, 'Size must be 1 or greater')
    .max(5000, 'Size must be 5000 or less')
    .required('Required')
    .notOneOf([0], 'Size must be greater than 0'),
  // powerplants: Yup.string().required('Required'),
  // haulerId: Yup.number().required('Required'),
})

export const DUMPSTER_LOCATION_SCHEMA = Yup.object().shape({
  sublocationName: Yup.string()
    .required('Required')
    .matches(/^[A-Za-z\s]+$/, JOBSITE_CONSTANT.ALPHABETS_ONLY),
})

export const SUPERVISOR_FORM_SCHEMA = Yup.object().shape({
  name: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required')
    .matches(EMAIL_REGX, 'Invalid email'),
  phone: Yup.string()
    .required('Required')
    .test('phone', 'Phone number is not valid', (str) => {
      return isValidPhoneNumber(str, 'US')
    }),
})

export const ADMIN_PROFILE_FORM_SCHEMA = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Min 3 and Max 50 characters are allowed')
    .max(50, 'Min 3 and Max 50 characters are allowed')
    .required('Required'),
  username: Yup.string()
    .min(3, 'Min 3 and Max 50 characters are allowed')
    .max(50, 'Min 3 and Max 50 characters are allowed')
    .required('Required'),
  phone: Yup.string()
    .required('Required')
    .test('phone', 'Phone number is not valid', (str) => {
      return isValidPhoneNumber(str, 'US')
    }),
})
export const CLIENT_PROFILE_FORM_SCHEMA = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Min 3 and Max 50 characters are allowed')
    .max(50, 'Min 3 and Max 50 characters are allowed')
    .required('Required'),
  username: Yup.string()
    .min(3, 'Min 3 and Max 50 characters are allowed')
    .max(50, 'Min 3 and Max 50 characters are allowed')
    .required('Required'),
  phone: Yup.string()
    .required('Required')
    .test('phone', 'Phone number is not valid', (str) => {
      return isValidPhoneNumber(str, 'US')
    }),
  ...BILLING_SCHEMA,
})

export const JOB_SITE_INFO_SCHEMA = Yup.object().shape({
  address: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .required('Required'),
  title: Yup.string()
    .min(3, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .max(50, SCHEMAS_CONSTANT.MIN3_MAX_50)
    .required('Required'),
})
export const EDIT_WASTE_STREAM_SCHEMA = Yup.object().shape({
  name: alphabeticFieldSchema(),
  tonPerOffRoleYard: Yup.number()
    .typeError('Must be a valid number')
    .required('Required')
    .test(
      'is-decimal',
      'Must be a number with up to 2 decimal places',
      (value) => {
        if (value !== undefined && value !== null) {
          return /^\d+(\.\d{1,2})?$/.test(value.toString())
        }
        return true // Skip validation if value is undefined or null, Yup will handle required validation
      }
    )
    .test(
      'is-positive',
      'Must be a non-negative number',
      (value) => value !== undefined && value !== null && value >= 0
    ),
  tonPerFrontLoadYard: Yup.number()
    .typeError('Must be a valid number')
    .required('Required')
    .test(
      'is-decimal',
      'Must be a number with up to 2 decimal places',
      (value) => {
        if (value !== undefined && value !== null) {
          return /^\d+(\.\d{1,2})?$/.test(value.toString())
        }
        return true // Skip validation if value is undefined or null, Yup will handle required validation
      }
    )
    .test(
      'is-positive',
      'Must be a non-negative number',
      (value) => value !== undefined && value !== null && value >= 0
    ),

  tonPerCompactorYard: Yup.number()
    .typeError('Must be a valid number')
    .required('Required')
    .test(
      'is-decimal',
      'Must be a number with up to 2 decimal places',
      (value) => {
        if (value !== undefined && value !== null) {
          return /^\d+(\.\d{1,2})?$/.test(value.toString())
        }
        return true // Skip validation if value is undefined or null, Yup will handle required validation
      }
    )
    .test(
      'is-positive',
      'Must be a non-negative number',
      (value) => value !== undefined && value !== null && value >= 0
    ),
  colorCodeEst: Yup.string()
    .required('Required')
    .test(
      'not-default',
      'Color cannot be #00000000',
      (value) => value !== '#00000000'
    ),
  colorCodeReal: Yup.string()
    .required('Required')
    .test(
      'not-default',
      'Color cannot be #00000000',
      (value) => value !== '#00000000'
    ),
})
export const ADD_POWER_PLANT_SCHEMA = Yup.object().shape({
  name: alphabeticFieldSchema(),
  // btuPerTon: Yup.number()
  //   .typeError('Must be a valid number')
  //   .test(
  //     'is-decimal',
  //     'Must be a number with up to 2 decimal places',
  //     (value) => {
  //       if (value !== undefined && value !== null) {
  //         return /^\d+(\.\d{1,2})?$/.test(value.toString())
  //       }
  //       return true // Optional field
  //     }
  //   ),
  kwhPerTon: Yup.number()
    .typeError('Must be a valid number')
    .required('Required')
    .test(
      'is-decimal',
      'Must be a number with up to 2 decimal places',
      (value) => {
        if (value !== undefined && value !== null) {
          return /^\d+(\.\d{1,2})?$/.test(value.toString())
        }
        return true // Skip validation if value is undefined or null, Yup will handle required validation
      }
    ),
  address: addressFieldSchema(),
})
export const ADD_EMISSION_FACTOR_SCHEMA = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  key: Yup.string()
    .required('Key is required')
    .matches(/^[a-z0-9_]+$/, 'Key must contain only lowercase letters, numbers, and underscores'),
  value: Yup.string().required('Value is required'),
})
export const ADD_LOCATION_SCHEMA = Yup.object().shape({
  name: alphabeticFieldSchema(),
  type: Yup.number().required('Required'),
  // inMiles: Yup.number()
  //   .nullable()
  //   .test('is-to', 'Required', function (value) {
  //     const { to } = this.parent
  //     return !!to ? !!value : true
  //   })
  //   .test(
  //     'is-decimal',
  //     'Must be a number with up to 2 decimal places',
  //     (value) => {
  //       if (value !== undefined && value !== null) {
  //         return /^\d+(\.\d{1,2})?$/.test(value.toString())
  //       }
  //       return true // Skip validation if value is undefined or null, Yup will handle required validation
  //     }
  //   ),
  // to: Yup.string().nullable(),
  address: addressFieldSchema(),
})
export const ADD_WASTE_STREAM_SCHEMA = Yup.object().shape({
  wastestreamsId: Yup.number().required('Field is required'),
  dumpster_type: Yup.string().required('Field is required'),
  locationId: Yup.number().nullable(),
  powerplantId: Yup.number().nullable(),
  dumpsterId: Yup.number().required('Field is required'),
  distance: Yup.number().required('Field is required'),
  haulerId: Yup.number().required('Field is required'),
})

export const ADD_WASTE_STREAM_STEP_ONE_SCHEMA = Yup.object().shape({
  wastestreamsId: Yup.string().required('Field is required'),
  vesselId: Yup.string().required('Field is required'),
  vesselLocationId: Yup.number().required('Field is required'),
  co2: Yup.number()
    .nullable()
    .min(0, 'must be at least 0')
    .max(100, 'must be at most 100'),
  recycling_rebate: Yup.number()
    .nullable()
    .min(0, 'must be at least 0')
    .max(100, 'must be at most 100'),
})

export const ADD_WASTE_STREAM_STEP_TWO_SCHEMA = Yup.object().shape({
  cameraId: Yup.number().nullable(),
  additionalCameraId: Yup.number().nullable(),
  fillLevel: Yup.number()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      const { cameraId, additionalCameraId } = this.parent
      return !!cameraId || !!additionalCameraId ? !!value : true
    })
    .min(0, 'must be at least 0')
    .max(100, 'must be at most 100'),
  confidenceLevel: Yup.number()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      const { cameraId, additionalCameraId } = this.parent
      return !!cameraId || !!additionalCameraId ? !!value : true
    })
    .min(0, 'must be at least 0')
    .max(100, 'must be at most 100'),
  alertId: Yup.string()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      const { cameraId, additionalCameraId } = this.parent
      return !!cameraId || !!additionalCameraId ? !!value : true
    }),
})

export const ADD_WASTE_STREAM_STEP_THREE_SCHEMA = Yup.object().shape({
  distance: Yup.number()
    .nullable()
    .min(0, 'must be at least 0')
    .max(1000, 'must be at most 1000'),
  haulerId: Yup.number().nullable(),
  locationId: Yup.number()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      // TODO: Validation needs to be corrected
      const { powerplantId } = this.parent
      return !!powerplantId || !!value
    }),
  powerplantId: Yup.number()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      // TODO: Validation needs to be corrected
      const { locationId } = this.parent
      return !!locationId || !!value
    }),
})

export const ADD_WASTE_STREAM_STEP_FOUR_SCHEMA = Yup.object().shape({
  distance_2: Yup.number()
    .nullable()
    .min(0, 'must be at least 0')
    .max(1000, 'must be at most 1000'),
  haulerId_2: Yup.number().nullable(),
  locationId_2: Yup.number().nullable(),
  powerplantId_2: Yup.number().nullable(),
})

export const EDIT_WASTE_STREAM_ITEM_SCHEMA = Yup.object().shape({
  cameraId: Yup.number().nullable(),
  additionalCameraId: Yup.number().nullable(),
  fillLevel: Yup.number()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      const { cameraId, additionalCameraId } = this.parent
      return !!cameraId || !!additionalCameraId ? !!value : true
    })
    .min(0, 'must be at least 0')
    .max(100, 'must be at most 100'),
  confidenceLevel: Yup.number()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      const { cameraId, additionalCameraId } = this.parent
      return !!cameraId || !!additionalCameraId ? !!value : true
    })
    .min(0, 'must be at least 0')
    .max(100, 'must be at most 100'),
  alertId: Yup.string()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      const { cameraId, additionalCameraId } = this.parent
      return !!cameraId || !!additionalCameraId ? !!value : true
    }),
  co2: Yup.number().nullable(),
  vesselLocationId: Yup.number().required('Field is required'),
  haulerId: Yup.number().nullable(),
  haulerId_2: Yup.number().nullable(),
})

export const ADD_CAMERA_SCHEMA = Yup.object().shape({
  cameraId: Yup.string().required('ID is required').trim(),
  ipAddress: Yup.string().required('IP Address is required').trim(),
  name: Yup.string()
    .required('Description is required')
    .trim()
    .min(3, 'Description must be at least 3 characters')
    .max(50, 'Description must be at most 50 characters'),
  url: Yup.string().required('URL is required').trim(),
})

export const DUMPSTER_CAMERA_SCHEMA = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 50 characters'),
  cameraId: Yup.number()
    .integer('Camera ID must be an integer')
    .required('Camera ID is required'),
  alert: Yup.string().required('Alert is required'),
  maxLevel: Yup.number()
    .min(0, 'Max level must be at least 0')
    .max(100, 'Max level must be at most 100')
    .required('Max level is required'),
})

export const REGISTRATION_SCHEMA = Yup.object().shape({
  ...CREATE_CLIENT_SCHEMAS.fields,
  role: Yup.object().shape({
    id: Yup.number()
      .required('Role is required')
      .oneOf(Object.values(ROLES_ENUM), 'Invalid role selected'),
  }),
})

export const VESSEL_FORM_SCHEMA = Yup.object().shape({
  weightType: Yup.number().required('Field is required'),
  weight: Yup.number()
    .nullable()
    .test('is-to', 'Field is required', function (value) {
      const { weightType } = this.parent
      return weightType === VESSEL_WEIGHT_TYPE.CONFIRMED
        ? value !== null && value !== undefined
        : true
    })
    .min(0, 'must be at least 0')
    .max(1000, 'must be at most 1000'),
})

export const CLIENT_USERS_FORM_SCHEMA = Yup.object().shape({
  username: Yup.string().required('Full name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required')
    .matches(EMAIL_REGX, 'Invalid email'),
  phone: Yup.string().test('phone', 'Phone number is not valid', (str) => {
    if (!str || str.trim() === '') return true // allow empty
    return isValidPhoneNumber(str, 'US')
  }),
})

export const VESSEL_SCHEMA = Yup.object().shape({
  vessels: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .min(1, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Required'),

        options: Yup.array()
          .of(
            Yup.object().shape({
              value: Yup.number()
                .nullable() // ✅ allow null (empty placeholder)
                .transform((val, orig) => (orig === '' ? null : val)) // treat empty string as null
                .min(0, 'Min 0'),
            })
          )
          .max(6, 'Maximum 6 options allowed')
          .test(
            'has-yrd-for-new-vessel',
            'At least one YRD is required for new vessels',
            function (options) {
              const vessel = this.parent
              // If vessel has an id, it's an existing vessel - no validation needed
              if (vessel.id) {
                return true
              }
              // For new vessels, check if at least one option has a value
              const hasYrdValue = options?.some(
                (opt: any) => opt.value !== null && opt.value !== undefined
              )
              return hasYrdValue === true
            }
          ),
      })
    )
    .required('At least one vessel is required'),
})

export const WASTE_STREAM_SCHEMA = Yup.object().shape({
  name: Yup.string().max(50).required('Name is required'),
  wasteStreamTypes: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(50).required('Sub-type name is required'),
      vessels: Yup.array().of(
        Yup.object().shape({
          tons: Yup.number()
            .typeError('Tons must be a number')
            .min(0, 'Tons cannot be negative')
            .nullable(),
        })
      ),
    })
  ),
})

export const VESSEL_DETAILS_SCHEMA = Yup.object().shape({
  vessels: Yup.array().of(
    Yup.object().shape({
      weightType: Yup.number().required('Weight type is required'),
      weight: Yup.number()
        .nullable()
        .when('weightType', {
          is: VESSEL_WEIGHT_TYPE.CONFIRMED,
          then: (schema) => schema.required('Weight is required'),
          otherwise: (schema) => schema.nullable(),
        }),
    })
  ),
})

export const VESSEL_COUNT_SCHEMA = Yup.object({
  vesselCount: Yup.number()
    .typeError('Enter a number')
    .required('Required')
    .min(1, 'A maximum of 20 vessels can be added at one time.')
    .max(20, 'A maximum of 20 vessels can be added at one time.'),
})
