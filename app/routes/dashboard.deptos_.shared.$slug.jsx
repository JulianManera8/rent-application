import { useLoaderData } from '@remix-run/react';
import DeptoSelectedShared from '../components/propiedades/DeptoSelectedShared'
import { useUser } from '../hooks/use-user';


export async function loader({ params }) {
    const slug = params.slug;
    return slug;
}

export default function DeptoSelectedPage() {
    const slug = useLoaderData();
    const userLoged_id = useUser()

    return (
        <div className="flex flex-col w-full mr-14 px-0 md:px-3">
            <DeptoSelectedShared slug={slug} userId={userLoged_id}/>
        </div>
    )
}