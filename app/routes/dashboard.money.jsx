/* eslint-disable no-unused-vars */
import { useState } from 'react';
import AddBalance from '../components/balances/AddBalance'
import DashboardMoneyAll from "../components/balances/dashboardMoneyAll";
import DashboardMoneyShared from "../components/balances/dashboardMoneyShared";
import { Separator } from '../components/ui/separator';

export default function MoneyHistorial() {
  const [ balanceCreated, setBalanceCreated ] = useState()

  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="flex flex-col w-full mr-14 px-0 md:px-3">
      <div className="flex md:justify-between justify-center items-center">
        <h1 className='sm:text-3xl text-lg text-gray-300 font-medium font-inter md:mt-8 mt-0 mx-0 mb-2'>
          DASHBOARD - <span className='text-[#0c426bd3]'> Balances </span>{" "}  
        </h1>
      </div>
      <Separator />
      <div className='flex md:justify-between justify-center gap-y-3 gap-x-6 items-center flex-wrap mt-10'>
        <h1 className="sm:text-3xl text-2xl font-medium text-[#194567] flex justify-between">
          Mis Balances
        </h1>
        <AddBalance months={months} setBalanceCreated={setBalanceCreated}/>
      </div>
      
      <DashboardMoneyAll months={months} balanceCreated={balanceCreated}/>

      <h1 className="text-3xl font-medium text-[#176c2b] flex justify-between">
        Balances de grupos compartidos
      </h1>
      <DashboardMoneyShared months={months} balanceCreated={balanceCreated}/>
    </div>
  );
}
