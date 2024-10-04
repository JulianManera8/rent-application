import { Link } from "@remix-run/react";
import { Button } from "../components/ui/button";

export default function Sidebar() {
    return (
        <div className="flex flex-col w-1/5 space-y-4">
            <Button><Link to="/dashboard"> Ir a dashboard </Link></Button>

            <Button><Link to="/dashboard/deptos"> Ir a dashboard.deptos </Link></Button>

            <Button><Link to="/dashboard/money"> Ir a dashboard.money </Link></Button>
        </div>
    )
}