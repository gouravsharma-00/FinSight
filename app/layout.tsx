import React from 'react'
import "@/app/globals.css"
import { Header, Footer } from '@/components/Head'

export const metadata = {
    title: 'mars | Finance Tracker',
    description: ''
}

export default function RootLayout({children} : {children: React.ReactNode}) {
    return(
        <html lang='en'>
            <head></head>
            <body>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    )
}