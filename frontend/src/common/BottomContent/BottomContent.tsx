import type React from "react";
import styles from './Bottom.module.css';

export const BottomContent : React.FC = () => {
    return (
        <>
            <div className={styles.content}>
                <div className={styles.box}>
                    content1
                </div>
                <div className={styles.box}>
                    content2
                </div>
                <div className={styles.box}>
                    content3
                </div>
                
            </div>
        </>
    )
}