import SectionBalances from '../components/dashboardGeneal/balanceSection/sectionBalances'
import SectionGeneral from '../components/dashboardGeneal/generalSection/sectionGeneral'
import SectionGrupos from '../components/dashboardGeneal/groupSection/sectionGrupos'
import SectionPropiedades from '../components/dashboardGeneal/propertySection/sectionPropiedades'
import QuickAccess from '../components/dashboardGeneal/QuickAccess'
import { Separator } from '../components/ui/separator'


export default function DashboardIndexPage() {
    return (
        <div className='flex flex-col w-full mr-7 md:px-3 px-0'> 
            <div className='fixed right-0 top-6 mr-4 z-50'>
                <QuickAccess />
            </div>
            <div className='flex md:justify-between md:ml-0 justify-center md:justify-left'>
                <h1 className="sm:text-3xl text-lg text-gray-300 font-medium font-inter md:mt-8 mt-0 mx-0 mb-2">
                    DASHBOARD - <span className='text-[#0c426bd3] whitespace-nowrap'> Vista General </span>{" "}  
                </h1>
            </div>


            <Separator />

            <main className='space-y-16 mr-0 mb-20 mt-10'>
                <section>
                    <SectionGeneral />
                </section>
                <section>
                    <SectionGrupos />
                </section>
                <section>
                    <SectionPropiedades />   
                </section>
                <section>
                    <SectionBalances />
                </section>
            </main>
        </div>
    )
}