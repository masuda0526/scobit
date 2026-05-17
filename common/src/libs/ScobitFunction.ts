import { GameResultConsts } from "@scobit/types";

export class ScobitFunction{
  static getGameResult(my_point:number, op_point:number, isNoGame = false):typeof GameResultConsts[number]{
    if(isNoGame){
      return 'no-game'
    }
    if(my_point > op_point){
      return 'win';
    }
    if(my_point < op_point){
      return 'lose';
    }
    if(my_point === op_point){
      return 'draw';
    }
    return 'no-game';
  }
}