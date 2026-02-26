import type React from "react";
import { Title } from "../../../parts/title/title";
import { GameScore } from "../../../component/GameItem/GameScore";
import { testScores } from "../../../testdatas/scores";

export const GameDetail : React.FC = () => {
    const scores = testScores;
    return (
        <>
            <Title text="試合結果詳細"/>
            {scores.map(score => {
                return (<GameScore score={score}/>)
            })}
        </>
    )
}