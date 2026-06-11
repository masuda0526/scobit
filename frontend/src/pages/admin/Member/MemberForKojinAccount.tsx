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
import { AbilitySchema, type Ability, type ResponseFormat } from "@scobit/types";
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { PageHistory } from "../../../component/PageHistory/PageHistory";

export const AdminMemberForKojinAccount: React.FC = () => {
    const err = useErrorArea();
    const load = useLoading();

    const [player, setPlayer] = useState<Ability | null>();
    const [positions, setPositions] = useState<string[]>([]);
    const [isEditMode, setEditFlg] = useState<boolean>(false)

    const [player_name, setPlayerName] = useState<string>('');
    const [disp_name, setDispName] = useState<string>('');
    const [throw_distance, setThrowDistance] = useState<string>('');

    useEffect(() => {
        const init = async () => {
            try {
                err.reset();
                load.startLoading();

                const r = await ajaxAdminApi.post('/member/kojin/init');
                const response = r.data as ResponseFormat;
                const fetchPlayer = response.data.info as Ability;
                // console.log(response);
                if (!response.isSuccess) {
                    err.setErrors(response.errors ?? []);
                    load.stopLoading();
                    return;
                }

                setPlayer(fetchPlayer);
                setPlayerName(fetchPlayer.name);
                setDispName(fetchPlayer.disp_name);
                setThrowDistance(fetchPlayer.throw_distance.toString());
                setPositions(fetchPlayer.positions.split(''))
                load.stopLoading();

            } catch (error) {
                console.log(error);
                load.stopLoading();
            }
        }
        init();
    }, [])


    const positionToggle = (position: string) => {

        if (!isEditMode) return; // 編集モードでなければ処理しない

        if (positions.includes(position)) {
            setPositions(prev => prev.filter(p => p !== position))
        } else {
            setPositions(prev => [...prev, position])
        }
    }

    const handleClickEditMode = async () => {
        load.startLoading();
        err.reset();
        if (isEditMode && player) {
            const valid = schema.safeParse({name:player_name, disp_name,throw_distance:Number.parseInt(throw_distance)});
            if(!valid.success){
                load.stopLoading();
                err.setErrors(convertToErrorInfos(valid.error));
                return;
            }
            const r = await ajaxAdminApi.post('/member/kojin/update', {...player, ...valid.data, positions:positions.join('')});
            const response = r.data as ResponseFormat;
            // console.log(response);
            if(!response.isSuccess){
                err.setErrors(response.errors??[]);
            }else{
                setPlayer(response.data.player);
            }
            load.stopLoading();
        }
        setEditFlg(!isEditMode)
        load.stopLoading();
    }


    return (
        <>
            <PageHistory pages={[
                {display:'マイページ',url:'/admin/mypage'}, 
            ]}/>
            <Title text="選手詳細" />
            <ErrorArea />
            {player ? (
                <>
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
                            onChange={(e) => setPlayerName(e.target.value)}
                        ></Input>
                        <Input
                            attr="disp_name"
                            label="表示名"
                            isEditMode={isEditMode}
                            value={disp_name}
                            onChange={(e) => setDispName(e.target.value)}
                        ></Input>
                        <Input
                            attr="throw_distance"
                            label="遠投距離(m)"
                            isEditMode={isEditMode}
                            value={throw_distance}
                            onChange={(e) => setThrowDistance(e.target.value)}
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
                </>

            ) : ''}
        
        </>
    )
}

const schema = AbilitySchema.pick({
    name:true,
    disp_name:true,
    throw_distance:true
})