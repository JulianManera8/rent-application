import SectionBalances from '../components/dashboardGeneal/sectionBalances'
import SectionGrupos from '../components/dashboardGeneal/sectionGrupos'
import SectionPropiedades from '../components/dashboardGeneal/sectionProp'


export default function DashboardIndexPage() {
    return (
        <div className='flex flex-col w-full mr-7 '> 
            <h1 className='text-3xl text-gray-300 font-extrabold font-inter mt-8 mx-0 mb-10'>
                 DASHBOARD - <span className='text-[#0c426bd3]'> Vista General </span>{" "}  
            </h1>
            <main className='space-y-16 w-full ml-5'>
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