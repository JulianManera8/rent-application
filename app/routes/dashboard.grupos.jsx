// import { NavLink } from "@remix-run/react";
import DashboardGrupos from "../components/grupos/DashboardGrupos";
import GruposShared from "../components/grupos/GruposShared";
import { Separator } from "../components/ui/separator"
// import { Button } from "../components/ui/button";

export default function DashboardGruposPage() {
  return (
    <div className="flex flex-col w-full mr-14 px-0 md:px-3">
      <div className="flex items-center mt-8 md:justify-between justify-center ">
        <h1 className="sm:text-3xl text-2xl   text-gray-300 font-medium font-inter mb-2">
          DASHBOARD - <span className='text-[#0c426bd3]'> Grupos </span>{" "} 
        </h1>
      </div>
      <Separator />
      <DashboardGrupos rows={10} border="border-none" showBtn={false} showAll={true}/>
      <Separator />
      <GruposShared />
    </div>
  );
}
