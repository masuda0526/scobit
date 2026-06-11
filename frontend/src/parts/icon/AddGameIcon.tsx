import { faBaseballBatBall, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, type CSSVariables } from "@fortawesome/react-fontawesome";
import type { ButtonHTMLAttributes, CSSProperties } from "react";
import type React from "react";



export const AddGameIcon:React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (prop) => {
  return(
    <button {...prop} style={topIcon}>
      <FontAwesomeIcon icon={faBaseballBatBall} style={bat}/>
      <FontAwesomeIcon icon={faCirclePlus} style={plus}/>
    </button>
  )
}

const topIcon:CSSProperties = {
  position:'relative',
}
const bat:CSSProperties & CSSVariables = {
  position:'absolute',
  fontSize:'25px',
}
const plus:CSSProperties & CSSVariables = {
  position:'absolute',
  
}
