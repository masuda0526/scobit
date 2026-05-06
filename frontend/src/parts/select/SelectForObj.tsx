import type React from "react";
import styles from './Select.module.css';
import type { Options } from "./SelectBoxUtil";
import { useErrorArea } from "../../component/ErrorArea/ErrorAreaContext";

export type SelectBoxType<V = string> = {
  label: string;
  attr: string;
  options: Options<V>[];
} & React.InputHTMLAttributes<HTMLSelectElement>

export const SelectOfObj: React.FC<SelectBoxType> = ({
  ...props
}) => {
  const errCtx = useErrorArea();
  return (
    <div className={styles.box}>
      <p className={styles.label}>{props.label}</p>
      <select
        name=""
        id=""
        className={`${styles.select} ${errCtx.hasError(props.attr) ? styles.isError : ''}`}
        {...props}
      >
        <option value=''>選択してください</option>
        {
          props.options.map((op, i) => (
            <option key={i} value={op.value}>{op.label}</option>
          ))
        }
      </select>
    </div>
  )
}