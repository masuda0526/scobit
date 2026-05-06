import type React from "react";
import styles from './Select.module.css';

export type SelectBoxType = {
  label:string,
  options:string[]
} & React.InputHTMLAttributes<HTMLSelectElement>

export const Select:React.FC<SelectBoxType> = ({
  ...props
}) => {

  return (
    <div className={styles.box}>
      <p className={styles.label}>{props.label}</p>
      <select name="" id="" className={styles.select} {...props}>
        {
          props.options.map((op,i) => (
            <option key={i} value={op}>{op}</option>
          ))
        }
      </select>
    </div>
  )
}