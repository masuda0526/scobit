import type { Game } from "@scobit/types";
import type React from "react";
import { testGames } from "../../testdatas/games";
import { GameItem } from "../../component/GameItem/GameItem";
import { Title } from "../../parts/title/title";
import { Button } from "../../parts/button/button";
import { ButtonArea } from "../../parts/button/buttonArea";

export const GameList:React.FC = () => {

    const games:Game[] = testGames;
    const addGame = () => {
        console.log("add game");
    }

    return (
        <div>
            <Title text="試合結果一覧" />
            <ButtonArea
                position="right"
            >
                <Button 
                    label="試合結果を追加"
                    size="sm" 
                    isRadius="isRadius"
                    onClick={addGame} 
                ></Button>
            </ButtonArea>
            {games.map((game) => (
                <GameItem 
                    key={game.g_id}
                    game={game}
                >
            </GameItem>
            ))}
        </div>
    );
}