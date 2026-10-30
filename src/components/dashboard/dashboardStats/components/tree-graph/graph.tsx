import React, { useEffect, useState, useId, useMemo, useCallback } from 'react'
import './graph.scss'
import { WASTE_STATS } from '@/src/utils/constants/types'
import { Col, Image, Tag, Tooltip, Typography } from 'antd'
import { SankeyData } from 'plotly.js-dist-min'
import { roundToNearestMillion } from '@/src/utils/functions/roundToNearestMillion'
import GenieButtonWrapper from '@/src/components/shared/hocs/genie-wrapper'
import { MESSAGES } from '@/src/utils/constants/app-constants'

const { Text } = Typography

const Graph: React.FC<{
  stats: WASTE_STATS | undefined
  clientId: number | null | undefined
  reporting?: boolean
  photo?: string
  isPowerPlant?: boolean
  showImage?: boolean
  isActiveJobsite?: boolean
}> = ({ stats, photo, showImage, reporting, isActiveJobsite }) => {
  const uniqueId = useId()
  const idSanitized = useMemo(() => uniqueId.replace(/:/g, '-'), [uniqueId])
  const sankeyId = useMemo(() => `sankey-${idSanitized}`, [idSanitized])
  const sankeyContainerId = useMemo(
    () => `sankey-container-${idSanitized}`,
    [idSanitized]
  )
  const [res, setRes] = useState<number[]>([])
  const [_isChartLoading, setIsChartLoading] = useState(true)

  const calculateValues = useCallback(
    (
      wood_waste: number = 0,
      remanufacturing: number = 0,
      biomass_clean_energy: number = 0,
      industrial_product: number = 0,
      landfill: number = 0
    ) => {
      let revisedWoodWaste = wood_waste > 0 ? wood_waste : 1
      const calculateWoodWaste =
        revisedWoodWaste > 1 ? (revisedWoodWaste / revisedWoodWaste) * 100 : 1
      const calculateRemanufacturing =
        (remanufacturing / revisedWoodWaste) * 100
      const calculateBiomassCleanEnergy =
        (biomass_clean_energy / revisedWoodWaste) * 100
      const calculateIndustrialProduct =
        (industrial_product / revisedWoodWaste) * 100
      const calculateLandfill = (landfill / revisedWoodWaste) * 100

      return {
        woodWaste: calculateWoodWaste,
        remanufacturing: calculateRemanufacturing,
        biomassCleanEnergy: calculateBiomassCleanEnergy,
        industrialProduct: calculateIndustrialProduct,
        landfill: calculateLandfill,
      }
    },
    []
  )

  useEffect(() => {
    if (stats) setIsChartLoading(true)
    else setIsChartLoading(false)
  }, [stats])

  useEffect(() => {
    const { remanufacturing, biomassCleanEnergy, industrialProduct, landfill } =
      calculateValues(
        stats?.wood_waste,
        stats?.remanufacturing,
        stats?.biomass_clean_energy,
        stats?.industrial_product,
        stats?.landfill
      )

    setIsChartLoading(true)
    import('plotly.js-dist-min').then((Plotly) => {
      const outputValues = [
        remanufacturing > 1 ? remanufacturing : 1,
        biomassCleanEnergy > 1 ? biomassCleanEnergy : 1,
        industrialProduct > 1 ? industrialProduct : 1,
        landfill > 1 ? landfill : 1,
        [remanufacturing, biomassCleanEnergy, industrialProduct, landfill].some(
          (item) => item > 1
        )
          ? 1
          : 100,
      ]
      setRes([...outputValues.slice(0, 4)])

      const data: Partial<SankeyData>[] = [
        {
          type: 'sankey',
          orientation: 'h',
          node: {
            pad: 200,
            thickness: 8,
            line: { color: '#efefef', width: 0.5 },
            label: ['', '', '', '', '', '', ''],
            color: [
              'transparent',
              '#338335',
              '#462C75',
              '#6B5691',
              '#B5ABC8',
              '#E11212',
            ],
            x: [0.0, 0.34, 0.8, 0.8, 0.8, 0.8],
            y: [0.5, 0.34, -0.2, 0.1, 0.6, 0.95],
          },
          link: {
            source: [0, 1, 1, 1, 1, 0],
            target: [1, 2, 3, 4, 5, 6],
            value: [0, ...outputValues],
            color: [
              '#efefef',
              'rgba(179,162,217,0.8)',
              'rgba(166,166,217,0.8)',
              'rgba(194,194,214,0.8)',
              'rgba(242,194,194,0.8)',
            ],
            hoverinfo: 'none',
            label: ['', '', '', '', '', ''],
          },
          hoverinfo: 'none',
        },
      ]

      // === Define the function that builds the Sankey chart ===
      const renderSankey = () => {
        const layout = {
          font: { size: 18, color: '#222' },
          margin: { l: 40, r: 40, t: 210, b: 60 },
          width: reporting
            ? 1000
            : window.innerWidth < 768
              ? window.innerWidth - 20
              : window.innerWidth < 1024
                ? 800 // better fit for tablets
                : 1000,
          height: reporting
            ? 750
            : window.innerWidth < 768
              ? 500
              : window.innerWidth < 1024
                ? 600 // taller for tablets
                : 750,
          autosize: !reporting,
          paper_bgcolor: '#fafafa',
          plot_bgcolor: '#fafafa',
          sankey: { arrangement: 'snap' },
        }

        Plotly.newPlot(sankeyId, data, layout, {
          displayModeBar: false,
          responsive: !reporting,
        }).then(() => {
          setTimeout(() => {
            const svg = document.querySelector(`#${sankeyId} .main-svg`)
            if (!svg) return

            // Create <defs> if not exists
            let defs: SVGDefsElement | null = svg.querySelector('defs')
            if (!defs) {
              defs = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'defs'
              )
              svg.insertBefore(defs, svg.firstChild)
            }

            // Helper to create a gradient
            const createGradient = (
              id: string,
              color1: string,
              color2: string
            ): void => {
              if (svg.querySelector(`#${id}`)) return

              const gradient = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'linearGradient'
              )
              gradient.setAttribute('id', id)
              gradient.setAttribute('x1', '0%')
              gradient.setAttribute('x2', '100%')
              gradient.setAttribute('y1', '0%')
              gradient.setAttribute('y2', '0%')

              const stop1 = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'stop'
              )
              stop1.setAttribute('offset', '0%')
              stop1.setAttribute('stop-color', color1)

              const stop2 = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'stop'
              )
              stop2.setAttribute('offset', '100%')
              stop2.setAttribute('stop-color', color2)

              gradient.appendChild(stop1)
              gradient.appendChild(stop2)
              defs?.appendChild(gradient)
            }

            // Create both gradients
            createGradient('linkGradientDefault', '#CCE0CC', '#C7ACD8')
            createGradient('linkGradientLight', '#CCE0CC', '#EDE4F2')
            createGradient('linkGradientRed', '#CCE0CC', '#E5827B')

            // Apply default gradient to all sankey links
            const links = svg.querySelectorAll('.sankey-link')
            links.forEach((link) => {
              link.setAttribute('fill', 'url(#linkGradientDefault)')
            })

            // Skip alignment when reporting to avoid triggering responsive observer
            if (!reporting) {
              // Responsive alignment with breakpoints
              ;(() => {
                // Adjust nudge per breakpoint (more negative = further left)
                // Goal: for ~390px width produce finalLeft â‰ˆ -75 (baseDelta ~ 45 => need nudge â‰ˆ -120)
                let nudge: number
                const w = window.innerWidth
                if (w <= 400) nudge = -120
                else if (w <= 480) nudge = -110
                else if (w > 412 && w <= 440) nudge = -118
                else if (w <= 600) nudge = -90
                else if (w <= 768)
                  nudge = -80 // previously -75
                else if (w <= 1024)
                  nudge = -70 // new: for tablets in landscape
                else nudge = -100 // desktop / wider (original desktop value)

                let svgEl = document.querySelector(
                  `#${sankeyId} .js-plotly-plot .plotly .main-svg`
                ) as Element | null
                if (!svgEl)
                  svgEl = document.querySelector(
                    `#${sankeyId} .main-svg`
                  ) as Element | null

                const streamNode = document.querySelector(
                  '.stream-node'
                ) as HTMLElement | null
                const plotContainer =
                  (document.querySelector(
                    `#${sankeyId} .js-plotly-plot`
                  ) as HTMLElement | null) ||
                  (document.querySelector(`#${sankeyId}`) as HTMLElement | null)

                if (!svgEl || !streamNode || !plotContainer) return

                const alignSvg = () => {
                  const svgRect = svgEl!.getBoundingClientRect()
                  const streamRect = streamNode!.getBoundingClientRect()
                  const containerRect = plotContainer!.getBoundingClientRect()

                  const currentSvgLeft = svgRect.left - containerRect.left
                  const desiredSvgLeft = streamRect.left - containerRect.left

                  // Base delta (how far stream is from svg origin)
                  const baseDelta = desiredSvgLeft - currentSvgLeft

                  // Final shift (base + breakpoint nudge)
                  let finalLeft: number
                  console.log('ðŸš€ ~ alignSvg ~ w:', w)
                  if (w <= 400) {
                    finalLeft = -67 // hard target for iPhone 12 Pro width
                  } else if (w > 425 && w <= 440) {
                    finalLeft = -80
                  } else if (w <= 480) {
                    finalLeft = -75
                  } else if (w <= 600) {
                    finalLeft = -70
                  } else if (w <= 768) {
                    finalLeft = -85
                  } else if (w <= 1024) {
                    finalLeft = -85
                  } else if (w <= 1069) {
                    finalLeft = -0
                  } else if (w <= 1204) {
                    finalLeft = 0
                  } else if (w <= 1280) {
                    finalLeft = -195
                  } else {
                    // desktop keep previous behavior (you can tweak)
                    finalLeft = baseDelta + nudge // or just -100 if you prefer a flat shift
                  }

                  console.log({
                    width: w,
                    currentSvgLeft,
                    desiredSvgLeft,
                    baseDelta,
                    nudge,
                    finalLeft,
                  })

                  const svgAsHTMLElement = svgEl as HTMLElement
                  const prevTransform = svgAsHTMLElement.style.transform || ''
                  const cleaned = prevTransform
                    .replace(/translateX\([^)]+\)/, '')
                    .trim()
                  svgAsHTMLElement.style.transform =
                    `${cleaned} translateX(${finalLeft}px)`.trim()
                  svgAsHTMLElement.style.transformOrigin = '0 0'

                  if (!plotContainer.style.position)
                    plotContainer.style.position = 'relative'
                }

                requestAnimationFrame(alignSvg)
                requestAnimationFrame(() => requestAnimationFrame(alignSvg))
                setTimeout(alignSvg, 60)
                setTimeout(alignSvg, 250)
              })()
            }

            // finally your existing line
            setIsChartLoading(false)
          }, 300)
        })
      }

      // === Call it for the first render ===
      renderSankey()
      console.log('handleResize report', reporting)
      // === Handle window resize and re-render (only when not reporting) ===
      if (!reporting) {
        let resizeTimeout: any
        const handleResize = () => {
          console.log('handleResize')
          clearTimeout(resizeTimeout)
          resizeTimeout = setTimeout(() => {
            Plotly.purge(sankeyId)
            renderSankey()
          }, 300)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }
    })
  }, [stats, sankeyId, calculateValues, reporting])

  const getRes = useCallback(() => {
    // If wood waste exists, always show nodes
    if (stats?.wood_waste && stats?.wood_waste > 0) return true

    // otherwise fallback to your old logic
    return res.some((item) => item > 1)
  }, [res, stats])

  useEffect(() => {
    if (res.length > 0) {
      const result = getRes()
      const svg = document.querySelector(`#${sankeyId} .main-svg`)
      const svgContainer = document.querySelector(`#${sankeyId} .svg-container`)
      if (!svg) return
      if (!result) {
        svg.classList.add('zero-state')
        svgContainer?.classList.add('zero-state')
      } else {
        svg.classList.remove('zero-state')
        svgContainer?.classList.remove('zero-state')
      }
    }
  }, [res, sankeyId, getRes])

  const proxiedPhotoUrl = useMemo(() => {
    if (!photo) return undefined
    if (photo.startsWith('/') || photo.startsWith('data:')) return photo
    return `/api/proxy-image?url=${encodeURIComponent(photo)}`
  }, [photo])

  return (
    <div id={sankeyContainerId} className="sankey-container">
      <GenieButtonWrapper
        hint="wood_waste_diversion_diagram"
        className="justify-center"
      >
        <div
          id={sankeyId}
          className="sankey-chart"
          style={{ width: '100%', height: '800px', position: 'relative' }}
        ></div>

        <>
          {showImage && proxiedPhotoUrl && (
            <div className="node-label amazon-label">
              <Image
                src={proxiedPhotoUrl}
                alt="logo"
                preview={false}
                className="tree_img"
              />
            </div>
          )}
          <div className="node-label center-icon">
            <img src="/images/c-logo.png" alt="Center" className="center-img" />
          </div>
          <div className="node-label label-remanufacturing">
            <span className="pointers">P1</span>
            <h2>
              {Math.round(Number(stats?.remanufacturing) || 0)} <span>tn</span>
            </h2>
            <Text>Remanufacturing</Text>
          </div>
          <div className="node-label label-biomass">
            <span className="pointers">P2-3</span>
            <h2>
              {Math.round(Number(stats?.biomass_clean_energy) || 0)}{' '}
              <span>tn</span>
            </h2>
            <Text>Biomass for Clean Energy</Text>
            {/* <div className="lead-div">
            <img src="/images/leaf-icon.svg" alt="leaf-icon" />
            <h4>
              {roundToNearestMillion(stats?.clean_energy || 0)} <span>MWh</span>
              <br />
              <Text>Clean Energy</Text>
            </h4>
          </div> */}
          </div>
          <div className="node-label label-industrial">
            <span className="pointers">P4-5</span>
            <h2>
              {Math.round(Number(stats?.industrial_product) || 0)}{' '}
              <span>tn</span>
            </h2>
            <Text>Industrial Product</Text>
          </div>
          <div className="node-label label-landfill">
            <h2>
              {Math.round(Number(stats?.landfill) || 0)} <span>tn</span>
            </h2>
            <Text>Landfill</Text>
          </div>
          <div className={getRes() ? 'stream-node' : 'stream-node zero'}></div>
          <div className="node-label label-bottom">
            <h2>
              {Math.round(Number(stats?.wood_waste) || 0)} <span>tn</span>
            </h2>
            <Text>Wood Waste</Text>
            <h3>
              ${Math.round(Number(stats?.carbon_credit_dollars) || 0)}
              <br />
              <Text>Carbon Credits</Text>
               <Col >
              <Tooltip
                title={
                  isActiveJobsite
                    ? MESSAGES.ESTIMATED_TOOLTIP
                    : MESSAGES.CONFIRMED_TOOLTIP
                }
              >
                <Tag
                  color={isActiveJobsite ? 'green' : 'blue'}
                  style={{ fontSize: '12px' }}
                >
                  {isActiveJobsite ? MESSAGES.ESTIMATED : MESSAGES.CONFIRMED}
                </Tag>
              </Tooltip>
            </Col>
            </h3>
           
          </div>
        </>
      </GenieButtonWrapper>
    </div>
  )
}

export default Graph
