import type React from "react";
import styles from "./GroundPosition.module.css";
import { type ButtonHTMLAttributes } from "react";

type ButtonProps = {
    label:string;
    isOn:boolean;
    clickToggle:()=>void;
}&ButtonHTMLAttributes<HTMLButtonElement>

export const PositionToggleBtn : React.FC<ButtonProps> = ({
    label,
    isOn,
    clickToggle,
    style,
    ...rest
}) => {

    return (
        <button 
            type="button"
            aria-pressed={isOn}
            onClick={clickToggle}
            style={style}
            className={`${styles.btn} ${isOn?styles.isOn:""}`}>
            {label}
        </button>
    )
}