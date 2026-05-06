import type React from "react";
import { Title } from "../../../../parts/title/title";
import { GameScore } from "../../../../component/GameItem/GameScore";
import { generateGameDetailForm } from "../../../../testdatas/testDataCreater";
import { GameResult } from "../../../../component/GameResult/GameResult";
import { useEffect, useState } from "react";
import { type ScoreForm, type GameForm } from "@scobit/types";

export const GameDetail : React.FC = () => {
    const [game, setGame] = useState<GameForm|null>(null)
    const [scores, setScores] = useState<ScoreForm[]>([]);
    useEffect(() => {
        const data = generateGameDetailForm();
        setGame(data.game);
        setScores(data.scores);
    }, [])
    return (
        <>
            <Title text="試合結果詳細"/>
            {game?(
                <GameResult game={game} />
            ):''}
            {scores.map(score => {
                return (<GameScore score={score}/>)
            })}
        </>
    )
}