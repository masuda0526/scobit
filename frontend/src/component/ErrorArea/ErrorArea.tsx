import type React from "react";
import { useErrorArea } from "./ErrorAreaContext";
import styles from './ErrorArea.module.css';

export const ErrorArea: React.FC = () => {
  const err = useErrorArea();

  return (
    <>
      {err.isError() ? (
        <div className={styles.errorArea}>
          <ul>
            {err.errors.map((e, i) => (<li key={i} className={styles.msg}>{e.message}</li>))}
          </ul>
        </div>
      ):''}
    </>
  )
}