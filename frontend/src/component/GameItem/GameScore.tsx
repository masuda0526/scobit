import type React from "react";
import styles from "./GameItem.module.css";
import type { Score } from "@scobit/types";
import { MemberLabel } from "../UserAbility/MemberLabel";

export const GameScore: React.FC<{ score: Score }> = ({ score }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardInner}>
                {/* 選手名 + ポジション */}
                <div className={styles.memberLabelWrapper}>
                    <MemberLabel name={score.disp_name} positions={score.positions} />
                </div>

                {/* 出番なし or 成績グリッド */}
                {!score.isTurn ? (
                    <div className={styles.noPlay}>出番なし</div>
                ) : (
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>打数</div>
                            <div className={styles.statValue}>{score.box}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>安打</div>
                            <div className={`${styles.statValue} ${styles.highlight}`}>
                                {score.hit}
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>本塁打</div>
                            <div className={`${styles.statValue} ${styles.highlight}`}>
                                {score.hr}
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>盗塁</div>
                            <div className={styles.statValue}>{score.steal}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statLabel}>エラー</div>
                            <div
                                className={`${styles.statValue} ${score.err > 0 ? styles.error : ""
                                    }`}
                            >
                                {score.err}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};