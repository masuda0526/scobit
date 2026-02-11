import type React from "react";
import styles from "./subtitle.module.css"

export const SubTitle : React.FC<{text:string}> = ({text}) => {
    return (
        <h2 className={styles.subtitle}>{text}</h2>
    )
} 
