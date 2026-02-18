export const metadata = {
  title: 'HeatCheck HQ — Graphic Builder',
  description: 'Generate viral sports stats graphics for Twitter/X from HeatCheck HQ dashboards',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
