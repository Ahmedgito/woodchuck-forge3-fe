interface ThemeConfig {
  token: {
    colorSuccess: string
    colorError: string
    colorLink: string
    borderRadius: number
    colorBgBase: string
    fontSize: number
    fontFamily: string
    wireframe: boolean
    colorPrimary: string
    colorInfo: string
    colorWarning: string
    colorTextBase: string
    components: {
      Button: {
        defaultColor: string
        defaultBorderColor: string
        defaultBg: string
        fontSize: number
        borderRadius: number
        fontWeight: number
      }
      Typography: {
        fontSizeHeading1: number
        fontSizeHeading2: number
        fontSizeHeading3: number
        fontSizeHeading4: number
        fontSizeHeading5: number
        fontFamilyCode: string
        fontFamily: string
        fontWeightStrong: number
        colorText: string
        colorTextDescription: string
        colorTextHeading: string
      }
      Input: {
        activeBorderColor: string
        hoverBorderColor: string
        colorBorder: string
        paddingBlock: number
        controlHeight: number
        fontFamily: string
      }
      Menu: {
        fontFamily: string
        lineType: string
        borderRadius: number
        itemBorderRadius: number
        fontSize: string
        itemActiveBg: string
        itemColor: string
        itemHoverColor: string
      }
    }
    algorithm: string
  }
}

const theme: ThemeConfig = {
  token: {
    colorSuccess: '#72c040',
    colorError: '#ec5b56',
    colorLink: '#101418',
    borderRadius: 6,
    colorBgBase: '#f4f4f4',
    fontSize: 12,
    fontFamily: "'Poppins', sans-serif",
    wireframe: true,
    colorPrimary: '#101418',
    colorInfo: '#3479f7',
    colorWarning: '#efaf41',
    colorTextBase: '#6c727f',
    components: {
      Button: {
        defaultColor: 'rgb(16, 20, 24)',
        defaultBorderColor: 'rgb(16, 20, 24)',
        defaultBg: 'rgb(229, 230, 235)',
        fontSize: 12,
        borderRadius: 6,
        fontWeight: 500,
      },
      Typography: {
        fontSizeHeading1: 32,
        fontSizeHeading2: 22,
        fontSizeHeading3: 20,
        fontSizeHeading4: 16,
        fontSizeHeading5: 14,
        fontFamilyCode: "'Poppins', sans-serif;",
        fontFamily: "'Poppins', sans-serif",
        fontWeightStrong: 700,
        colorText: 'rgb(108, 114, 127)',
        colorTextDescription: 'rgb(108, 114, 127)',
        colorTextHeading: 'rgb(108, 114, 127)',
      },
      Input: {
        activeBorderColor: 'rgb(16, 20, 24)',
        hoverBorderColor: 'rgb(16, 20, 24)',
        colorBorder: 'rgb(210, 213, 219)',
        paddingBlock: 10,
        controlHeight: 0,
        fontFamily: "'Poppins', sans-serif;",
      },
      Menu: {
        fontFamily: 'inherit',
        lineType: '',
        borderRadius: 0,
        itemBorderRadius: 0,
        fontSize: 'inherit',
        itemActiveBg: 'rgb(16, 20, 24)',
        itemColor: 'rgb(16, 20, 24)',
        itemHoverColor: 'rgb(255, 255, 255)',
      },
    },
    algorithm: 'compact',
  },
}

export default theme
