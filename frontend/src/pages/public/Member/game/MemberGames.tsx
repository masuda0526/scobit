import { type MemberGamesForm, type PlayerForm, type ResponseFormat, type ScoreItemDto } from "@scobit/types"
import { ScoreItem } from "../../../../component/ScoreItem/ScoreItem"
import { ContentBox } from "../../../../parts/content/contentBox"
import { Title } from "../../../../parts/title/title"
import { SubTitle } from "../../../../parts/subtitle/subtitle"
// import { generateMemberGamesForm } from "../../../../testdatas/testDataCreater"
import { useEffect, useState } from "react"
import { useLoading } from "../../../../component/Loading/LoadingContext"
import { ajaxPublicApi } from "../../../../Util/AjaxUtil/AjaxUtil"
import { useParams } from "react-router-dom"
import { PageHistory, type PageHistoryItem } from "../../../../component/PageHistory/PageHistory"
import { exceptionProcess } from "../../../../Util/CommonUtil/CommonUtil"

export const MemberGames: React.FC = () => {
    const load = useLoading();
    const {publicId, playerId} = useParams();
    const [memberInfo, setMemberInfo] = useState<PlayerForm|null>()
    const [scores, setScores] = useState<ScoreItemDto[]>([]);

    const pages:PageHistoryItem[] =[
        {display:'チーム情報', url:`/team/${publicId}`},
        {display:'選手一覧', url:`/members/${publicId}`},
        {display:'選手情報', url:`/member/${publicId}/${playerId}`},
    ]
    useEffect(() => {
        const init = async () => {
            load.startLoading();
            try {
                const r = await ajaxPublicApi.get(`/member/game?public_id=${publicId}&player_id=${playerId}`);
                const res = r.data as ResponseFormat;
                const data = res.data.data as MemberGamesForm;
                setMemberInfo(data.info);
                setScores(data.scores);
                load.stopLoading();
            } catch (error) {
                exceptionProcess();                
            }
        }
        // const data = generateMemberGamesForm();
        init();
    }, [])
    return (
        <>
            <PageHistory pages={pages}/>
            <Title text={'試合結果一覧'}/>
            <ContentBox>
                {memberInfo?(
                    <SubTitle text={`「${memberInfo.name}」選手の成績`} />
                ):''}
                {scores.map(score => {
                    return <ScoreItem key={score.score_id} {...score}></ScoreItem>
                })}
            </ContentBox>
        </>
    )
}