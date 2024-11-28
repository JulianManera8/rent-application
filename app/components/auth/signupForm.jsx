"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import Error from '../helpers/Error'
import Spinner from '../helpers/loaderIcon'
import { useNavigate } from "@remix-run/react"
import supabase from "../../lib/supabase"

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

  const [progressValue, setProgressValue] = useState(0)
  const [progressColor, setProgressColor] = useState("#de1b2e")
  const [itemValidated, setItemValidated] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    length: false,
  })

  const navigate = useNavigate()

  useEffect(() => {
    const password = userInfo.password
    
    const validations = {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      length: password.length >= 8,
    }

    setItemValidated(validations)

    const validCount = Object.values(validations).filter(Boolean).length
    const newProgressValue = Math.min(validCount * 25, 100)
    setProgressValue(newProgressValue)

    const colorMap = {
      0: "#de1b2e",
      25: "#de8d1b",
      50: "#edc709",
      75: "#bced09",
      100: "#33ed09",
    }
    setProgressColor(colorMap[newProgressValue] || "#f72331")
  }, [userInfo.password])

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
  

    if (!Object.values(itemValidated).every(Boolean)) {
      setLoading(false)
      return setErrors(prev => ({ ...prev, password: 'La contraseña no cumple con todos los requisitos' }))
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
          <h2 className="text-2xl font-bold text-center sr-only">Sign Up</h2>
        </CardHeader>

        <CardContent className="space-y-5">
        <div>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="given-name"
              className="md:text-lg text-md text-sm w-4/5 mx-auto"
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
              placeholder="Lastname"
              autoComplete='family-name'
              className="md:text-lg text-md  w-4/5 mx-auto"
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
              className="md:text-lg text-md text-sm w-4/5 mx-auto"
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
              className="md:text-lg text-md text-sm w-4/5 mx-auto"
              value={userInfo.dni}
              onChange={(e) =>
                setUserInfo({ ...userInfo, dni: e.target.value })
              }
            />
            {errors.dni && <Error errorMessage={errors.dni} />}
          </div>

          <div className="w-4/5 mx-auto">
            <div className="relative">
              <Input
                type={passEye ? "password" : "text"}
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                className="pr-10"
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
            
            <div className="mt-3">
              <Progress value={progressValue > 0 ? progressValue : 5} className="h-2" colorProgress={progressColor } />

              <ul className="list-inside mt-2 text-sm text-muted-foreground">
                <li className={itemValidated.uppercase ? 'line-through' : ''}>- Mayúscula</li>
                <li className={itemValidated.lowercase ? 'line-through' : ''}>- Minúscula</li>
                <li className={itemValidated.number ? 'line-through' : ''}>- Número</li>
                <li className={itemValidated.length ? 'line-through' : ''}>- 8 caracteres mínimo</li>
              </ul>
            </div>
          </div>
          {errors.password && <Error errorMessage={errors.password} />}

          <div className="w-4/5 mx-auto relative">
            <Input
              type={passEye ? "password" : "text"}
              name="confirmPassword"
              placeholder="Confirm password"
              autoComplete="new-password"
              className="pr-10"
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
            {loading ? <Spinner /> : "Create Account"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

