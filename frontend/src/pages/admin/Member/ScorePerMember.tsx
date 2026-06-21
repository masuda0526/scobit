import { type MemberGamesForm, type PlayerForm, type ResponseFormat, type ScoreItemDto } from "@scobit/types"
import { useEffect, useState } from "react";
// import { generateMemberGamesForm } from "../../../testdatas/testDataCreater";
import { Title } from "../../../parts/title/title";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { ScoreItem } from "../../../component/ScoreItem/ScoreItem";
import { useParams } from "react-router-dom";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { PageHistory, type PageHistoryItem } from "../../../component/PageHistory/PageHistory";
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";


export const AdminScorePerMemberPage: React.FC = () => {
  // プロバイダー
  const load = useLoading();
  const err = useErrorArea();

  // パラメータ
  const {playerId} = useParams();

  // 状態管理
  const [memberInfo, setMemberInfo] = useState<PlayerForm | null>()
  const [scores, setScores] = useState<ScoreItemDto[]>([]);

  let pageHistoies:PageHistoryItem[] = [
    {display:'チーム情報', url:`/admin/team`},
    {display:'選手一覧', url:`/admin/members`}
  ];
  if(playerId){
    pageHistoies.push({display:'選手情報', url:`/admin/member/${playerId}`})
  }

  useEffect(() => {
    const init = async () => {
      load.startLoading();
      err.reset();

      try {
        const r = await ajaxAdminApi.post('/score/init', {player_id:playerId});
        const res = r.data as ResponseFormat;
  
        if(!res.isSuccess){
          err.setErrors(res.errors??[]);
          load.stopLoading();
          return 
        }
  
        // const data = generateMemberGamesForm();
        const data = res.data.data as MemberGamesForm;
        setMemberInfo(data.info);
        setScores(data.scores);

        load.stopLoading();

      } catch (error) {
        console.log(error);
        load.stopLoading();
        return;
      }
    }
    init();
  }, [])
  return (
    <>
      <PageHistory pages={pageHistoies}/>
      <ErrorArea/>
      <Title text={'試合結果一覧'} />
      <ContentBox>
        {memberInfo ? (
          <SubTitle text={`${memberInfo.name}　の成績`} />
        ) : ''}
        {scores.map(score => {
          return <ScoreItem {...score} key={score.score_id}></ScoreItem>
        })}
      </ContentBox>
    </>
  )
}