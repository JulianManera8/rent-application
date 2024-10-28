/* eslint-disable no-unused-vars */
import AddBalance from '../components/AddBalance'
import DashboardMoneyAll from "../components/dashboardMoneyAll";

export default function MoneyHistorial() {

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


  return (
    <div className="container mx-auto w-full mr-14 px-0 ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-gray-300 font-extrabold font-inter mb-10 mt-8">
          {" "}
          DASHBOARD - Balances Monetarios{" "}
        </h1>
        <AddBalance months={months}/>
      </div>
      <DashboardMoneyAll months={months}/>
    </div>
  );
}
