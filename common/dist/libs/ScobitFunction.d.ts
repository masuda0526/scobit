import { ErrorInfo, GameForm, GameInput, GameResultConsts, ScoreForm } from "@scobit/types";
import { PoolClient } from "pg";
export declare class ScobitFunction {
    static getGameResult(my_point: number, op_point: number, isNoGame?: boolean): typeof GameResultConsts[number];
    static validGame(game: GameForm, teamOrAccountId: string, client: PoolClient): Promise<ErrorInfo[]>;
    static validScore(score: ScoreForm): ErrorInfo[];
    static parseGameFormToGameInput(game: GameForm): GameInput;
}
//# sourceMappingURL=ScobitFunction.d.ts.map