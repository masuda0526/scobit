import type React from "react";
import styles from "./Loading.module.css"

export const Loading: React.FC = () => {
    const isShow = true;
    return (
        <>
            {isShow ? (
                <div className={styles.loading}>
                    <div className={styles.inner}>
                        <div className={styles.spinner}></div>
                        <div>
                            Loading...
                        </div>
                    </div>
                </div>
            ) : ''}
        </>
    )
}