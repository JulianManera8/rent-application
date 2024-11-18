// import { NavLink } from "@remix-run/react";
import DashboardGrupos from "../components/grupos/DashboardGrupos";
// import { Button } from "../components/ui/button";

export default function DashboardGruposPage() {
  return (
    <div className="flex flex-col w-full mr-14 ">
      <div className="flex items-center mt-8 md:justify-between justify-center ">
        <h1 className="sm:text-3xl text-2xl   text-gray-300 font-medium font-inter">
           DASHBOARD - <span className='text-[#0c426bd3]'> Grupos </span>{" "} 
           </h1>
      </div>
      <DashboardGrupos rows={10} border="border-none" showBtn={false} showAll={true}/>
    </div>
  );
}
