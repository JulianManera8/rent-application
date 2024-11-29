import SectionBalances from '../components/dashboardGeneal/balanceSection/sectionBalances'
import SectionGrupos from '../components/dashboardGeneal/groupSection/sectionGrupos'
import SectionPropiedades from '../components/dashboardGeneal/propertySection/sectionPropiedades'
import { Separator } from '../components/ui/separator'


export default function DashboardIndexPage() {
    return (
        <div className='flex flex-col w-full mr-7 md:px-3 px-0'> 
            <div className='flex md:justify-between md:ml-0 ml-3 justify-center '>
                <h1 className='sm:text-3xl text-2xl text-gray-300 font-medium font-inter mb-2 mt-8 mx-0'>
                    DASHBOARD - <span className='text-[#0c426bd3]'> Vista General </span>{" "}  
                </h1>
            </div>
            <Separator />

            <main className='space-y-16 mr-4 mb-20 mt-10'>
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