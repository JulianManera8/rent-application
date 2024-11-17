import SectionBalances from '../components/dashboardGeneal/sectionBalances'
import SectionGrupos from '../components/dashboardGeneal/sectionGrupos'
import SectionPropiedades from '../components/dashboardGeneal/sectionPropiedades'


export default function DashboardIndexPage() {
    return (
        <div className='flex flex-col w-full mr-7 '> 
            <h1 className='text-3xl text-gray-300 font-medium font-inter mt-8 mx-0 mb-10'>
                 DASHBOARD - <span className='text-[#0c426bd3]'> Vista General </span>{" "}  
            </h1>
            <main className='space-y-16 ml-4 mr-4 mb-20'>
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