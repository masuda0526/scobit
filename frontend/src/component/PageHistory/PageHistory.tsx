import type React from "react";
import { useNavigate } from "react-router-dom";
import styles from './PageHistory.module.css';


export type PageHistoryProp = {
  pages: PageHistoryItem[]
}

export type PageHistoryItem = {
  display: string;
  url: string;
}

export const PageHistory: React.FC<PageHistoryProp> = (prop) => {
  const navigator = useNavigate();

  return (
    <>
      {prop.pages.length > 0 ? (
        <div className={styles.container}>
          {prop.pages.map((page, idx) => {
            return (
              <div key={idx}>
                <span className={styles.prefix}>＞</span>
                <span 
                  className={styles.item} 
                  onClick={() => navigator(page.url)}
                >
                  {page.display}
                </span>
              </div>
            )
          })}
        </div>
      ):''}
    </>
  )
}