/* eslint-disable no-unused-vars */
import { Outlet } from '@remix-run/react'
import Sidebar from '../components/Sidebar'

export default function DashboardIndexPage() {
    return (
        <div className='flex font-inter'> 
            <Sidebar />
            {/* aca en outlet se va a mostrar las rutas q sean dashboard.xx */}
            <Outlet />
        </div>
    )
}