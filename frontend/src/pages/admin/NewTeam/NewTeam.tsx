import { TeamFormSchema, type ResponseFormat, type TeamForm } from "@scobit/types";
import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "../../../parts/input/Input";
import { PrefSelect } from "../../../parts/select/PrefSelect";
import { TextArea } from "../../../parts/textarea/TextArea";
import { ContentBox } from "../../../parts/content/contentBox";
import { Title } from "../../../parts/title/title";
import { Button } from "../../../parts/button/button";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { useNavigate } from "react-router-dom";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";

export const NewTeamPage: React.FC = () => {
  // フック
  const loading = useLoading();
  const err = useErrorArea();
  const navigator = useNavigate();

  useEffect(() => {
    err.reset();
  },[]);

  // チーム状態
  const initTeam = (): TeamForm => {
    return {
      team_id: crypto.randomUUID(),
      team_name: '',
      public_id: '',
      pref: '東京都',
      area: '',
      description: '',
      created_at: new Date()
    }
  }
  const [team, setTeam] = useState<TeamForm>(initTeam());
  const changeTeam = (key: keyof TeamForm, val: string) => {
    setTeam(prev => ({ ...prev, [key]: val }));
  }  

  // 作成処理
  const clickCreateNewTeam = async () => {
    loading.startLoading();
    err.reset();
    // バリデーション
    const valid = TeamFormSchema.safeParse(team);
    if(!valid.success){
      err.setErrors(convertToErrorInfos(valid.error));
      loading.stopLoading();
      return
    }
    // 登録処理
    const res = await ajaxAdminApi.post('/team/new', valid.data);
    const data = res.data as ResponseFormat;
    console.log(data);
    if(!data.isSuccess){
      err.setErrors(data.errors??[]);
      loading.stopLoading();
      return ;
    }

    // 画面遷移
    navigator('/admin/mypage');
  }

  return (
    <>
      <Title text="チーム作成" />
      <ContentBox>
        <ErrorArea/>
        <Input
          attr="team_name"
          label="チーム名"
          value={team.team_name}
          onChange={(e) => changeTeam('team_name', e.target.value)}
        />
        <Input
          attr='public_id'
          label="チームID"
          value={team.public_id}
          onChange={(e) => changeTeam('public_id', e.target.value)} />
        <PrefSelect
          value={team.pref}
          onChange={(e) => changeTeam('pref', e.target.value)}
        />
        <Input
          attr="area"
          label="活動地域"
          value={team.area}
          onChange={(e) => changeTeam('area', e.target.value)} />
        <TextArea
          label="チーム説明"
          value={team.description ?? ''}
          onChange={(e) => changeTeam('description', e.target.value)}
        />
        <ButtonArea>
          <Button label="作成する" isRadius='isRadius' size="md" onClick={clickCreateNewTeam}/>
        </ButtonArea>
      </ContentBox>
    </>
  )



}