import { NavLink } from "@remix-run/react";
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { CheckCircle, FileSpreadsheet } from "lucide-react"

export default function DashboardMoney() {
  return (
    <Card className="w-full mx-auto border-none border-b-[1px]">
      <CardHeader className='px-0'>
        <CardTitle className="text-3xl font-extrabold text-[#194567]">
            Balances Monetarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-start space-x-5">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold"> Ultimo balance: Agosto </span>
          </div>
          <Button variant="outline" className="flex items-center space-x-2 text-lg">
            <FileSpreadsheet className="h-5 w-5" />
            <span>cobrosgastos.xls</span>
          </Button>
          <span className="text-sm text-gray-300"> Click para descargar </span>
        </div>
        <div className="flex justify-center mt-5">
        <Button className="h-[45px] px-7 text-md bg-[#003156] hover:bg-[#255a93] rounded-xl mt-3"> 
            <NavLink to="/dashboard/money"> VER TODOS </NavLink>    
        </Button>
        </div>
      </CardContent>
    </Card>
  );
}