export const APP_CONSTANTS = {
  StatusRoute: {
    authenticated: {
      message: 'User created',
      link: '/',
    },
    unauthenticated: {
      message: 'User created',
      link: '/login',
    },
  },
}

export const ROLES_ENUM = {
  ADMIN: 1,
  GENERAL_CONTRACTOR: 2,
  POWER_PLANT: 3,
  END_CLIENT: 4,
  MANUFACTURER: 5,
  CMS: 6,
  OFFTAKE: 7,
}

export const FORM_TYPES = {
  END_CLIENT: 'end_client',
  CONSTRUCTION_COMPANY: 'construction_company',
  MANUFACTURER: 'manufacturer',
  OFFTAKE: 'offtake',
}

export const ROLES = {
  ADMIN: 'admin',
  GENERAL_CONTRACTOR: 'general_contractor',
  POWER_PLANT: 'power_plant',
  END_CLIENT: 'end_client',
  MANUFACTURER: 'manufacturer',
  CMS: 'cms',
  /** Must match backend `RoleEnum` key / `role.enum` from API (id 7). */
  OFFTAKE: 'wood_processing',
}
export const DISPLAY_MAP_ROLES = [ROLES.GENERAL_CONTRACTOR, ROLES.MANUFACTURER, ROLES.OFFTAKE, ROLES.ADMIN, ROLES.CMS]
export const HIDE_GRAPH = [ROLES.GENERAL_CONTRACTOR, ROLES.MANUFACTURER, ROLES.OFFTAKE, ROLES.ADMIN, ROLES.CMS]
export const ROLES_MAPPER = {
  [ROLES_ENUM.ADMIN]: 'Admin',
  [ROLES_ENUM.GENERAL_CONTRACTOR]: 'Construction Company',
  [ROLES_ENUM.POWER_PLANT]: 'Power Plant',
  [ROLES_ENUM.END_CLIENT]: 'End Client',
  [ROLES_ENUM.MANUFACTURER]: 'Manufacturer',
  [ROLES_ENUM.OFFTAKE]: 'Wood Processing',
}

export const API_VERSION_V1 = '/v1'
export const WASTE_STEAMS_BULK =
  API_VERSION_V1 + '/job-sites-wastestreams-dumpsters'

export const ROUTES = {
  AUTH: API_VERSION_V1 + '/auth',
  IMPERSONATION: API_VERSION_V1 + '/auth/impersonation',
  IMPERSONATION_REVERT: API_VERSION_V1 + '/auth/impersonation/revert',
  USERS: API_VERSION_V1 + '/users',
  HAULERS: API_VERSION_V1 + '/haulers',
  CAMERAS: API_VERSION_V1 + '/cameras',
  GLOBAL_DATA: API_VERSION_V1 + '/global_data',
  JOBSITES: API_VERSION_V1 + '/jobsites',
  SMS: API_VERSION_V1 + '/sms',
  ADD_DUMPSTER: '/addDumpster',
  UPDATE_DUMPSTER: '/updateDumpster',
  OUTCOME: API_VERSION_V1 + '/home/outcome',
  STATISTICS: API_VERSION_V1 + '/home/stats',
  DUMPSTER_STATUS: '/dumpsterStatus',
  WASTE: API_VERSION_V1 + '/home/waste',
  DUMPSTER_REFUSED_MMR: API_VERSION_V1 + '/dumpster-refused-mmr',
  NOTIFICATIONS: API_VERSION_V1 + '/notifications',
  SMS_DUMPSTER: API_VERSION_V1 + '/sms-dumpster',
  DUMPSTER_LIVE_VIEW: API_VERSION_V1 + '/dumpster-live-view',
  WASTE_STREAM: API_VERSION_V1 + '/wastestreams',
  POWER_PLANTS: API_VERSION_V1 + '/powerplants',
  EMISSION_FACTORS: API_VERSION_V1 + '/emission-factors',
  LOCATIONS: API_VERSION_V1 + '/locations',
  JOBSITES_WASTESTREAMS: API_VERSION_V1 + '/job-sites-waste-streams',
  WASTE_STREAMS_DUMPSTERS: API_VERSION_V1 + '/job-sites-wastestreams-dumpsters',
  JOB_SITE_CAMERAS: API_VERSION_V1 + '/job-sites-cameras',
  CAMERA_LIVE_VIEW: API_VERSION_V1 + '/camera-live-view',
  TREE_STATS: API_VERSION_V1 + '/home/tree-graph-',
  HOME: API_VERSION_V1 + '/home',
  UPDATE_ORDER: '/update-order',
  CLIENT_SUB_USERS_LISTING: API_VERSION_V1 + '/users/subUsers',
  CLIENT_SUB_USER_CREATE: API_VERSION_V1 + '/users/subUser',
  CLIENT_SUB_USER_UPDATE: API_VERSION_V1 + '/users',
  CLIENT_SUB_USER_DELETE: API_VERSION_V1 + '/users/subUser',
  SAVE_VESSEL: API_VERSION_V1 + '/vessels/save',
  GET_VESSEL: API_VERSION_V1 + '/vessels',
  REPORT_SUBSCRIPTIONS: API_VERSION_V1 + '/report-subscriptions',
  REPORT_SUBSCRIPTIONS_UNSUBSCRIBE:
    API_VERSION_V1 + '/report_subscriptions/unsubscribe',
  REPORT_SUBSCRIPTIONS_SUBSCRIBE:
    API_VERSION_V1 + '/report-subscriptions/toggle',
  SEND_JOBSITE_ARCHIVE_REPORT: API_VERSION_V1 + '/jobsites/send-archive-report',
  SEND_DASHBOARD_ARCHIVE_REPORT: API_VERSION_V1 + '/home/send-archive-report',
  EXPORT_USER: API_VERSION_V1 + '/export/user',
  EXPORT_ARCHIEVE_REPORT: '/export-archive-report',
  EXPORT_ARCHIEVE_REPORT_STATUS: API_VERSION_V1 + '/reports/export',
  API_KEY: API_VERSION_V1 + '/users/me/api-key',
  NEXT_API_EXPORT_ROUTE: '/api/export-user',
  REFRESH_API_KEY: API_VERSION_V1 + '/users/me/refresh-api-key',
  DOWNLOAD_POSTMAN_COLLECTION: '/api/download-postman',
  WASTE_STREAMS_DUMPSTERS_BULK_CREATE: WASTE_STEAMS_BULK + '/bulk-create',
  WASTE_STREAMS_DUMPSTERS_BULK_DELETE: WASTE_STEAMS_BULK + '/bulk-delete',
  GENIE: API_VERSION_V1 + '/genie',
  NEXT_AUTO_LOGIN_ROUTE: '/api/auth/autoLogin',
  MAP_DATA: API_VERSION_V1 + '/job-sites-waste-streams/map-data',
  MAP_STATS: API_VERSION_V1 + '/job-sites-waste-streams/map-data-stats',
  CMS_USERS: API_VERSION_V1 + '/users/cms',
  CARBON_CREDITS: API_VERSION_V1 + '/carbon-credits',
  WASTE_STREAM_IMAGES: API_VERSION_V1 + '/waste-stream-images',
  FILES_UPLOAD: API_VERSION_V1 + '/files/upload',
  WEIGHT_TICKETS_PROCESS: API_VERSION_V1 + '/weight-tickets/process',
  WEIGHT_TICKETS_APPLY: API_VERSION_V1 + '/weight-tickets/apply',
}
export const REGEX_CONSTANTS = {
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z!@#$%^&_*\?/|\d]{8,30}$/, ///^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
  URL: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/,
  USERNAME: /^[a-z]{1}[a-z0-9]{2,99}$/,
  PHONENUMBER: /^[0-9]*$/,
  DATE: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
}

export const MESSAGES = {
  FORGOT_PASSWORD: 'Forgot Password',
  ENTER_EMAIL: 'Please enter your email',
  RESET_EMAIL_TEXT: 'A link to reset your password will be sent to your email',
  SEND_EMAIL: 'Send Email',
  EMAIL_SENT: 'Email Sent!',
  EMAIL_SENT_MESSAGE: 'Reset password link has been sent to your email',
  TOTAL_TIME_WINDOW: 'Total Time Window:',

  //Registration
  ACCOUNT_PROMPT: 'Already have an account?',
  SIGN_IN: 'Sign in',
  REGISTRATION_SUCCESS:
    'Registration successful. We have sent a confirmation link to activate your account and set your password.',
  REGISTRATION_FAILED: 'Registration Failed',
  EMAIL_EXISTS: 'Email already exists',
  SUCCESS: 'Success',
  //Dashboard Stats
  DASHBOARD: 'Dashboard',
  N_A: 'N/A',
  NOTIFICATIONS: 'Notifications',
  SIGN_UP_AS: 'Sign up as ',

  //Job Site List
  ACTIVE_JOB_SITES: 'Active Job Sites',
  INACTIVE_JOB_SITES: 'Past Job Sites',
  SHOW_MORE: 'Show More',
  SHOW_LESS: 'Show Less',
  FIND_CLIENT: 'Find Construction Company',
  FIND_MANUFACTURER: 'Find Manufacturer',
  FIND_OFFTAKE: 'Find Wood Processing',

  //Job Site Card
  WOOD_WASTE_DIVERTED: 'Wood Waste Diverted',
  DIVERTED: 'Diverted',
  REFUSED: 'Refused',
  WASTE_RECYCLED: 'Wood Waste Recycled',
  CLEAN_ENERGY: 'Biomass for clean energy',
  TOTAL_TONNAGE: 'Total Tonnage',
  SEE_DETAILS: 'See Details',
  CO: 'CO',
  METRIC_TONS: 'tn',
  PERCENTAGE: '%',
  DOLLAR: '$',
  MI: 'mi',
  M: 'M',
  CARD_BOARD: 'Card Board',
  WASTE_HAULING: 'Waste Hauling',
  METAL: 'Metal',
  PLASTIC: 'Plastic',
  CONCRETE: 'Concrete',
  TOTAL_TONNAGE: 'Total Tonnage',
  SAVE_CHANGES: 'Save Changes',
  HOME_PAGE: 'Home page',
  CHANGE: 'Change',
  SAVE: 'SAVE',
  UPDATE: 'UPDATE',

  HAULER_INFO: 'HAULER INFO',
  HAULER_NAME: 'Hauler Name',
  EMAIL: 'Email',
  PHONE: 'Phone',
  DUMPSTER_SIZE: 'Dumpster Size',
  YARD: 'YRD',
  ADD_HAULER: 'Add Hauler',
  USER_INFO: 'USER INFO',
  USER_NAME: 'User Name',
  DISPLAY_NAME: 'Display Name',
  COMPANY: 'Company',
  COMPANY_NAME: 'Company Name',
  CREATE_ACCOUNT: 'Create Account',
  BILLING_ADDRESS: 'Billing Address',
  STREET: 'Street',
  CITY: 'City',
  ZIP: 'ZIP',
  COUNTRY: 'Country',
  STATE: 'State',
  EDIT_ACCOUNT: 'Edit Account',
  CLIENTS: 'Construction Companies',
  END_CLIENTS: 'End Clients',
  MANUFACTURERS: 'Manufacturers',
  OFFTAKES: 'Wood Processing',
  HAULERS: 'Haulers',
  CAMERA_ID: 'Camera ID',
  ADD_CLIENT: 'Add Construction Company',
  ADD_END_CLIENT: 'Add End Client',
  ADD_MANUFACTURER: 'Add Manufacturer',
  ADD_OFFTAKE: 'Add Wood Processing',
  ADD_HAULER: 'Add Hauler',
  ADD_CAMERAS: 'Add Cameras',
  SAVE_HAULER: 'Save Hauler',

  // create job site
  SITE_ADDRESS: 'Site Address',
  SUPERVISOR: 'Supervisor',
  JOB_SITE_INFO: 'Job Site Info',
  CLIENT_NAME: 'Construction Company Name',
  SELECT_HAULER: 'Select Hauler',
  CREATE_JOB_SITE: 'Create Job Site',
  TIME_OF_COMPLETION: 'Completion by',
  SEND_INSTRUCTIONS_TO_SUPERVISOR: 'SEND INSTRUCTIONS TO SUPERVISOR',
  TITLE: 'Title',
  JOB_SITE_TITLE: 'Job Site Title',
  SMS_SUCCESS_TO_SUPERVISOR: 'Sms instructions successfully send to supervisor',
  SQFT: 'sqft',
  ADDRESS: 'Address',
  PROJECT: 'Project',
  JOB_SITE_OVERVIEW: 'Job Site Overview',
  IMAGE_UPLOAD_SUCCESS: 'Image uploaded successfully',
  MANUFACTURER: 'Manufacturer',

  // job site listing
  ADD_SITE: 'Add A Site',
  CONTACT_ADMIN_TO_ADD_JOBSITE: 'To add a job site, contact your WoodChuck account manager',
  UPGRADE_HEADING: 'Upgrade to a Pro Account',
  UPGRADE_TO_PRO_FOR_MORE_JOBSITES: 'Want perks like waste tracking of more than one job site, and monthly reports of your waste material data?  Consider upgrading to a Pro account and get in touch with your WoodChuck account manager.',

  // settings
  GLOBAL_DATA: 'Global Data',
  MESSAGE_TEMPLATE: 'Message Template',
  INSTRUCTIONS_TO_SUPERVISOR: 'Instructions to Supervisor',
  MILES: 'mile(s)',
  TONS: 'ton(s)',
  GLOBAL_DATA_UPDATED: 'Data is successfully updated',
  SETTINGS: 'Settings',
  IMPACT_HISTORICAL_DATA:
    'Changing these values will impact all historical data!',
  DELETE_CAMERA_TITLE: 'Are you sure you want to delete this camera?',
  KEEP_CAMERA: 'Keep Camera',
  DELETE_CAMERA: 'Delete Camera',

  //Notification Toast
  INVALID_FILE_FORMAT: 'File format is invalid',
  FILE_SIZE_ERROR: 'File Size Error',
  FILE_SIZE_TOO_LARGE:
    'File size is too large. Please select a file smaller than 5MB.',
  INVALID_FILE_TYPE: 'Invalid File Type',
  INVALID_FILE_TYPE_MESSAGE: 'Please select a JPEG or PNG image file.',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  SOMETHING_WENT_WRONG_CLIENT:
    'Something went wrong in getting construction companies data',
  SOMETHING_WENT_WRONG_END_CLIENT:
    'Something went wrong in getting end clients data',
  SOMETHING_WENT_WRONG_MANUFACTURER:
    'Something went wrong in getting manufacturers data',
  SOMETHING_WENT_WRONG_OFFTAKE:
    'Something went wrong in getting wood processing data',
  SOMETHING_WENT_WRONG_HAULER: 'Something went wrong in getting haulers data',
  SOMETHING_WENT_WRONG_CAMERAS: 'Something went wrong in getting cameras data',
  SOMETHING_WENT_WRONG_UNASSIGN_HAULER:
    'Please unassign the current Hauler before assigning a new one',
  SOMETHING_WENT_WRONG_CAMERA_DELETE_JOB_SITE_ASSOCIATION:
    'This camera is associated with a Job Site -',
  SOMETHING_WENT_WRONG_CAMERAS_DELETE:
    'Something went wrong in deleting camera',
  SOMETHING_WENT_WRONG_POWER:
    'Something went wrong in getting power plants data',
  SOMETHING_WENT_WRONG_EMISSION_FACTORS:
    'Something went wrong in getting emission factors data',
  SOMETHING_WENT_WRONG_WASTE_STREAM:
    'Something went wrong in getting waste streams data',
  SOMETHING_WENT_WRONG_LOCATION:
    'Something went wrong in getting locations data',
  SOMETHING_WENT_WRONG_DUMPSTER: 'Something went wrong in getting Dumpsters',
  SOMETHING_WENT_WRONG_DUMPSTER_LOCATIONS:
    'Something went wrong in getting Dumpsters Locations',
  SOMETHING_WENT_WRONG_GRAPH: 'Something went wrong in getting Tree stats',
  SOMETHING_WENT_WRONG_DUMPSTER_STATS:
    'Something went wrong in getting Dumpster Stats',
  ERROR: 'Error',
  SUCCESS: 'Success',
  CLIENT_SUCCESSFULLY_CREATED: 'Construction company has been created successfully',
  CLIENT_SUCCESSFULLY_UPDATED: 'Construction company has been updated successfully',
  CLIENT_PRO_SUCCESSFULLY_CREATED: 'Pro construction company account has been created successfully',
  CLIENT_FREE_SUCCESSFULLY_CREATED: 'Free construction company account has been created successfully',
  CLIENT_PRO_SUCCESSFULLY_UPDATED: 'Pro construction company account has successfully updated',
  CLIENT_FREE_SUCCESSFULLY_UPDATED: 'Free construction company account has successfully updated',
  END_CLIENT_SUCCESSFULLY_CREATED: 'End Client has been created successfully',
  END_CLIENT_SUCCESSFULLY_UPDATED: 'End Client has been updated successfully',
  MANUFACTURER_SUCCESSFULLY_CREATED: 'Manufacturer has been created successfully',
  MANUFACTURER_SUCCESSFULLY_UPDATED: 'Manufacturer has been updated successfully',
  MANUFACTURER_PRO_SUCCESSFULLY_CREATED: 'Pro manufacturer account has been created successfully',
  MANUFACTURER_FREE_SUCCESSFULLY_CREATED: 'Free manufacturer account has successfully created',
  MANUFACTURER_PRO_SUCCESSFULLY_UPDATED: 'Pro manufacturer account has been updated successfully',
  MANUFACTURER_FREE_SUCCESSFULLY_UPDATED: 'Free manufacturer account has been updated successfully',
  OFFTAKE_SUCCESSFULLY_CREATED: 'Wood Processing has been created successfully',
  OFFTAKE_SUCCESSFULLY_UPDATED: 'Wood Processing has been updated successfully',
  HAULER_SUCCESSFULLY_ADDED: 'Hauler has been added successfully',
  HAULER_SUCCESSFULLY_UPDATED: 'Hauler has been updated successfully',
  POWER_SUCCESSFULLY_ADDED: 'Power Plant has been added successfully',
  POWER_SUCCESSFULLY_UPDATED: 'Power Plant has been updated successfully',
  EMISSION_FACTOR_SUCCESSFULLY_ADDED: 'Emission Factor has been added successfully',
  EMISSION_FACTOR_SUCCESSFULLY_UPDATED: 'Emission Factor has been updated successfully',
  CAMERA_SUCCESSFULLY_ADDED: 'Camera has been added successfully',
  CAMERA_SUCCESSFULLY_UPDATED: 'Camera has been updated successfully',
  CAMERA_SUCCESSFULLY_DELETED: 'Camera has been deleted successfully',
  DUMPSTER_LOCATION_ADDED_SUCCESS: 'Dumpster location has been added successfully',

  SUB_LOCATION_ADDED_SUCCESS: 'Sub-location has been added to the list',
  DUMPSTER_LOCATION_UPDATED_SUCCESS:
    'Dumpster location has been updated successfully',
  MMR_LOCATION_UPDATED_SUCCESS: 'MMR location has been updated successfully',
  JOB_SITE_CREATED_SUCCESS: 'Job site has been created successfully',
  JOB_SITE_DETAILS_UPDATED_SUCCESS: 'Job site details have been updated successfully',
  JOB_SITE_DETAILS_DELETED_SUCCESS: 'Job site has been closed successfully',
  PROFILE_UPDATE_SUCCESS: `Profile has been updated successfully`,
  PASSWORD_RESET_SUCCESS: `Password reset link has been sent successfully`,
  EMAIL_DOESNT_EXIST: `Email does not exist. Try again`,
  DUMPSTERS_UPDATED_SUCCESS: 'Dumpster has been updated successfully',
  REQUEST_UPDATED_SUCCESS: 'Request has been updated successfully',
  WASTE_STREAM_REORDER_SUCCESS: 'Waste stream has been reordered successfully',

  //Job Site Details
  //Header
  SITE_DETAIL: 'SITE DETAIL',
  ALL_SITE_DETAILS: 'All Sites Details',
  TODAY: 'Today',
  TO_DATE: 'To Date',
  FILTER_REPORT_VIEW: 'Filter Report View:',
  LAST_WEEK: 'This Week',
  LAST_MONTH: 'This Month',
  CUSTOM_DATE: 'Custom Date',
  EXPORT_REPORT: 'Export Report',
  CONFIRM: 'Confirm',
  DECLINE: 'Decline',
  ACCEPT: 'accept',
  REJECT: 'reject',
  EXPORT_FILTERED_DATA_DESCRIPTION:
    'Export a report that’s based on the filters you may have chosen.',
  EXPORT_ALL_DATA: 'Export all data',
  EXPORT_FILTERED_REPORT_VIEW: 'Export Filtered Report View',
  SETUP_AUTO_EXPORT: 'Set Up Auto-export',
  ARCHIVE_OF_ALL_REPORTS: 'Archive of All Monthly Reports',
  AUTO_EXPORT_REPORTS_TITLE: 'Set Up Auto-Exporting of Reports',
  EXPORT_FILTERED_REPORT: 'Export Filtered Report',
  EXPORT_FILTERED_REPORT_MODAL_DESCRIPTION:
    'Export a report that’s based on the filters you may have chosen.',
  AUTO_EXPORT_DESCRIPTION:
    'Turning this on will auto-export reports to you.  Use these controls to set up and activate.',
  TURN_ON: 'TURN ON',
  EXPORT: 'EXPORT',
  ARCHIVE_OF_MONTHLY_REPORTS: 'Archive of Monthly Reports',
  SEND_VIA_EMAIL: 'SEND VIA EMAIL',
  SELECT_ALL_MONTHS: 'Select all months',
  ARCHIVE_REPORTS_SENT_SUCCESS: 'Archive reports have been sent successfully via email',
  ARCHIVE_REPORTS_SEND_FAILED: 'Failed to send archive reports',
  ERROR_SENDING_ARCHIVE_REPORTS: 'Error sending archive reports:',
  SEND_SMS_VALIDATON:
    'To send an SMS, at least one dumpster location must be added',
  SUSTAINABILITY_REPORT: 'Sustainability Report',
  ALL_CLIENT_DETAILS: 'All Construction company Details',
  DASHBOARD_REPORT: 'Dashboard Report',
  OTHER_WASTE_STREAMS: 'Other Waste Streams',

  //Dumpster Status
  DUMPSTER_STATUS: 'DUMPSTER STATUS',
  DUMPSTERS_DELIVERED: 'Dumpsters Delivered',
  TOTAL_MILES_TO_MMR: 'Total Miles from Job Site to MMR',
  COLLECTED_WOOD_WASTE: 'of Collected Wood Waste',
  DUMPSTER_REFUSED_BY_MMR: 'Dumpster Refused by MMR',
  YARDS: 'yards',
  YARD_20: 'x 20 yards',
  YARD_40: 'x 40 yards',
  MI: 'mi',
  RECYCLED: 't recycled',
  ADD_WASTE_STREAMS: 'Add Waste Streams',
  MONTHLY_REPORTS: 'Monthly Reports',
  VESSEL_OVERVIEW: 'Vessel Overview',
  //Outcome
  OUTCOME: 'OUTCOME',
  AVOIDED: 'Avoided',
  PRODUCED: 'Produced',
  CO: 'CO',
  TOTAL_HAULED: 'Total Hauled',

  //Dupster location
  DUMPSTER_LOCATION: 'Dumpster Locations',
  MI_TO_MMR: 'mi to MMR',
  DUMPSTER_NOTE_1:
    'Keep the Sub-Location name simple and avoid complex spellings.',
  DUMPSTER_NOTE_2: 'This name will be used for SMS requests.',
  DUMPSTER_NOTE_3: `e.g. 'Main Gate', 'MG' or 'MainG'`,
  DUMPSTER_NOTE_4:
    'The Sub-Location name needs to be communicated to the Job Site Supervisor.',
  DUMPSTER_TITLE: 'ADD Dumpster Location  for Jobsite ',
  ADD_DUMPSTER_LOCATION: 'Add Dumpster Location',
  ADD_SUB_LOCATION_NOTE: 'Add to Vessel Location list',
  CANCEL_SUB_LOCATION_NOTE: "Don't add to Vessel Location list",
  SUB_LOCATION_VALIDATION_NOTE:
    'Adding is required if a sub-location is desired',
  LOADING: 'Loading...',
  INFO: 'INFO',
  SUBLOCATION_NAME: 'Sub-Location',
  DISTANCE_TO_MMR: 'Distance To MMR',
  LOCATION: 'LOCATION',
  ADD_SUBLOCATION: 'ADD SUBLOCATION',
  UPDATE_SUBLOCATION: 'UPDATE SUBLOCATION',
  CANCEL: 'Cancel',
  REQUIRED_NOTE: 'Indicates a required field',
  //Active Dumpster
  ACTIVE_DUMPSTER: 'Active Dumpster',
  ACTIVE_DUMPSTERS: 'Active Dumpsters',
  DUMPSTER_LIVE_VIEW: 'Dumpster Live View',
  SELECT_ID: 'SELECT ID',
  SELECT_CHAIN: 'SELECT CHAIN',
  RECYCLING_REBATES: 'Recycling Rebates',
  //Waste Diversion Rate
  WASTE_DIVERSION_RATE: 'Waste Diversion Rate',
  WASTER_DIVERSION_LABEL_ACCEPTED: 'Accepted',
  WASTER_DIVERSION_LABEL_REFUSED: 'Refused',

  //Collection Stats
  COLLECTION_STATS: 'Collection Stats',
  TOTAL_COLLECTED: 'Total Collected',
  TOTAL_RECYCLED: 'Total Recycled',
  TOTAL_REFUSED: 'Total Refused',
  ENERGY_GENERATED: 'Energy Generated For',
  HOMES: 'Homes',

  //Milage Stats
  MILAGE_STATS: 'MILAGE STATS',
  MI_T: 'mi/t',

  //MMR
  MMR_LOCATION: 'MMR LOCATION',
  //Footer
  CLOSE_JOB_SITE: 'Close Job Site',
  KEEP_JOB_SITE: 'Keep Job Site Open',
  ARE_U_SURE_CLOSE_THIS_JOB_SITE:
    'ARE YOU SURE YOU WANT TO CLOSE THIS JOB SITE?',
  //Profile
  USER_INFO: 'User Info',
  PASSWORD: 'Password',
  RESET_PASSWORD: 'Reset Password',
  DISPLAY_PROFILE_NAME: '[Display] Name',
  NAME_OR_COMPANY_NAME: 'Name or Company Name',

  //Navbar
  LOGOUT: 'Logout',
  VIEW_PROFILE: 'View Profile',
  MY_ACCOUNT: 'My Account',
  EXIT_CLIENT_VIEW: 'Exit Client View',
  EXIT_CMS_VIEW: 'Exit CMS View',
  VIEWING_AS: 'You are currently viewing as ',
  ADMIN_SESSION_RESTORED: 'Admin Session Restored',
  IMPERSONATION_SESSION_EXPIRED:
    'Your impersonation session had expired. You have been switched back to your admin account',

  //Notifications
  VIEW_JOB_SITE: 'View job site',
  SEE_ALL: 'See All',
  // auth
  PLEASE_SET_PASSWORD: 'Please set a password',
  PLEASE_SET_PASSWORD_TO_USE: 'Please set a password to use it.',
  PASSWORD_SET: 'Password set',
  GO_TO_LOGIN: 'Go to login',
  INVALID_TOKEN: 'Invalid token',
  LINK_EXPIRED: 'Password link has been expired',
  ACCOUNT_SETUP: 'Account Setup',
  SET_A_PASSWORD: 'Please set a password',
  ADMIN_CREATED_ACCOUNT: 'Admin created this account for you.',
  SET_A_PASSWORD_TO_USE: 'Please set a password to use it.',
  REPEAT_PASSWORD: 'Repeat Password',
  SET_PASSWORD: 'Set Password',
  USER_EXISTS: 'User already Exists',
  INVALID_OR_EXPIRED: 'Link Invalid or Expired',
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully',
  ERROR_IN_RESETTING_PASSWORD: 'Error in resetting password',
  ACCOUNT_VERIFIED: 'Account verified',
  //waste
  WASTE_STREAM: 'WASTE STREAM',
  ESTIMATED_TON_PER_WASTE_TYPE_AND_DUMPSTER_SIZE_TYPE:
    'ESTIMATED TON PER WASTE TYPE AND DUMPSTER SIZE / TYPE',
  WASTE_STREAM_INFO: 'WASTE STREAM INFO',
  COLORS: 'COLORS',
  WASTE_STREAM_SUCCESSFULLY_UPDATED: 'Waste Stream has been successfully updated',
  WASTE_STREAM_SUCCESSFULLY_CREATED: 'Waste Stream has been successfully Created',
  WASTE_STREAM_SUCCESSFULLY_DELETED: 'Waste Stream has been successfully deleted',
  //powerplant
  POWER_PLANTS: 'POWER PLANTS',
  ADD_PLANTS: 'Add Plant',

  //emission factors
  EMISSION_FACTORS: 'EMISSION FACTORS',
  ADD_EMISSION_FACTOR: 'Add Emission Factor',

  //locations
  LOCATIONS: 'LOCATIONS',
  LOCATION_MILES: 'miles',
  ADD_LOCATION: 'Add Location',
  LOCATION_SUCCESSFULLY_ADDED: 'Location has been successfully added',
  LOCATION_SUCCESSFULLY_UPDATED: 'Location has been successfully updated',

  //ADDWasteStream
  WASTE_STREAMS: 'Waste Streams',
  DUMPSTER: 'Dumpster',
  DUMPSTER_LOCATION: 'Dumpster Location',
  DELIVERY_lOCATION: 'Delivery location',
  DISTANCE: 'Distance',
  HAULER: 'Hauler',
  WASTE_STREAM_SUCCESSFULLY_UPDATED: 'Waste Stream has been successfully updated',
  CREATE_WASTE_STREAM: 'Create Waste Stream',
  SELECT_TYPE: 'Select Type',
  SELECT_LOCATION: 'Select Location',

  NO_RECORDS_FOUND: 'No Records Found',
  NO_WASTE_STREAMS_ADDED: 'No waste streams have been added yet.',
  NO_VESSELS_ADDED: 'No vessels have been added yet.',

  //DumpsterGraphs
  DUMPSTER_DELETE: 'Dumpster has been deleted successfully',
  DUMPSTER_UPDATE: 'Dumpster has been updated successfully',
  DUMPSTER_CREATE: 'Dumpster has been created successfully',
  VESSEL_DELETE: 'Selected vessels have been deleted successfully.',
  DUMPSTER_NEGATIVE: 'The number of dumpsters cannot be zero or negative',
  TOTAL_MOVED: 'TOTAL MOVED',
  TOTAL_TONS: 'TOTAL TONS',
  TONS_DEVERTED_RECYCLED: 'TONS DIVERTED/RECYCLED',
  WASTE_DIVERSION: '% WASTE diversion',
  REAL_WEIGHT_ERROR: 'Real weight must be specified',
  REAL_WEIGHT_ERROR_NEGATIVE: 'Real weight must not be less than 1',

  CAMERA_ID_ALREADY_EXISTS: 'Camera ID already exists',
  CAMERA_ASSOCIATED_ERROR:
    'This camera is associated with a job site and cannot be deleted',
  DELETE_VESSELS_MODAL_TITLE: ' Are you sure you want to delete these vessels?',
  NO: 'No',
  YES: 'Yes',

  //Client Users
  FULL_NAME: 'Full Name',
  PHONE_NUMBER: 'Phone Number',
  USERINFO: 'User Info',
  DELETE_USER: 'Delete User',
  CLIENT_USER_SUCCESSFULLY_CREATED: 'User has been created successfully',
  CLIENT_USER_SUCCESSFULLY_UPDATED: 'User has been updated successfully',
  CLIENT_USER_SUCCESSFULLY_DELETED: 'User has been deleted successfully',
  DOWNLOAD: 'Download',
  POSTMAN_COLLECTION: 'Postman Collection',
  COPIED: 'Copied',
  FAILED_TO_COPY: 'Failed to copy',
  GENERATE_API_RESPONSE: 'Generate API Response',
  CLEAR: 'Clear',
  API_SECRET_KEY: 'API Secret Key = ',
  API_END_POINT: 'API Endpoint:-',
  POSTMAN_FILE_NAME: 'WoodChuck.postman_collection.json',

  //vessels
  VESSEL_UPDATE: 'Vessel has been Updated Successfully',
  MAX_SUBUSERS_REACHED: 'Maximum sub-users limit has been reached.',
  VESSEL_HEADING: 'Vessel Types',
  ADD_ANOTHER_VESSEL_TYPE: 'Add Another Vessel Type',
  ADD_SUB_TYPE: '+ Add Sub-Type',
  VESSEL_TYPES: 'Vessel Types',
  TONNAGE: 'Estimated Tonnage',
  SUB_TYPES: 'Sub-Types',
  SUB_TYPE_NAME: 'Sub-Type Name',
  VESSELS: 'Vessels',
  NUMBER: 'Number',
  WEIGHT: 'WEIGHT',
  VESSEL_TONS: 'Tons',
  SELECT_ALL: 'Select All',
  DELETE: 'Delete',
  SELECT: 'Select',
  ADD: 'Add',

  //report subscriptions
  AUTO_EXPORT_REPORTS_SUBSCRIBED: `Auto-export reports have been subscribed successfully`,
  AUTO_EXPORT_REPORTS_UNSUBSCRIBED: `Auto-export reports have been unsubscribed successfully`,
  WEEKLY_REPORT_ENABLED: 'Weekly report(s) have been enabled successfully.',
  WEEKLY_REPORT_DISABLED: 'Weekly report(s) have been disabled successfully.',
  MONTHLY_REPORT_ENABLED: 'Monthly report(s) have been enabled successfully.',
  MONTHLY_REPORT_DISABLED: 'Monthly report(s) have been disabled successfully.',
  AUTO_EXPORT_SETTINGS_UPDATED:
    'Auto-export settings have been updated successfully.',
  RADIO_GROUP_MONTHLY: 'Monthly (every 1st of month)',
  RADIO_GROUP_WEEKLY: 'Weekly (every Monday)',
  ACTIVATE: 'Activate',
  REPORT_GENERATION_CANCELLED:
    'Report generation took too long and has been cancelled. Please try again later.',
  CLOSED: 'CLOSED',
  LOGGING_IN: 'Logging in...',

  // Carbon Credits
  CO2_VALUE: 'CO2e Value',
  CARBON_CREDIT_DOLLARS: 'Carbon Credit Value',
  ESTIMATED: 'Estimated',
  CONFIRMED: 'Confirmed',
  ESTIMATED_TOOLTIP: 'Preliminary',
  CONFIRMED_TOOLTIP: 'Validated',
  ACCOUNT_TYPE:"Account Type",
  LOGO:"Logo",
}

export const Months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const MMR_LOCATIONS = [
  { value: 1, label: 'Macomb' },
  { value: 2, label: 'Livonio' },
]

export const JOB_SITE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
}
export const DATE_FORMAT = {
  DATE_FORMAT_ISO: 'YYYY-MM-DD',
  MM_DD_YYYY: 'MM/DD/YYYY',
  MM_YY_HH_MM: 'MM/YY HH:mm',
  MMM_YYYY: 'MMM YYYY',
}

export const SCHEMAS_CONSTANT = {
  MIN3_MAX_50: 'Min 3 and Max 50 characters are allowed',
  MIN3_MAX_100: 'Min 3 and Max 100 characters are allowed',
  MIN2_MAX_50: 'Min 2 and Max 50 characters are allowed',
  MIN1_MAX_50: 'Min 1 and Max 50 characters are allowed',
}
export const JOBSITE_CONSTANT = {
  ALPHABETS_ONLY: 'Only alphabets are allowed',
  NUMBERS_ONLY: 'Only numbers are allowed',
  ALPHABETS_NUMBERS_SPECIAL:
    'Only alphanumeric values and special characters are allowed',
  ALPHA_NUMERIC_ONLY: 'only alphanumeric values are allowed',
}
export const NOTIFICATION_STATUS = {
  REQUEST: 'request',
  ACCEPT: 'accept',
  REJECT: 'reject',
}
export const colorPickerFields = [
  { name: 'colorCodeEst', label: 'COLOR CODE EST:' },
  { name: 'colorCodeReal', label: 'COLOR CODE REAL:' },
]
export const WASTE_STREAM_HEADINGS = {
  name: 'Name',
  tonPerOffRoleYard: 'Ton per Roll Off YRD: ',
  tonPerFrontLoadYard: 'Ton per Front Load YRD: ',
  tonPerCompactorYard: 'Ton per Compactor YRD: ',
  colorCodeEst: 'COLOR CODE EST: ',
  colorCodeReal: 'COLOR CODE REAL: ',
}
export const POWER_PLANT_HEADINGS = {
  BTU_PER_TON: 'BTU Per Ton',
  KWH_PER_TON: 'KWH Per Ton',
  TYPE: 'Type: ',
  POWER_PLANT: 'POWER PLANT',
  POWER_PLANT_INFO: 'POWER PLANT INFO',
  NAME: 'Name',
  ADDRESS: 'Address',
}
export const EMISSION_FACTOR_HEADINGS = {
  EMISSION_FACTORS: 'EMISSION FACTORS',
  EMISSION_FACTOR_INFO: 'EMISSION FACTOR INFO',
  NAME: 'Name',
  KEY: 'Key',
  VALUE: 'Value',
}
export const CAMERA_HEADINGS = {
  CAMERA: 'CAMERA',
  CAMERA_ID: 'CAMERA ID',
  CAM_ID: 'CAM ID',
  IN: 'IN %',
  ALERT: 'ALERT',
  INFO: 'INFO',
  CAMERA_INFO: 'CAMERA INFO',
  MAX_FILL_LEVEL: 'Max aFill Level',
  NAME: 'NAME',
  IP_ADDRESS: 'IP Address',
  ID: 'ID',
  URL: 'URL',
  DESCRIPTION: 'DESCRIPTION',
}

export const LOCATION_HEADINGS = {
  TYPE: 'Type',
  DISTANCE_TO: 'Distance To',
  LOCATION: 'LOCATION',
  INFO: 'INFO',
  DISTANCE: 'Distance',
}

export const LOCATION_TO_TYPES = {
  POWER_PLANT: 1,
  LOCATION: 2,
}
export const JOB_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
}
export const WASTE_STREAM_STRINGS = {
  heading: 'Wood Waste Diversion',
  cleanEnergy: 'clean energy',
  woodWaste: 'Wood waste',
  DIVERTED: 'diverted',
  REJECTED: 'rejected',
  landfill: 'Landfill',
  powerplant: 'Power Plant',
  biomassCleanEnergy: 'Biomass for clean energy',
  remanufacturing: 'Remanufacturing',
  industrialProduct: 'Industrial product',
  totalDiverted: 'total diverted',
  PERC_DIVERTED: '% diverted',
  totalCo2Diverted: 'total CO2e diverted',
  clientDiversionGoal: 'client diversion goal',
  chuckResult: 'chuck result',
  cleanEnergyBtus: 'clean energy',
  totalWoodWasteCollected: 'Total Wood Waste Collected',
  carbonCreditsGenerated: 'Carbon Credits Generated',
  summaryText:
    't diverted, t rejected, % diverted, t transport CO2, net CO2 avoided, M BTUs clean energy.',
  DELIVERED_TO: 'delivered to',
  TOTAL_WASTE_DIVERSION: 'TOTAL WASTE diversion',
  WOOD_WASTE_COLLECTED: 'Wood Waste Collected',
  FINAL_DESTINATION: 'final destination: ',
  TRANSPORT: 'transport',
  CO2: 'CO2',
  NET: 'net',
  AVOIDED: 'avoided',
  BTU_CLEAN_ENERGY: 'BTUs clean energy',
  BTU: 'BTU',
  WASTE_STREAM_NAME: 'Waste Stream Name',
  NO_WASTE_STREAM_AVAILABLE: 'No Waste Stream Available',
  NO_VESSEL_AVAILABLE: 'No Vessel Available',
  TON_PER: 'Ton Per',
  MW: 'MW',
  MWH: 'MWh',
}

export const DUMPSTER_STYLES = {
  FRONTLOAD: 1,
  INACTIVE: 2,
}

export const WASTE_STREAMS = {
  PLASTIC: 'PLASTIC',
  WOOD_WASTE: 'WOOD WASTE',
  CARD_BOARD: 'CARD BOARD',
  WASTE_HAULING: 'WASTE HAULING',
  METAL: 'METAL',
  CONCRETE: 'CONCRETE',
}
export const LOCATION_TYPE = {
  LANDFILL: 'Landfill',
}

export const WASTE_STREAM_LOCATION_TYPE = {
  LOCATION: 1,
  END_POINT: 2,
}

export const CONFIDENCE_LEVEL_TOOLTIP = {
  PARAGRAPH_1:
    "Enter a % number to set your minimum threshold for the confidence level of our AI system's estimate of the material type in your vessel.",
  PARAGRAPH_2:
    ' If our material type estimate falls below your minimum % confidence level, a red outline will appear around the confidence level indicator bar in the camera window.',
  NOTE_1: 'Red outline = Low confidence',
  NOTE_2: 'level of material type estimate',
}

export const WASTE_STREAM_CARD_TOOLTIP = {
  LEGEND: 'Legend :',
  VARIATION_1:
    'Thickness of diagonal hatch lines = confidence level of material type estimate',
  VARIATION_2: 'Red outline = low confidence level of material type estimate',
  VARIATION_3: 'Red diagonal hatch lines = excessive fill level of vessel',
}

export const VESSEL_FORM = {
  ADD_VESSEL_MAIN_HEADING: 'Add new vessels to this monthly report:',
  EDIT_VESSEL_MAIN_HEADING: 'Edit this vessel:',
  INFO_CONTENT:
    'With Estimated Weight, the weight in tons cannot be entered manually.',
  NO_LONGER_ACTIVE: 'No longer active',
  ADD_VESSEL_INFO_CONTENT: 'Maximum of 20 vessels can be added at one time.',
  HOW_MANY_VESSLES: 'How many vessels do you want to add?',
  ESTIMATED_INFO:
    'With Estimated Weight, the weight in tons cannot be  entered manually.',
}

export const VESSEL_WEIGHT_TYPE = {
  ESTIMATED: 1,
  CONFIRMED: 2,
}

export const WHITELISTED_WASTE_STREAMS = {
  WOOD_WASTE: 1,
  CARD_BOARD: 3,
}

export const ERROR_TYPES = {
  EMAIL_ALREADY_EXISTS: 'emailAlreadyExists',
  MAX_SUB_USERS_REACHED: 'maxSubUsersReached',
}
export const WOOD_WASTE_STEPS = [
  {
    title: 'Waste Stream Details',
  },
  {
    title: 'Sub-Types',
  },
]

export const PDF_EXPORT = {
  CANVAS_SCALE: 1.5,
  JPEG_QUALITY: 0.85,
  MARGIN: 15,
  PAGE_WIDTH: 420,
  PAGE_HEIGHT: 2180,
  PLOTLY_TIMEOUT: 5000,
  MAX_SAFE_CANVAS_HEIGHT: 6000,
}

export const FILE_UPLOAD = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
}

export const ARCHIVE_MONTHLY_REPORTS_STEPS = [
  {
    title: 'Select Months',
  },
  {
    title: 'Choose Format',
  },
]

export const EXPORT_REPORT_MESSAGES = {
  EXPORT_REPORT_SUCCESS: 'Report is ready for download.',
  EXPORT_REPORT_FAILED: 'Report generation failed.',
  ERROR_CHECKING_STATUS: 'Error checking report status.',
  REPORT_GENERATION_IN_PROGRESS:
    'We’re preparing your report. This may take a few moments.',
  FAILED_TO_START: 'Failed to start report generation.',
  ERROR_EXPORTING_REPORT: 'Error exporting report.',
}

export const COLOR_LIGHTEN_FACTOR = {
  FORTY_PERCENT: 0.4,
}

export const US_CENTER_FOR_MAP = { lat: 39.8283, lng: -98.5795 } // Approx center of USA
export const API_RESPONSE = {
  SUCCESS: 'success',
}

export const LOCATION_TYPES_MAP={
  powerplant:'powerplant',
  location:'location'
}
export const ALL_LOCATIONS_KEY = 'All'
export const ALL_CMS_KEY = 'All CMS'