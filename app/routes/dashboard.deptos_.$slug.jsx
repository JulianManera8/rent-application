import { useLoaderData } from '@remix-run/react';
import DeptoSelected from '../components/propiedades/DeptoSelected'

export async function loader({ params }) {
    const slug = params.slug;
    return slug;
}

export default function DeptoSelectedPage() {
    const slug = useLoaderData();

    return (
        <div className="flex flex-col w-full mr-14 ">
            <DeptoSelected slug={slug}/>
        </div>
    )
}