/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
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
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault();

    setErrors({ email: "", password: "", auth: "" });

    if(userInfo.email === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, email: 'Debes completar correctamente el email'} ))
    }

    if(userInfo.password === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, password: 'Debes completar correctamente la contraseña'} ))
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userInfo.email,
      password: userInfo.password,
    });

    if (error) {
      setLoading()
      return setErrors( (prevErrors) => ({...prevErrors, auth: error.message}))
    }

    setTimeout(() => {
      setLoading(false)
      navigate("/dashboard/general");
    }, 2000);

  }

  return (
    <form>
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
              className="text-lg w-4/5 mx-auto"
              value={userInfo.email}
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
            />
            {errors.email && <Error errorMessage={errors.email} />}
          </div>

          <div className="relative">
            <Input
              type={passEye ? "password" : "text"}
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              className="text-lg w-4/5 mx-auto"
              value={userInfo.password}
              onChange={(e) =>
                setUserInfo({ ...userInfo, password: e.target.value })
              }
            />
            {passEye ? (
              <Eye
                className="absolute inset-y-0 my-auto right-1 md:right-3 text-gray-400 cursor-pointer"
                onClick={() => setPassEye(!passEye)}
              />
            ) : (
              <EyeOff
                className="absolute inset-y-0 my-auto right-1 md:right-3 text-gray-400 cursor-pointer"
                onClick={() => setPassEye(!passEye)}
              />
            )}
          </div>
          {errors.password && <Error errorMessage={errors.password} />}
        </CardContent>

        <CardFooter className="flex justify-center gap-5 flex-col">
          <Button
            onClick={(e) => handleLogin(e)}
            className="w-fit px-5 text-lg mt-3"
          >
            {loading ? <Spinner/> : "Login"}
          </Button>
          {errors.auth && <Error errorMessage={errors.auth} />}
        </CardFooter>
      </Card>
    </form>
  );
}
