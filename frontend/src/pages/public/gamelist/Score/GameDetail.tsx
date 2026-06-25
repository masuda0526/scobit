import type React from "react";
import { Title } from "../../../../parts/title/title";
import { GameScore } from "../../../../component/GameItem/GameScore";
// import { generateGameDetailForm } from "../../../../testdatas/testDataCreater";
import { GameResult } from "../../../../component/GameResult/GameResult";
import { useEffect, useState } from "react";
import { type ScoreForm, type GameForm, type ResponseFormat, type GameDetail } from "@scobit/types";
import { useParams } from "react-router-dom";
import { useLoading } from "../../../../component/Loading/LoadingContext";
import { ajaxPublicApi } from "../../../../Util/AjaxUtil/AjaxUtil";
import { exceptionProcess } from "../../../../Util/CommonUtil/CommonUtil";
import { ScobitFunction } from "@scobit/common";
import { PageHistory, type PageHistoryItem } from "../../../../component/PageHistory/PageHistory";

export const GameDetailPage : React.FC = () => {
    const load = useLoading();
    const {publicId, gameId} = useParams();
    console.log(`publicId:${publicId}  gameId:${gameId}`);

    const [game, setGame] = useState<GameForm|null>(null)
    const [scores, setScores] = useState<ScoreForm[]>([]);

    const pages:PageHistoryItem[] = [
        {display:'チーム情報', url:`/team/${publicId}`},
        {display:'試合結果一覧', url:`/games/${publicId}`}
    ]

    useEffect(() => {
        const init = async() => {
            load.startLoading();
            try {
                const r = await ajaxPublicApi.get(`/game/score?public_id=${publicId}&game_id=${gameId}`);
                const res = r.data as ResponseFormat;
                console.log(res);
                const data = res.data.data as GameDetail;
                setGame(ScobitFunction.convertToGameForm(data.game));
                setScores(data.scores);
                load.stopLoading();
            } catch (error) {
                exceptionProcess()
            }
        }
        init();
        // const data = generateGameDetailForm();
    }, [])
    return (
        <>
            <PageHistory pages={pages}/>
            <Title text="試合結果詳細"/>
            {game?(
                <GameResult game={game} />
            ):''}
            {scores.map(score => {
                return (<GameScore score={score}/>)
            })}
        </>
    )
}