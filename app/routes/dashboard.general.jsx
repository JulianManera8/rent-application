/* eslint-disable no-unused-vars */
import DashboardDeptos from '../components/dashboardDeptos'
import DashboardMoney from '../components/dashboardMoney'

export default function DashboardIndexPage() {
    return (
        <div className='flex flex-col w-screen mr-7'> 
            <h1 className='text-3xl text-gray-400 font-extrabold font-inter mt-8'> DASHBOARD - VISTA GENERAL </h1>
            <DashboardDeptos />
            <DashboardMoney />
        </div>
    )
}