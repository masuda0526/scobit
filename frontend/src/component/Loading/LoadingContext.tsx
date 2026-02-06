import { createContext, useContext, useState, type ReactNode } from "react";

type LoadingContextType = {
    isLoading: boolean;
    message: string;
    startLoading: (msg?:string) => void;
    stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({children}:{children:ReactNode}) => {
    const DEFAULT_MESSAGE = "Loading..."
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(DEFAULT_MESSAGE);

    const startLoading = (msg?:string) => {
        if(msg){
            setMessage(msg);
        }
        setIsLoading(true);
    }
    const stopLoading = ()=> {
        setMessage(DEFAULT_MESSAGE)
        setIsLoading(false);
    }
    return (
        <LoadingContext.Provider value={{isLoading, message, startLoading, stopLoading}}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const ctx = useContext(LoadingContext);
    if(!ctx) throw new Error('LoadingProviderで囲ってください');
    return ctx;
}