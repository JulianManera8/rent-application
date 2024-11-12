import { NavLink } from "@remix-run/react"
import { Button } from "../ui/button"
import { ShieldAlert } from 'lucide-react'

export default function Component() {
  return (
    <div className="min-h-screen flex items-start mt-[10%] justify-center ">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-xl rounded-lg">
        <div className="text-center">
          <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Unauthorized Access</h2>
          <p className="mt-2 text-sm text-gray-600">
            This page requires authentication.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-sm text-center">
            <p className="font-medium text-indigo-600">
              Please log in to access this page and enjoy all the features of our application.
            </p>
          </div>
          <div className="flex justify-center">
            <NavLink to="/">
              <Button className="w-full sm:w-auto">
                Go to Login
              </Button>
            </NavLink>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}