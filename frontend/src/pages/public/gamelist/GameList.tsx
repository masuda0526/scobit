import type { GameForm, GamesForm, ResponseFormat, TeamForm } from "@scobit/types";
import type React from "react";
import { GameItem } from "../../../component/GameItem/GameItem";
import { Title } from "../../../parts/title/title";
// import { generateGamesForm } from "../../../testdatas/testDataCreater";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { useEffect, useState } from "react";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { ajaxPublicApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { useNavigate, useParams } from "react-router-dom";
import { exceptionProcess } from "../../../Util/CommonUtil/CommonUtil";
import { ScobitFunction } from "@scobit/common";
import { PageHistory, type PageHistoryItem } from "../../../component/PageHistory/PageHistory";

export const GameList: React.FC = () => {
    const load = useLoading();
    const nav = useNavigate();

    const [games, setGames] = useState<GameForm[]>([]);
    const [team, setTeam] = useState<TeamForm | null>(null);

    const { publicId } = useParams();

    const histories: PageHistoryItem[] = [
        { display: 'チーム情報', url: `/team/${publicId}` }
    ]

    useEffect(() => {
        const init = async () => {
            load.startLoading();
            try {
                const r = await ajaxPublicApi.get(`/games?public_id=${publicId}`);
                const res = r.data as ResponseFormat;
                const data = res.data.data as GamesForm;
                setTeam(ScobitFunction.convertToTeamForm(data.team));
                setGames(ScobitFunction.convertToGameForms(data.games));
            } catch (error) {
                exceptionProcess();
            }
            load.stopLoading();
        }
        // const data = generateGamesForm();
        init();
    }, [])

    return (
        <div>
            <PageHistory pages={histories} />
            <Title text="試合結果一覧" />
            <ContentBox>
                {team ? (
                    <SubTitle text={`${team.team_name}`} />
                ) : ''}
                {games.map((game) => (
                    <GameItem
                        game={game}
                        key={game.game_id}
                        onClick = {() => nav(`/game/${publicId}/${game.game_id}`)}
                    />
                ))}
            </ContentBox>
        </div>
    );
}