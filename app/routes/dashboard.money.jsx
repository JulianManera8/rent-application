import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { NavLink } from "@remix-run/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export const loader = async () => {
  // In a real application, you would fetch this data from a database or API
  const months = [
    "AGOSTO",
    "JULIO",
    "JUNIO",
    "MAYO",
    "ABRIL",
    "MARZO",
    "FEBRERO",
    "ENERO",
  ];
  return json({ months });
};

export default function MoneyHistorial() {
  const { months } = useLoaderData();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");

  const filteredMonths = months.filter((month) =>
    month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto w-full mr-14 px-0 ">
      <div className="flex justify-between items-center">  
        <h1 className="text-3xl text-gray-300 font-extrabold font-inter mb-10 mt-8">
          {" "}
          DASHBOARD - Balances Monetarios{" "}
        </h1>
        <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800"> 
            <NavLink to="/dashboard/money/addBalance"> Agregar Balance </NavLink>
        </Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-[#194567]">
          Todos los Balances Monetarios
        </h1>

        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Short by :</span>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Newest</SelectItem>
              <SelectItem value="Oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MES</TableHead>
            <TableHead>PLANILLA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMonths.map((month) => (
            <TableRow key={month}>
              <TableCell>{month}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                  cobrosgastos.xls
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      
    </div>
  );
}
