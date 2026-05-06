import type { PlayerForm, ScoreForm, GameForm } from "@scobit/types";
import type React from "react";
import { useEffect, useState } from "react";

type PlayerAndScore = {
  score:ScoreForm
} & PlayerForm
export const NewScore: React.FC = () => {
  const [game, setGame] = useState<GameForm|null>(null);
  const [players, setPlayers] = useState<PlayerAndScore[]>([]);

  useEffect(() => {
    
  },[])
}