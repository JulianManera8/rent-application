/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {Card,CardContent,CardDescription,CardFooter,CardHeader, CardTitle} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import supabase from "../../lib/supabase";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import Spinner from '../helpers/loaderIcon'
import Error from '../helpers/Error'
import ValidatePassword from "./validatePassword";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)

    const [passEye, setPassEye] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
      password: '',
      confirmPassword: '',
      auth: '',
    });
    
    const [userInfo, setUserInfo] = useState({
      password: "",
      confirmPassword: "",
    });
  
    const handleChangePassword = async (e) => {
      e.preventDefault();
      setLoading(true)
  
      setErrors({password: "", confirmPassword: '', auth: "" });
  
      if(userInfo.password === "") {
        setLoading(false) 
        return setErrors((prevErrors)=> ({...prevErrors, password: 'La contraseña debe cumplir con los requisitos de seguridad'} ))
      }

      if(userInfo.confirmPassword === "") {
        setLoading(false) 
        return setErrors((prevErrors)=> ({...prevErrors, confirmPassword: 'Debes completar correctamente la contraseña nuevamente'} ))
      }
  
      if (userInfo.password !== userInfo.confirmPassword) {
        setLoading(false)
        return setErrors((prevErrors)=> ({...prevErrors, confirmPassword: 'Las contraseñas no coinciden'} ))
      }
  
      const { data, error } = await supabase.auth.updateUser({
        password: userInfo.password
      })
  
      if (error) {
        setLoading(false)  
        return setErrors((prevErrors)=> ({...prevErrors, auth: error.message} ))
      }
  
      setTimeout(() => {
        setLoading(false)
        setSuccess(true)
        setTimeout(() => {
            navigate("/");
        }, 3000);
      }, 2000);
    };

  return (
    <form className="w-full">
      <Card>
        <CardHeader>
            <CardTitle className="text-center"> Crea una nueva contraseña </CardTitle>
            <CardDescription className="sr-only"> Las 2 tienen que coincidir </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <div className="relative">
            <Input
              type={passEye ? "password" : "text"}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              className="md:text-lg text-md text-sm w-4/5 mx-auto"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
            {passEye ? (
              <Eye
                className="absolute inset-y-0 my-auto right-0 pl-0.5 sm:pl-0 text-gray-400 cursor-pointer"
                onClick={() => setPassEye(!passEye)}
              />
            ) : (
              <EyeOff
                className="absolute inset-y-0 my-auto right-0 pl-0.5 sm:pl-0 text-gray-400 cursor-pointer"
                onClick={() => setPassEye(!passEye)}
              />
            )}
        </div>
        <div className="w-4/5 mx-auto">
          <ValidatePassword password={userInfo.password}/>
        </div>
          

        <div className="relative">
            <Input
              type={passEye ? "password" : "text"}
              name="password"
              placeholder="Confirm password"
              autoComplete="current-password"
              className="md:text-lg text-md text-sm w-4/5 mx-auto"
              value={userInfo.confirmPassword}
              onChange={(e) =>
                setUserInfo({ ...userInfo, confirmPassword: e.target.value })
              }
            />
            {passEye ? (
              <Eye
                className="absolute inset-y-0 my-auto right-0 pl-0.5 sm:pl-0 text-gray-400 cursor-pointer"
                onClick={() => setPassEye(!passEye)}
              />
            ) : (
              <EyeOff
                className="absolute inset-y-0 my-auto right-0 pl-0.5 sm:pl-0 text-gray-400 cursor-pointer"
                onClick={() => setPassEye(!passEye)}
              />
            )}
        </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-5 flex-col">
          <Button
            onClick={(e) => handleChangePassword(e)}
            className="w-fit px-5 md:text-lg text-sm mt-3"
          >
            {loading ? <Spinner/> : "Confirmar"}
          </Button>
          {errors.confirmPassword && <Error errorMessage={errors.confirmPassword} />}
          {errors.password && <Error errorMessage={errors.password} />}
          {errors.auth && <Error errorMessage={errors.auth} />}

          {success && (
            <div className="w-full text-center">
              <p className="text-green-600 font-medium text-lg"> Contraseña actualizada, ya puedes iniciar sesión </p>
            </div>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
