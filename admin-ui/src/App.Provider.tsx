import React, {createContext, useEffect, useState} from "react";
import {ToastProps} from "./elements/toast";

interface IAppContext {
    notifications: ToastProps[];
    showNotification: (toast: ToastProps) => void;
    clearNotifications: () => void,
}

const AppContext = createContext<IAppContext>({
    notifications: [],
    showNotification: () => {},
    clearNotifications: () => {},
});

const AppProvider: React.FC = ({children}) => {
    const [notifications, setNotifications] = useState<ToastProps[]>([]);

    const clearNotifications = () => {
        setNotifications([]);
    }

    const showNotification = (toast: ToastProps) => {
        setNotifications([...notifications, toast]);
    };

    // useEffect(() => {
    //     setNotifications([
    //         {body: <p>A</p>, heading: "Heading", type: "info", onExpire: clearNotifications},
    //     ]);
    // }, [])

    return (
        <AppContext.Provider value={{notifications, showNotification, clearNotifications}}>
            {children}
        </AppContext.Provider>
    );
};

export {AppProvider, AppContext};
