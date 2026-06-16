import { type TeamForm, type Ability, type PlayerForm, PlayerFormSchema, type ResponseFormat } from "@scobit/types";
import type React from "react";
import { useEffect, useState } from "react";
// import { generateMembersForm } from "../../../testdatas/testDataCreater";
import { Title } from "../../../parts/title/title";
import { UserAbility } from "../../../component/UserAbility/UserAbility";
import { CornerIcon } from "../../../component/Modal/CornerIcon";
import { faPen } from "@fortawesome/free-solid-svg-icons/faPen";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../component/Modal/Modal";
import { Input } from "../../../parts/input/Input";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { GroundPosition } from "../../../component/GroundPosition/GroundPosition";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { useLoading } from "../../../component/Loading/LoadingContext";

export const AdminMembers: React.FC = () => {
  // フック
  const navigate = useNavigate();
  const err = useErrorArea();
  const load = useLoading();

  // 状態
  const [team, setTeam] = useState<TeamForm | null>();
  const [members, setMembers] = useState<Ability[]>([]);

  // 初期表示
  useEffect(() => {
    const init = async () => {
      load.startLoading();
      const r = await ajaxAdminApi.post('/members/init');
      const res = r.data as ResponseFormat;
      // const data = generateMembersForm();
      try {
        if(!res.isSuccess){
          load.stopLoading();
          return;
        }
        const data = res.data.data;
        setTeam(data.info);
        setMembers(data.members);
        load.stopLoading();
        return
      } catch (error) {
        console.log(error);
    load.stopLoading();
      }
    }
    init();
  }, [])

  const defaultMember =():PlayerForm => {
    return {name:'', disp_name:'', throw_distance:0, positions:'', player_id:crypto.randomUUID()}
  }

  // 新規追加用
  const [newMember, setNewMember] = useState<PlayerForm>(defaultMember());
  const [throwDistance, setThrowDistance] = useState<string>('');
  
  const updateNewMember = (key:keyof PlayerForm, val:string) => {
    if (key === 'throw_distance'){
      setThrowDistance(val);
    }else{
      setNewMember(prev => {
        return {...prev, [key]:val}
      })
    }
  }
  
  const clickPosition = (position:string) => {
    setNewMember(prev => {
      const posArr = prev.positions.split('');
      let newPosArr = []
      if(posArr.includes(position)){
        newPosArr = posArr.filter(pos => pos!==position);
      }else{
        newPosArr = [...posArr, position];
      }
      return {...prev, positions:newPosArr.sort().join('')}
    })
  }

  
  // モーダル操作
  const [isNewMemberMode, setIsNewMemberMode] = useState<boolean>(false);
  const clickNewMember = () => {
    setIsNewMemberMode(true);
  }
  const closeModal = () => {
    setIsNewMemberMode(false);
    err.reset();
    setNewMember(defaultMember());
    setThrowDistance('');
  }
  
  const clickMemberEditIcon = (playerId:string) => {
    navigate(`/admin/member/${playerId}`);
  }
  
  const addNewMember = async () => {
    load.startLoading();
    err.reset();
    const valid = PlayerFormSchema.safeParse({...newMember, throw_distance:Number.parseInt(throwDistance)})
    if(!valid.success){
      err.setErrors(convertToErrorInfos(valid.error));
      load.stopLoading();
      return 
    }
    try {
      const r = await ajaxAdminApi.post('/members/add', valid.data);
      const res = r.data as ResponseFormat;

      if(!res.isSuccess){
        err.setErrors(res.errors??[]);
        load.stopLoading();
        return;
      }
      const players:Ability[] = res.data.players;
      setMembers(players)
    } catch (error) {
      console.log(error);
    }
    closeModal();
    load.stopLoading();
  }
  return (
    <>
      {isNewMemberMode?(
        <Modal title="選手追加">
          <ErrorArea/>
          <CornerIcon icon={faXmark} onClick={closeModal}/>
          <Input label="選手名" attr="name" value={newMember.name} onChange={(e) => updateNewMember('name',e.target.value)}/>
          <Input label="表示名" attr="disp_name" value={newMember.disp_name} onChange={(e) => updateNewMember('disp_name',e.target.value)}/>
          <Input label="遠投距離（m）" attr="throw_distance" value={throwDistance} onChange={(e) => updateNewMember('throw_distance',e.target.value)}/>
          <SubTitle text="ポジション"/>
          <GroundPosition positions={newMember.positions.split('')} clickToggle={clickPosition}/>
          <ButtonArea>
            <Button label="追加する" isRadius='isRadius' size='md' onClick={addNewMember}/>
          </ButtonArea>
        </Modal>
      ):''}
      {team?(
        <Title text={`${team?.team_name}選手一覧`} />
      ):''}
      {members.map(member => {
        return (
          <>
            <div style={{ position: "relative" }}>
              <UserAbility player={member} />
              <CornerIcon icon={faPen} position='bottom-left' style={{ fontSize: 18 }} x={15} onClick={() => clickMemberEditIcon(member.player_id)} />
            </div>
          </>
        )
      })}
      <ButtonArea position='center'>
        <Button label="新規追加" isRadius='isRadius' size='md' onClick={clickNewMember}/>
      </ButtonArea>
    </>
  )
}