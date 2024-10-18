/* eslint-disable no-unused-vars */
import DashboardDeptos from '../components/DashboardDeptos'
import DashboardMoney from '../components/DashboardMoney'


export default function DashboardIndexPage() {
    return (
        <div className='flex flex-col w-full mr-7 '> 
            <h1 className='text-3xl text-gray-300 font-extrabold font-inter mt-8 mx-0'> DASHBOARD - Vista General </h1>
            <DashboardDeptos rows={4} border='border-b-[1px]' showBtn={true} showAll={false}/>
            <DashboardMoney />
        </div>
    )
}