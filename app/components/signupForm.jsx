/* eslint-disable no-unused-vars */
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Spinner from '../components/loaderIcon'
import { Eye, EyeOff } from "lucide-react";
import Error from '../components/Error'
import supabase from "../lib/supabase";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function SignupForm() {

  const navigate = useNavigate();

  const [passEye, setPassEye] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    auth: '',
  });
  
  const [userInfo, setUserInfo] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true)

    setErrors({ name: '', lastname: '', email: "", password: "", confirmPassword: '', auth: "" });


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

    if(userInfo.password === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, password: 'Debes completar correctamente la contraseña'} ))
    }

    if(userInfo.confirmPassword === "") {
      setLoading(false) 
      return setErrors((prevErrors)=> ({...prevErrors, confirmPassword: 'Debes completar correctamente la contraseña nuevamente'} ))
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      setLoading(false)
      return setErrors((prevErrors)=> ({...prevErrors, confirmPassword: 'Las contraseñas no coinciden'} ))
    }

    const { data, error } = await supabase.auth.signUp({
      email: userInfo.email,
      password: userInfo.password,
      options: {
        data: {
          name: userInfo.name,
          lastname: userInfo.lastname,
        },
      },
    });

    if (error) {
      setLoading(false)  
      return setErrors((prevErrors)=> ({...prevErrors, auth: error.message} ))
    }

    setTimeout(() => {
      setLoading(false)
      navigate("/dashboard/general");
    }, 2000);
  };

  return (
    <form>
      <Card>
        <CardHeader>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <Input
              //   onChange={handleInputChange}
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="name"
              className="text-lg w-4/5 mx-auto"
              value={userInfo.name}
              onChange={(e) =>
                setUserInfo({ ...userInfo, name: e.target.value })
              }
            />
            {errors.name && <Error errorMessage={errors.name} />}
            </div>
          <div>
            <Input
              //   onChange={handleInputChange}
              type="text"
              name="lastname"
              placeholder="Lastname"
              autoComplete="lastname"
              className="text-lg w-4/5 mx-auto"
              value={userInfo.lastname}
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastname: e.target.value })
              }
            />
            {errors.lastname && <Error errorMessage={errors.lastname} />}
            </div>

          <div>
            <Input
              //   onChange={handleInputChange}
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
              //   onChange={handleInputChange}
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

          <div className="relative">
            <Input
              //   onChange={handleInputChange}
              type={passEye ? "password" : "text"}
              name="password"
              placeholder="Confirm password"
              autoComplete="current-password"
              className="text-lg w-4/5 mx-auto"
              value={userInfo.confirmPassword}
              onChange={(e) =>
                setUserInfo({ ...userInfo, confirmPassword: e.target.value })
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
          {errors.confirmPassword && <Error errorMessage={errors.confirmPassword} />}

        </CardContent>

        <CardFooter className="flex justify-center gap-5 flex-col">
          <Button onClick={handleSignup} className="w-fit px-5 text-lg mt-3">
            {loading ? <Spinner/> : "Create"}
          </Button>

          {errors.auth && <Error errorMessage={errors.auth} />}

        </CardFooter>
      </Card>
    </form>
  );
}

export async function loader() {

    const {data} = await supabase.auth.getUser();
    console.log(data)
    return data
}