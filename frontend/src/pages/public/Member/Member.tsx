import type React from "react";
import { Title } from "../../../parts/title/title";
import { UserAbility } from "../../../component/UserAbility/UserAbility";
import { GroundPosition } from "../../../component/GroundPosition/GroundPosition";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { ContentBox } from "../../../parts/content/contentBox";
import { ButtonArea } from "../../../parts/button/buttonArea";
import type { Ability, MemberForm, ResponseFormat, ScoreItemDto } from "@scobit/types";
import { ScoreItem } from "../../../component/ScoreItem/ScoreItem";
import { generateMemberForm } from "../../../testdatas/testDataCreater";
import { Info } from "../../../component/Info/info";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { ajaxPublicApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { PageHistory, type PageHistoryItem } from "../../../component/PageHistory/PageHistory";

export const Member: React.FC = () => {
    const load = useLoading();
    const {publicId, playerId} = useParams();

    const [scores, setScores] = useState<ScoreItemDto[]>([]);
    const [player, setPlayer] = useState<Ability | null>(null);

    const pages : PageHistoryItem[] = [
        {display:'チーム情報', url:`/team/${publicId}`},
        {display:'選手一覧', url:`/members/${publicId}`}
    ]

    useEffect(() => {
        const init = async () => {
            load.startLoading();
            try {
                const r = await ajaxPublicApi.get(`/member?public_id=${publicId}&player_id=${playerId}`);
                const res = r.data as ResponseFormat;
                const data = res.data.data as MemberForm;
                setScores(data.scores);
                setPlayer(data.info);
                load.stopLoading();
            } catch (error) {
                
            }
        }
        // const data = generateMemberForm();
        init()
    }, [])

    return (
        <>
            <PageHistory pages={pages}/>
            <Title text="選手詳細" />
            <ContentBox>
                <SubTitle text="能力値" />
                {player ? (
                    <UserAbility player={player}></UserAbility>
                ) : ''}
            </ContentBox>

            <ContentBox>
                <SubTitle text="ポジション" />
                {player ? (
                    <GroundPosition
                        positions={player.positions.split("")}
                    ></GroundPosition>
                ) : ''}
            </ContentBox>

            <ContentBox>
                <SubTitle text="プロフィール" />
                {player ? (
                    <>
                        <Info label="氏名" info={player.name} />
                        <Info label="表示名" info={player.disp_name} />
                        <Info label="遠投距離(m)" info={player.throw_distance.toString()} />
                    </>
                ) : ''}
            </ContentBox>
            <ContentBox>
                <SubTitle text="試合結果" />
                {scores.map(score => {
                    return (<ScoreItem key={score.game_id} {...score}></ScoreItem>)
                })}
                <ButtonArea position="right">
                    <a href={`/member/games/${publicId}/${playerId}`}>一覧を見る</a>
                </ButtonArea>
            </ContentBox>

        </>
    )
}