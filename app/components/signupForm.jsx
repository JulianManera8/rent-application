/* eslint-disable no-unused-vars */
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { BeatLoader } from "react-spinner";
import { Eye, EyeOff } from "lucide-react";

import supabase from "../lib/supabase";
import { useState } from "react";
import { useNavigate } from "@remix-run/react";

export default function SignupForm() {

    const navigate = useNavigate()

    const [passEye, setPassEye] = useState(true)
    const [loading, setLoading] = useState(false)
    const [userInfo, setUserInfo] = useState({
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const handleSignup = async (e) => {
      e.preventDefault()

      if(userInfo.name === '' || userInfo.lastname === '' || userInfo.email === '' || userInfo.password === '' || userInfo.confirmPassword === '') return console.error('completa todo')

      if(userInfo.password !== userInfo.confirmPassword) return console.error('contraseñas no coinciden')  
        
      const { data, error } = await supabase.auth.signUp({
        email: userInfo.email,
        password: userInfo.password,
        options: {
          data: {
            name: userInfo.name,
            lastname: userInfo.lastname
          },
        }
      })

      if(error) return console.error(error)
      
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
  
            <CardContent className="space-y-5">
              <div>
                <Input
                //   onChange={handleInputChange}
                  type="text"
                  name="name"
                  placeholder="Name"
                  autoComplete="email"
                  className="text-lg w-4/5 mx-auto"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                />
                {/* {errors.email && <Error errorMessage={errors.email} />} */}
              </div>
              <div>
                <Input
                //   onChange={handleInputChange}
                  type="text"
                  name="lastname"
                  placeholder="Lastname"
                  autoComplete="email"
                  className="text-lg w-4/5 mx-auto"
                  value={userInfo.lastname}
                  onChange={(e) => setUserInfo({...userInfo, lastname: e.target.value})}
                />
                {/* {errors.email && <Error errorMessage={errors.email} />} */}
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
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
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
              <div className="relative">
                <Input
                //   onChange={handleInputChange}
                  type={passEye ? "password" : "text"}
                  name="password"
                  placeholder="Confirm password"
                  autoComplete="current-password"
                  className="text-lg w-4/5 mx-auto"
                  value={userInfo.confirmPassword}
                  onChange={(e) => setUserInfo({...userInfo, confirmPassword: e.target.value})}
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

              <Button onClick={handleSignup} className="w-fit px-5 text-lg mt-3">
                {/* {loading ? <BeatLoader size={10} color="teal" /> : "Login"} */}
                Create account
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