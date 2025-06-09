"use client";

import { authClient } from "@/lib/auth-client";
import { Cake, LogOut } from "lucide-react";
import CarritoSheet from "./carrito-sheet";
import { Button } from "./ui/button";

const { data } = await authClient.getSession();

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
            <Cake className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
            Postre Express
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="relative p-2"
            onClick={() => {
              window.location.href = "/favoritos";
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <CarritoSheet />
          {data?.user && (
            <Button
              className="flex items-center space-x-2"
              onClick={async () => {
                await authClient.signOut();
                window.location.href = "/";
              }}
            >
              <LogOut /> Cerrar sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
