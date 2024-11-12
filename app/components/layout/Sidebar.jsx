/* eslint-disable react/prop-types */
import { Button } from "../ui/button"
import { NavLink, useNavigate } from "@remix-run/react"
import { Building, DollarSign, Home, Boxes, ArrowLeftFromLine, ArrowRightFromLine, ChevronsRight, ChevronsLeft } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { useEffect, useState } from "react"
import { Skeleton } from "../ui/skeleton"
import supabase from "../../lib/supabase"
import Spinner from '../helpers/loaderIcon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

export default function Sidebar({ responsive, setResponsive, onMobileHiddenChange }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [isMobileHidden, setIsMobileHidden] = useState(false)
  
  useEffect(() => {
    setLoadingUser(true) 

    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setLoadingUser(false)
      setName(data?.user.user_metadata.name)
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
    { path: "/dashboard/money", icon: DollarSign, label: "Balance" },
  ]

  const toggleMobileSidebar = () => {
    setIsMobileHidden(!isMobileHidden);
    onMobileHiddenChange(!isMobileHidden);
  }

  return (
    <>
      <Button
        className={` ${!responsive ? 'hidden' : 'fixed'} fixed top-4 transition-all duration-300 ease-in-out 
        ${ isMobileHidden ? 'left-4' : 'left-20'} z-50 pl-1 pr-0 py-2 md:hidden bg-[#0031566d] hover:bg-[#004a8769] text-white`
        }
        onClick={toggleMobileSidebar}
      >
        <div className="border-l-2">
          {isMobileHidden ? <ChevronsRight className="min-w-6 min-h-8" />
            : <ChevronsLeft className="min-w-6 min-h-8" />
          }
        </div>
      </Button>

      <div className={`
        fixed inset-y-0 left-0 z-40 flex flex-col h-dvh min-h-dvh
        bg-[#003156]
        ${isMobileHidden ? '-translate-x-[80%] bg-[#227dc2]' : 'translate-x-0 bg-[#003156]'}
        ${responsive ? 'w-20 bg-[#003156]' : 'w-60 bg-[#003156]'}
        min-w-[5rem]  text-white p-4
        transition-all duration-300 ease-in-out
        md:translate-x-0
      `}>

        <div className={`flex flex-col items-center ${responsive ? 'mt-0' : 'mt-4'} space-y-2 transition-all duration-300 ease-in-out`}>
          {loadingUser ? (
            <>
              <Skeleton className={`${responsive ? 'h-10 w-10' : 'h-14 w-14  md:h-16 md:w-16'} mb-3 rounded-full bg-gray-200 opacity-30 transition-all duration-300 ease-in-out`}/>
              <div>
                <Skeleton className={`h-5 w-28 bg-gray-200 opacity-30 ${responsive ? 'hidden' : 'block'} transition-all duration-300 ease-in-out`}/>
              </div>
            </>
          ) : (
            <>
              <img src="/logo.png" alt="Logo" className={`transition-all duration-300 ease-in-out ${responsive ? 'h-10 w-10' : 'h-16 w-16'} mb-2`} />
              <div className={`mt-2 text-center transition-all duration-300 ease-in-out ${responsive ? 'hidden' : 'block'}`}>
                <h2 className="text-md md:text-lg font-semibold truncate">Welcome, {name}</h2>
              </div>
            </>
          )}
        </div>
        
        <nav className={`space-y-4 flex-grow mt-8 transition-all duration-300 ease-in-out`}>
          {navItems.map((item) => (
            <TooltipProvider key={item.path}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center space-x-2 px-4 py-3 rounded-lg
                      hover:bg-[#1c4570] transition-all duration-200 ease-in-out
                      ${isActive ? "bg-[#005291]" : "bg-[#003156]"}
                      ${responsive ? 'justify-center' : ''}
                    `}
                  >
                    <item.icon className={`h-6 w-6 transition-all duration-200 ease-in-out ${responsive ? 'scale-125' : ''}`} />
                    {!responsive && <span className="text-sm md:text-base transition-all duration-200 ease-in-out">{item.label}</span>}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10} className={responsive ? 'block' : 'hidden'}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
        
        <div className={`mt-auto space-y-4 transition-all duration-300 ease-in-out ${responsive ? 'items-center' : 'items-start'}`}>
          <AlertDialog>
            <AlertDialogTrigger
             className={`w-full h-12 text-base border-2 border-red-600 rounded-lg bg-[#003156] hover:bg-[#004b87] transition-all duration-200 ease-in-out ${responsive ? 'px-2' : 'px-0'} `}
            >
              {responsive ? (
                <img src="/apagado.png" alt="apagado" />
              ) : (
                "Cerrar sesión"
              )}
            </AlertDialogTrigger>
            <AlertDialogContent className={` rounded-xl ${responsive ? 'max-w-[80%] md:max-w-96' : ''} `}>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">¿Quieres cerrar sesión?</AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-center justify-evenly flex flex-row items-center">
                <AlertDialogCancel className='h-10 mt-0'>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className={`h-10 ${ loading ? 'opacity-50' : ''}`}
                  disabled={loading}
                  onClick={handleLogout}
                >
                  {loading ? <Spinner /> : 'Continue'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            className={`w-full bg-zinc-200 hover:bg-zinc-300 text-black transition-all duration-200 ease-in-out
              ${responsive ? 'px-2' : 'px-4'}
            `}
            onClick={() => setResponsive(!responsive)}
          >
            {responsive ? (
              <ArrowRightFromLine className="h-6 w-6" />
            ) : (
              <>
                <ArrowLeftFromLine className="h-6 w-6 mr-2" />
                <span>Esconder</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}