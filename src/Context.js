/* eslint-disable no-unused-vars */
import { createContext, useContext, useRef, useState } from "react";

const ServiceContext = createContext();

export const useService = () => useContext(ServiceContext);

export const ServiceProvider = ({ children }) => {

    const printElem = useRef();

    const [services, setServices] = useState([
        {
            id: "",
            name: "",
            price: 0,
        },
    ]);


    const value = { services, setServices, printElem };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    )
}