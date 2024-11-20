/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { useUser } from "../../hooks/use-user";
import { useEffect, useState } from "react";
import { getAllUser } from "../../database/crudUsers";
import { Skeleton } from "../ui/skeleton";
import useFetch from "../../hooks/use-fetch";
import { X, Search } from 'lucide-react';
import { Input } from "../ui/input";

export default function HandleUsers({ onSelectUserChange }) {
  const userLoged_id = useUser();
  const [usersInfo, setUsersInfo] = useState([]);
  const [usersSelected, setUsersSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { loading, data, error, fn: fnGetAllUsers } = useFetch(getAllUser, {});

  useEffect(() => {
    if (userLoged_id) {
      fnGetAllUsers();
    }
  }, [userLoged_id]);

  useEffect(() => {
    if (data) {
      setUsersInfo(
        data.map((user) => ({
          user_id: user.id,
          user_name: user.user_name,
          user_lastname: user.user_lastname,
          user_dni: user.user_dni,
        }))
      );
    }
  }, [data, error]);

  const handleSelectChange = (value) => {
    const selectedUser = usersInfo.find((user) => user.user_id === value);

    if (!usersSelected.some((user) => user.user_id === value)) {
      const updatedSelection = [...usersSelected, selectedUser];
      setUsersSelected(updatedSelection);

      if (onSelectUserChange) {
        onSelectUserChange(updatedSelection);
      }
    }
    setSearchTerm("");
  };

  const handleRemoveUser = (userId) => {
    const updatedSelection = usersSelected.filter((user) => user.user_id !== userId);
    setUsersSelected(updatedSelection);

    if (onSelectUserChange) {
      onSelectUserChange(updatedSelection);
    }
  };

  const filteredUsers = usersInfo.filter(
    (user) =>
      user.user_id !== userLoged_id &&
      (user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_dni.includes(searchTerm))
  );

  return (
    <div className="min-w-full space-y-2 mt-1">
      <Label htmlFor="mesBalance" className="font-bold text-md">
        Asignar acceso (opcional)
      </Label>

      <Select onOpenChange={(open) => setIsOpen(open)} onValueChange={handleSelectChange} open={isOpen}>
        <SelectTrigger className="w-full pl-1">
          <SelectValue placeholder="Elegir Usuarios" />
        </SelectTrigger>

        <SelectContent>
          <div className="flex items-center border-b px-3 pb-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Buscar usuarios..."
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading ? (
            <>
              <Skeleton className="w-2/4 h-5 ml-4 my-3 bg-gray-200" />
              <Skeleton className="w-2/4 h-5 ml-4 mb-2 bg-gray-200" />
            </>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <SelectItem
                key={user.user_id}
                value={user.user_id}
                className="flex items-center w-full"
              >
                <p className="overflow-hidden text-ellipsis whitespace-nowrap pl-1 text-md">
                  {user.user_name + " " + user.user_lastname} - {user.user_dni}{" "}
                  <small>(D.N.I.)</small>
                </p>
              </SelectItem>
            ))
          ) : (
            <p className="my-2 ml-2">No se encontraron usuarios.</p>
          )}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2 mt-2">
        {usersSelected.map((user) => (
          <div
            key={user.user_id}
            className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full shadow-sm"
          >
            <span className="text-sm font-medium">
              {user.user_name} {user.user_lastname}
            </span>
            <button
              onClick={() => handleRemoveUser(user.user_id)}
              className="ml-2 text-gray-500 hover:text-gray-800"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}