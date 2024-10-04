/* eslint-disable no-unused-vars */
import Sidebar from '../components/Sidebar'
import { Outlet } from '@remix-run/react'
import DashboardLayout from '../components/DashboardLayout'

export default function DashboardIndexPage() {
    return (
        <div> 
            <h1> VISTA DEL DASHBOARD  </h1>
            <DashboardLayout />
        </div>
    )
}