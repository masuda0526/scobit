import { type GameForm, type PlayerForm, type ResponseFormat, type TeamForm, type TeamTopForm } from "@scobit/types";
import type React from "react";
import { ContentBox } from "../../../parts/content/contentBox";
import { Info } from "../../../component/Info/info";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { Title } from "../../../parts/title/title";
import { Modal } from "../../../component/Modal/Modal";
import { Input } from "../../../parts/input/Input";
import { TextArea } from "../../../parts/textarea/TextArea";
import { useEffect, useState } from "react";
import { PrefSelect } from "../../../parts/select/PrefSelect";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { CornerIcon } from "../../../component/Modal/CornerIcon";
import { GameItem } from "../../../component/GameItem/GameItem";
import { AdminMemberLabelList } from "../../../component/MemberLabelList/AdminMemberLabelList";
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { exceptionAdminProcess } from "../../../Util/CommonUtil/CommonUtil";
import { useNavigate } from "react-router-dom";
import { ScobitFunction } from "@scobit/common";

export const AdminTeam: React.FC = () => {
  const err = useErrorArea();
  const load = useLoading();
  const navigator = useNavigate();

  const [team, setTeam] = useState<TeamForm | null>(null);
  const [games, setGames] = useState<GameForm[]>([]);
  const [players, setPlayers] = useState<PlayerForm[]>([]);

  const [editTeam, setEditTeam] = useState<TeamForm | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      load.startLoading();
      try {
        const res = await ajaxAdminApi.post('/team/init');
        const data = res.data as ResponseFormat;
        if (!data.isSuccess || !data.data) {
          err.setErrors(data.errors ?? []);
          load.stopLoading();
          return;
        }
        const form = data.data.data as TeamTopForm;
        setTeam(form.info);
        setGames(ScobitFunction.convertToGameForms(form.games));
        setPlayers(form.players);
        load.stopLoading();
      } catch (error) {
        console.error(error);
        load.stopLoading();
        exceptionAdminProcess();
      }
    }
    init();
  }, [])

  const editClick = () => {
    if (!team) return;
    setEditTeam({ ...team });
    setIsEdit(true);
  }

  const handleClick = async () => {
    if (!editTeam) return;
    load.startLoading();
    try {
      const res = await ajaxAdminApi.post('/team/update', editTeam);
      const data = res.data as ResponseFormat;
      if (!data.isSuccess) {
        load.stopLoading();
        return err.setErrors(data.errors ?? []);
      }
      setTeam(data.data.updatedTeam);
      setIsEdit(false);
      load.stopLoading();
    } catch (error) {
      load.stopLoading();
      console.error(error);
      exceptionAdminProcess();
    }
  }

  if (!team) return <></>;

  return (
    <>
      {/* 編集モーダル */}
      {isEdit && editTeam ? (
        <Modal title="チーム情報編集" onClose={() => setIsEdit(false)}>
          <CornerIcon icon={faXmark} onClick={() => setIsEdit(false)} />
          <Input
            attr="team_name"
            label="チーム名"
            value={editTeam.team_name}
            onChange={(e) => setEditTeam({ ...editTeam, team_name: e.target.value })}
          />
          <Input
            attr='public_id'
            label="チームID"
            value={editTeam.public_id}
            onChange={(e) => setEditTeam({ ...editTeam, public_id: e.target.value })} />
          <PrefSelect
            value={editTeam.pref}
            onChange={(e) => setEditTeam({ ...editTeam, pref: e.target.value as typeof team.pref })}
          />
          <Input
            attr="area"
            label="活動地域"
            value={editTeam.area}
            onChange={(e) => setEditTeam({ ...editTeam, area: e.target.value })} />
          <TextArea
            label="チーム説明"
            value={editTeam.description ?? ''}
            onChange={(e) => setEditTeam({ ...editTeam, description: e.target.value })}
          />
          <ButtonArea>
            <Button label="変更する" onClick={handleClick} />
          </ButtonArea>
        </Modal>
      ) : ''}

      {/* 画面 */}
      <Title text="チーム管理" />
      <ContentBox>
        <SubTitle text="チーム情報" />
        <Info label="チーム名" info={team.team_name} />
        <Info label="チームID" info={team.public_id} />
        <Info label="都道府県" info={team.pref} />
        <Info label="活動地域" info={team.area} />
        {team.description ? (
          <Info label="チーム説明" info={team.description} />
        ) : ''}
        <CornerIcon icon={faPencil} x={5} y={5} onClick={editClick} />
      </ContentBox>

      <ContentBox>
        <SubTitle text='直近の試合結果' />
        {games.length > 0 ? (
          <>
            {games.map(game => <GameItem key={game.game_id} game={game} />)}
            <ButtonArea position='right'>
              <a href="#/admin/games">一覧を見る</a>
            </ButtonArea>
          </>
        ) : (
          <>
            <p>試合情報の登録はありません。</p>
            <ButtonArea position='center'>
              <Button label="試合結果を登録へ" isRadius='isRadius' onClick={()=>{navigator('/admin/games')}} />
            </ButtonArea>
          </>
        )}
      </ContentBox>

      <ContentBox>
        <SubTitle text="選手一覧" />
        <AdminMemberLabelList players={players} />
        <ButtonArea position='right'>
          <a href="#/admin/members">一覧を見る</a>
        </ButtonArea>
      </ContentBox>
    </>
  )
}

