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
}
//# sourceMappingURL=ScobitFunction.js.map