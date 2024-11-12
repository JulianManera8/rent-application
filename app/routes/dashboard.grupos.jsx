// import { NavLink } from "@remix-run/react";
import DashboardGrupos from "../components/grupos/DashboardGrupos";
// import { Button } from "../components/ui/button";

export default function DashboardGruposPage() {
  return (
    <div className="flex flex-col w-full mr-14 ">
      <div className="flex items-center mt-8 justify-between ">
        <h1 className="text-3xl text-gray-300 font-extrabold font-inter"> DASHBOARD - Grupos </h1>
        {/* <Button className="bg-green-600 h-10 px-6 font-bold text-md hover:bg-green-800"> 
            <NavLink to="/dashboard/deptos/createDepto"> Agregar Propiedad </NavLink>
        </Button> */}
      </div>
      <DashboardGrupos rows={10} border="border-none" showBtn={false} showAll={true}/>
    </div>
  );
}
