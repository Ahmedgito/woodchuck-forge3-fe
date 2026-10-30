import React from 'react'
import { Select, Typography, Row, Col, Checkbox, Skeleton, Switch } from 'antd'

const { Title } = Typography
interface TopBarContentProps {
  reporting?: boolean
  selectedWasteType?: string
  setSelectedWasteType?: (value: string) => void
  selectedEndpointKey?: string[]
  setSelectedEndpointKey?: (value: string[]) => void
  dropdownRef?: React.RefObject<HTMLDivElement>
  totalTonnage?: number
  totalDistance?: number
  totalCo2Avoided?: number
  wasteStreams?: { name: string }[] // pass from parent
  endpointOptions?: { label: string; value: string }[] // pass from parent
  isFullScreen?: boolean
  isLoading?: boolean
  showVerificationImages?: boolean
  setShowVerificationImages?: (value: boolean) => void
}

const TopBarContent: React.FC<TopBarContentProps> = ({
  reporting = false,
  selectedWasteType,
  setSelectedWasteType,
  selectedEndpointKey,
  setSelectedEndpointKey,
  dropdownRef,
  totalTonnage,
  totalDistance,
  totalCo2Avoided,
  wasteStreams = [],
  endpointOptions = [],
  isFullScreen = false,
  isLoading = false,
  showVerificationImages = false,
  setShowVerificationImages,
}) => {
  // Calculate display text based on selection
  const getDisplayText = () => {
    if (!selectedEndpointKey || selectedEndpointKey.length === 0) {
      return 'Select Location(s)'
    }

    const hasAll = selectedEndpointKey.includes('All')
    const hasAllCMS = selectedEndpointKey.includes('All CMS')

    // Filter out "All" and "All CMS" to count actual selections
    const actualSelections = selectedEndpointKey.filter(
      (key) => key !== 'All' && key !== 'All CMS'
    )
    const hasLocation =
      Array.isArray(selectedEndpointKey) &&
      selectedEndpointKey.some(
        (key) =>
          typeof key === 'string' && key.toLowerCase().includes('location')
      )
    // If "All" is selected, show "All"
    if (hasAll) {
      return 'All'
    }

    // If only "All CMS" is selected (no other actual selections), show "All CMS"
    if (hasAllCMS && !hasLocation) {
      return 'All CMS'
    }

    // If exactly one actual selection (and possibly "All CMS"), show that item's name
    if (actualSelections.length === 1) {
      const selectedOption = endpointOptions.find(
        (opt) => opt.value === actualSelections[0]
      )
      return selectedOption?.label || actualSelections[0]
    }

    // If multiple selections (more than 1 actual selection, or "All CMS" with other selections)
    if (
      actualSelections.length > 1 ||
      (hasAllCMS && actualSelections.length > 0)
    ) {
      return 'Multiple Selections'
    }

    // Fallback
    return 'Select Location(s)'
  }

  const isEmpty = !selectedEndpointKey || selectedEndpointKey.length === 0
  const displayText = getDisplayText()

  return (
    <div className="map-top-bar">
      <div className="mapdropdown-wrapper" ref={dropdownRef}>
        <label className="waste-type-label">
          WASTE Type
          <Select
            value={selectedWasteType}
            onChange={setSelectedWasteType}
            options={[
              { label: 'All', value: 'All' },
              ...wasteStreams.map((ws) => ({ label: ws.name, value: ws.name })),
            ]}
            placeholder="Select waste type"
            placement="bottomLeft"
            listHeight={256}
            popupClassName="map-top-bar-select-dropdown"
            getPopupContainer={(triggerNode) => {
              // Fullscreen: keep popup inside map controls for stacking.
              // Otherwise mount on body so long lists aren't clipped by the 100px top bar.
              if (isFullScreen) {
                return (dropdownRef?.current ||
                  triggerNode.closest('.mapdropdown-wrapper') ||
                  document.body) as HTMLElement
              }
              return document.body
            }}
          />
        </label>
        <Title level={3} className="mapdropdown-to" color="black">
          To
        </Title>
        <label>
          OFFTAKE
          <div
            style={{
              position: 'relative',
              fontFamily: 'Inter',
              fontWeight: 500,
            }}
          >
            <Select
              mode="multiple"
              value={selectedEndpointKey}
              onChange={setSelectedEndpointKey}
              options={endpointOptions}
              placeholder="Select Location(s)"
              open={undefined} // allow default open behavior
              showSearch={false}
              allowClear={false}
              maxTagCount={0}
              maxTagPlaceholder={() => <span style={{ display: 'none' }} />}
              tagRender={() => <span style={{ display: 'none' }} />}
              placement="bottomLeft"
              className={
                isEmpty ? 'offtake-select-empty' : 'ant-select-selection-item'
              }
              popupClassName="offtake map-top-bar-select-dropdown"
              dropdownRender={() => (
                <div className="map-top-bar-offtake-options">
                  <Checkbox.Group
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                    value={selectedEndpointKey}
                    onChange={(checkedValues: string[]) => {
                      const prev = selectedEndpointKey || []
                      const hadAll = prev.includes('All')
                      const hasAll = checkedValues.includes('All')

                      // Unchecking "All" should clear every location, not leave
                      // the individually expanded IDs that were synced in state.
                      if (hadAll && !hasAll) {
                        setSelectedEndpointKey?.([])
                        return
                      }

                      setSelectedEndpointKey?.(checkedValues as string[])
                    }}
                  >
                    {endpointOptions.map((option) => (
                      <Checkbox key={option.value} value={option.value}>
                        {option.label}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>
              )}
              getPopupContainer={(triggerNode) => {
                if (isFullScreen) {
                  return (dropdownRef?.current ||
                    triggerNode.closest('.mapdropdown-wrapper') ||
                    document.body) as HTMLElement
                }
                return document.body
              }}
            />
            {!isEmpty && (
              <div
                style={{
                  position: 'absolute',
                  left: 11,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                  color: '#3b0062',
                  fontSize: '14px',
                  lineHeight: '22px',
                }}
              >
                {displayText}
              </div>
            )}
            <style
              dangerouslySetInnerHTML={{
                __html: `
                .mapdropdown-wrapper .offtake-select-empty .ant-select-selector {
                  border-color: #fb181c !important;
                  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
                }
                .offtake-select-with-value .ant-select-selection-placeholder {
                  opacity: 0 !important;
                }
                .offtake-select-with-value .ant-select-selection-item {
                  display: none !important;
                }
              `,
              }}
            />
          </div>
        </label>

      </div>
      <div className="map-stats-overlay">
        {isLoading ? (
          <Row gutter={[24, 16]}>
            <Col>
              <Skeleton.Input active style={{ width: 160 }} />
            </Col>
            <Col>
              <Skeleton.Input active style={{ width: 160, marginRight: 10 }} />
              <Skeleton.Input active style={{ width: 160 }} />
            </Col>
          </Row>
        ) : (
          <Row gutter={[24, 16]} align="bottom">
            <Col>
              <label className="verification-images-label">
                <span>VERIFICATION IMAGES</span>
                <Switch
                  checked={showVerificationImages}
                  onChange={(checked) => setShowVerificationImages?.(checked)}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </label>
            </Col>
            <Col>
              <div className="stat">
                <Title level={3}>TOTAL TONNAGE:</Title>
                <span style={{ color: '#1a1a1a' }}>{Math.round(Number(totalTonnage) || 0)} tn</span>
              </div>
              <div className="stat">
                <Title level={3}>TOTAL MILES:</Title>
                <span style={{ color: '#1a1a1a' }}>{totalDistance ?? 0} mi</span>
              </div>
            </Col>
            <Col>
              <div className="stat">
                <Title level={3} color="black">
                  TOTAL CO₂e:
                </Title>{' '}
                <span style={{ color: '#1a1a1a' }}>{Math.round(Number(totalCo2Avoided) || 0)} tn</span>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  )
}

export default TopBarContent
