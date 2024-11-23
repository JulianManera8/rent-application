import ResetPassword from '../components/auth/resetPassword'

  
  export const meta = () => {
    return [{ title: "RentApp" }];
  };
  
  export default function Index() {
    return (
      <div className="font-sans flex md:flex-row flex-col items-center justify-evenly bg-slate-100 min-h-screen">
        <section className="md:w-1/2 w-full md:h-screen mt-8 flex items-center justify-center relative">
          <div className="md:absolute top-[10%] md:top-[15%] flex flex-col text-center items-center md:space-y-7 space-y-3 ">
            <img
              src="/logo.png"
              alt="Logo"
              className="md:w-32 w-24 shadow-xl border rounded-full mb-5 hover:shadow-2xl transition-all"
            />
            <h1 className="text-3xl md:text-5xl font-bold">Welcome to RentApp</h1>
            <p className="text-lg md:text-2xl">Reset your password</p>
          </div>
        </section>
  
        <section className="flex flex-1 w-full md:w-[600px] h-[50vh] md:h-screen items-center justify-center relative">
          <div className="flex flex-col items-start gap-10 mx-auto w-[90%] md:w-[65%] md:absolute md:top-[12%] mb-24 mt-12">
            <ResetPassword />
          </div>
        </section>
      </div>
    );
  }
  