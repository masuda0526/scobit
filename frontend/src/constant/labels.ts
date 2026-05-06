import type { LabelDef } from "@scobit/common";

export const FRONT_LABELS:LabelDef[] = [
  {key:'opponent', label:'対戦相手', type:'string'},
  {key:'my_point', label:'自チームの得点', type:'string'},
  {key:'op_point', label:'相手チームの得点', type:'string'},
  {key:'tournament_id', label:'試合タイプ', type:'string'},
  {key:'game_dt', label:'試合日', type:'string'},
  {key:'team_name', label:'チーム名', type:'string'},
  {key:'team_id', label:'チームID', type:'string'},
  {key:'public_id', label:'チームID', type:'string'},
  {key:'area', label:'活動地域', type:'string'},
  {key:'player_name', label:'選手名', type:'string'},
  {key:'disp_name', label:'表示名', type:'string'},
  {key:'throw_distance', label:'遠投距離', type:'string'},
  {key:'seq', label:'試合順', type:'number'},
  {key:'box', label:'打席数', type:'number'},
  {key:'hit', label:'安打数', type:'number'},
  {key:'hr', label:'本塁打数', type:'number'},
  {key:'steal', label:'盗塁数', type:'number'},
  {key:'error', label:'エラー数', type:'number'},
  {key:'name', label:'選手名', type:'string'},
  {key:'positions', label:'ポジション', type:'string'},
  {key:'email', label:'メールアドレス', type:'string'},
  {key:'account_pub_id', label:'ユーザーID', type:'string'}
]