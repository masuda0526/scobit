import type React from "react";
import styles from './toggle.module.css'

type Prop = {
  isOn: boolean;
}&React.HTMLAttributes<HTMLDivElement>

export const Toggle: React.FC<Prop> = ({
  isOn,
  ...props
}) => {
  return (
    <div className={styles.toggle} {...props}>
      <div className={`${styles.bar} ${ isOn ? styles.isOn : ''}`}>
        <div className={`${styles.point} ${isOn ? styles.isOn : ''}`}></div>
      </div>
    </div>
  )
}