import styles from './info.module.css'

export const Info: React.FC<{ label: string, info: string }> = (props) => {
    return (
        <>
            <div className={styles.box}>
                <p className={styles.label}>{props.label}</p>
                <p className={styles.info}>{props.info}</p>
            </div>
        </>
    )
} 