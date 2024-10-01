export default function SingleDepto() {
    return (
        <div> VISTA DEL DEPTO SELECCIONADO </div>
    )
}

export async function loader({params}) {
    const idDepto = params.slug
    console.log(idDepto)
    return idDepto
}