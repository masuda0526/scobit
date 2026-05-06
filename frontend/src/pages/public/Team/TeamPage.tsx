import type React from "react";
import { Title } from "../../../parts/title/title";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { ContentBox } from "../../../parts/content/contentBox";
import { Info } from "../../../component/Info/info";
import { dispDateFromDate } from "../../../Util/DateUtil/DateUtil";
import { GameItem } from "../../../component/GameItem/GameItem";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { generateTeamForms } from "../../../testdatas/testDataCreater";
import { MemberLabelList } from "../../../component/MemberLabelList/MemberLabelList";
import { useEffect, useState } from "react";
import type { GameForm, PlayerForm, TeamForm } from "@scobit/types";

export const TeamPage: React.FC = () => {
    const [team, setTeam] = useState<TeamForm | null>(null);
    const [games, setGames] = useState<GameForm[]>([]);
    const [players, setPlayers] = useState<PlayerForm[]>([])

    useEffect(() => {
        const data = generateTeamForms();
        setTeam(data.info);
        setGames(data.games);
        setPlayers(data.players);
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
                    return (<GameItem game={g}></GameItem>)
                })}
                <ButtonArea position={'right'}>
                    <a href="#/games">一覧を見る</a>
                </ButtonArea>
            </ContentBox>
            <ContentBox>
                <SubTitle text="選手一覧" />
                <MemberLabelList players={players} />
                <ButtonArea position="right">
                    <a href="#/members">詳細を一覧で表示</a>
                </ButtonArea>
            </ContentBox>
        </>
    )
}


