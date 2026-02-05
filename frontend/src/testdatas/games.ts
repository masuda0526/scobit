import type { Game } from "@scobit/types";

export const testGames: Game[] = [
  // --- 既存 ---
  {
    g_id: "game-001",
    t_id: "tournament-2025",
    seq: 1,
    opponent: "チームああああああああああああああああああA",
    my_point: 21,
    op_point: 18,
    result: 1,
    g_dt: new Date("2025-01-10T10:00:00+09:00"),
  },
  {
    g_id: "game-002",
    t_id: "tournament-2025",
    seq: 2,
    opponent: "チームB",
    my_point: 15,
    op_point: 21,
    result: 0,
    g_dt: new Date("2025-01-10T11:00:00+09:00"),
  },
  {
    g_id: "game-003",
    t_id: "tournament-2025",
    seq: 3,
    opponent: "チームC",
    my_point: 21,
    op_point: 19,
    result: 1,
    g_dt: new Date("2025-01-10T12:00:00+09:00"),
  },

  // --- 同点・接戦 ---
  {
    g_id: "game-004",
    t_id: "tournament-2025",
    seq: 4,
    opponent: "TOKUSHIMA BASEBALL CLUB",
    my_point: 20,
    op_point: 22,
    result: 0,
    g_dt: new Date("2025-01-11T09:30:00+09:00"),
  },

  // --- 大差勝ち ---
  {
    g_id: "game-005",
    t_id: "tournament-2025",
    seq: 5,
    opponent: "鳴門オーシャンズ",
    my_point: 30,
    op_point: 5,
    result: 1,
    g_dt: new Date("2025-01-11T10:30:00+09:00"),
  },

  // --- 大差負け ---
  {
    g_id: "game-006",
    t_id: "tournament-2025",
    seq: 6,
    opponent: "阿波ブルースカイレジェンズ",
    my_point: 3,
    op_point: 28,
    result: 0,
    g_dt: new Date("2025-01-11T11:30:00+09:00"),
  },

  // --- 超長いチーム名（UI崩れ検証用） ---
  {
    g_id: "game-007",
    t_id: "tournament-2025",
    seq: 7,
    opponent:
      "とくしま超銀河系未来型次世代ベースボールクラブ・アルティメットユナイテッド2025",
    my_point: 18,
    op_point: 21,
    result: 0,
    g_dt: new Date("2025-01-12T10:00:00+09:00"),
  },

  // --- 英数字＋記号混在 ---
  {
    g_id: "game-008",
    t_id: "tournament-2025",
    seq: 8,
    opponent: "TEAM-αβγ_123",
    my_point: 22,
    op_point: 20,
    result: 1,
    g_dt: new Date("2025-01-12T11:00:00+09:00"),
  },

  // --- 最低得点・ゼロ ---
  {
    g_id: "game-009",
    t_id: "tournament-2025",
    seq: 9,
    opponent: "徳島シャドーズ",
    my_point: 0,
    op_point: 21,
    result: 0,
    g_dt: new Date("2025-01-12T12:00:00+09:00"),
  },

  // --- 最大ラリー想定 ---
  {
    g_id: "game-010",
    t_id: "tournament-2025",
    seq: 10,
    opponent: "阿南ファイターズ",
    my_point: 35,
    op_point: 33,
    result: 1,
    g_dt: new Date("2025-01-13T13:00:00+09:00"),
  },

  // --- 日付が飛んでいるケース（並び替え検証） ---
  {
    g_id: "game-011",
    t_id: "tournament-2025",
    seq: 11,
    opponent: "小松島シーガルズ",
    my_point: 19,
    op_point: 21,
    result: 0,
    g_dt: new Date("2025-02-01T10:00:00+09:00"),
  },

  // --- 別トーナメント ---
  {
    g_id: "game-012",
    t_id: "tournament-2024",
    seq: 1,
    opponent: "吉野川リバーズ",
    my_point: 21,
    op_point: 17,
    result: 1,
    g_dt: new Date("2024-11-20T14:00:00+09:00"),
  },
];
