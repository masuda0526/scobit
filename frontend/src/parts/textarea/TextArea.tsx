import type React from "react";
import styles from './TextArea.module.css';

type TextAreaProps = {
  label: string,
  value: string
} & React.InputHTMLAttributes<HTMLTextAreaElement>

export const TextArea: React.FC<TextAreaProps> = ({ ...props }) => {

  return (
    <div className={styles.box}>
      <label className={styles.label}>
        {props.label}
      </label>
      <textarea
        className={styles.textarea}
        {...props}
      >{props.value}</textarea>
    </div>
  )

}