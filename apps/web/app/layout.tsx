import './globals.css';

export const metadata = {
  title: 'MedEase — Healthcare That Reaches You',
  description: 'Integrated Rural Healthcare Access & Care-Continuity Platform - Government of Maharashtra',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

