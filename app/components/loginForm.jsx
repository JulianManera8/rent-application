/* eslint-disable no-unused-vars */
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { BeatLoader } from "react-spinner";
// import pkg from 'react-spinner';
// const {BeatLoader} = pkg;
import { Eye, EyeOff } from "lucide-react";

import supabase from "../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function LoginForm() {

    const navigate = useNavigate()

    const [passEye, setPassEye] = useState(true)
    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState({
      email: '',
      password: '',
    })
    
    const handleLogin = async (e) => {
      e.preventDefault()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: userInfo.email,
        password: userInfo.password
      });

      if(error) {
        return console.error(error)
      }
      
      navigate('/dashboard/general')
    }

    return (
        <form>
          <Card>
            <CardHeader>
              <CardDescription>
                {/* {error && <Error errorMessage={error.message} />} */}
              </CardDescription>
            </CardHeader>
  
            <CardContent className="space-y-4">
              <div>
                <Input
                //   onChange={handleInputChange}
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="text-lg w-4/5 mx-auto"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo( { ...userInfo, email: e.target.value } )}

                />
                {/* {errors.email && <Error errorMessage={errors.email} />} */}
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
                  onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}
                />
                {passEye ? (
                  <Eye
                    className="absolute inset-y-0 my-auto right-3 text-gray-400 cursor-pointer"
                    onClick={() => setPassEye(!passEye)}
                  />
                ) : (
                  <EyeOff
                    className="absolute inset-y-0 my-auto right-3 text-gray-400 cursor-pointer"
                    onClick={() => setPassEye(!passEye)}
                  />
                )}
  
                {/* {errors.password && <Error errorMessage={errors.password} />} */}
              </div>
            </CardContent>
  
            <CardFooter className="flex justify-center gap-5 flex-col">
              <Button onClick={(e) => handleLogin(e)} className="w-fit px-5 text-lg mt-3">
                {/* {loading ? <BeatLoader size={10} color="teal" /> : "Login"} */}
                Login
              </Button>
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