import type { ScoreItemDto } from "@scobit/types"
import { ScoreItem } from "../../../component/ScoreItem/ScoreItem"
import { ContentBox } from "../../../parts/content/contentBox"
import { Title } from "../../../parts/title/title"
import { SubTitle } from "../../../parts/subtitle/subtitle"
import { generateMemberGamesForm } from "../../../testdatas/testDataCreater"

export const MemberGames: React.FC = () => {
    const data = generateMemberGamesForm();
    const memberInfo = data.info
    const scores : ScoreItemDto[] = data.scores;
    return (
        <>
            <Title text={'試合結果一覧'}/>
            <ContentBox>
                <SubTitle text={`${memberInfo.name}　選手の成績`} />
                {scores.map(score => {
                    return <ScoreItem {...score}></ScoreItem>
                })}
            </ContentBox>
        </>
    )
}