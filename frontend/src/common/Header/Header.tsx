import styles from './Header.module.css';

export const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.icon_box}>
                <img className={styles.icon} src="icon_toumei.png" alt="Scobit Logo" />
                <h1 className={styles.title}>Scobit</h1>
            </div>
        </header>
    );
}