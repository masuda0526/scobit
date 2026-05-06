import type { ErrorInfo } from "@scobit/types";
import { createContext, useContext, useState, type ReactNode } from "react";

type ErrorAreaContextType = {
  errors: ErrorInfo[];
  reset: () => void;
  isError: () => boolean;
  setErrors: (errors:ErrorInfo[]) => void;
  addError: (error:ErrorInfo) => void;
  hasError: (attribute:string) => boolean;
}

const ErrorAreaContext = createContext<ErrorAreaContextType | undefined>(undefined);

export const ErrorAreaProvider = ({children}:{children:ReactNode}) => {
  const [errors, setErrorInfos] = useState<ErrorInfo[]>([]);

  const reset = () => {setErrorInfos([])};
  const isError = () => {
    return errors.length !== 0;
  }
  const setErrors = (errorInfos:ErrorInfo[]) => {
    setErrorInfos(prev => [...prev, ...errorInfos]);
  }
  const addError = (errorInfo:ErrorInfo) => {
    setErrorInfos(prev => [...prev, errorInfo]);
  }
  const hasError = (attribute:string) => {
    const err = errors.find(e => e.field === attribute);
    if(err){
      return true;
    }
    return false;
  }
  return (
    <ErrorAreaContext.Provider value = {{errors, reset, isError, setErrors, addError, hasError}} >
      {children}
    </ErrorAreaContext.Provider>
  )

}

export const useErrorArea = () => {
  const ctx = useContext(ErrorAreaContext);
  if(!ctx) throw new Error('ErrorAreaProviderで囲ってください。');
  return ctx;
}