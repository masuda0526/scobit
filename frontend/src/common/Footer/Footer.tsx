import type React from "react";
import styles from "./Footer.module.css"
export const Footer: React.FC = () => {
    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p className={styles.txt}>© 2026 scobit</p>
                    <a className={styles.link} href="/agreement">利用規約</a>
                    <a className={styles.link} href="https://forms.gle/mUyrM2N5ZSExJBgX6">お問い合わせ</a>
                </div>
            </footer>
        </>
    )
}