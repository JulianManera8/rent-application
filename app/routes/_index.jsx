import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import SignupForm from "../components/auth/signupForm";
import LoginForm from "../components/auth/loginForm";
import { NavLink } from "react-router-dom";

export const meta = () => {
  return [{ title: "RentApp" }];
};

export default function Index() {

  return (
    <div className="font-sans flex md:flex-row flex-col md:mt-0 items-center justify-evenly bg-slate-100 min-h-screen">
      <section className="md:w-1/2 w-full  md:mt-0 mt-6 md:h-screen flex items-center justify-center relative">
        <div className="md:absolute top-[8%] md:top-[11%] flex flex-col text-center items-center md:space-y-7 space-y-3 ">
          <NavLink to='/'>
          <img
            src="/logo.png"
            alt="Logo"
            className="md:w-32 w-24 shadow-xl border rounded-full mb-5 hover:shadow-2xl transition-all"
          />
          </NavLink>
          <h1 className="text-3xl md:text-5xl font-bold">RentApp</h1>
          <p className="text-lg md:text-2xl">Gestión eficiente y sencilla de propiedades en alquiler.</p>
        </div>
      </section>

      <section className="flex flex-1 w-full md:w-[600px] h-[50vh] md:h-screen items-center justify-center relative">
        <div className="flex flex-col items-start gap-10 mx-auto w-[90%] md:w-[65%] md:absolute md:top-[8%] mb-24 mt-8">
          <Tabs defaultValue="account" className="w-full shadow-2xl bg-transparent border border-gray-300 rounded-md">
            <TabsList className="grid grid-cols-2 w-full h-16 md:h-20 bg-[#003156]">
              <TabsTrigger value="account" className="h-[75%] text-lg md:text-xl w-[95%] mx-auto font-bold text-gray-300">
                Iniciar sesión
              </TabsTrigger>
              <TabsTrigger value="signip" className="h-[75%] text-lg md:text-xl w-[95%] mx-auto font-bold text-gray-300">
                Crear Cuenta
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signip">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
