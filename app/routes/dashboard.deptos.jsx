import { NavLink } from "@remix-run/react";
import DashboardDeptos from "../components/propiedades/DashboardDeptos";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input"
import { Search } from "lucide-react";
import { useState } from "react";

export default function DashboardDeptoPage() {
  const [ searchTerm, setSearchTerm ] = useState('')

  return (
    <div className="flex flex-col w-full mr-14 ">
      <div className="flex items-center mt-8 justify-between ">
        <h1 className="text-3xl text-gray-300 font-extrabold font-inter">
           DASHBOARD - <span className='text-[#0c426bd3]'> Propiedades </span>{" "} 
        </h1>
        <div className="flex gap-x-5">  
          <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
              placeholder="Buscar"
              className='pl-8 w-[210px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800"> 
              <NavLink to="/dashboard/deptos/createDepto"> Agregar Propiedad </NavLink>
          </Button>
      </div>
        </div>
      <DashboardDeptos searchTerm={searchTerm}/>
    </div>
  );
}
