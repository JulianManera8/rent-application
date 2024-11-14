import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

import { AlertCircle, DollarSign, Home, TrendingUp, Users } from 'lucide-react'


export default function SectionGrupos() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
            </Card>
        </div>
    )
}