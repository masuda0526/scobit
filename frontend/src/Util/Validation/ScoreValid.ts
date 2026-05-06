import type { ErrorInfo, ScoreForm } from "@scobit/types";

export const validConstantScore = (score:ScoreForm):ErrorInfo[] => {
  const errors:ErrorInfo[] = [];
  if(!score.is_turn)return [];
  if(score.box < score.hit){
    errors.push({field:'custom', message:'安打数が打席数を超えています。'});
  }
  if(score.hit < score.hr){
    errors.push({field:'custom', message:'本塁打数が安打数を超えています。'})
  }
  return errors
}