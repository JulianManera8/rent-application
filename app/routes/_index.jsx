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
    <div className="font-sans flex items-center justify-evenly relative bg-slate-100">
      <section className="w-1/2 h-screen  relative">
        <div className="absolute w-full top-[15%] flex flex-col text-center items-center space-y-7">
          <img src="/logo.png" alt="" className="w-32 shadow-xl border rounded-full mb-5 hover:shadow-2xl transition-all"/>     
          <h1 className="text-5xl font-bold">Welcome to RentApp</h1>
          <p className="text-2xl">Login to your account, or create one.</p>
        </div>
      </section>

      <section className="flex flex-1 w-[600px] relative h-screen">
          <div className="flex flex-col items-start gap-10 mx-auto absolute w-full top-[15%] rounded-xl">
            <Tabs defaultValue="account" className="w-[65%] shadow-2xl bg-transparent border border-gray-300 rounded-md">
              <TabsList className="grid grid-cols-2 w-full h-20 bg-[#003156]">
                <TabsTrigger value="account" className="h-[75%] text-xl w-[95%] mx-auto font-bold text-gray-300"> Login </TabsTrigger>
                <TabsTrigger value="signip" className="h-[75%] text-xl w-[95%] mx-auto font-bold text-gray-300"> Create Account </TabsTrigger>
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
