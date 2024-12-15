/* eslint-disable react/prop-types */
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"

export default function FilterComponent({ onFilterChange }) {
  const handleFilterChange = (value) => {
    onFilterChange(value);
  }

  return (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="status">Estado</Label>
              <Select onValueChange={handleFilterChange} defaultValue="all">
                <SelectTrigger className="col-span-2 h-8">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="no_vencido">No Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
  )
}
