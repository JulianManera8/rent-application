import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import SignupForm from "../components/signupForm";
import LoginForm from "../components/loginForm";

export const meta = () => {
  return [{ title: "RentApp" }];
};

export default function Index() {
  return (
    <div className="font-sans flex md:flex-row flex-col items-center justify-evenly bg-slate-100 min-h-screen">
      <section className="md:w-1/2 w-full h-[30vh] md:h-screen flex items-center justify-center relative">
        <div className="absolute top-[10%] md:top-[15%] flex flex-col text-center items-center space-y-7">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-32 shadow-xl border rounded-full mb-5 hover:shadow-2xl transition-all"
          />
          <h1 className="text-3xl md:text-5xl font-bold">Welcome to RentApp</h1>
          <p className="text-lg md:text-2xl">Login to your account, or create one.</p>
        </div>
      </section>

      <section className="flex flex-1 w-full md:w-[600px] h-[50vh] md:h-screen items-center justify-center relative">
        <div className="flex flex-col items-start gap-10 mx-auto w-[90%] md:w-[65%] absolute top-[10%] md:top-[15%]">
          <Tabs defaultValue="account" className="w-full shadow-2xl bg-transparent border border-gray-300 rounded-md">
            <TabsList className="grid grid-cols-2 w-full h-16 md:h-20 bg-[#003156]">
              <TabsTrigger value="account" className="h-[75%] text-lg md:text-xl w-[95%] mx-auto font-bold text-gray-300">
                Login
              </TabsTrigger>
              <TabsTrigger value="signip" className="h-[75%] text-lg md:text-xl w-[95%] mx-auto font-bold text-gray-300">
                Create Account
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
