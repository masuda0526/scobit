import type React from "react";
import styles from "./Input.module.css"
import { useErrorArea } from "../../component/ErrorArea/ErrorAreaContext";

type WidthProps = "w100"|"w50"|"w30";

type InputProps = {
    label:string;
    attr:string;
    isEditMode?:boolean;
    w?:WidthProps;
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input : React.FC <InputProps> = ({
    isEditMode = true,
    w = "w100",
    ...props
}) => {
    const errorCtx = useErrorArea();

    return (
        <label className={styles.label}>
            <p className={styles.labelText}>
                {props.label}
            </p>
            <input 
                {...props}
                className={`${styles.input} ${styles[w]} ${errorCtx.hasError(props.attr)?styles.isError:''}` }
                disabled={!isEditMode}
                value={props.value}
            />
        </label>
    )
}