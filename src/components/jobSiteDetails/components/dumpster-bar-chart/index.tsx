import { Col, Input, Row } from 'antd'
import styles from './styles.module.scss'

const DumspterBarChart = () => {
  return (
    <>
      <section className={styles.dumpster_chart_wrapper}>
        <div className={styles.chart_container}>
          <Row gutter={24} align={'middle'}>
            <Col span={24}>
              <h2>FRONT LOAD</h2>
            </Col>
            <Col span={24}>
              <section className={styles.dumpster_chart}>
                <Row align={'middle'} gutter={48}>
                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>4 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      9 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>2 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>

                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      19 <span>10.34t</span>
                    </span>
                  </Col>

                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>4 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      9 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>2 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>

                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      19 <span>10.34t</span>
                    </span>
                  </Col>

                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>4 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      9 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>2 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>

                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      19 <span>10.34t</span>
                    </span>
                  </Col>
                </Row>
              </section>
            </Col>
          </Row>
        </div>

        <div className={styles.chart_container}>
          <Row gutter={24} align={'middle'}>
            <Col span={24}>
              <h2>ROLL OFF</h2>
            </Col>
            <Col span={24}>
              <section className={styles.dumpster_chart}>
                <Row align={'middle'} gutter={48}>
                  <Col
                    className={`${styles.chart_column} ${styles.wood_waste}`}
                  >
                    <h5>
                      WOOD <br /> WASTE
                    </h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.wood_waste}`}
                  >
                    <h5>
                      WOOD <br /> WASTE
                    </h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.wood_waste}`}
                  >
                    <h5>
                      WOOD <br /> WASTE
                    </h5>
                    <span className={styles.distance}>4 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      9 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.wood_waste}`}
                  >
                    <h5>
                      WOOD <br /> WASTE
                    </h5>
                    <span className={styles.distance}>2 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>

                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      19 <span>10.34t</span>
                    </span>
                  </Col>

                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>4 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      9 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>2 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>

                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      19 <span>10.34t</span>
                    </span>
                  </Col>

                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>4 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      9 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>2 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>

                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      19 <span>10.34t</span>
                    </span>
                  </Col>

                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>4 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      9 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>2 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>

                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      19 <span>10.34t</span>
                    </span>
                  </Col>
                </Row>
              </section>
            </Col>
          </Row>
        </div>

        <div className={styles.chart_container}>
          <Row gutter={24} align={'middle'}>
            <Col span={24}>
              <h2>COMPACTOR</h2>
            </Col>
            <Col span={24}>
              <section className={styles.dumpster_chart}>
                <Row align={'middle'} gutter={48}>
                  <Col
                    className={`${styles.chart_column} ${styles.wood_waste}`}
                  >
                    <h5>
                      WOOD <br /> WASTE
                    </h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.wood_waste}`}
                  >
                    <h5>
                      WOOD <br /> WASTE
                    </h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>

                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.card_board}`}
                  >
                    <h5>
                      CARD <br /> BOARD
                    </h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>

                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col className={`${styles.chart_column} ${styles.plastic}`}>
                    <h5>PLASTIC</h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>

                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>8 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span
                        className={`${styles.blocks} ${styles.mild} ${styles.active}`}
                      >
                        <Input
                          type="number"
                          className={styles.block_input}
                          value={19}
                        />
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.49t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.47t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.45t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.38t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>{' '}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.36t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.34t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      16 <span>10.34t</span>
                    </span>
                  </Col>
                  <Col
                    className={`${styles.chart_column} ${styles.waste_hauling}`}
                  >
                    <h5>
                      WASTE <br /> HAULING
                    </h5>
                    <span className={styles.distance}>6 yrds</span>
                    <div className={styles.bar_line}>
                      {/* Mild */}
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.input_value}>16</span>
                        <span className={styles.block_value}>0.49t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.43t</span>
                      </span>
                      <span className={`${styles.blocks} ${styles.mild}`}>
                        <span className={styles.block_value}>0.41t</span>
                      </span>
                      {/* Dark */}
                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.40t</span>
                      </span>

                      <span className={`${styles.blocks} ${styles.dark}`}>
                        <span className={styles.block_value}>0.31t</span>
                      </span>
                    </div>
                    <span className={styles.bar_legend}>
                      4 <span>10.34t</span>
                    </span>
                  </Col>
                </Row>
              </section>
            </Col>
          </Row>
        </div>
      </section>
    </>
  )
}

export default DumspterBarChart
