import type React from "react";
import styles from './Modal.module.css'

export const Modal: React.FC<{ children: React.ReactNode, title: string, onClose?:Function }> = ({ children, title, onClose }) => {
  const clickOuterModal = ()=>{
    if(onClose){
      onClose()
    }
  }
  return (
    <div className={styles.wrapper} onClick={clickOuterModal}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.scroll}>
          {children}
        </div>
      </div>
    </div>
  )
}
