// pages/page.js or app/page.js
"use client"
import "./globals.css"
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FinanceContextProvider from "@/lib/finance-context";
import  Nav from '@/components/Navigation.js'
import AuthContextProvider from "@/lib/store/auth-context";
export default function RootLayout({children}){
   return (
    <html lang="en">
       <head>
         
       </head>
       <body>
        
         <AuthContextProvider>
              <FinanceContextProvider>
               <ToastContainer/> 
                  <Nav/>{children}
              
              </FinanceContextProvider>
         </AuthContextProvider>
       </body>
    </html>
   );
}
