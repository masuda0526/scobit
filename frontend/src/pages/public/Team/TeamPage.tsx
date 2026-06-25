import type React from "react";
import { Title } from "../../../parts/title/title";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { ContentBox } from "../../../parts/content/contentBox";
import { Info } from "../../../component/Info/info";
import { dispDateFromDate } from "../../../Util/DateUtil/DateUtil";
import { GameItem } from "../../../component/GameItem/GameItem";
import { ButtonArea } from "../../../parts/button/buttonArea";
// import { generateTeamForms } from "../../../testdatas/testDataCreater";
import { MemberLabelList } from "../../../component/MemberLabelList/MemberLabelList";
import { useEffect, useState } from "react";
import type { GameForm, PlayerForm, ResponseFormat, TeamForm, TeamTopForm } from "@scobit/types";
import { ajaxPublicApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { useParams } from "react-router-dom";
import { exceptionProcess } from "../../../Util/CommonUtil/CommonUtil";
import { ScobitFunction } from "@scobit/common";
import { useLoading } from "../../../component/Loading/LoadingContext";

export const TeamPage: React.FC = () => {
    const load = useLoading();
    const {publicId} = useParams();

    const [team, setTeam] = useState<TeamForm | null>(null);
    const [games, setGames] = useState<GameForm[]>([]);
    const [players, setPlayers] = useState<PlayerForm[]>([])


    useEffect(() => {
        const init = async () => {
            load.startLoading();
            try {
                const r = await ajaxPublicApi.get(`/team?public_id=${publicId}`);
                const res = r.data as ResponseFormat;
                const data = res.data.data as TeamTopForm;
                setTeam(ScobitFunction.convertToTeamForm(data.info));
                setGames(ScobitFunction.convertToGameForms(data.games));
                setPlayers(data.players);
                load.stopLoading();
            } catch (error) {
                console.log(error);
                load.stopLoading();
                exceptionProcess();
            }

        }
        // const data = generateTeamForms();
        init();
    }, [])
    return (
        <>
            <Title text="チームTOP" />

            {team ? (
                <ContentBox>
                    <SubTitle text="チーム情報" />
                    <Info label="チーム名" info={team.team_name} />
                    {/* <Info label="代表者" info={team.leaderName} /> */}
                    <Info label="都道府県" info={team.pref} />
                    <Info label="活動地域" info={team.area} />
                    <Info label="設立日" info={dispDateFromDate(team.created_at)} />
                </ContentBox>
            ) : ''}

            <ContentBox>
                <SubTitle text="直近の試合結果" />
                {games.map(g => {
                    return (<GameItem game={g} key={g.game_id}></GameItem>)
                })}
                <ButtonArea position={'right'}>
                    <a href={`/games/${publicId}`}>一覧を見る</a>
                </ButtonArea>
            </ContentBox>
            <ContentBox>
                <SubTitle text="選手一覧" />
                <MemberLabelList players={players} />
                <ButtonArea position="right">
                    <a href={`/members/${publicId}`}>詳細を一覧で表示</a>
                </ButtonArea>
            </ContentBox>
        </>
    )
}


