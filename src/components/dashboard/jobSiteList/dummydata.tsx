export const activeJobSites = {
  data: [
    {
      id: 2,
      city: 'JACKSON',
      state: 'MI',
      name: 'dummy data',
      woodWasteRecycled: 250,
      diverted: 80,
      refused: 20,
      co2Avoided: 487.5,
      totalHailed: 1462,
      totalTonnage: 261,
      status: {
        id: 1,
        name: 'Active',
        __entity: 'StatusEntity',
      },
    },
    {
      id: 1,
      city: 'NOVI',
      state: 'MI',
      name: 'dummy data',
      woodWasteRecycled: 250,
      diverted: 94,
      refused: 6,
      co2Avoided: 487.5,
      totalHailed: 1462,
      totalTonnage: 261,
      status: {
        id: 1,
        name: 'Active',
        __entity: 'StatusEntity',
      },
    },
    {
      id: 3,
      city: 'AMBER',
      state: 'MI',
      name: 'dummy data',
      woodWasteRecycled: 250,
      diverted: 94,
      refused: 6,
      co2Avoided: 487.5,
      totalHailed: 1462,
      totalTonnage: 261,
      status: {
        id: 1,
        name: 'Active',
        __entity: 'StatusEntity',
      },
    },
  ],
  status: 'success',
}
export const dumpsterNotification = [
  {
    id: 1,
    message: 'SWAP10',
    location: 'AMBER',
  },
  {
    id: 2,
    message: 'SWAP20',
    location: 'AMBER',
  },
]
export const dumpsterDummyData = {
  id: 1,
  name: 'Jackson Amazon Logistics',
  city: 'Jackson',
  state: 'MI',
  GC_name: 'Amy',
  notifications: {
    data: [
      {
        id: 1,
        message: 'SWAP10',
        location: 'AMBER',
      },
      {
        id: 2,
        message: 'SWAP20',
        location: 'AMBER',
      },
    ],
  },
  dumpster_status: {
    dumpster_delivery: {
      total: '2',
      yard20: '1',
      yard40: '1',
    },
    miles: {
      total: '51.8',
      yard20: '25.9',
      yard40: '25.9',
    },
    wood_wasted: {
      total: '28.7',
      yard20: '9.66',
      yard40: '19.18',
    },
    dumpster_refused: {
      total: '3',
      yard20: '2',
      yard40: '1',
    },
  },
  outcome: {
    co2Avoided: '0',
    co2Produced: '88.5',
    woodWasteRecycled: '250',
    totalHauled: '1462',
  },
}
export const DumpsterStatusMock = {
  status: 'success',
  data: {
    total_delivered: 13,
    total_miles: 365,
    total_waste: 13,
    total_refused: 5,
    gates: [
      {
        name: 'South Gate',
        dumpster_location: 1,
        dumpster: [
          {
            size: 20,
            delivered: 7,
            miles: 345,
            waste: 10,
            refused: 1,
          },
          {
            size: 40,
            delivered: 3,
            miles: 22,
            waste: 3,
            refused: 2,
          },
        ],
      },
      {
        name: 'West Gate',
        dumpster_location: 2,
        dumpster: [
          {
            size: 20,
            delivered: 7,
            miles: 345,
            waste: 10,
            refused: 1,
          },
          {
            size: 40,
            delivered: 3,
            miles: 22,
            waste: 3,
            refused: 2,
          },
        ],
      },
      {
        name: 'East Gate',
        dumpster_location: 3,
        dumpster: [
          {
            size: 20,
            delivered: 7,
            miles: 345,
            waste: 10,
            refused: 1,
          },
          {
            size: 40,
            delivered: 3,
            miles: 22,
            waste: 3,
            refused: 2,
          },
        ],
      },
    ],
  },
}
export const OutcomeMockData = {
  status: 'success',
  data: {
    avoided: 0,
    produced: 88.5,
    waste: 250,
    hauled: 1462,
  },
}
export const Stats = {
  status: 'success',
  data: {
    total_collected: 12,
    total_recycled: 2,
    total_refused: 10,
    energy_generated: 40000,
    milate_stats1: 1432,
    milate_stats2: 2616,
  },
}
export const wasteMockData = {
  status: 'success',
  data: {
    percent_delivered: 94,
    percent_refused: 6,
    accepted: 250,
    refused: 10,
    months: [
      {
        id: 3,
        accepted: 10,
        refused: 5,
      },
      {
        id: 4,
        accepted: 10,
        refused: 4,
      },
      {
        id: 5,
        accepted: 5,
        refused: 5,
      },
      {
        id: 7,
        accepted: 10,
        refused: 6,
      },
      {
        id: 8,
        accepted: 10,
        refused: 1,
      },
    ],
  },
}
