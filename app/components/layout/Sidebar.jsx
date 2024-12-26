/* eslint-disable react/prop-types */
import { Button } from "../ui/button"
import { NavLink, useNavigate } from "@remix-run/react"
import { Building, DollarSign, Home, Boxes, ArrowLeftFromLine, ArrowRightFromLine, XSquareIcon, MenuSquareIcon } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import supabase from "../../lib/supabase"
import Spinner from '../helpers/loaderIcon'
import DisplayDate from "../helpers/DisplayDate"

export default function Sidebar({ responsive, setResponsive, onMobileHiddenChange }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(null)
  const [lastname, setLastname] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [isMobileHidden, setIsMobileHidden] = useState(false)
  
  useEffect(() => {
    setLoadingUser(true) 

    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setLoadingUser(false)
      setName(data?.user.user_metadata.name)
      setLastname(data?.user.user_metadata.lastname)
    }

    const timer = setTimeout(() => {
      getUser()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = async (e) => {
    setLoading(true)
    e.preventDefault()

    const { error } = await supabase.auth.signOut()

    if (error) {
      setLoading(false)
      console.error(error)
    }

    setTimeout(() => {
      setLoading(false)
      navigate("/")
    }, 1000)
  }

  const navItems = [
    { path: "/dashboard/general", icon: Home, label: "Dashboard" },
    { path: "/dashboard/grupos", icon: Boxes, label: "Grupos" },
    { path: "/dashboard/deptos", icon: Building, label: "Propiedades" },
    { path: "/dashboard/money", icon: DollarSign, label: "Balances" },
  ]

  const toggleMobileSidebar = () => {
    setIsMobileHidden(!isMobileHidden);
    onMobileHiddenChange(!isMobileHidden);
  }

  return (
    <>
      <Button
        className={`${!responsive ? 'hidden' : 'fixed'} fixed top-6 transition-all duration-300 ease-in-out 
        ${isMobileHidden ? 'left-2' : 'left-20'} z-50 px-1 py-2 md:hidden bg-[#0031566d] hover:bg-[#004a8769] text-white`}
        onClick={toggleMobileSidebar}
      >
        <div className="">
          {isMobileHidden ? <MenuSquareIcon className="min-w-8 min-h-8" /> : <XSquareIcon className="min-w-8 min-h-8" />}
        </div>
      </Button>

      <div className={`
        fixed inset-y-0 left-0 z-50 flex flex-col h-dvh min-h-dvh
        bg-[#003156]
        ${isMobileHidden ? '-translate-x-[100%]' : 'translate-x-0'}
        ${responsive ? 'w-20 ' : 'w-screen sm:w-60'}
        min-w-[5rem] text-white p-4
        transition-all duration-300 ease-in-out
        md:translate-x-0
      `}>
        <div className="flex flex-col items-center mt-4 space-y-2">
          {loadingUser ? (
            <>
              <Skeleton className={`h-16 w-16 ${responsive ? 'h-12 w-12' : 'h-16 w-16'} mb-3 rounded-full bg-gray-200 opacity-30`} />
              <div className={`transition-all duration-300 ease-in-out ${responsive ? 'w-0 opacity-0' : 'w-auto opacity-100'} overflow-hidden`}>
                <Skeleton className="h-5 w-28 bg-gray-200 opacity-30" />
              </div>
            </>
          ) : (
            <>
              <img src="/logo.png" alt="Logo" className={`${responsive ? 'h-12 w-12' : 'h-16 w-16'} mb-2 transition-all`} />
              <div className={`mt-2 text-center transition-all duration-300 ease-in-out ${responsive ? 'w-0 opacity-0' : 'w-auto opacity-100'} overflow-hidden whitespace-nowrap`}>
                <h2 className="text-sm md:text-md font-semibold">{name} {lastname}</h2>
              </div>
            </>
          )}
        </div>
        
        <nav className="space-y-4 flex-grow mt-8">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-2 px-3 py-3 rounded-lg
                hover:bg-[#1c4570] transition-colors duration-200 ease-in-out
                ${isActive ? "bg-[#005291]" : "bg-[#003156]"}
              `}
            >
              <div className="w-6 flex-shrink-0 flex justify-center">
                <item.icon className="h-5 w-5" />
              </div>
              <span className={`text-sm md:text-md transition-all duration-300 ease-in-out ${responsive ? 'w-0 opacity-0' : 'w-auto opacity-100'} overflow-hidden whitespace-nowrap`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-auto space-y-4">
          <DisplayDate responsive={responsive} />
          

          <AlertDialog>
            <AlertDialogTrigger
              className="w-full h-12 text-base border-2 border-red-600 rounded-lg bg-[#003156] hover:bg-[#ce2424cc] transition-all duration-200 ease-in-out flex items-center justify-center"
            >
              <img src="/apagado.png" alt="apagado" className="w-6 h-6" />
              <span className={`transition-all duration-300 ease-in-out ${responsive ? 'w-0 opacity-0 ml-0' : 'ml-2 w-auto opacity-100'} overflow-hidden whitespace-nowrap`}>
                Cerrar sesión
              </span>
            </AlertDialogTrigger>
            <AlertDialogContent className={`rounded-xl ${responsive ? 'max-w-[80%] md:max-w-96' : ''}`}>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">¿Quieres cerrar sesión?</AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-center justify-evenly flex flex-row items-center">
                <AlertDialogCancel className='h-10 mt-0'>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className={`h-10 ${loading ? 'opacity-50' : ''}`}
                  disabled={loading}
                  onClick={handleLogout}
                >
                  {loading ? <Spinner /> : 'Continue'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            className="w-full bg-zinc-200 hover:bg-zinc-300 text-black transition-all duration-200 ease-in-out flex items-center justify-center"
            onClick={() => setResponsive(!responsive)}
          >
            {responsive ? (
              <ArrowRightFromLine className="h-6 w-6" />
            ) : (
              <>
                <ArrowLeftFromLine className="h-6 w-6" />
                <span className="ml-2 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap">Esconder</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}