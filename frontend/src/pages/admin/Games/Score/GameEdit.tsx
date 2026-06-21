import type React from "react";
import styles from './GameEdit.module.css';
// import { generateAdminGameEditForm } from "../../../../testdatas/testDataCreater";
import { useEffect, useState } from "react";
import { type PlayerForm, type ScoreForm, type GameForm, type Tournament, GameFormSchema, type ErrorInfo, ScoreFormSchema, type ResponseFormat, type AdminGameEditForm } from "@scobit/types";
import { Toggle } from "../../../../parts/toggle/toggle";
import { MemberLabel } from "../../../../component/UserAbility/MemberLabel";
import { SubTitle } from "../../../../parts/subtitle/subtitle";
import { parseStringFromDate } from "../../../../Util/DateUtil/DateUtil";
import { ContentBox } from "../../../../parts/content/contentBox";
import { CornerIcon } from "../../../../component/Modal/CornerIcon";
import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../../../../component/Modal/Modal";
import { Input } from "../../../../parts/input/Input";
import { SelectOfObj } from "../../../../parts/select/SelectForObj";
import { parseOptionObjects } from "../../../../parts/select/SelectBoxUtil";
import { ButtonArea } from "../../../../parts/button/buttonArea";
import { Button } from "../../../../parts/button/button";
import { convertToErrorInfos } from "../../../../Util/ZodUtils";
import { useErrorArea } from "../../../../component/ErrorArea/ErrorAreaContext";
import { useLoading } from "../../../../component/Loading/LoadingContext";
import { ErrorArea } from "../../../../component/ErrorArea/ErrorArea";
import { validConstantScore } from "../../../../Util/Validation/ScoreValid";
import { useNavigate, useParams } from "react-router-dom";
import { ajaxAdminApi } from "../../../../Util/AjaxUtil/AjaxUtil";
import { ScobitFunction } from "@scobit/common";
import { PageHistory, type PageHistoryItem } from "../../../../component/PageHistory/PageHistory";

type PlayerAndScore = {
  score: ScoreForm;
  errors:ErrorInfo[];  
} & PlayerForm

type ExtErrorInfo = {
  player_id:string,
  errors:ErrorInfo[]
}

export const AdminGameEdit: React.FC = () => {
  // プロバイダー
  const navigate = useNavigate();
  const err = useErrorArea();
  const loading = useLoading();

  // パラメータ
  const {gameId} = useParams();

  // 状態
  const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
  const [game, setGame] = useState<GameForm | null>(null);
  const [editGame, setEditGame] = useState<GameForm | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [players, setPlayers] = useState<PlayerAndScore[]>([]);

  // ページヒストリ
  const pageHistorys:PageHistoryItem[] = [
    {display:'チーム情報', url:'/admin/team'},
    {display:'試合結果一覧', url:'/admin/games'}
  ]

  const defaultScore = (playerId: string, scoreId: string, gameId?: string): ScoreForm => {
    return {
      hit: 0,
      hr: 0,
      box: 0,
      player_id: playerId,
      steal: 0,
      err: 0,
      score_id: scoreId,
      game_id: gameId,
      is_turn: false
    }
  }

  // 初期表示処理
  useEffect(() => {
    const init = async () => {
      err.reset()
      loading.startLoading();
      if(!gameId){
        alert('試合情報が存在しません。\n試合結果一覧へ遷移します。');
        loading.stopLoading();
        navigate('/admin/games')
        return ;
      }

      try {
        const r = await ajaxAdminApi.post('/game/edit/init', {game_id:gameId});
        const res = r.data as ResponseFormat;
        if(!res.isSuccess){
          const es = res.errors??[];
          const messages = es.map(e => e.message);
          if(messages.length === 0){
            alert('試合情報の取得に失敗しました。\n試合結果一覧画面へ戻ります。');
          }else{
            alert(messages.join('\n'));
          }
          loading.stopLoading();
          navigate('/admin/games');
          return;
        }else{
          // const data = generateAdminGameEditForm();
          const data = res.data.data as AdminGameEditForm;
          setGame(ScobitFunction.convertToGameForm(data.game));
          setEditGame(ScobitFunction.convertToGameForm(data.game));
          const playerAndScores: PlayerAndScore[] = [];
          data.members.forEach(player => {
            const score = data.scores.find(sc => sc.player_id === player.player_id);
            playerAndScores.push({ ...player, score: score ? score : defaultScore(player.player_id, crypto.randomUUID(), game?.game_id), errors:[] })
          })
          setPlayers(playerAndScores);
          setTournaments(data.tournaments);
        }
        loading.stopLoading();
      } catch (error) {
        console.log(error);
        loading.stopLoading();
      }
    }
    init();
  }, [])

  const tournamentObjs = parseOptionObjects(tournaments, 'tournament_id', 'name');

  //============================================
  //　試合編集関連処理
  //============================================
  const clickEditGame = () => {
    err.reset();
    setIsModalEdit(prev => {
      if (prev) {
        setEditGame(game);
        err.reset();
      }
      return !prev
    });
  }

  const updateGame = (key: keyof GameForm, value: string | number | Date) => {
    setEditGame(prev => prev ? { ...prev, [key]: value } : prev);
  }

  const clickEditButton = async () => {
    loading.startLoading();
    err.reset()
    const valid = GameFormSchema.safeParse(editGame)
    if (!valid.success) {
      const errors = convertToErrorInfos(valid.error);
      err.setErrors(errors);
      loading.stopLoading();
      return;
    }
    try {
      const r = await ajaxAdminApi.post('/game/edit/update', valid.data);
      const res = await r.data as ResponseFormat;
      if(!res.isSuccess){
        err.setErrors(res.errors??[]);
      }else{
        const updatedGame = ScobitFunction.convertToGameForm(res.data.data);
        setGame(updatedGame);
        setEditGame(updatedGame);
      }
      loading.stopLoading();
    } catch (error) {
      console.log(error);
      loading.stopLoading();
      return
    }
    setIsModalEdit(false);
  }

  //=========================================
  //　選手成績編集処理
  //=========================================

  const updateScore = (
    playerId: string,
    key: keyof ScoreForm,
    value: number | boolean | string
  ) => {
    setPlayers(prev => prev.map(
      player => player.player_id === playerId ?
        { ...player, score: { ...player.score, [key]: value } }
        : player
    ));
  }

  const toggleTurn = (playerId: string) => {
    setPlayers(prev => prev.map(player => {
      if (player.player_id !== playerId) return player;

      if (player.score.is_turn) {
        return { ...player, score: defaultScore(player.player_id, player.score.score_id, player.score.game_id) }
      } else {
        return { ...player, score: { ...player.score, is_turn: true } }
      }
    }))
  }

  const validScore = () => {
    let errorCount = 0;
    const newPlayers = players.map(player => {
      const valid = ScoreFormSchema.safeParse(player.score);
      if(!valid.success) {
        errorCount ++;
        const errors = convertToErrorInfos(valid.error);
        return {...player, errors};
      }
      const addErrors = validConstantScore(player.score);
      if(addErrors.length > 0){
        errorCount ++;
        return {...player, errors:addErrors};
      }
      return {...player, errors:[]}
    })
    setPlayers(newPlayers);
    return errorCount > 0;
  }

  const putExtErrors = (errors:ExtErrorInfo[]) => {
    let newPlayers = [...players];1
    errors.forEach(e => {
      const pl = newPlayers.find(p => p.player_id === e.player_id);
      if(pl){
        pl.errors = e.errors;
        newPlayers = [...newPlayers, pl]
      }
    })
  }

  const editCompButton = async () => {
    loading.startLoading();
    const isError = validScore();
    if(isError){
      loading.stopLoading();
      return;
    }
    const scores = players.map(p => {
      p.score.game_id = game?.game_id;
      return p.score;
    });
    try {
      const r = await ajaxAdminApi.post('/scores/update', scores);
      const res = r.data as ResponseFormat;
      if(!res.isSuccess){
        const exerrs = res.data.extErrors as ExtErrorInfo[];
        if(exerrs){
          putExtErrors(exerrs);
        }else{
          const es = res.errors??[]
          alert(es.length > 0?es.map(e => e.message).join('\n') :'予期せぬエラーが発生しました。');
        }
        loading.stopLoading();
      }else{
        const fetchScores:ScoreForm[] = res.data.updatedScores;
        let newPlayers = [...players];
        for(const s of fetchScores){
          const p = newPlayers.find(p => p.player_id === s.player_id);
          if(p){
            newPlayers = [...newPlayers, p];
          }
        }
        setPlayers(newPlayers);
        loading.stopLoading();
        navigate('/admin/games');
      }
    } catch (error) {
      console.log(error);
      loading.stopLoading();
    }
  } 

  return (
    <>
      <PageHistory pages={pageHistorys}/>
      {game ? (
        <>
          {isModalEdit && editGame ? (
            <Modal title="試合結果編集">
              <CornerIcon icon={faXmark} onClick={clickEditGame} />
              <ErrorArea></ErrorArea>
              <Input type="date" attr="game_dt" label="試合日" value={parseStringFromDate(editGame.game_dt)} onChange={(e) => updateGame('game_dt', new Date(e.target.value))} />
              <Input type="text" attr="opponent" label="対戦相手" value={editGame.opponent} onChange={(e) => updateGame('opponent', e.target.value)} />
              <Input type="number" attr="op_point" label="相手チームの得点" value={editGame.op_point} onChange={(e) => updateGame('op_point', Number.parseInt(e.target.value))} />
              <Input type="number" attr="my_point" label="自チームの得点" value={editGame.my_point} onChange={(e) => updateGame('my_point', Number.parseInt(e.target.value))} />
              <Input type="number" attr="seq" label="試合順" value={editGame.seq} onChange={(e) => updateGame('seq', Number.parseInt(e.target.value))} />
              <SelectOfObj attr="tournament_id" label="試合タイプ" value={editGame.tournament_id} options={tournamentObjs} onChange={(e) => updateGame('tournament_id', e.target.value)} />
              <ButtonArea>
                <Button label="更新する" isRadius='isRadius' onClick={clickEditButton} />
              </ButtonArea>
            </Modal>
          ) : ''}
          <ContentBox>
            <CornerIcon icon={faPencil} onClick={clickEditGame} />
            <SubTitle text="試合結果" />
            <div className={styles.game}>
              <div className={styles.info}>
                <p className={styles.date}>{parseStringFromDate(game.game_dt)} （{game.seq}試合目）</p>
              </div>
              <div className={styles.result}>
                <p>
                  {game.my_point} - {game.op_point}
                </p>
                <p className={styles.opponent}> vs {game.opponent}</p>

              </div>
            </div>
          </ContentBox>
        </>
      ) : ''}
      <ContentBox>
        <SubTitle text="選手成績" />
        <div className={styles.list}>
          {players.map((player) => {
            return (
              <div className={styles.card} >
                <div className={styles.header}>
                  <MemberLabel name={player.disp_name} positions={player.positions} />
                  <Toggle isOn={player.score.is_turn} onClick={() => toggleTurn(player.player_id)} />
                </div>
                <div className={styles.formbox}>
                  <div className={styles.formitem}>
                    <label className={styles.label}>打席</label>
                    <input className={styles.form} type="text" value={player.score.box} onChange={(e) => updateScore(player.player_id, 'box', e.target.value===''?0:Number(e.target.value))} disabled={!player.score.is_turn} />
                  </div>
                  <div className={styles.formitem}>
                    <label className={styles.label}>安打</label>
                    <input className={styles.form} type="text" value={player.score.hit} onChange={(e) => updateScore(player.player_id, 'hit', e.target.value===''?0:Number(e.target.value))} disabled={!player.score.is_turn} />
                  </div>
                  <div className={styles.formitem}>
                    <label className={styles.label}>本塁打</label>
                    <input className={styles.form} type="text" value={player.score.hr} onChange={(e) => updateScore(player.player_id, 'hr', e.target.value===''?0:Number(e.target.value))} disabled={!player.score.is_turn} />
                  </div>
                  <div className={styles.formitem}>
                    <label className={styles.label}>盗塁</label>
                    <input className={styles.form} type="text" value={player.score.steal} onChange={(e) => updateScore(player.player_id, 'steal', e.target.value===''?0:Number(e.target.value))} disabled={!player.score.is_turn} />
                  </div>
                  <div className={styles.formitem}>
                    <label className={styles.label}>エラー</label>
                    <input className={styles.form} type="text" value={player.score.err} onChange={(e) => updateScore(player.player_id, 'err', e.target.value===''?0:Number(e.target.value))} disabled={!player.score.is_turn} />
                  </div>
                </div>
                {player.errors.length>0?(
                  <ul>
                    {player.errors.map(err => <li className={styles.err}>{err.message}</li>)}
                  </ul>
                ):''}
              </div>
            )
          })}
        </div>
        <ButtonArea>
          <Button label="更新する" isRadius='isRadius' onClick={editCompButton}/>
        </ButtonArea>
      </ContentBox>
    </>
  )
}
