/* eslint-disable no-unused-vars */
import { Outlet } from "@remix-run/react";
import Sidebar from "../components/Sidebar";

export default function DashboardIndexPage() {
  return (
    <div className="flex font-inter">
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="ml-[280px] flex flex-1">
        <Outlet />
      </div>
    </div>
  );
}
