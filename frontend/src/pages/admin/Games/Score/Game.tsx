import type { GameForm, ScoreForm } from "@scobit/types";
import type React from "react";
import { useEffect, useState } from "react";
import { Title } from "../../../../parts/title/title";
import { GameResult } from "../../../../component/GameResult/GameResult";
import { GameScore } from "../../../../component/GameItem/GameScore";
import { generateGameDetailForm } from "../../../../testdatas/testDataCreater";
import { ButtonArea } from "../../../../parts/button/buttonArea";
import { Button } from "../../../../parts/button/button";
import { useNavigate } from "react-router-dom";

export const AdminGame: React.FC = () => {
  const navigate = useNavigate();

  const [game, setGame] = useState<GameForm | null>(null);
  const [scores, setScores] = useState<ScoreForm[]>([]);
  useEffect(() => {
    const data = generateGameDetailForm();
    setGame(data.game);
    setScores(data.scores);
  }, [])

  const clickButton = () => {
    navigate('/admin/game/edit')
  }

  return (
    <>
      <Title text="試合結果詳細" />
      {game ? (
        <GameResult game={game} />
      ) : ''}
      {scores.map(score => <GameScore score={score} />)}
      <ButtonArea>
        <Button label="編集する" isRadius='isRadius' onClick={clickButton}/>
      </ButtonArea>
    </>
  )
}