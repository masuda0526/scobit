import type React from "react";
import { Title } from "../../../parts/title/title";
import { UserAbility } from "../../../component/UserAbility/UserAbility";
import { GroundPosition } from "../../../component/GroundPosition/GroundPosition";
import { useEffect, useState } from "react";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { ContentBox } from "../../../parts/content/contentBox";
import { Input } from "../../../parts/input/Input";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { type Ability, type ScoreItemDto } from "@scobit/types";
import { ScoreItem } from "../../../component/ScoreItem/ScoreItem";
import { generateMemberForm } from "../../../testdatas/testDataCreater";

export const AdminMember: React.FC = () => {
    const [player, setPlayer] = useState<Ability | null>();
    const [scores, setScores] = useState<ScoreItemDto[]>([])
    const [positions, setPositions] = useState<string[]>([]);
    const [isEditMode, setEditFlg] = useState<boolean>(false)

    const [player_name, setPlayerName] = useState<string>('');
    const [disp_name, setDispName] = useState<string>('');
    const [throw_distance, setThrowDistance] = useState<string>('');

    useEffect(() => {
        const data = generateMemberForm();
        const p = data.info;
        setPlayer(p);
        setScores(data.scores);
        setPositions(data.info.positions.split(''))
        setPlayerName(p.name);
        setDispName(p.disp_name);
        setThrowDistance(p.throw_distance.toString());
    }, [])

    
    const positionToggle = (position: string) => {
        
        if (!isEditMode) return; // 編集モードでなければ処理しない

        if (positions.includes(position)) {
            setPositions(prev => prev.filter(p => p !== position))
        } else {
            setPositions(prev => [...prev, position])
        }
    }

    const handleClickEditMode = () => { 
        if(isEditMode && player){
            setPlayer({...player, disp_name:disp_name, name:player_name, throw_distance:Number.parseInt(throw_distance), positions:positions.join()})
        }
        setEditFlg(!isEditMode) 
    }


    return (
        <>
            {player ? (
                <>
                    <Title text="選手詳細" />
                    <ContentBox>
                        <SubTitle text="能力値" />
                        <UserAbility player={player}></UserAbility>
                    </ContentBox>

                    <ContentBox>
                        <SubTitle text="ポジション" />
                        <GroundPosition
                            positions={positions}
                            clickToggle={positionToggle}
                        ></GroundPosition>
                    </ContentBox>

                    <ContentBox>
                        <SubTitle text="プロフィール" />
                        <Input
                            attr="player_name"
                            label="氏名"
                            isEditMode={isEditMode}
                            value={player_name}
                            onChange={(e)=>setPlayerName(e.target.value)}
                        ></Input>
                        <Input
                            attr="disp_name"
                            label="表示名"
                            isEditMode={isEditMode}
                            value={disp_name}
                            onChange={(e)=>setDispName(e.target.value)}
                        ></Input>
                        <Input
                            attr="throw_distance"
                            label="遠投距離(m)"
                            isEditMode={isEditMode}
                            value={throw_distance}
                            onChange={(e)=>setThrowDistance(e.target.value)}
                        ></Input>
                        <ButtonArea>
                            <Button
                                label={isEditMode ? "変更する" : "編集する"}
                                onClick={handleClickEditMode}
                                isRadius={'isRadius'}
                                size={'md'}
                            />
                        </ButtonArea>
                    </ContentBox>

                    <ContentBox>
                        <SubTitle text="試合結果" />
                        {scores.map(score => {
                            return (<ScoreItem key={score.game_id} {...score}></ScoreItem>)
                        })}
                        <ButtonArea position="right">
                            <a href="#/member/games">一覧を見る</a>
                        </ButtonArea>
                    </ContentBox>
                </>

            ) : ''}

        </>
    )
}