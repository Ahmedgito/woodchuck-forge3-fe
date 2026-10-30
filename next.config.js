const path = require('path')

module.exports = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    dangerouslyAllowSVG: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    additionalData: `  
    @import "src/styles/abstract/_functions.scss"; 
    @import "src/styles/abstract/_variables.scss"; 
    @import "src/styles/abstract/_mixins.scss";
    @import "src/styles/abstract/_fonts.scss";
    `,
  },
  reactStrictMode: false,
  async headers() {
    // Get backend API URL from environment or use default
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'https://woodchuck-api.folio3.com:7000'
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      'https://woodchuck-api.folio3.com:7000'

    // Extract domain from URLs for CSP
    const apiDomain = apiUrl.replace(/^https?:\/\//, '').split('/')[0]
    const socketDomain = socketUrl.replace(/^https?:\/\//, '').split('/')[0]

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              // Scripts: Allow same-origin, inline scripts, eval (needed for Google Maps), and Google Maps (including gstatic)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://*.googleapis.com https://maps.gstatic.com",
              // Explicitly allow script-src-elem for browsers that differentiate it
              "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://*.googleapis.com https://maps.gstatic.com",
              // Styles: Allow same-origin, inline styles, and Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com",
              // Fonts: Allow same-origin and Google Fonts
              "font-src 'self' data: https://fonts.gstatic.com",
              // Images: Allow all sources (adjust if you want to restrict)
              "img-src 'self' data: https: blob:",
              // Connections: Allow same-origin, localhost (for dev), backend API, socket.io, and Google Maps APIs
              `connect-src 'self' http://localhost:3000 http://localhost:7000 http://127.0.0.1:3000 http://127.0.0.1:7000 ws://localhost:3000 ws://localhost:7000 wss://localhost:3000 wss://localhost:7000 https://${apiDomain} https://${socketDomain} https://maps.googleapis.com https://*.googleapis.com https://maps.gstatic.com wss://${socketDomain} ws://${socketDomain}`,
              // Frame sources (if you use iframes)
              "frame-src 'self' https://*.googleapis.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}
