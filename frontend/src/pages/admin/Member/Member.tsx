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
import { PlayerFormSchema, type Ability, type PlayerForm, type ResponseFormat, type ScoreItemDto } from "@scobit/types";
import { ScoreItem } from "../../../component/ScoreItem/ScoreItem";
// import { generateMemberForm } from "../../../testdatas/testDataCreater";
import { useParams } from "react-router-dom";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { PageHistory, type PageHistoryItem } from "../../../component/PageHistory/PageHistory";

export const AdminMember: React.FC = () => {
    const { playerId } = useParams();

    const err = useErrorArea();
    const load = useLoading();

    const [player, setPlayer] = useState<Ability | null>();
    const [scores, setScores] = useState<ScoreItemDto[]>([])
    const [positions, setPositions] = useState<string[]>([]);
    const [isEditMode, setEditFlg] = useState<boolean>(false)

    const [player_name, setPlayerName] = useState<string>('');
    const [disp_name, setDispName] = useState<string>('');
    const [throw_distance, setThrowDistance] = useState<string>('');

    let pageHistories:PageHistoryItem[] = [
        {display:'チーム情報', url:'/admin/team'},
        {display:'選手一覧', url:'/admin/members'}
    ]

    const setPlayerForm = (p:Ability) => {
        setPlayer(p);
        setPlayerName(p.name);
        setDispName(p.disp_name);
        setThrowDistance(p.throw_distance.toString());
        setPositions(p.positions.split(''));
    }

    useEffect(() => {
        const init = async () => {

            load.startLoading();
            err.reset();

            if (!playerId) {
                err.addError({ field: 'playerId', message: '選手情報がありません。' })
                load.stopLoading();
            } else {
                try {
                    const r = await ajaxAdminApi.post('/member/init', { player_id: playerId });
                    const res = r.data as ResponseFormat;
                    if (!res.isSuccess) {
                        err.setErrors(res.errors ?? []);
                        load.stopLoading();
                        return;
                    }
                    // const data = generateMemberForm();
                    const data = res.data.data;
                    const p = data.info;

                    setPlayerForm(p)
                    setScores(data.scores);
                    load.stopLoading();

                    return;
                } catch (error) {
                    console.log(error);
                    load.stopLoading();
                    return;
                }
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
            const inputPlayer:PlayerForm = { disp_name: disp_name, name: player_name, throw_distance: Number.parseInt(throw_distance), positions: positions.join(''), player_id:player.player_id }

            const valid = PlayerFormSchema.safeParse(inputPlayer);
            if (!valid.success) {
                err.setErrors(convertToErrorInfos(valid.error));
                load.stopLoading();
                return;
            }
            try {
                const r = await ajaxAdminApi.post('/member/update', valid.data);
                const res = r.data as ResponseFormat;
                if (!res.isSuccess) {
                    err.setErrors(res.errors ?? []);
                } else {
                    const data = res.data.player as Ability;
                    setPlayerForm(data);
                }
                load.stopLoading();
                setEditFlg(!isEditMode)
                return;
            } catch (error) {
                console.log(error);
            }
            // setPlayer({ ...player, disp_name: disp_name, name: player_name, throw_distance: Number.parseInt(throw_distance), positions: positions.join() })
        }
        setEditFlg(!isEditMode)
        load.stopLoading();
    }


    return (
        <>
            <PageHistory pages={pageHistories}/>
            <ErrorArea />
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

                    <ContentBox>
                        <SubTitle text="試合結果" />
                        {scores.length > 0 ? (
                            <>
                                {scores.map(score => <ScoreItem key={score.game_id} {...score}></ScoreItem>)}
                                <ButtonArea position="right">
                                    <a href={`/admin/member/scores/${playerId}`}>一覧を見る</a>
                                </ButtonArea>
                            </>
                        )
                            : (
                                <>
                                    <p>成績の登録がありません。</p>
                                </>
                            )}
                    </ContentBox>
                </>

            ) : ''}

        </>
    )
}