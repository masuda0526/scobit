import type React from "react";
import { Modal } from "../../../component/Modal/Modal";
import { useEffect, useState } from "react";
import { Select } from "../../../parts/select/Select";
import { AccountFormSchema, type Ability, type AccountForm, type ScoreItemDto, type TeamForm } from "@scobit/types";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { generateAdminMypageFetchKojinAccount, generateAdminMypageFetchTeams } from "../../../testdatas/testDataCreater";
import { useNavigate } from "react-router-dom";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { Input } from "../../../parts/input/Input";
import { Info } from "../../../component/Info/info";
import { ScoreItem } from "../../../component/ScoreItem/ScoreItem";
import { UserAbility } from "../../../component/UserAbility/UserAbility";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { CornerIcon } from "../../../component/Modal/CornerIcon";
import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";

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

  // 個人アカウント用
  const [account, setAccount] = useState<AccountForm>({ email: '', account_pub_id: '' });
  const [editAccount, setEditAccount] = useState<AccountForm>({ email: '', account_pub_id: '' });
  const [player, setPlayer] = useState<Ability | null>(null);
  const [scores, setScores] = useState<ScoreItemDto[]>([]);

  useEffect(() => {
    loading.startLoading();
    const data = generateAdminMypageFetchTeams();
    setTeams(data.teams);

    if (data.teams.length > 0) {
      // チーム選択処理
      setTeamSelectPage(true);
      setIndividualPage(false);
      setIsEditAccount(false);
      // } else if (data.teams.length === 1) {
      //   // 取得したチーム情報でマイページを構築
      //   navigator('/admin/team');
    } else {
      // 個人アカウントページ
      const kojinData = generateAdminMypageFetchKojinAccount();
      setAccount(kojinData.account);
      setEditAccount(kojinData.account);
      setPlayer(kojinData.ability)
      setScores(kojinData.scores);
      setIndividualPage(true);
      setTeamSelectPage(false);
    }
    loading.stopLoading();
  }, [])

  // アカウント情報編集
  const clickEditAccount = () => {
    loading.startLoading();
    err.reset();
    const valid = AccountFormSchema.safeParse(editAccount);
    if (!valid.success) {
      err.setErrors(convertToErrorInfos(valid.error));
      loading.stopLoading();
      return;
    }
    setAccount({ email: editAccount.email, account_pub_id: editAccount.account_pub_id });
    setIsEditAccount(false);
    loading.stopLoading();
  }
  const changeAccount = (key: keyof AccountForm, val: string) => {
    setEditAccount(prev => ({ ...prev, [key]: val }));
  }

  const clickNewTeam = () => {
    navigator('/admin/new/team')
  }

  const clickSelectTeam = () => {
    navigator('/admin/team');
  }

  return (
    <>
      {isTeamSelectPage ? (
        <ContentBox>
          <SubTitle text="チーム選択" />
          <Select label="チーム" options={teams.map(team => team.team_name)}></Select>
          <ButtonArea position='between'>
            <Button label='チーム追加' onClick={clickNewTeam} />
            <Button label="選択" onClick={clickSelectTeam} />
          </ButtonArea>
        </ContentBox>
      ) : ''}
      <ContentBox>
        <CornerIcon icon={faPencil} onClick={() => setIsEditAccount(true)} />
        <SubTitle text="アカウント情報" />
        <Info label='ユーザーID' info={account.account_pub_id} />
        <Info label='メールアドレス' info={account.email} />
      </ContentBox>
      {isIndividualPage ? (
        <>
          {player ? (
            <ContentBox>
              <SubTitle text="能力値" />
              <UserAbility player={player} />
            </ContentBox>
          ) : ''}
          <ContentBox>
            <SubTitle text="試合成績" />
            {scores.map(score => <ScoreItem {...score} />)}
          </ContentBox>
          <ButtonArea>
            <Button label="チーム作成" isRadius="isRadius" size="md" onClick={clickNewTeam} />
          </ButtonArea>
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