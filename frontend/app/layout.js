import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
import HomeToolBar from '@/app/components/HomeToolBar';
import PeerProvider from "@/app/components/PeerProvider";

export const metadata = {
  title: 'wbittorrent',
  description: 'An innovative web application that aims to utilize WebRTC for creating a browser-based bittorrent client, enabling peer-to-peer file sharing directly between browsers.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} vsc-initialized`}>
        <PeerProvider>
          <HomeToolBar />
          {children}
        </PeerProvider>
      </body>
    </html>
  )
}
