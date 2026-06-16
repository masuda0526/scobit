import { GameFormSchema } from "@scobit/types";
export class ScobitFunction {
    static getGameResult(my_point, op_point, isNoGame = false) {
        if (isNoGame) {
            return 'no-game';
        }
        if (my_point > op_point) {
            return 'win';
        }
        if (my_point < op_point) {
            return 'lose';
        }
        if (my_point === op_point) {
            return 'draw';
        }
        return 'no-game';
    }
    static async validGame(game, teamOrAccountId, client) {
        const errors = [];
        if (game.result !== this.getGameResult(game.my_point, game.op_point, game.result === 'no-game')) {
            errors.push({ field: 'game', message: '試合結果が誤っています。' });
        }
        const result = await client.query(`
      select g.game_id from games g 
      where g.team_id = $1  
      and g.game_dt = $2 
      and g.seq = $3
      ;
      `, [teamOrAccountId, game.game_dt, game.seq]);
        if (result.rows.length > 0) {
            errors.push({ field: 'seq', message: '同日に試合順が重複しています。' });
        }
        return errors;
    }
    static validScore(score) {
        const errors = [];
        if (score.box < score.hit) {
            errors.push({ field: 'hit', message: '安打数が打席数を超えています。' });
        }
        if (score.hit < score.hr) {
            errors.push({ field: 'hr', message: '本塁打数が安打数を超えています。' });
        }
        return errors;
    }
    static parseGameFormToGameInput(game) {
        const date = game.game_dt;
        const gameInput = {
            game_id: game.game_id,
            seq: game.seq.toString(),
            tournament_id: game.tournament_id,
            opponent: game.opponent,
            op_point: game.op_point.toString(),
            my_point: game.my_point.toString(),
            result: game.result,
            game_dt: `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
        };
        return gameInput;
    }
    static convertToGameForms(beforeGames) {
        const games = [];
        for (const g of beforeGames) {
            const v = GameFormSchema.safeParse(g);
            if (v.success) {
                games.push(v.data);
            }
        }
        return games;
    }
    static convertToGameForm(beforeGame) {
        const v = GameFormSchema.safeParse(beforeGame);
        if (v.success) {
            return v.data;
        }
        return null;
    }
}
//# sourceMappingURL=ScobitFunction.js.map