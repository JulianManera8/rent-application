import SectionBalances from '../components/dashboardGeneral/balanceSection/sectionBalances'
import SectionGeneral from '../components/dashboardGeneral/generalSection/sectionGeneral'
import SectionGrupos from '../components/dashboardGeneral/groupSection/sectionGrupos'
import SectionPropiedades from '../components/dashboardGeneral/propertySection/sectionPropiedades'
import QuickAccess from '../components/dashboardGeneral/QuickAccess'
import { Separator } from '../components/ui/separator'
import { useUser } from '../hooks/use-user'


export default function DashboardIndexPage() {
    const userLoged_id = useUser()

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
                    <SectionGeneral userId={userLoged_id}/>
                </section>
                <section>
                    <SectionGrupos userId={userLoged_id}/>
                </section>
                <section>
                    <SectionPropiedades userId={userLoged_id}/>   
                </section>
                <section>
                    <SectionBalances userId={userLoged_id}/>
                </section>
            </main>
        </div>
    )
}