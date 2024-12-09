/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import supabase from "../../lib/supabase";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import Spinner from '../helpers/loaderIcon'
import Error from '../helpers/Error'

export default function LoginForm() {
  const navigate = useNavigate();

  const [passEye, setPassEye] = useState(true);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    auth: '',
  });
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [forgotPassword, setForgotPassword] = useState(false)

  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault();

    setErrors({ email: "", password: "", auth: "" });

    if(userInfo.email === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, email: 'Debes escribir correctamente tu email'} ))
    }

    if(userInfo.password === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, password: 'Debes escribir tu contraseña'} ))

    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userInfo.email,
      password: userInfo.password,
    });

    if (error) {
      setLoading()
      setErrors( (prevErrors) => ({...prevErrors, auth: 'Email o contraseña incorrectos'}))
      return setTimeout(() => {
        setErrors({ email: "", password: "", auth: "" });
      }, 2500);
    }

    setTimeout(() => {
      setLoading(false)
      navigate("/dashboard/general");
    }, 2000);

  }

  const sendResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const {data: dataSendEmail, error: errorSendEmail} = await supabase.auth.resetPasswordForEmail(userInfo.email, {
        // redirectTo: `${window.location.href}reset-password`
        redirectTo: 'https://rent-app.com.ar/reset-password'
      })

      if (errorSendEmail) throw new Error(errorSendEmail)
      if(dataSendEmail) {
        setLoading(false)
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 10000);
      }
    } catch (errorSendEmail) {
      console.error(errorSendEmail)
      setLoading(false)
    }
  }

  return (
    <form>
      {forgotPassword ? (
        <Card>
        <CardHeader>
          <CardTitle className="font-medium text-lg mt-2 text-center w-full">
            Dinos tu email para enviarte las instrucciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              className="md:text-lg text-sm w-4/5 mx-auto"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
            {errors.email && <Error errorMessage={errors.email} />}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-5 flex-col">
          <Button
            onClick={(e) => sendResetPassword(e)}
            className="w-fit px-5 md:text-lg text-sm mt-3"
          >
            {loading ? <Spinner/> : "Enviar Email"}
          </Button>
          {errors.auth && <Error errorMessage={errors.auth} />}
          {success && (
            <div className="w-full text-center">
              <p className="text-green-600 font-medium text-lg"> Email enviado correctamente, ¡revísalo! </p>
            </div>
          )}
        </CardFooter>
        <div className="w-full my-4  mx-auto text-center">
            <Button 
              variant='ghost' 
              className="border border-zinc-300 text-sky-700" 
              onClick={(e) => {e.preventDefault(), setForgotPassword(false)}}
            > 
              Regresar 
            </Button>  
        </div>
      </Card>
      ) 
      : (
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              className="md:text-lg text-md w-4/5 mx-auto"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
            {errors.email && <Error errorMessage={errors.email} />}
          </div>

          <div className="w-4/5 mx-auto relative">
            <Input
              type={passEye ? "password" : "text"}
              placeholder="Contraseña"
              name="password"
              autoComplete="new-password"
              className="pr-10 md:text-lg text-md"
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
          {errors.password && <Error errorMessage={errors.password} />}
        </CardContent>

        <CardFooter className="flex justify-center gap-5 flex-col">
          <Button
            onClick={(e) => handleLogin(e)}
            className="w-fit px-5 md:text-lg text-sm mt-3"
          >
            {loading ? <Spinner/> : "Iniciar Sesión"}
          </Button>
          {errors.auth && <Error errorMessage={errors.auth} />}
        </CardFooter>
        <div className="w-full my-4  mx-auto text-center">
          <p>¿Olvidaste tu contraseña? 
            <Button 
              variant='ghost' 
              className="border ml-3 border-zinc-300 text-sky-700" 
              onClick={(e) => {e.preventDefault(), setForgotPassword(true)}}
            > 
              Haz click aqui 
            </Button>  
          </p>
        </div>
      </Card>
      )
    }
      
    </form>
  );
}
