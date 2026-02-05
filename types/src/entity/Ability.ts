export type Ability = {
  a_id: string;              // 能力ID
  t_id: string;              // チームID
  u_id: string;              // ユーザーID
  avr: number;               // 打率
  hr_per_game: number;       // 1試合あたりHR数
  steal_per_game: number;    // 1試合あたり盗塁数
  err_per_game: number;      // 1試合あたり失策数
  throw_distance: number;    // 遠投距離（m）
  sprint_sec: number;        // 50m走（秒）
};
