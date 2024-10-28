/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import useFetch from "../hooks/use-fetch";
import supabase from "../lib/supabase";
import { getBalances } from "../database/crudBalances";
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

export default function DashboardMoneyAll({ months }) {
  const [userLoged_id, setUserLogedId] = useState(null);
  const [balanceInfo, setBalanceInfo] = useState([
    {
    mes_balance: '',
    año_balance: '',
    url_balance: '',
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");

  const filteredMonths = months.filter((month) =>
    month.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { loading, error, data: dataBalances, fn: fnGetBalances } = useFetch(getBalances, { userId: userLoged_id});

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data && data.user) {
        setUserLogedId(data.user.id);
      }
      if (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userLoged_id) {
      fnGetBalances({ userId: userLoged_id }); // Correctly pass userId as an object
    }
  }, [userLoged_id]);

  useEffect(() => {
    if (dataBalances) {
      setBalanceInfo(dataBalances);
      console.log(dataBalances) 
    }
  }, [dataBalances]);
  

  return (
    <div>
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
          <span className="mr-2">Sort by :</span>
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
            <TableHead>AÑO</TableHead>
            <TableHead>MES</TableHead>
            <TableHead>PLANILLA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMonths.map((month) => (
            <TableRow key={month}>
              <TableCell>{month}</TableCell>
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
