import type React from "react";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { Input } from "../../../parts/input/Input";
import { SelectOfObj } from "../../../parts/select/SelectForObj";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { type Tournament, type GameInput, type ScoreInput, type ResponseFormat, GameFormSchema, ScoreFormSchema, type ErrorInfo } from "@scobit/types";
import { getDateString } from "../../../Util/DateUtil/DateUtil";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { useEffect, useState } from "react";
import { parseOptionObjects } from "../../../parts/select/SelectBoxUtil";
import styles from './AddGameForKojin.module.css';
import { ajaxAdminApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { exceptionAdminProcess } from "../../../Util/CommonUtil/CommonUtil";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { useNavigate, useParams } from "react-router-dom";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { ScobitFunction } from "@scobit/common";
import { PageHistory } from "../../../component/PageHistory/PageHistory";
import { Title } from "../../../parts/title/title";

export const AddGameForKojinUser: React.FC = () => {
  const err = useErrorArea();
  const navigator = useNavigate();
  const load = useLoading();

  const {gameId} = useParams();

  const initGame = (): GameInput => {
    return {
      game_id: crypto.randomUUID(),
      seq: '1',
      tournament_id: '',
      opponent: '',
      my_point: '0',
      op_point: '0',
      game_dt: getDateString(),
      result: 'no-game'
    }
  }
  const initScore = (): ScoreInput => {
    return {
      score_id: crypto.randomUUID(),
      game_id: crypto.randomUUID(),
      player_id: crypto.randomUUID(),
      is_turn: true,
      box: '0',
      hit: '0',
      hr: '0',
      steal: '0',
      err: '0'
    }
  }
  const [game, setGame] = useState<GameInput>(initGame());
  const [score, setScore] = useState<ScoreInput>(initScore());
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const editGame = (key: keyof GameInput, val: string) => {
    setGame(prev => ({ ...prev, [key]: val }));
  }
  const editScore = (key: keyof ScoreInput, val: string) => [
    setScore(prev => ({ ...prev, [key]: val }))
  ]

  useEffect(() => {
    const init = async () => {
      try {
        err.reset();
        load.startLoading();
        const r = await ajaxAdminApi.post('/game/new/kojin/init', {gameId:gameId});
        const response = r.data as ResponseFormat;
        if(!response.isSuccess){
          load.stopLoading()
          return;
        }
        setTournaments(response.data.tournaments);
        const fetchGame = GameFormSchema.safeParse(response.data.game).data;
        const fetchScore = response.data.score;
        if(fetchGame){
          setGame(ScobitFunction.parseGameFormToGameInput(fetchGame));
        }
        if(fetchScore){
          setScore(fetchScore);
        }
        load.stopLoading()
      } catch (error) {
        console.log(error);
        load.stopLoading()
        exceptionAdminProcess();
      }
    }
    init();
  }, [])


  const addNewGame = async () => {
    load.startLoading();
    err.reset();
    const scoreValid = ScoreFormSchema.safeParse(score);
    const gameValid = GameFormSchema.safeParse(game);
    let errors : ErrorInfo[] = []
    if(!scoreValid.success){
      errors = [...errors, ...convertToErrorInfos(scoreValid.error)]
    }
    if(!gameValid.success){
      errors = [...errors, ...convertToErrorInfos(gameValid.error)];
    }
    const inputScore = scoreValid.data;
    if(errors.length === 0 && inputScore){
      errors = [...errors, ...ScobitFunction.validScore(inputScore)];
    }
    if(errors.length > 0){
      err.setErrors(errors);
      load.stopLoading();
      return;
    }
    try {
      const r = await ajaxAdminApi.post('/game/new/kojin/add', {game:gameValid.data, score:scoreValid.data});
      const response = r.data as ResponseFormat;
      if(!response.isSuccess){
        err.setErrors(response.errors??[]);
        load.stopLoading();
        return;
      }
      navigator('/admin/mypage');
    } catch (error) {
      console.log(error);
      load.stopLoading();
      exceptionAdminProcess();
    }
  }

  const updateGame = async () => {
    load.startLoading();
    err.reset();
    const scoreValid = ScoreFormSchema.safeParse(score);
    const gameValid = GameFormSchema.safeParse(game);
    let errors : ErrorInfo[] = []
    if(!scoreValid.success){
      errors = [...errors, ...convertToErrorInfos(scoreValid.error)]
    }
    if(!gameValid.success){
      errors = [...errors, ...convertToErrorInfos(gameValid.error)];
    }
    const inputScore = scoreValid.data;
    if(errors.length === 0 && inputScore){
      errors = [...errors, ...ScobitFunction.validScore(inputScore)];
    }
    if(errors.length > 0){
      err.setErrors(errors);
      load.stopLoading();
      return;
    }
    try {
      const r = await ajaxAdminApi.post('/game/update/kojin', {game:gameValid.data, score:scoreValid.data});
      const response = r.data as ResponseFormat;
      if(!response.isSuccess){
        err.setErrors(response.errors??[]);
        load.stopLoading();
        return;
      }
      navigator('/admin/mypage');
    } catch (error) {
      console.log(error);
      load.stopLoading();
      exceptionAdminProcess();
    }
  }

  return (
    <>
      <PageHistory pages={[{display:'マイページ',url:'/admin/mypage'}]} />
      <Title text="試合結果追加"/>
      <ErrorArea />
      <ContentBox>
        <SubTitle text="試合結果" />
        <Input type='date' attr='game_dt' label="試合日" value={game.game_dt} onChange={(e) => editGame('game_dt', e.target.value)} />
        <Input label="対戦相手" attr='opponent' value={game.opponent} onChange={(e) => editGame('opponent', e.target.value)} />
        <Input type="number" min={0} attr='my_point' label="自チームの得点" value={game.my_point} onChange={(e) => editGame('my_point', e.target.value)} />
        <Input type="number" min={0} attr='op_point' label="相手チームの得点" value={game.op_point} onChange={(e) => editGame('op_point', e.target.value)} />
        <Input type="number" min={1} attr='seq' label="試合順" value={game.seq} onChange={(e) => editGame('seq', e.target.value)} />
        <SelectOfObj attr="tournament_id" label="試合タイプ" value={game.tournament_id} options={parseOptionObjects(tournaments, 'tournament_id', 'name')} onChange={(e) => editGame('tournament_id', e.target.value)} />
      </ContentBox>
      <ContentBox>
        <SubTitle text="成績" />
        <div className={styles.formbox}>
          <div className={styles.formitem}>
            <label className={styles.label}>打席</label>
            <input className={styles.form} type="number" value={score.box} onChange={(e) => editScore('box', e.target.value)} />
          </div>
          <div className={styles.formitem}>
            <label className={styles.label}>安打</label>
            <input className={styles.form} type="number" value={score.hit} onChange={(e) => editScore('hit', e.target.value)} />
          </div>
          <div className={styles.formitem}>
            <label className={styles.label}>本塁打</label>
            <input className={styles.form} type="number" value={score.hr} onChange={(e) => editScore('hr', e.target.value)} />
          </div>
          <div className={styles.formitem}>
            <label className={styles.label}>盗塁</label>
            <input className={styles.form} type="number" value={score.steal} onChange={(e) => editScore('steal', e.target.value)} />
          </div>
          <div className={styles.formitem}>
            <label className={styles.label}>エラー</label>
            <input className={styles.form} type="number" value={score.err} onChange={(e) => editScore('err', e.target.value)} />
          </div>
        </div>
      </ContentBox>
      <ButtonArea>
        {gameId?(
          <Button label="変更する" onClick={updateGame}/>
        ):(
          <Button label="追加する" onClick={addNewGame}/>
        )}
      </ButtonArea>
    </>
  )
}