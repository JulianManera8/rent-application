import { NavLink } from "@remix-run/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"


export default function QuickAccess() {

    const navItems = [
        {"label": 'Grupos', "path": '/dashboard/grupos'},
        {"label": 'Crear Grupo', "path": '/dashboard/grupos'},
        {"label": 'Propiedades', "path": '/dashboard/deptos'},
        {"label": 'Crear Propiedad', "path": '/dashboard/deptos/createDepto'},
        {"label": 'Balances', "path": '/dashboard/money'},
        {"label": 'Cargar Balance', "path": '/dashboard/money'},
    ]

    return (
        <div className="flex items-end mb-2">
            <DropdownMenu className=''>
                <DropdownMenuTrigger className="bg-[#003156] hover:bg-[#1d5d80] transition-all duration-150 h-10 w-fit px-3 rounded-md text-white font-semibold">Atajos</DropdownMenuTrigger>
                <DropdownMenuContent>
                    {navItems.map((item, i) => (
                        <div key={i}>
                            <DropdownMenuItem>
                                <NavLink to={`${item.path}`}> {item.label} </NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </div>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}