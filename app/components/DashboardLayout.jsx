/* eslint-disable no-unused-vars */
import Sidebar from '../components/Sidebar'
import { Outlet } from '@remix-run/react'

export default function DashboardIndexPage() {
    return (
        <div> 
            <Sidebar />
            <Outlet />
        </div>
    )
}