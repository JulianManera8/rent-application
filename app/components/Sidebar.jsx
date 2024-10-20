import { Button } from "./ui/button"
import { NavLink, useLocation, useNavigate } from "@remix-run/react"
import { Building, DollarSign, Home } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"
import supabase from "../lib/supabase";
import Spinner from '../components/loaderIcon'

export default function Sidebar() {

 const location = useLocation()
 const navigate = useNavigate()
 const [loading, setLoading] = useState(false);
 const [name, setName ] = useState(null);
 const [loadingUser, setLoadingUser] = useState(true)

 useEffect(() => {
  setLoadingUser(true) 

  const getUser = async () => {
    const {data} = await supabase.auth.getUser();

    setLoadingUser(false)
    setName(data?.user.user_metadata.name)
  }

   // Fetch user after 1 second
  const timer = setTimeout(() => {
    getUser();
  }, 1000);


  return () => clearTimeout(timer);
 }, [])


 const handleLogout = async (e) => {
    setLoading(true)
    e.preventDefault()

    const { error } = await supabase.auth.signOut()

    if(error) {
      setLoading(false)
      console.error(error)
    }

    setTimeout(() => {
      setLoading(false)
      navigate("/");
    }, 1000);
 }

  return (
    <div className="flex flex-col h-screen w-64 min-w-64 bg-[#003156] text-white p-4">

      <div className="flex flex-col flex-1 space-y-8 items-center mt-8">
        {loadingUser ? (
          <>
            <Skeleton className="h-20 w-20 rounded-full bg-gray-200 opacity-30"/>
            <div className="space-y-1">
              <Skeleton className="h-5 w-20 bg-gray-200 opacity-30"/>
            </div>
          </>
        ) : (
          <>
            <img src="/logo.png" alt="" className="w-20 h-20" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Welcome, {name} </h2>
            </div>
          </>
        )}
        
      </div>
      
      <nav className="space-y-8 flex-grow flex-1">
        <NavLink to="/dashboard/general" className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-[#1c4570] ${location.pathname == "/dashboard/general" ? "bg-[#005291]" : "bg-[#003156]"} transition-all`}>
          <Home className="h-8 w-8" />
          <span className="text-xl">Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/deptos" className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-[#1c4570] ${location.pathname == "/dashboard/deptos" ? "bg-[#005291]" : "bg-[#003156]"}`}>
          <Building className="h-8 w-8" />
          <span className="text-xl">Propiedades</span>
        </NavLink>
        <NavLink to="/dashboard/money" className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-[#1c4570] ${location.pathname == "/dashboard/money" ? "bg-[#005291]" : "bg-[#003156]"}`}>
          <DollarSign className="h-8 w-8" />
          <span className="text-xl">Balance</span>
        </NavLink>
      </nav>
      
      <div className="mb-8 space-y-4 mx-auto flex flex-1 items-end">
        <Button className="h-14 w-32 text-xl border-[3px] border-red-600 rounded-lg bg-[#003156]" onClick={handleLogout}>
        {loading ? <Spinner/> : "Log Out"}

        </Button>
      </div>
    </div>
  )
}