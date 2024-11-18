/* eslint-disable no-unused-vars */
import { useState } from 'react';
import AddBalance from '../components/balances/AddBalance'
import DashboardMoneyAll from "../components/balances/dashboardMoneyAll";

export default function MoneyHistorial() {
  const [ balanceCreated, setBalanceCreated ] = useState()

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="container mx-auto w-full mr-14 px-0 ">
      <div className="flex md:justify-between justify-center items-center">
        <h1 className='sm:text-3xl text-lg text-gray-300 font-medium font-inter mt-8 mx-0 mb-10'>
          DASHBOARD - <span className='text-[#0c426bd3]'> Balances </span>{" "}  
        </h1>
      </div>

      <div className='flex md:justify-between justify-center gap-y-3 gap-x-6 items-center flex-wrap'>
        <h1 className="text-3xl font-medium text-[#194567] flex justify-between">
          Todos los Balances
        </h1>
        <AddBalance months={months} setBalanceCreated={setBalanceCreated}/>
      </div>
      
      <DashboardMoneyAll months={months} balanceCreated={balanceCreated}/>
    </div>
  );
}
