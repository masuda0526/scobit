import type { GameForm } from "@scobit/types";
import type React from "react";
import styles from "./GameResult.module.css"
import { dispDateFromDate } from "../../Util/DateUtil/DateUtil";

export const GameResult: React.FC<{ game: GameForm }> = ({ game }) => {

    return (
        <>
            <div className={getClassName(game.my_point, game.op_point)}>
                <div className={styles.date}>{dispDateFromDate(game.game_dt, 'jp')}</div>
                <div className={styles.box}>
                    <div className={styles.score}>{game.my_point} - {game.op_point}</div>
                    <div className={styles.opponent}>
                        <span>vs</span>
                        {game.opponent}
                    </div>
                </div>
            </div>
        </>
    )
}

const getClassName = (my_point:number, op_point:number) => {
    let cln = '';
    if(my_point > op_point){
        cln = 'win'
    }
    if(my_point < op_point){
        cln = 'lose'
    }
    if(my_point === op_point){
        cln = 'draw'
    }
    return `${styles.container} ${styles[cln]}`
}