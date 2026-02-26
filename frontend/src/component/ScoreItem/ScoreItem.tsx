import type { Score } from "@scobit/types";
import type React from "react";
import { dispDate } from "../../Util/DateUtil/DateUtil";
import styles from "./ScoreItem.module.css";

export const ScoreItem: React.FC<Score> = (score) => {
    return (
        <div className={styles.item}>
            <div className={styles.info}>
                <div className={styles.date}>{dispDate(score.gameDt)}</div>
                <div className={styles.opponent}>vs {score.opponent}</div>
            </div>
            <div className={styles.data}>
                {score.isTurn ? (
                    <>
                        <div className={styles.box}>
                            <div className={styles.label}>打数</div>
                            <div className={`${styles.value} ${styles.black}`}>{score.box}</div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.label}>安打</div>
                            <div className={setValueClassName(score.hit)}>{score.hit}</div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.label}>本塁打</div>
                            <div className={setValueClassName(score.hr)}>{score.hr}</div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.label}>盗塁</div>
                            <div className={setValueClassName(score.steal)}>{score.steal}</div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.label}>エラー</div>
                            <div className={`${styles.value} ${score.err > 0?styles.haserr:''}`}>{score.err}</div>
                        </div>
                    </>
                ) : (<div className={styles.noturn}>{"出番なし"}</div>)}
            </div>
        </div>
    )
}

const setValueClassName = (val : number) => {
    return `${styles.value} ${val > 0 ? styles.notZero:''}`
}