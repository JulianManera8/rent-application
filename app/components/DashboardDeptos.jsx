import { Button } from "./ui/button";
import { NavLink } from "@remix-run/react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Image as ImageIcon,
  Search,
} from "lucide-react";

const departamentos = [
  {
    id: 1,
    foto: "/placeholder.svg",
    direccion: "xxxxx",
    propietario: "xxxxx",
    inquilino: "xxxxx",
    estado: "Ocupado",
  },
  {
    id: 2,
    foto: "/placeholder.svg",
    direccion: "xxxxx",
    propietario: "xxxxx",
    inquilino: "-",
    estado: "Desocupado",
  },
  {
    id: 3,
    foto: "/placeholder.svg",
    direccion: "xxxxx",
    propietario: "xxxxx",
    inquilino: "-",
    estado: "Desocupado",
  },
  {
    id: 4,
    foto: "/placeholder.svg",
    direccion: "xxxxx",
    propietario: "xxxxx",
    inquilino: "xxxxx",
    estado: "Ocupado",
  },
  {
    id: 5,
    foto: "/placeholder.svg",
    direccion: "xxxxx",
    propietario: "xxxxx",
    inquilino: "xxxxx",
    estado: "Ocupado",
  },
  {
    id: 6,
    foto: "/placeholder.svg",
    direccion: "xxxxx",
    propietario: "xxxxx",
    inquilino: "xxxxx",
    estado: "Ocupado",
  },
  {
    id: 7,
    foto: "/placeholder.svg",
    direccion: "xxxxx",
    propietario: "xxxxx",
    inquilino: "xxxxx",
    estado: "Ocupado",
  },
];

export default function DashboardDeptos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("Mas nuevo");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(departamentos.length / itemsPerPage);

  const filteredDepartamentos = departamentos.filter(
    (dep) =>
      dep.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.inquilino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDepartamentos = filteredDepartamentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto w-full py-10 px-0 border-b-[1px]">
      <div className="flex justify-between items-center mb-6">
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
              <SelectItem value="Mas nuevo">Mas nuevo</SelectItem>
              <SelectItem value="Mas viejo">Mas viejo</SelectItem>
              <SelectItem value="Ocupado">Ocupado</SelectItem>
              <SelectItem value="Desocupado">Desocupado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="font-lg">
            <TableHead>Foto</TableHead>
            <TableHead>Direccion</TableHead>
            <TableHead>Propietario</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedDepartamentos.map((dep) => (
            <TableRow key={dep.id} className="text-lg">
              <TableCell>
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                  <ImageIcon className="w-8 h-8 text-gray-500" />
                </div>
              </TableCell>
              <TableCell>{dep.direccion}</TableCell>
              <TableCell>{dep.propietario}</TableCell>
              <TableCell>{dep.inquilino}</TableCell>
              <TableCell>
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
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
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
      </div>

      <div className="flex justify-center mt-5">
        <Button className="h-[45px] px-7 text-md bg-[#003156] hover:bg-[#255a93] rounded-xl">
            <NavLink to="/dashboard/deptos"> VER TODOS </NavLink>    
        </Button>
      </div>
    </div>
  );
}
