import { type GameForm, type PlayerForm, type TeamForm, type TeamTopForm } from "@scobit/types";
import type React from "react";
import { generateTeamForms } from "../../../testdatas/testDataCreater";
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

export const AdminTeam: React.FC = () => {
  const [team, setTeam] = useState<TeamForm|null>(null);
  const [games, setGames] = useState<GameForm[]>([]);
  const [players, setPlayers] = useState<PlayerForm[]>([]);

  const [editTeam, setEditTeam] = useState<TeamForm|null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    const form: TeamTopForm = generateTeamForms();
    setTeam(form.info);
    setGames(form.games);
    setPlayers(form.players);
  }, [])

  const editClick = () => {
    if(!team)return;
    setEditTeam({...team});
    setIsEdit(true);
  }
  
  const handleClick = () => {
    if(!editTeam)return;
    setTeam(editTeam);
    setIsEdit(false);
  }

  if(!team) return <></>;

  return (
    <>
    {/* 編集モーダル */}
      {isEdit && editTeam ? (
        <Modal title="チーム情報編集" onClose={() => setIsEdit(false)}>
          <CornerIcon icon={faXmark} onClick={()=>setIsEdit(false)}/>
          <Input 
            attr="team_name" 
            label="チーム名" 
            value={editTeam.team_name} 
            onChange={(e) => setEditTeam({...editTeam, team_name:e.target.value})} 
          />
          <Input 
            attr='public_id' 
            label="チームID" 
            value={editTeam.public_id} 
            onChange={(e) => setEditTeam({...editTeam, public_id:e.target.value})} />
          <PrefSelect 
            value={editTeam.pref} 
            onChange={(e) => setEditTeam({...editTeam, pref:e.target.value as typeof team.pref})} 
          />
          <Input 
            attr="area" 
            label="活動地域" 
            value={editTeam.area} 
            onChange={(e) => setEditTeam({...editTeam, area:e.target.value})} />
          <TextArea
            label="チーム説明"
            value={editTeam.description??''}
            onChange={(e) => setEditTeam({...editTeam, description:e.target.value})}
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
        <CornerIcon icon={faPencil} x={5} y={5} onClick={editClick}/>
      </ContentBox>

      <ContentBox>
        <SubTitle text='直近の試合結果' />
        {games.map(game => <GameItem game={game} />)}
        <ButtonArea position='right'>
          <a href="#/admin/games">一覧を見る</a>
        </ButtonArea>
      </ContentBox>

      <ContentBox>
        <SubTitle text="選手一覧"/>
        <AdminMemberLabelList players={players}/>
        <ButtonArea position='right'>
          <a href="#/admin/members">一覧を見る</a>
        </ButtonArea>
      </ContentBox>
    </>
  )
}

