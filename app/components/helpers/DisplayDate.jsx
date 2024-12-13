import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { es } from 'date-fns/locale';

export default function DisplayDate({responsive}) {
    const [date, setDate] = useState(null)
    useEffect(() => {
        const today = new Date()
        const fechaFormateada = responsive === false 
            ? format(today, 'EEEE, dd/MM/yyyy', { locale: es })
            : format(today, 'dd/MM/yy', { locale: es })
        setDate(fechaFormateada)
    }, [responsive])

    return (
        <div className='w-full text-center'>
            <h1 className={`first-letter:uppercase ${responsive ? 'text-xs' : 'text-lg'}`}> {date} </h1>
        </div>
    )
}