import React from 'react'
import Icon from '@ant-design/icons'

const CollapseIcoVar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="27"
    fill="none"
    viewBox="0 0 18 27"
  >
    <path
      fill="#3B0062"
      fillRule="evenodd"
      d="M16.454 11.623c.439.407.685.96.685 1.535 0 .576-.246 1.128-.684 1.536L4.756 25.556a2.443 2.443 0 01-1.636.583 2.431 2.431 0 01-1.613-.636 2.1 2.1 0 01-.685-1.498 2.088 2.088 0 01.627-1.52l10.045-9.327L1.45 3.831a2.088 2.088 0 01-.627-1.52A2.1 2.1 0 011.508.814 2.431 2.431 0 013.12.178 2.443 2.443 0 014.757.76l11.697 10.863z"
      clipRule="evenodd"
    ></path>
  </svg>
)

export const ConfidenceIcon = () => (
  <svg
    width="100"
    height="40"
    viewBox="0 0 100 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="diagonalStripes"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
      >
        <rect width="8" height="8" fill="white" />
        <path
          d="M0,8 L8,0 M-2,2 L2,-2 M6,10 L10,6"
          stroke="#8b5cf6"
          stroke-width="2"
        />
      </pattern>
    </defs>

    <rect
      x="10"
      y="10"
      width="80"
      height="20"
      fill="url(#diagonalStripes)"
      stroke="#f87171"
      stroke-width="2"
      rx="2"
    />
  </svg>
)

export const CollapseIco = (props) => (
  <Icon component={CollapseIcoVar} {...props} />
)

export const DumpsterIconSolid = ({ colorCode }) => (
  // <svg
  //   width="80"
  //   height="48"
  //   viewBox="0 0 40 24"
  //   fill="none"
  //   xmlns="http://www.w3.org/2000/svg"
  //   style={{ '--icon-color': colorCode }}
  // >
  //   <rect x="6" y="6" width="28" height="14" fill="var(--icon-color)" />
  //   <rect x="4" y="6" width="2" height="3" fill="var(--icon-color)" />
  //   <rect x="34" y="6" width="2" height="3" fill="var(--icon-color)" />
  //   <circle cx="10" cy="21" r="2" fill="var(--icon-color)" />
  //   <circle cx="30" cy="21" r="2" fill="var(--icon-color)" />
  // </svg>

  <svg
    width="56"
    height="31"
    viewBox="0 0 56 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ '--icon-color': colorCode }}
  >
    <rect x="2" width="52" height="28" fill="var(--icon-color)" />
    <rect width="56" height="5" fill="var(--icon-color)" />
    <rect x="54" y="7" width="2" height="5" fill="var(--icon-color)" />
    <rect x="54" y="20" width="2" height="5" fill="var(--icon-color)" />
    <circle cx="9.5" cy="26.5" r="4.5" fill="var(--icon-color)" />
    <circle cx="46.5" cy="26.5" r="4.5" fill="var(--icon-color)" />
  </svg>
)

export const DumpsterIconStriped = ({ colorCode }) => (
  // <svg
  //   width="80"
  //   height="48"
  //   viewBox="0 0 40 24"
  //   fill="none"
  //   xmlns="http://www.w3.org/2000/svg"
  //   style={{ '--icon-color': colorCode }}
  // >
  //   <defs>
  //     <pattern
  //       id="dumpsterStripes"
  //       patternUnits="userSpaceOnUse"
  //       width="3"
  //       height="3"
  //       patternTransform="rotate(45)"
  //     >
  //       <rect width="1.5" height="3" fill="var(--icon-color)" />
  //       <rect x="1.5" width="1.5" height="3" fill="white" />
  //     </pattern>
  //   </defs>
  //   <rect x="6" y="6" width="28" height="14" fill="url(#dumpsterStripes)" />
  //   <rect x="4" y="6" width="2" height="3" fill="url(#dumpsterStripes)" />
  //   <rect x="34" y="6" width="2" height="3" fill="url(#dumpsterStripes)" />
  //   <circle cx="10" cy="21" r="2" fill="url(#dumpsterStripes)" />
  //   <circle cx="30" cy="21" r="2" fill="url(#dumpsterStripes)" />
  // </svg>
  <svg
    width="56"
    height="31"
    viewBox="0 0 56 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ '--icon-color': colorCode }}
  >
    <mask
      id="mask0"
      style={{ maskType: 'alpha' }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="56"
      height="31"
    >
      <path
        d="M56 0H0V5H2V28H5.5C5.83333 29 7.1 31 9.5 31C11.9 31 13.1667 29 13.5 28H42.5C42.5 28 43 31 46.5 31C49.3 31 50.3333 29 50.5 28H54V25H56V20H54V12H56V7H54V5H56V0Z"
        fill="var(--icon-color)"
      />
    </mask>
    <g mask="url(#mask0)">
      {[
        [30.5581, -30, -20, 20.5581],
        [33.3865, -27.1719, -17.1717, 23.3863],
        [36.2148, -24.3433, -14.3433, 26.2149],
        [39.0435, -21.5146, -11.5147, 29.0435],
        [41.8718, -18.6865, -8.68631, 31.8716],
        [44.7002, -15.8579, -5.85794, 34.7002],
        [47.5287, -13.0293, -3.02945, 37.5288],
        [50.3572, -10.2012, -0.200956, 40.357],
        [53.1855, -7.37256, 2.62741, 43.1856],
        [56.0139, -4.54395, 5.45578, 46.0142],
        [58.8424, -1.71582, 8.28427, 48.8423],
        [61.6708, 1.11279, 11.1126, 51.6709],
        [64.4993, 3.94141, 13.9411, 54.4995],
        [67.3276, 6.76953, 16.7695, 57.3277],
        [70.156, 9.59814, 19.5979, 60.1563],
        [72.9844, 12.4263, 22.4262, 62.9844],
      ].map(([x1, y1, x2, y2], i) => (
        <path
          key={i}
          d={`M${x1} ${y1}L${x2} ${y2}`}
          stroke="var(--icon-color)"
          strokeWidth="2.5"
        />
      ))}
    </g>
  </svg>
)

export const EmptyDumpsterIcon = ({ colorCode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="58"
    height="33"
    viewBox="0 0 58 33"
    fill="none"
    style={{ '--icon-color': colorCode }}
  >
    <path
      d="M57 1H1V6H3V29H6.5C6.83333 30 8.1 32 10.5 32C12.9 32 14.1667 30 14.5 29H43.5C43.5 29 44 32 47.5 32C50.3 32 51.3333 30 51.5 29H55V26H57V21H55V13H57V8H55V6H57V1Z"
      stroke="var(--icon-color)"
      stroke-dasharray="6 2"
    />
  </svg>
)
