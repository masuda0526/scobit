import { GameFormSchema, type AdminGamesForms, type GameForm, type ResponseFormat, type TeamForm, type Tournament } from "@scobit/types";
import type React from "react";
import { GameItem } from "../../../component/GameItem/GameItem";
import { Title } from "../../../parts/title/title";
import { Button } from "../../../parts/button/button";
import { ButtonArea } from "../../../parts/button/buttonArea";
// import { generateAdminGamesForm } from "../../../testdatas/testDataCreater";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { useEffect, useState } from "react";
import { Modal } from "../../../component/Modal/Modal";
import { Input } from "../../../parts/input/Input";
import { CornerIcon } from "../../../component/Modal/CornerIcon";
import { faChevronRight, faPlusCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { parseOptionObjects } from "../../../parts/select/SelectBoxUtil";
import { SelectOfObj } from "../../../parts/select/SelectForObj";
import { parseStringFromDate } from "../../../Util/DateUtil/DateUtil";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { ScobitFunction } from "@scobit/common";
import { useNavigate } from "react-router-dom";
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { exceptionAdminProcess } from "../../../Util/CommonUtil/CommonUtil";

export const AdminGames: React.FC = () => {
    // 状態管理
    const load = useLoading();
    const err = useErrorArea();
    const navigator = useNavigate();

    // 初期表示
    const [games, setGames] = useState<GameForm[]>([]);
    const [team, setTeam] = useState<TeamForm | null>(null);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [initCompFlg, setInitializeComp] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            err.reset();
            load.startLoading();
            try {
                const r = await ajaxAdminApi.post('/games/init');
                const res = r.data as ResponseFormat;
                
                if(!res.isSuccess){
                    load.stopLoading();
                    return ;
                }
                const data = res.data.data as AdminGamesForms;
                setGames(data.games)
                setTeam(data.team);
                setTournaments(data.tournaments);
                setInitializeComp(true);
                load.stopLoading();
            } catch (error) {
                exceptionAdminProcess();
            }
        }
        // const data = generateAdminGamesForm();
        // setTeam(data.team);
        // setTournaments(data.tournaments);
        // setGames(data.games);
        init();
    }, [])

    // 試合情報の保持
    const tournamentObjs = parseOptionObjects(tournaments, 'tournament_id', 'name');

    // モーダル編集用
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // フォームの値
    const [game_dt, setGameDt] = useState<Date>(new Date());
    const [opponent, setOpponent] = useState<string>('');
    const [my_point, setMyPoint] = useState<string>('0');
    const [op_point, setOpPoint] = useState<string>('0');
    const [seq, setSeq] = useState<string>('1');
    const [tournament_id, setTournamentId] = useState<string>('');

    const clickAddGame = () => {
        setIsEdit(true);
    }

    const resetParam = () => {
        setOpponent('');
        setOpPoint('0');
        setMyPoint('0');
    }

    const closeModal = () => {
        // if(confirm('編集内容は保存されていません。\n追加画面を閉じますか？')){   
        err.reset()
        resetParam();
        setIsEdit(false);
        // }
    }
    const clickAddNewGame = async () => {
        load.startLoading();
        err.reset();

        // 追加する処理
        const input_my_point = Number.parseInt(my_point);
        const input_op_point = Number.parseInt(op_point);
        const result = ScobitFunction.getGameResult(input_my_point, input_op_point);
        const inputGame:GameForm = {
            game_id:crypto.randomUUID(),
            game_dt, opponent, tournament_id,
            seq: Number.parseInt(seq),
            my_point: input_my_point,
            op_point: input_op_point,
            result
        }
        const valid = GameFormSchema.safeParse(inputGame);
        if (!valid.success) {
            const errors = convertToErrorInfos(valid.error);
            err.setErrors(errors);
            load.stopLoading();
            return;
        }

        const r = await ajaxAdminApi.post('/games/new', valid.data);
        const res = r.data as ResponseFormat;
        if(!res.isSuccess){
            err.setErrors(res.errors??[]);
            load.stopLoading();
            return 
        }
        
        const games:GameForm[] = res.data.games;
        setGames(games);
        closeModal()
        load.stopLoading();
    }

    const clickMoveGamePage = ()=>{
        navigator('/admin/game/edit');
    }

    return (
        <div>
            {isEdit ? (
                <Modal title="試合結果を追加">
                    <CornerIcon x={15} y={15} onClick={() => closeModal()} position='top-right' icon={faXmark} />
                    <ErrorArea />
                    <Input type='date' attr='game_dt' label="試合日" value={parseStringFromDate(game_dt)} onChange={(e) => setGameDt(new Date(e.target.value))} />
                    <Input label="対戦相手" attr='opponent' value={opponent} onChange={(e) => setOpponent(e.target.value)} />
                    <Input type="number" min={0} attr='my_point' label="自チームの得点" value={my_point} onChange={(e) => setMyPoint(e.target.value)} />
                    <Input type="number" min={0} attr='op_point' label="相手チームの得点" value={op_point} onChange={(e) => setOpPoint(e.target.value)} />
                    <Input type="number" min={1} attr='seq' label="試合順" value={seq} onChange={(e) => setSeq(e.target.value)} />
                    <SelectOfObj attr="tournament_id" label="試合タイプ" value={tournament_id} options={tournamentObjs} onChange={(e) => setTournamentId(e.target.value)} />
                    <ButtonArea>
                        <Button label="追加する" onClick={clickAddNewGame} />
                    </ButtonArea>
                </Modal>
            ) : ''}
            <Title text="試合結果一覧" />
            <ContentBox>
                {team ? (
                    <>
                        <SubTitle text={`${team.team_name}`} />
                        <CornerIcon icon={faPlusCircle} onClick={clickAddGame} y={2}/>
                    </>
                ) : ''}
                {games.length > 0?'':(
                    <>
                        {initCompFlg?'試合結果の登録はありません。':'読み込み中...'}
                    </>
                )}
                {games.map((g) => {
                    let v = GameFormSchema.safeParse(g);
                    if(v.error){
                        return ;
                    }
                    let game = v.data;
                    return (
                        <div style={{position:'relative'}} key={game.game_id}>
                            <CornerIcon icon={faChevronRight} y={25} onClick={clickMoveGamePage}/>
                            <GameItem
                                key={game.game_id}
                                game={game}
                            >
                            </GameItem>
                        </div>
                    )
                }
                )}
            </ContentBox>
        </div>
    );
}