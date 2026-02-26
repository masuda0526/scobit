import type React from "react";
import { Title } from "../../parts/title/title";
import type { Game, Team } from "@scobit/types";
import { testTeams } from "../../testdatas/teams";
import { SubTitle } from "../../parts/subtitle/subtitle";
import { ContentBox } from "../../parts/content/contentBox";
import { Info } from "../../component/Info/info";
import { perseActiveStatus } from "../../Util/ActiveStatusUtil/ActiveStatusUtil";
import { dispDate } from "../../Util/DateUtil/DateUtil";
import { testGames } from "../../testdatas/games";
import { GameItem } from "../../component/GameItem/GameItem";
import { ButtonArea } from "../../parts/button/buttonArea";

export const TeamPage: React.FC = () => {
    const team: Team = testTeams[0]
    const games: Game[] = testGames.slice(0, 5);
    return (
        <>
            <Title text="チームTOP" />

            <ContentBox>
                <SubTitle text="チーム情報" />
                <Info label="チーム名" info={team.teamName} />
                <Info label="代表者" info={team.leaderName} />
                <Info label="活動状況" info={perseActiveStatus(team.interval, team.activeInfo)} />
                <Info label="活動地域" info={team.area} />
                <Info label="設立日" info={dispDate(team.createdDt)} />
            </ContentBox>

            <ContentBox>
                <SubTitle text="直近の試合結果" />
                {games.map(g => {
                    return (<GameItem game={g}></GameItem>)
                })}
                <ButtonArea position={'right'}>
                    <a href="#/games">一覧を見る</a>
                </ButtonArea>
            </ContentBox>
        </>
    )
}


