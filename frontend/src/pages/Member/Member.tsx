import type React from "react";
import { Title } from "../../parts/title/title";
import { UserAbility } from "../../component/UserAbility/UserAbility";
import { testPlayers } from "../../testdatas/members";
import { GroundPosition } from "../../component/GroundPosition/GroundPosition";
import { useState } from "react";
import { SubTitle } from "../../parts/subtitle/subtitle";
import { ContentBox } from "../../parts/content/contentBox";
import { Input } from "../../parts/input/Input";
import { ButtonArea } from "../../parts/button/buttonArea";
import { Button } from "../../parts/button/button";

export const Member: React.FC = () => {
    const data = testPlayers[0]

    const [positions, setPositions] = useState<string[]>(data.pos.split(""));
    const [isEditMode, setEditFlg] = useState<boolean>(false)
    
    const positionToggle = (position: string) => {

        if(!isEditMode)return; // 編集モードでなければ処理しない
        
        if (positions.includes(position)) {
            setPositions(prev => prev.filter(p => p !== position))
        } else {
            setPositions(prev => [...prev, position])
        }
    }

    const handleClickEditMode = () => {setEditFlg(!isEditMode)}


    return (
        <>
            <Title text="選手詳細" />
            <ContentBox>
                <SubTitle text="能力値" />
                <UserAbility player={data}></UserAbility>
            </ContentBox>

            <ContentBox>
                <SubTitle text="ポジション" />
                <GroundPosition
                    positions={positions}
                    clickToggle={positionToggle}
                ></GroundPosition>
            </ContentBox>

            <ContentBox>
                <SubTitle text="プロフィール"/>
                <Input label="氏名" isEditMode={isEditMode} value={"あああ"}></Input>
                <Input label="選手" isEditMode={isEditMode} value={"いいい"}></Input>
                <ButtonArea>
                    <Button 
                        label={isEditMode?"変更する":"編集する"} 
                        onClick={handleClickEditMode} 
                        isRadius={'isRadius'} 
                        size={'md'}
                    />
                </ButtonArea>
            </ContentBox>

        </>
    )
}