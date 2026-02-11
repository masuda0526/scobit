import type React from "react";
import styles from "./Input.module.css"
import { useState } from "react";

type WidthProps = "w100"|"w50"|"w30";

type InputProps = {
    label:string
    isEditMode:boolean
    w?:WidthProps
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input : React.FC <InputProps> = ({
    isEditMode = false,
    w = "w100",
    ...props
}) => {

    const [val, setVal] = useState(props.value);
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(isEditMode){
            setVal(e.target.value);
        }
    }


    return (
        <label className={styles.label}>
            <p className={styles.labelText}>
                {props.label}
            </p>
            <input 
                className={`${styles.input} ${styles[w]}`}
                disabled={!isEditMode}
                value={val}
                onChange={handleChange}
            />
        </label>
    )
}