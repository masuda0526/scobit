import type { GameForm, TeamForm } from "@scobit/types";
import type React from "react";
import { GameItem } from "../../../component/GameItem/GameItem";
import { Title } from "../../../parts/title/title";
import { generateGamesForm } from "../../../testdatas/testDataCreater";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { useEffect, useState } from "react";

export const GameList: React.FC = () => {
    const [games, setGames] = useState<GameForm[]>([]);
    const [team, setTeam] = useState<TeamForm|null>(null);
    useEffect(() => {
        const data = generateGamesForm();
        setTeam(data.team);
        setGames(data.games);
    }, [])

    return (
        <div>
            <Title text="試合結果一覧" />
            <ContentBox>
                {team?(
                    <SubTitle text={`${team.team_name}`} />
                ):''}
                {games.map((game) => (
                    <GameItem
                        key={game.game_id}
                        game={game}
                    >
                    </GameItem>
                ))}
            </ContentBox>
        </div>
    );
}