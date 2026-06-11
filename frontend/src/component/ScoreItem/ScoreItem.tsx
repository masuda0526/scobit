import { ScoreItemDtoSchema, type ScoreItemDto } from "@scobit/types";
import type React from "react";
import { dispDateFromDate } from "../../Util/DateUtil/DateUtil";
import styles from "./ScoreItem.module.css";

export const ScoreItem: React.FC<ScoreItemDto> = (score) => {
    const parseScore = ScoreItemDtoSchema.safeParse(score).data;
    return (
        <>
        {parseScore?(

        <div className={styles.item}>
            <div className={styles.info}>
                <div className={styles.date}>{dispDateFromDate(parseScore.game_dt)}</div>
                <div className={styles.opponent}>vs {parseScore.opponent}</div>
            </div>
            <div className={styles.data}>
                {parseScore.is_turn ? (
                    <>
                        <div className={styles.box}>
                            <div className={styles.label}>打数</div>
                            <div className={`${styles.value} ${styles.black}`}>{parseScore.box}</div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.label}>安打</div>
                            <div className={setValueClassName(parseScore.hit)}>{parseScore.hit}</div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.label}>本塁打</div>
                            <div className={setValueClassName(parseScore.hr)}>{parseScore.hr}</div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.label}>盗塁</div>
                            <div className={setValueClassName(parseScore.steal)}>{parseScore.steal}</div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.label}>エラー</div>
                            <div className={`${styles.value} ${parseScore.err > 0?styles.haserr:''}`}>{parseScore.err}</div>
                        </div>
                    </>
                ) : (<div className={styles.noturn}>{"出番なし"}</div>)}
            </div>
        </div>
        ):''}
        </>
    )
}

const setValueClassName = (val : number) => {
    return `${styles.value} ${val > 0 ? styles.notZero:''}`
}