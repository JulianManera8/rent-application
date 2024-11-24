/* eslint-disable no-unused-vars */
import { useState } from "react";

//cb es la funcion que se va a pasar dentro del useFetch() cuando sea invocado
//en options se pasa algun parametro adicional (Es opcional)

//fn es la funcion asincrona que va a hacer la llamada a la api d lo q sea
// esta fn ejecuta la funcion que le pasemos en el cb


export default function useFetch(cb, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const fn = async (...args) => {
        setLoading(true);
        setError(null); // Reinicia el estado de error al comienzo de la solicitud

        try {
            const response = await cb(options, ...args);
            setData(response);
        } catch (err) {
            setError(err); // Captura cualquier error que ocurra en cb
        } finally {
            setLoading(false); // Cambia el estado de carga después de la solicitud
        }
    };

    return { data, loading, error, fn };
}