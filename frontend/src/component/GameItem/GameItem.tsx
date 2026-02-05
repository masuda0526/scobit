import type { Game } from "@scobit/types";
import style from "./GameItem.module.css";

export const GameItem: React.FC<{ game: Game }> = ({ game }) => {
    return (
        <div className={style.gameItem}>
            <div className={style.gameInfo}>
                <div className={style.gameProp}>
                    <div className={style.gameDate}>{perseDate(game.g_dt)}</div>
                    <div className={style.gameResult}>{translateResult(game.result)}</div>
                    <div className={style.gamePoints}>{game.my_point} - {game.op_point}</div>
                </div>
                <div className={style.vs}>{game.opponent}</div>
            </div>
            <div className={style.link}>{"＞"}</div>
        </div>
    )
}

function perseDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}.${month}.${day}`;
}


function translateResult(resultNum: number): string {
    switch (resultNum) {
        case 0:
            return "●";
        case 1:
            return "○";
        case 2:
            return "△";
        case 3:
            return "-";
        default:
            return "-";
    }
}