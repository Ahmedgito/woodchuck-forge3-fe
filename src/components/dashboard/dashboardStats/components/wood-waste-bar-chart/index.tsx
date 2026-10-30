const WoodWasteBarChart = () => {
  // const { Title, Text } = Typography
  // const data = [
  //   {
  //     clientID: 38,
  //     clientName: 'Jane Roe',
  //     data: [
  //       {
  //         name: 'PAPER',
  //         dumpster_weight: '50yd',
  //         dumpster_count: 5,
  //         total_tons: 865,
  //         location: 'Greenwood',
  //       },
  //       {
  //         name: 'GLASS',
  //         dumpster_weight: '40yd',
  //         dumpster_count: 3,
  //         total_tons: 774,
  //         location: 'Sunset Blvd',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 91,
  //     clientName: 'Tom Smith',
  //     data: [
  //       {
  //         name: 'WOOD HAULING',
  //         dumpster_weight: '15yd',
  //         dumpster_count: 5,
  //         total_tons: 712,
  //         location: 'Ocean Drive',
  //       },
  //       {
  //         name: 'GLASS',
  //         dumpster_weight: '50yd',
  //         dumpster_count: 3,
  //         total_tons: 601,
  //         location: 'Maple Street',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 75,
  //     clientName: 'Alice Johnson',
  //     data: [
  //       {
  //         name: 'PLASTIC',
  //         dumpster_weight: '25yd',
  //         dumpster_count: 1,
  //         total_tons: 630,
  //         location: 'Ocean Drive',
  //       },
  //       {
  //         name: 'PLASTIC',
  //         dumpster_weight: '20yd',
  //         dumpster_count: 4,
  //         total_tons: 819,
  //         location: 'Greenwood',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 20,
  //     clientName: 'John Doe',
  //     data: [
  //       {
  //         name: 'PAPER',
  //         dumpster_weight: '25yd',
  //         dumpster_count: 4,
  //         total_tons: 538,
  //         location: 'Greenwood',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 71,
  //     clientName: 'John Doe',
  //     data: [
  //       {
  //         name: 'PAPER',
  //         dumpster_weight: '25yd',
  //         dumpster_count: 2,
  //         total_tons: 668,
  //         location: 'Maple Street',
  //       },
  //       {
  //         name: 'GLASS',
  //         dumpster_weight: '25yd',
  //         dumpster_count: 5,
  //         total_tons: 578,
  //         location: 'Greenwood',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 78,
  //     clientName: 'Tom Smith',
  //     data: [
  //       {
  //         name: 'GLASS',
  //         dumpster_weight: '40yd',
  //         dumpster_count: 5,
  //         total_tons: 633,
  //         location: 'Greenwood',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 83,
  //     clientName: 'Jane Roe',
  //     data: [
  //       {
  //         name: 'METAL',
  //         dumpster_weight: '15yd',
  //         dumpster_count: 1,
  //         total_tons: 984,
  //         location: 'Greenwood',
  //       },
  //       {
  //         name: 'PLASTIC',
  //         dumpster_weight: '20yd',
  //         dumpster_count: 3,
  //         total_tons: 973,
  //         location: 'Sunset Blvd',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 65,
  //     clientName: 'John Doe',
  //     data: [
  //       {
  //         name: 'WOOD WASTE',
  //         dumpster_weight: '40yd',
  //         dumpster_count: 5,
  //         total_tons: 825,
  //         location: 'Greenwood',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 14,
  //     clientName: 'Bob Brown',
  //     data: [
  //       {
  //         name: 'GLASS',
  //         dumpster_weight: '15yd',
  //         dumpster_count: 3,
  //         total_tons: 867,
  //         location: 'Greenwood',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 21,
  //     clientName: 'Alice Johnson',
  //     data: [
  //       {
  //         name: 'METAL',
  //         dumpster_weight: '15yd',
  //         dumpster_count: 1,
  //         total_tons: 978,
  //         location: 'Sunset Blvd',
  //       },
  //       {
  //         name: 'WOOD WASTE',
  //         dumpster_weight: '20yd',
  //         dumpster_count: 2,
  //         total_tons: 822,
  //         location: 'Greenwood',
  //       },
  //       {
  //         name: 'PLASTIC',
  //         dumpster_weight: '30yd',
  //         dumpster_count: 4,
  //         total_tons: 587,
  //         location: 'Maple Street',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 33,
  //     clientName: 'Tom Smith',
  //     data: [
  //       {
  //         name: 'PAPER',
  //         dumpster_weight: '15yd',
  //         dumpster_count: 1,
  //         total_tons: 804,
  //         location: 'Sunset Blvd',
  //       },
  //       {
  //         name: 'METAL',
  //         dumpster_weight: '40yd',
  //         dumpster_count: 3,
  //         total_tons: 777,
  //         location: 'Aston Hill',
  //       },
  //       {
  //         name: 'PLASTIC',
  //         dumpster_weight: '25yd',
  //         dumpster_count: 3,
  //         total_tons: 945,
  //         location: 'Greenwood',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 10,
  //     clientName: 'John Doe',
  //     data: [
  //       {
  //         name: 'METAL',
  //         dumpster_weight: '30yd',
  //         dumpster_count: 5,
  //         total_tons: 863,
  //         location: 'Aston Hill',
  //       },
  //       {
  //         name: 'PLASTIC',
  //         dumpster_weight: '50yd',
  //         dumpster_count: 5,
  //         total_tons: 871,
  //         location: 'Maple Street',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 37,
  //     clientName: 'Jane Roe',
  //     data: [
  //       {
  //         name: 'PLASTIC',
  //         dumpster_weight: '25yd',
  //         dumpster_count: 5,
  //         total_tons: 671,
  //         location: 'Ocean Drive',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 7,
  //     clientName: 'Alice Johnson',
  //     data: [
  //       {
  //         name: 'METAL',
  //         dumpster_weight: '30yd',
  //         dumpster_count: 2,
  //         total_tons: 826,
  //         location: 'Ocean Drive',
  //       },
  //     ],
  //   },
  //   {
  //     clientID: 38,
  //     clientName: 'Bob Brown',
  //     data: [
  //       {
  //         name: 'WOOD WASTE',
  //         dumpster_weight: '15yd',
  //         dumpster_count: 1,
  //         total_tons: 894,
  //         location: 'Maple Street',
  //       },
  //       {
  //         name: 'PAPER',
  //         dumpster_weight: '25yd',
  //         dumpster_count: 3,
  //         total_tons: 759,
  //         location: 'Ocean Drive',
  //       },
  //       {
  //         name: 'GLASS',
  //         dumpster_weight: '50yd',
  //         dumpster_count: 4,
  //         total_tons: 882,
  //         location: 'Ocean Drive',
  //       },
  //     ],
  //   },
  // ]

  // // Extract all clientID and clientName
  // const clients = data.map(({ clientID, clientName, data }, index) => {
  //   const client = {
  //     clientID,
  //     clientName,
  //     height: 50 * index,
  //   }

  //   data.forEach(({ name, dumpster_weight, total_tons }) => {
  //     client[`${name}_${dumpster_weight}`] = total_tons
  //   })

  //   return client
  // })

  // // Extract unique waste streams based on composite key name_dumpster_weight
  // const wasteStreams = data.reduce((acc, { data }) => {
  //   data.forEach(({ name, dumpster_weight, total_tons }) => {
  //     const key = `${name}_${dumpster_weight}`
  //     if (!acc.some((obj) => obj.key === key)) {
  //       acc.push({
  //         key: `${name}_${dumpster_weight}`,
  //         dumpster_weight,
  //         name,
  //         total_tons,
  //       })
  //     }
  //   })
  //   return acc
  // }, [])

  return (
    <div className="x-auto">
      {/* <Row gutter={24} align={'middle'} className={styles.bar_chart_wrapper}>
        <Col span={24}>
          <Row
            justify={'center'}
            align={'middle'}
            gutter={[24, 24]}
            wrap={false}
          >
            <Col className={styles.col_values}>
              <div className={styles.labels}>
                {clients.map((client, index) => {
                  return (
                    <h4
                      key={index}
                      style={{ 'margin-top': `${client.height}px` }}
                    >
                      {client.clientName}
                    </h4>
                  )
                })}
              </div>
            </Col>

            <Col flex={'auto'}>
              <Row align={'middle'} gutter={16} className={styles.bar_chart}>
                {wasteStreams.map((wasteStream, index) => {
                  return (
                    <Col
                      key={index}
                      className={`${styles.chart_column} ${styles.wood_waste}`}
                    >
                      <h5>{wasteStream.name}</h5>
                      <span className={styles.distance}>
                        {wasteStream.dumpster_weight}
                      </span>
                      {/* <div className={styles.bar_line}>
                        <span
                          className={`${styles.bar_value} ${styles.percentage_first}`}
                        >
                          999
                        </span>
                      </div>}
                      <div className={styles.bar_line}>
                        {clients.map((client) => {
                          return Object.keys(client).map((key, index) => {
                            if (key === wasteStream.key) {
                              return (
                                <span
                                  key={index}
                                  className={`${styles.bar_value}`}
                                  style={{ top: `${client.height}px` }}
                                >
                                  {client[key]}
                                </span>
                              )
                            }
                            return null
                          })
                        })}
                      </div>
                      <span className={styles.bar_legend}>1</span>
                      <span className={styles.bar_location}>Aston Hill</span>
                    </Col>
                  )
                })}
                {<Col className={`${styles.chart_column} ${styles.wood_waste}`}>
                  <h5>WOOD WASTE</h5>
                  <span className={styles.distance}>40 yrds</span>
                  <div className={styles.bar_line}>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_first}`}
                    >
                      999
                    </span>
                  </div>
                  <span className={styles.bar_legend}>1</span>
                  <span className={styles.bar_location}>Aston Hill</span>
                </Col>
                <Col
                  className={`${styles.chart_column} ${styles.waste_hauling}`}
                >
                  <h5>Waste Hauling</h5>
                  <span className={styles.distance}>40 yrds</span>
                  <div className={styles.bar_line}>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_second}`}
                    >
                      999
                    </span>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_first}`}
                    >
                      997
                    </span>
                  </div>
                  <span className={styles.bar_legend}>0</span>
                  <span className={styles.bar_location}>Aston Hill</span>
                </Col>
                <Col className={`${styles.chart_column} ${styles.wood_waste}`}>
                  <h5>WOOD WASTE</h5>
                  <span className={styles.distance}>30 yrds</span>
                  <div className={styles.bar_line}>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_third}`}
                    >
                      999
                    </span>
                  </div>
                  <span className={styles.bar_legend}>4</span>
                  <span className={styles.bar_location}>Aston Hill</span>
                </Col>
                <Col className={`${styles.chart_column} ${styles.card_board}`}>
                  <h5>CARD BOARD</h5>
                  <span className={styles.distance}>30 yrds</span>
                  <div className={styles.bar_line}>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_first}`}
                    >
                      999
                    </span>
                  </div>
                  <span className={styles.bar_legend}>1</span>
                  <span className={styles.bar_location}>Aston Hill</span>
                </Col>
                <Col
                  className={`${styles.chart_column} ${styles.waste_hauling}`}
                >
                  <h5>Waste Hauling</h5>
                  <span className={styles.distance}>30 yrds</span>
                  <div className={styles.bar_line}>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_third}`}
                    >
                      999
                    </span>
                  </div>
                  <span className={styles.bar_legend}>4</span>
                  <span className={styles.bar_location}>Aston Hill</span>
                </Col>
                <Col className={`${styles.chart_column} ${styles.card_board}`}>
                  <h5>CARD BOARD</h5>
                  <span className={styles.distance}>8 yrds</span>
                  <div className={styles.bar_line}>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_last}`}
                    >
                      999
                    </span>
                  </div>
                  <span className={styles.bar_legend}>2</span>
                  <span className={styles.bar_location}>Aston Hill</span>
                </Col>
                <Col
                  className={`${styles.chart_column} ${styles.waste_hauling}`}
                >
                  <h5>Waste Hauling</h5>
                  <span className={styles.distance}>8 yrds</span>
                  <div className={styles.bar_line}>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_first}`}
                    >
                      999
                    </span>
                  </div>
                  <span className={styles.bar_legend}>6</span>
                  <span className={styles.bar_location}>Aston Hill</span>
                </Col>
                <Col
                  className={`${styles.chart_column} ${styles.waste_hauling}`}
                >
                  <h5>Waste Hauling</h5>
                  <span className={styles.distance}>3 yrds</span>
                  <div className={styles.bar_line}>
                    <span
                      className={`${styles.bar_value} ${styles.percentage_first}`}
                    >
                      999
                    </span>
                  </div>
                  <span className={styles.bar_legend}>2</span>
                  <span className={styles.bar_location}>Aston Hill</span>
                </Col>}
              </Row>
            </Col>

            <Col
              flex={'100px'}
              className="flex self-stretch items-start justify-end flex-col black"
            >
              <Title className="mt-0 mb-0" level={2}>
                <span className="font-black">20</span>
              </Title>
              <Text className="font-medium">Total Moved</Text>
            </Col>
          </Row>
        </Col>
      </Row> */}
    </div>
  )
}

export default WoodWasteBarChart
