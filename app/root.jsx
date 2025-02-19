import { useEffect } from "react";
/* eslint-disable react/prop-types */
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import "@fontsource/roboto";  // Importa el archivo CSS de la fuente en todo el proyecto




export const meta = () => {
  return [
    { title: "RentApp" }
  ];
};



export function Layout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" /> 
        <Meta />
        <Links />
      </head>
      <body>

          {children}
          <ScrollRestoration />
          <Scripts />

      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registrado"))
        .catch((err) => console.error("Error registrando el Service Worker", err));
    }
  }, []);
  return <Outlet />;
}

