import type React from "react";

export const AdminWrapper : React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <>
      {children}
    </>
  )
}