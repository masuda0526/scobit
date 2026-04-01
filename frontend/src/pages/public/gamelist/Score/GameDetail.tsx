import type React from "react";
import { Title } from "../../../../parts/title/title";
import { GameScore } from "../../../../component/GameItem/GameScore";
import { generateGameDetailForm } from "../../../../testdatas/testDataCreater";
import { GameResult } from "../../../../component/GameResult/GameResult";

export const GameDetail : React.FC = () => {
    const data = generateGameDetailForm();
    const game = data.game;
    const scores = data.scores;
    return (
        <>
            <Title text="試合結果詳細"/>
            <GameResult game={game} />
            {scores.map(score => {
                return (<GameScore score={score}/>)
            })}
        </>
    )
}