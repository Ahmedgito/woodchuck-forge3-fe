export const USER_INITIAL_STATE = {
  id: 0,
  username: '',
  email: '',
  name: '',
  company: '',
  phone: '',
  billing_details_name: '',
  billing_details_street: '',
  billing_details_city: '',
  billing_details_state: '',
  billing_details_zipcode: '',
  billing_details_country: '',
}

export const HAULER_INITIAL_STATE = {
  name: '',
  phone: '',
  email: '',
  // dumpsterSize: [],
  address: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
}

export const GLOBAL_DATA_INITIAL_STATE = {
  distanceMmrMacomb: 0,
  distanceMmrLivonia: 0,
  tonage10yrd: 0,
  tonage20yrd: 0,
  tonage30yrd: 0,
  tonage40yrd: 0,
  supervisorOnboarding: '',
  autoResponse: '',
}

export const DUMPSTER_LOCATION = {
  id: 0,
  sublocationName: '',
}
export const WASTE_STREAM_INITIAL_STATE = {
  id: 0,
  name: '',
  tonPerOffRoleYard: 0,
  tonPerFrontLoadYard: 0,
  tonPerCompactorYard: 0,
  colorCodeEst: '',
  colorCodeReal: '',
}
export const POWER_PLANT_INITAL_STATE = {
  id: 0,
  name: '',
  btuPerTon: undefined,
  kwhPerTon: 0.1,
  address: {
    addressFull: '',
    addressLine1: '',
    addressLine2: null,
    city: '',
    state: '',
    postalCode: '',
    country: '',
    lat: 0,
    lng: 0,
    placeId: null,
  },
}

export const EMISSION_FACTOR_INITIAL_STATE = {
  id: 0,
  name: '',
  key: '',
  value: '',
}

export const CAMERA_INITIAL_STATE = {
  cameraId: '',
  ipAddress: '',
  name: '',
  url: '',
  isAdmin: false,
}

export const DUMPSTER_CAMERA_INITIAL_STATE = {
  cameraId: null,
  maxLevel: null,
  alert: '',
  name: '',
  alertTo: '',
  alertToType: '',
  camera: {
    id: null,
    name: null,
    cameraId: null,
  },
}

export const LOCATION_INITAL_STATE = {
  id: 0,
  name: '',
  type: null,
  inMiles: null,
  to: null,
  toType: null,
  address: {
    addressFull: '',
    addressLine1: '',
    addressLine2: null,
    city: '',
    state: '',
    postalCode: '',
    country: '',
    lat: 0,
    lng: 0,
    placeId: null,
  },
}
export const JOB_SITE_INITIAL_STATE = {
  address: null,
  sustainabilityGoal: null,
  name: '',
  phone: '',
  email: '',
  title: '',
  size: null,
  completionBy: new Date(),
  powerplants: '',
  startDate: new Date(),
}
export const WASTE_STREAM_JOB_SITE_FORM_INITIAL_STATE = {
  jobSiteId: 0,
  wastestreamsId: 0,
  dumpster_type: 0,
  locationId: 0,
  powerplantId: 0,
  dumpsterId: 0,
  distance: 0,
  haulerId: 0,
}
export const TREE_GRAPH_VALUES = {
  wood_waste: 0,
  landfill: 0,
  clean_energy: 0,
  remanufacturing: 0,
  industrial_product: 0,
  biomass_clean_energy: 0,
  total_diverted: 0,
  total_co2_diverted: 0,
  client_diversion_goal: 0,
  chuck_result: 0,
  diverted: 0,
  rejected: 0,
  diverted_percentage: 0,
  transport_co2: 0,
  net_co2_avoided: 0,
  card_board: {
    delivered: 0,
    delivered_to: '',
    transport_co2: 0,
  },
  waste_hauling: {
    delivered: 0,
    delivered_to: '',
    transport_co2: 0,
  },
  metal: {
    delivered: 0,
    delivered_to: '',
    transport_co2: 0,
  },
  plastic: {
    delivered: 0,
    delivered_to: '',
    transport_co2: 0,
  },
  concrete: {
    delivered: 0,
    delivered_to: '',
    transport_co2: 0,
  },
  total_waste_diversion: 0,
  wood_waste_collected: 0,
  wood_waste_diverted: 0,
  total_wood_waste_diversion: 0,
  carbon_credits: 0,
}

export const REGISTRATION_INITIAL_VALUES = {
  username: '',
  email: '',
  name: '',
  company: '',
  phone: '',
  billingCompanyName: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  role: { id: null },
}
