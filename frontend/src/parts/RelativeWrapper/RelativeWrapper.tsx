import type { CSSProperties } from "react";
import type React from "react";


export const RelativeWrapper : React.FC<{children:React.ReactNode}> = ({children}) => {
  return (
    <div style={css}>
      {children}
    </div>
  )
}

const css:CSSProperties = {
  position:'relative'
}