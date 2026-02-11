import type React from "react";
import styles from "./contentBox.module.css"

export const ContentBox : React.FC <{children:React.ReactNode}> = ({children}) => {
    return (
        <div className={styles.content}>
            {children}
        </div>
    )
}