import type { PlayerWithAbility } from "@scobit/types";

export const testPlayers: PlayerWithAbility[] = [
  // ===== チーム1 =====
  { t_id: "T001", u_id: "U001", name: "山田 太郎", disp_name: "山田", pos: "6", hr: 18, steal: 42, throw_distance: 92, avr: 0.312, hr_per_game: 0.25, steal_per_game: 0.35, err_per_game: 0.08 },
  { t_id: "T001", u_id: "U002", name: "佐藤 健", disp_name: "佐藤", pos: "4", hr: 7, steal: 28, throw_distance: 88, avr: 0.285, hr_per_game: 0.1, steal_per_game: 0.22, err_per_game: 0.05 },
  { t_id: "T001", u_id: "U003", name: "鈴木 一郎", disp_name: "鈴木", pos: "8", hr: 4, steal: 75, throw_distance: 95, avr: 0.355, hr_per_game: 0.05, steal_per_game: 0.55, err_per_game: 0.02 },
  { t_id: "T001", u_id: "U004", name: "田中 翔", disp_name: "田中", pos: "5", hr: 15, steal: 12, throw_distance: 90, avr: 0.268, hr_per_game: 0.18, steal_per_game: 0.12, err_per_game: 0.11 },
  { t_id: "T001", u_id: "U005", name: "中村 剛", disp_name: "中村", pos: "3", hr: 35, steal: 3, throw_distance: 87, avr: 0.298, hr_per_game: 0.32, steal_per_game: 0.05, err_per_game: 0.09 },
  { t_id: "T001", u_id: "U006", name: "小林 海", disp_name: "小林", pos: "2", hr: 2, steal: 1, throw_distance: 82, avr: 0.245, hr_per_game: 0.04, steal_per_game: 0.03, err_per_game: 0.03 },
  { t_id: "T001", u_id: "U007", name: "高橋 蓮", disp_name: "高橋", pos: "7", hr: 9, steal: 30, throw_distance: 86, avr: 0.276, hr_per_game: 0.12, steal_per_game: 0.28, err_per_game: 0.06 },
  { t_id: "T001", u_id: "U008", name: "伊藤 光", disp_name: "伊藤", pos: "9", hr: 6, steal: 19, throw_distance: 89, avr: 0.251, hr_per_game: 0.09, steal_per_game: 0.18, err_per_game: 0.07 },
  { t_id: "T001", u_id: "U009", name: "渡辺 陸", disp_name: "渡辺", pos: "1", hr: 0, steal: 0, throw_distance: 100, avr: 0.198, hr_per_game: 0.01, steal_per_game: 0.02, err_per_game: 0.04 },
  { t_id: "T001", u_id: "U010", name: "松本 大輝", disp_name: "松本", pos: "6", hr: 16, steal: 38, throw_distance: 91, avr: 0.301, hr_per_game: 0.21, steal_per_game: 0.31, err_per_game: 0.1 },

  // ===== チーム2 =====
  { t_id: "T002", u_id: "U011", name: "井上 直", disp_name: "井上", pos: "8", hr: 11, steal: 60, throw_distance: 93, avr: 0.334, hr_per_game: 0.15, steal_per_game: 0.48, err_per_game: 0.03 },
  { t_id: "T002", u_id: "U012", name: "木村 悠", disp_name: "木村", pos: "4", hr: 5, steal: 22, throw_distance: 84, avr: 0.266, hr_per_game: 0.08, steal_per_game: 0.2, err_per_game: 0.06 },
  { t_id: "T002", u_id: "U013", name: "林 恒一", disp_name: "林", pos: "5", hr: 10, steal: 15, throw_distance: 87, avr: 0.241, hr_per_game: 0.13, steal_per_game: 0.14, err_per_game: 0.12 },
  { t_id: "T002", u_id: "U014", name: "清水 翼", disp_name: "清水", pos: "3", hr: 28, steal: 2, throw_distance: 85, avr: 0.289, hr_per_game: 0.29, steal_per_game: 0.04, err_per_game: 0.1 },
  { t_id: "T002", u_id: "U015", name: "山口 陽", disp_name: "山口", pos: "7", hr: 8, steal: 40, throw_distance: 88, avr: 0.259, hr_per_game: 0.11, steal_per_game: 0.33, err_per_game: 0.08 },
  { t_id: "T002", u_id: "U016", name: "石井 駿", disp_name: "石井", pos: "6", hr: 20, steal: 35, throw_distance: 94, avr: 0.308, hr_per_game: 0.23, steal_per_game: 0.29, err_per_game: 0.07 },
  { t_id: "T002", u_id: "U017", name: "長谷川 海斗", disp_name: "長谷", pos: "9", hr: 13, steal: 27, throw_distance: 90, avr: 0.273, hr_per_game: 0.17, steal_per_game: 0.26, err_per_game: 0.05 },
  { t_id: "T002", u_id: "U018", name: "岡田 蒼", disp_name: "岡田", pos: "2", hr: 3, steal: 1, throw_distance: 83, avr: 0.232, hr_per_game: 0.05, steal_per_game: 0.03, err_per_game: 0.04 },
  { t_id: "T002", u_id: "U019", name: "藤原 智", disp_name: "藤原", pos: "1", hr: 0, steal: 0, throw_distance: 102, avr: 0.205, hr_per_game: 0.02, steal_per_game: 0.01, err_per_game: 0.03 },
  { t_id: "T002", u_id: "U020", name: "橋本 翔太", disp_name: "橋本", pos: "8", hr: 17, steal: 55, throw_distance: 96, avr: 0.321, hr_per_game: 0.19, steal_per_game: 0.41, err_per_game: 0.06 },

  // ===== 複数ポジション =====
  { t_id: "T001", u_id: "U021", name: "藤田 恒一", disp_name: "藤田", pos: "123", hr: 22, steal: 6, throw_distance: 98, avr: 0.305, hr_per_game: 0.18, steal_per_game: 0.08, err_per_game: 0.06 },
  { t_id: "T001", u_id: "U022", name: "岡本 大地", disp_name: "岡本", pos: "456", hr: 19, steal: 10, throw_distance: 90, avr: 0.288, hr_per_game: 0.22, steal_per_game: 0.12, err_per_game: 0.09 },
  { t_id: "T001", u_id: "U023", name: "前田 陽", disp_name: "前田", pos: "789", hr: 6, steal: 48, throw_distance: 92, avr: 0.265, hr_per_game: 0.07, steal_per_game: 0.42, err_per_game: 0.05 },
  { t_id: "T001", u_id: "U024", name: "西村 蒼", disp_name: "西村", pos: "24", hr: 9, steal: 33, throw_distance: 86, avr: 0.275, hr_per_game: 0.11, steal_per_game: 0.28, err_per_game: 0.07 },
  { t_id: "T001", u_id: "U025", name: "福田 蓮", disp_name: "福田", pos: "35", hr: 26, steal: 4, throw_distance: 91, avr: 0.318, hr_per_game: 0.27, steal_per_game: 0.06, err_per_game: 0.08 },
  { t_id: "T002", u_id: "U026", name: "森 悠真", disp_name: "森", pos: "67", hr: 12, steal: 29, throw_distance: 88, avr: 0.292, hr_per_game: 0.14, steal_per_game: 0.24, err_per_game: 0.1 },
  { t_id: "T002", u_id: "U027", name: "坂本 翼", disp_name: "坂本", pos: "68", hr: 24, steal: 44, throw_distance: 94, avr: 0.332, hr_per_game: 0.25, steal_per_game: 0.36, err_per_game: 0.06 },
  { t_id: "T002", u_id: "U028", name: "原口 海斗", disp_name: "原口", pos: "19", hr: 1, steal: 1, throw_distance: 101, avr: 0.21, hr_per_game: 0.03, steal_per_game: 0.02, err_per_game: 0.04 },
  { t_id: "T002", u_id: "U029", name: "大西 拓海", disp_name: "大西", pos: "27", hr: 5, steal: 37, throw_distance: 89, avr: 0.255, hr_per_game: 0.06, steal_per_game: 0.31, err_per_game: 0.05 },
  { t_id: "T002", u_id: "U030", name: "今井 陽向", disp_name: "今井", pos: "345", hr: 21, steal: 18, throw_distance: 93, avr: 0.3, hr_per_game: 0.19, steal_per_game: 0.18, err_per_game: 0.09 },
];
