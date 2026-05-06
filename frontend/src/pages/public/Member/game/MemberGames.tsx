import { type PlayerForm, type ScoreItemDto } from "@scobit/types"
import { ScoreItem } from "../../../../component/ScoreItem/ScoreItem"
import { ContentBox } from "../../../../parts/content/contentBox"
import { Title } from "../../../../parts/title/title"
import { SubTitle } from "../../../../parts/subtitle/subtitle"
import { generateMemberGamesForm } from "../../../../testdatas/testDataCreater"
import { useEffect, useState } from "react"

export const MemberGames: React.FC = () => {
    const [memberInfo, setMemberInfo] = useState<PlayerForm|null>()
    const [scores, setScores] = useState<ScoreItemDto[]>([]);
    useEffect(() => {
        const data = generateMemberGamesForm();
        setMemberInfo(data.info);
        setScores(data.scores);
    }, [])
    return (
        <>
            <Title text={'試合結果一覧'}/>
            <ContentBox>
                {memberInfo?(
                    <SubTitle text={`${memberInfo.name}　選手の成績`} />
                ):''}
                {scores.map(score => {
                    return <ScoreItem {...score}></ScoreItem>
                })}
            </ContentBox>
        </>
    )
}