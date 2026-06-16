import type React from "react";
import { Modal } from "../../../component/Modal/Modal";
import { useEffect, useState } from "react";
import { AccountFormSchema, type Ability, type AccountForm, type MypageFormOfIndividualUser, type ResponseFormat, type ScoreItemDto, type TeamForm } from "@scobit/types";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
// import { generateAdminMypageFetchKojinAccount, generateAdminMypageFetchTeams } from "../../../testdatas/testDataCreater";
import { useNavigate } from "react-router-dom";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { Input } from "../../../parts/input/Input";
import { Info } from "../../../component/Info/info";
import { ScoreItem } from "../../../component/ScoreItem/ScoreItem";
import { UserAbility } from "../../../component/UserAbility/UserAbility";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { CornerIcon } from "../../../component/Modal/CornerIcon";
import { faFileCirclePlus, faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { exceptionAdminProcess, exceptionProcess } from "../../../Util/CommonUtil/CommonUtil";
import { AccessTokenUtil } from "../../../Util/TokenUtil/AccessTokenUtil";
import { SelectOfObj } from "../../../parts/select/SelectForObj";
import { parseOptionObjects } from "../../../parts/select/SelectBoxUtil";
import { RelativeWrapper } from "../../../parts/RelativeWrapper/RelativeWrapper";

export const Mypage: React.FC = () => {
  // プロバイダー
  const navigator = useNavigate();
  const loading = useLoading();
  const err = useErrorArea();

  // フラグ
  const [isTeamSelectPage, setTeamSelectPage] = useState<boolean>(false);
  const [isIndividualPage, setIndividualPage] = useState<boolean>(false);
  const [isEditAccount, setIsEditAccount] = useState<boolean>(false);

  // チーム選択用
  const [teams, setTeams] = useState<TeamForm[]>([]);
  const [selectTeam, setSelectTeam] = useState<string>('');

  // 個人アカウント用
  const [account, setAccount] = useState<AccountForm>({ email: '', account_pub_id: '' });
  const [editAccount, setEditAccount] = useState<AccountForm>({ email: '', account_pub_id: '' });
  const [player, setPlayer] = useState<Ability | null>(null);
  const [scores, setScores] = useState<ScoreItemDto[]>([]);

  useEffect(() => {
    const init = async () => {
      let teams = [];
      try {
        loading.startLoading();
        const res = await ajaxAdminApi.post('/mypage/teams')

        const data = res.data as ResponseFormat;
        teams = data.data.teams as TeamForm[];
        const account = data.data.account as AccountForm;

        setTeams(teams);
        setAccount(account);
        setEditAccount(account);

      } catch (error) {
        console.error(error)
        exceptionAdminProcess();
      }
      
      if (teams.length > 0) {
        // チーム選択処理
        setTeamSelectPage(true);
        setIndividualPage(false);
        setIsEditAccount(false);
      } else {
        // 個人アカウントページ
        try {
          const res = await ajaxAdminApi.post('/mypage/kojin')
          const data = res.data as ResponseFormat;
          const kojinData = data.data.data as MypageFormOfIndividualUser;

          setAccount(kojinData.account);
          setEditAccount(kojinData.account);
          setPlayer(kojinData.ability)
          setScores(kojinData.scores);

          setIndividualPage(true);
          setTeamSelectPage(false);
        } catch (error) {
          console.log(error)
          loading.stopLoading();
          exceptionAdminProcess();
        }
      }
      loading.stopLoading();
    }
    init();
  }, [])

  // アカウント情報編集
  const clickEditAccount = async() => {
    loading.startLoading();
    err.reset();
    const valid = AccountFormSchema.safeParse(editAccount);
    if (!valid.success) {
      err.setErrors(convertToErrorInfos(valid.error));
      loading.stopLoading();
      return;
    }
    try {
      const r = await ajaxAdminApi.post('/account/edit', valid.data);
      const response = r.data as ResponseFormat;
      if(!response.isSuccess){
        err.setErrors(response.errors??[]);
        loading.stopLoading();
        return;
      }
      const account = response.data.account as AccountForm;
      console.log(account);
      setAccount({ email: account.email, account_pub_id: account.account_pub_id });
      setIsEditAccount(false);
      loading.stopLoading();
    } catch (error) {
      loading.stopLoading();
      exceptionAdminProcess();
    }
  }
  const changeAccount = (key: keyof AccountForm, val: string) => {
    setEditAccount(prev => ({ ...prev, [key]: val }));
  }

  const clickNewTeam = () => {
    navigator('/admin/new/team')
  }
  
  const clickSelectTeam = async () => {
    loading.startLoading();
    if(selectTeam === ''){
      alert('チームを選択してください。');
      loading.stopLoading();
      return ;
    }
    try {
      const res = await ajaxAdminApi.post('/mypage/select', {team_id:selectTeam});
      const data = res.data as ResponseFormat;
      AccessTokenUtil.setToken(data.data.token);
    } catch (error) {
      loading.stopLoading();
      exceptionProcess();
    }
    loading.stopLoading();
    navigator('/admin/team');
  }

  const editGame = (gameId:string) => {
    navigator(`/admin/game/kojin/${gameId}`);
  }

  return (
    <>
      {isTeamSelectPage ? (
        <ContentBox>
          <SubTitle text="チーム選択" />
          <SelectOfObj 
            label="チーム" 
            attr="team_id" 
            value={selectTeam}
            options={parseOptionObjects(teams, 'team_id', 'team_name')} 
            onChange={(e) => setSelectTeam(e.target.value)}
          />
          <ButtonArea position='between'>
            <Button label='チーム追加' onClick={clickNewTeam} />
            <Button label="選択" onClick={clickSelectTeam} />
          </ButtonArea>
        </ContentBox>
      ) : ''}
      <ContentBox>
        <CornerIcon icon={faPencil} onClick={() => setIsEditAccount(true)} />
        <SubTitle text="アカウント情報" />
        {account.account_pub_id?(
          <Info label='ユーザーID' info={account.account_pub_id} />
        ):''}
        <Info label='メールアドレス' info={account.email} />
      </ContentBox>
      {isIndividualPage ? (
        <>
          {player ? (
            <ContentBox>
              <CornerIcon icon={faPencil} onClick={() => navigator('/admin/member/kojin')}/>
              <SubTitle text="能力値" />
              <UserAbility player={player} />
            </ContentBox>
          ) : ''}
          <ContentBox>
            <CornerIcon icon={faFileCirclePlus} y={0} onClick={() => navigator('/admin/game/kojin')}/>
            <SubTitle text="試合成績" />
            {scores.map(score =>{return (
              <RelativeWrapper key={score.score_id}>
                <CornerIcon icon={faPencil} style={{fontSize:'18px'}} onClick={() => editGame(score.game_id)}/>
                <ScoreItem {...score}/>
              </RelativeWrapper>
            )
            })}
          </ContentBox>
          {/* <ButtonArea>
            <Button label="チーム作成" isRadius="isRadius" size="md" onClick={clickNewTeam} />
          </ButtonArea> */}
        </>
      ) : ''}
      {isEditAccount ? (
        <Modal title="アカウント情報編集">
          <ErrorArea />
          <CornerIcon icon={faXmark} onClick={() => setIsEditAccount(false)} />
          <Input label="ユーザーID" attr="account_pub_id" value={editAccount.account_pub_id} onChange={(e) => changeAccount('account_pub_id', e.target.value)} />
          <Input label="メールアドレス" attr="email" value={editAccount.email} onChange={(e) => changeAccount('email', e.target.value)} />
          <ButtonArea>
            <Button label="変更する" onClick={() => clickEditAccount()} />
          </ButtonArea>
        </Modal>
      ) : ''}
    </>
  )
}