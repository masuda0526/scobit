import type React from "react";
import styles from "./Loading.module.css"
import { useLoading } from "./LoadingContext";

export const Loading: React.FC = () => {
    const loadingState = useLoading();
    const isLoading = loadingState.isLoading;
    return (
        <>
            {isLoading ? (
                <div className={styles.loading}>
                    <div className={styles.inner}>
                        <div className={styles.spinner}></div>
                        <div className={styles.message}>
                            {loadingState.message}
                        </div>
                    </div>
                </div>
            ) : ''}
        </>
    )
}