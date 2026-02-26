import type React from "react";
import type { Game } from "@scobit/types";
import style from "./GameItem.module.css";
import { dispDate } from "../../Util/DateUtil/DateUtil";

export const GameItem: React.FC<{ game: Game }> = ({ game }) => {
  return (
    <div className={style.gameItem}>
      {/* 左：日付 */}
      <div className={style.gameDate}>
        {dispDate(game.g_dt, "dot")}
      </div>

      {/* 中央：結果バッジ + スコア + 対戦相手 */}
      <div className={style.gameInfo}>
        <div className={style.gameMeta}>
          <span className={`${style.gameResult} ${style[resultClass(game)]}`}>
            {translateResult(game)}
          </span>
          <span className={style.gamePoints}>
            {game.my_point} - {game.op_point}
          </span>
        </div>
        <div className={style.gameOpponent}>{game.opponent}</div>
      </div>

      {/* 右：矢印リンク */}
      <div className={style.link}>{"›"}</div>
    </div>
  );
};

function translateResult(game: Game): string {
  if (game.my_point > game.op_point) return "○";
  if (game.my_point < game.op_point) return "●";
  return "△";
}

function resultClass(game: Game): string {
  if (game.my_point > game.op_point) return "win";
  if (game.my_point < game.op_point) return "lose";
  return "draw";
}