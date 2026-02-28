import type { Game, Team } from "@scobit/types";
import type React from "react";
import { GameItem } from "../../component/GameItem/GameItem";
import { Title } from "../../parts/title/title";
import { Button } from "../../parts/button/button";
import { ButtonArea } from "../../parts/button/buttonArea";
import { generateGamesForm } from "../../testdatas/testDataCreater";
import { ContentBox } from "../../parts/content/contentBox";
import { SubTitle } from "../../parts/subtitle/subtitle";

export const GameList: React.FC = () => {
    const data = generateGamesForm();
    const games: Game[] = data.games;
    const team:Team = data.team;
    const addGame = () => {
        console.log("add game");
    }

    return (
        <div>
            <Title text="試合結果一覧" />
            <ContentBox>
                <SubTitle text={`${team.teamName}`} />
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
            </ContentBox>
        </div>
    );
}