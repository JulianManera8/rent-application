/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { NavLink } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";

const departamentos = [
  { id: 1, foto: "/placeholder.svg", direccion: "Salta 1234", propietario: "Marcelo Manera", facturador: 'Marcelo Manera', cobrador: 'Javier Deptos', inquilino: "Julio Cesar", estado: "Ocupado" },
  { id: 2, foto: "/placeholder.svg", direccion: "Rioja 765", propietario: "Marcelo Manera", facturador: 'Marcelo Manera', cobrador: 'Javier Deptos', inquilino: "-", estado: "Desocupado" },
  { id: 3, foto: "/placeholder.svg", direccion: "Buenos aires 234", propietario: "Veronica Manera", facturador: 'Veronica Manera', cobrador: 'Javier Deptos', inquilino: "-", estado: "Desocupado" },
  { id: 4, foto: "/placeholder.svg", direccion: "Urquiza 6754", propietario: "Veronica Manera", facturador: 'Veronica Manera', cobrador: 'Javier Deptos', inquilino: "Tiger Woods", estado: "Ocupado" },
  { id: 5, foto: "/placeholder.svg", direccion: "Urquiza 754", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Julian Manera', inquilino: "Tiger Woods", estado: "Ocupado" },
  { id: 6, foto: "/placeholder.svg", direccion: "Santa Fe 1754", propietario: "Veronica Manera", facturador: 'Veronica Manera', cobrador: 'Julian Manera', inquilino: "Tiger Woods", estado: "Ocupado" },
  { id: 7, foto: "/placeholder.svg", direccion: "Rioja 2754", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Julian Manera', inquilino: "Tiger Woods", estado: "Ocupado" },
  { id: 8, foto: "/placeholder.svg", direccion: "Buenos Aires 3754", propietario: "Veronica Manera", facturador: 'Veronica Manera', cobrador: 'Javier Deptos', inquilino: "-", estado: "Desocupado" },
  { id: 9, foto: "/placeholder.svg", direccion: "San Lorenzo 354", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Javier Deptos', inquilino: "Lionel Messi", estado: "Ocupado" },
  { id: 10, foto: "/placeholder.svg", direccion: "Brown 1754", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Julian Manera', inquilino: "Tiger Woods", estado: "Ocupado" },
  { id: 11, foto: "/placeholder.svg", direccion: "Brown 714", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Julian Manera', inquilino: "Tiger Woods", estado: "Ocupado" },
  { id: 12, foto: "/placeholder.svg", direccion: "Rioja 254", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Julian Manera', inquilino: "Lionel Messi", estado: "Ocupado" },
  { id: 13, foto: "/placeholder.svg", direccion: "San Juan 54", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Julian Manera', inquilino: "Tiger Woods", estado: "Ocupado" },
  { id: 14, foto: "/placeholder.svg", direccion: "Alem 1354", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Julian Manera', inquilino: "Lionel Messi", estado: "Ocupado" },
  { id: 15, foto: "/placeholder.svg", direccion: "Juan Manuel de Rosas 7234", propietario: "Veronica Manera", facturador: 'Marcelo Manera', cobrador: 'Julian Manera', inquilino: "Tiger Woods", estado: "Ocupado" },
]

export default function DashboardDeptos({rows, border, showBtn, showAll}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("sinfiltro");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = rows;
  const totalPages = Math.ceil(departamentos.length / itemsPerPage);

  useEffect(() => {
    setFilterValue(filterValue)
  }, [filterValue, setFilterValue])

  const filteredDepartamentos = departamentos.filter((dep) => {

    const matchesSearchTerm =
      dep.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.facturador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.cobrador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.inquilino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.estado.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesFilter =
      filterValue === "sinfiltro" || dep.estado.toLowerCase() === filterValue.toLowerCase();
  
    return matchesSearchTerm && matchesFilter;
  });

// console.log(departamentos[0].estado.toLowerCase().includes(filterValue.toLowerCase()))

  const paginatedDepartamentos = filteredDepartamentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`container mx-auto w-full py-10 px-0 ${border}`}>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-[#194567]">Todos los Departamentos</h1>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar"
            className="pl-8 w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtrar por:</span>
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sinfiltro">Sin filtro</SelectItem>
              <SelectItem value="ocupado">Ocupado</SelectItem>
              <SelectItem value="desocupado">Desocupado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table className="border-b-[2px] overflow-hidden">
        <TableHeader>
          <TableRow className="font-md">
            <TableHead>Direccion</TableHead>
            <TableHead>Propietario</TableHead>
            <TableHead>Facturador</TableHead>
            <TableHead>Cobrador</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {showAll 
          ? filteredDepartamentos.map((dep) => (
            <TableRow key={dep.id} className="text-md">
              <TableCell className="w-1/6">{dep.direccion}</TableCell>
              <TableCell className="w-1/6">{dep.propietario}</TableCell>
              <TableCell className="w-1/6">{dep.facturador}</TableCell>
              <TableCell className="w-1/6">{dep.cobrador}</TableCell>
              <TableCell className="w-1/6">{dep.inquilino}</TableCell>
              <TableCell className="w-1/6">
                <span
                  className={`px-2 py-1 rounded-full text-md font-semibold ${
                    dep.estado === "Ocupado"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {dep.estado}
                </span>
              </TableCell>
            </TableRow>
          ))
          : paginatedDepartamentos.map((dep) => (
            <TableRow key={dep.id} className="text-md">
              <TableCell className="w-1/6">{dep.direccion}</TableCell>
              <TableCell className="w-1/6">{dep.propietario}</TableCell>
              <TableCell className="w-1/6">{dep.facturador}</TableCell>
              <TableCell className="w-1/6">{dep.cobrador}</TableCell>
              <TableCell className="w-1/6">{dep.inquilino}</TableCell>
              <TableCell className="w-1/6">
                <span
                  className={`px-2 py-1 rounded-full text-md font-semibold ${
                    dep.estado === "Ocupado"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {dep.estado}
                </span>
              </TableCell>
            </TableRow>
          ))
        }

          
        </TableBody>
      </Table>
      
      {/* show or dont show the divided pages */}
      {showAll 
      ? ''
      : (<div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing data of {paginatedDepartamentos.length} in{" "}
          {filteredDepartamentos.length} total
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(page)}
              className="h-8 w-8"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>)
    }
      
      {/* show or dont show the button to see all deptos */}
      {showBtn 
      ? (<div className="flex justify-center mt-5">
          <Button className="h-[45px] px-7 text-md bg-[#003156] hover:bg-[#255a93] rounded-xl">
              <NavLink to="/dashboard/deptos"> VER TODOS </NavLink>    
          </Button>
        </div>
        )
      : ''
      }
      
    </div>
  );
}
