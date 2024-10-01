import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import LoginForm from "../components/loginForm";
import SignupForm from "../components/signupForm";

export default function AuthPage() {
    return (
        <div className="mt-8 flex flex-col  items-center gap-10 px-4  max-w-[400px] mx-auto">
            
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Login</TabsTrigger>
              <TabsTrigger value="signip">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signip">
              <SignupForm />
            </TabsContent>
          </Tabs>
      
        </div>
      );
}
