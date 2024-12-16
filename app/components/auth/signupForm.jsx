"use client"

import { useState,  } from "react"
import { Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Error from '../helpers/Error'
import Spinner from '../helpers/loaderIcon'
import { useNavigate } from "@remix-run/react"
import supabase from "../../lib/supabase"
import ValidatePassword from '../auth/validatePassword'

export default function SignupForm() {

  const [passEye, setPassEye] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    dni: '',
    auth: '',
  })
  
  const [userInfo, setUserInfo] = useState({
    name: "",
    lastname: "",
    email: "",
    dni: '',
    password: "",
    confirmPassword: "",
  })

  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({ name: '', lastname: '', email: "", password: "", confirmPassword: '', dni: '', auth: "" })

    if(userInfo.name === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, name: 'Debes completar correctamente el nombre'} ))
    }
    if(userInfo.lastname === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, lastname: 'Debes completar correctamente el apellido'} ))
    }
    if(userInfo.email === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, email: 'Debes completar correctamente el email'} ))
    }
    if(userInfo.dni === "" || userInfo.dni.length !== 8) {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, dni: 'Debes completar correctamente tu DNI'} ))
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      setLoading(false)
      return setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }))
    }

    const { error } = await supabase.auth.signUp({
      email: userInfo.email,
      password: userInfo.password,
      options: {
        data: {
        name: userInfo.name,
        lastname: userInfo.lastname,
        email: userInfo.email,
        dni: userInfo.dni.toString(),
        }
      },
    });
    if (error) {
      setLoading(false)  
      return setErrors((prevErrors)=> ({...prevErrors, auth: error.message} ))
    }

    // Simulating API call
    setTimeout(() => {
      setLoading(false)
      navigate("/dashboard/general")
    }, 2000)
  }

  return (
    <form onSubmit={handleSignup}>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-center sr-only">Crear Cuenta</h2>
        </CardHeader>

        <CardContent className="space-y-5">
        <div>
            <Input
              type="text"
              name="name"
              placeholder="Nombre"
              autoComplete="given-name"
              className="md:text-lg text-sm w-11/12 mx-auto"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
            />
            {errors.name && <Error errorMessage={errors.name} />}
            </div>
          <div>
            <Input
              type="text"
              name="lastname"
              placeholder="Apellido"
              autoComplete='family-name'
              className="md:text-lg text-sm  w-11/12 mx-auto"
              value={userInfo.lastname}
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastname: e.target.value })
              }
            />
            {errors.lastname && <Error errorMessage={errors.lastname} />}
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              className="md:text-lg text-sm w-11/12 mx-auto"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
            {errors.email && <Error errorMessage={errors.email} />}
          </div>
          <div>
            <Input
              type="number"
              name="dni"
              placeholder="D.N.I (sin puntos, solo numeros)"
              autoComplete="off"
              className="md:text-lg text-sm w-11/12 mx-auto"
              value={userInfo.dni}
              onChange={(e) =>
                setUserInfo({ ...userInfo, dni: e.target.value })
              }
            />
            {errors.dni && <Error errorMessage={errors.dni} />}
          </div>

          <div className="w-11/12 mx-auto">
            <div className="relative">
              <Input
                type={passEye ? "password" : "text"}
                name="password"
                placeholder="Contraseña"
                autoComplete="new-password"
                className="pr-10 text-sm"
                value={userInfo.password}
                onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setPassEye(!passEye)}
              >
                {passEye ? <Eye className="h-5 w-5 text-gray-400" /> : <EyeOff className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            
            <ValidatePassword password={userInfo.password}/>
          </div>
          {errors.password && <Error errorMessage={errors.password} />}

          <div className="w-11/12 mx-auto relative">
            <Input
              type={passEye ? "password" : "text"}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              autoComplete="new-password"
              className="pr-10 md:text-lg text-sm"
              value={userInfo.confirmPassword}
              onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setPassEye(!passEye)}
            >
              {passEye ? <Eye className="h-5 w-5 text-gray-400" /> : <EyeOff className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {errors.confirmPassword && <Error errorMessage={errors.confirmPassword} />}
        </CardContent>

        <CardFooter className="flex justify-center mt-5">
          <Button type="submit" className="w-fit">
            {loading ? <Spinner /> : "Crear Cuenta"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

