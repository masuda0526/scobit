import type { Score } from "@scobit/types"
import { ScoreItem } from "../../../component/ScoreItem/ScoreItem"
import { ContentBox } from "../../../parts/content/contentBox"
import { Title } from "../../../parts/title/title"
import { testScores } from "../../../testdatas/scores"
import { SubTitle } from "../../../parts/subtitle/subtitle"

export const MemberGames: React.FC = () => {
    const scores : Score[] = testScores
    return (
        <>
            <Title text={'試合結果一覧'}/>
            <ContentBox>
                <SubTitle text="〇〇選手の成績" />
                {scores.map(score => {
                    return <ScoreItem {...score}></ScoreItem>
                })}
            </ContentBox>

        </>
    )
}