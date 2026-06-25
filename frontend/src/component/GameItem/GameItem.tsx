import type React from "react";
import type { GameForm } from "@scobit/types";
import style from "./GameItem.module.css";
import { dispDateFromDate } from "../../Util/DateUtil/DateUtil";
// import { useNavigate } from "react-router-dom";

type Prop = {
  game:GameForm
}&React.HtmlHTMLAttributes<HTMLDivElement>

export const GameItem: React.FC<Prop> = ({game,...prop}) => {
  return (
    <div className={style.gameItem} {...prop}>
      {/* 左：日付 */}
      <div className={style.gameDate}>
        {dispDateFromDate(game.game_dt, "dot")}
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
      {/* <a href="/#/game" className={style.link}>{"›"}</a> */}
    </div>
  );
};

function translateResult(game: GameForm): string {
  if (game.my_point > game.op_point) return "○";
  if (game.my_point < game.op_point) return "×";
  return "△";
}

function resultClass(game: GameForm): string {
  if (game.my_point > game.op_point) return "win";
  if (game.my_point < game.op_point) return "lose";
  return "draw";
}