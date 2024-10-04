/* eslint-disable no-unused-vars */
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { BeatLoader } from "react-spinner";
// import pkg from 'react-spinner';
// const {BeatLoader} = pkg;
import { Eye, EyeOff } from "lucide-react";
// import { FaGithub } from "react-icons/fa";
// import { FcGoogle } from "react-icons/fc";

import supabase from "../lib/supabase";
import { useState } from "react";

export default function LoginForm() {

    const [passEye, setPassEye] = useState(true)
    const [loading, setLoading] = useState(false)
    
    const handleLogin = (e) => {
      e.preventDefault()

    }

    return (
        <form>
          <Card>
            <CardHeader>
              {/* <CardTitle className="text-center">Login</CardTitle> */}
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
              <Button onClick={handleLogin} className="w-fit px-5 text-lg mt-3">
                {/* {loading ? <BeatLoader size={10} color="teal" /> : "Login"} */}
                Login
              </Button>
  
              {/* <span className="mt-3"> Or if you prefer, you can also login with:</span> */}
  
              <div className="space-x-7">
  
                {/* <Button onClick={handleLoginGoogle}>
                  <FcGoogle className="mr-2 h-4 w-4" /> Google
                </Button> */}
  
                {/* <Button onClick={handleLoginGithub}>
                  <FaGithub className="mr-2 h-4 w-4" /> Github
                </Button> */}

              </div>
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