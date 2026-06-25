import { ErrorInfo, GameForm, GameInput, GameResultConsts, ScoreForm, TeamForm } from "@scobit/types";
import { PoolClient } from "pg";
export declare class ScobitFunction {
    static getGameResult(my_point: number, op_point: number, isNoGame?: boolean): typeof GameResultConsts[number];
    static validGame(game: GameForm, teamOrAccountId: string, client: PoolClient): Promise<ErrorInfo[]>;
    static validScore(score: ScoreForm): ErrorInfo[];
    static parseGameFormToGameInput(game: GameForm): GameInput;
    static convertToGameForms(beforeGames: any[]): GameForm[];
    static convertToGameForm(beforeGame: any): GameForm | null;
    static convertToTeamForm(beforeTeam: any): TeamForm | null;
}
//# sourceMappingURL=ScobitFunction.d.ts.map