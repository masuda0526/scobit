-- =====================================================
-- scobit schema
-- =====================================================

-- UUID生成用
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUM定義
-- =====================================================

CREATE TYPE game_result AS ENUM (
    'win',
    'lose',
    'draw',
    'no-game'
);

COMMENT ON TYPE game_result IS '試合結果';

CREATE TYPE prefecture AS ENUM (
'北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
'茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
'新潟県','富山県','石川県','福井県','山梨県','長野県',
'岐阜県','静岡県','愛知県','三重県',
'滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県',
'鳥取県','島根県','岡山県','広島県','山口県',
'徳島県','香川県','愛媛県','高知県',
'福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県',
'沖縄県'
);
COMMENT ON TYPE prefecture IS '都道府県';

CREATE TYPE tournament_type AS ENUM (
'official',
'league',
'tournament',
'practice',
'intrasquad'
);
COMMENT ON TYPE tournament_type IS '大会タイプ';

CREATE TYPE player_role AS ENUM (
'guest',
'member',
'admin'
);
COMMENT ON TYPE player_role IS 'チーム内権限';

CREATE TYPE player_status AS ENUM (
'active',
'rest'
);
COMMENT ON TYPE player_status IS '活動状況';


-- =====================================================
-- account
-- =====================================================

CREATE TABLE account (
    account_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_pub_id varchar(20) UNIQUE NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    hash_pass varchar(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE account IS 'ユーザーアカウント';

COMMENT ON COLUMN account.account_id IS 'アカウントID(UUID)';
COMMENT ON COLUMN account.account_pub_id IS '公開用アカウントID';
COMMENT ON COLUMN account.email IS 'メールアドレス';
COMMENT ON COLUMN account.hash_pass IS 'パスワードハッシュ';
COMMENT ON COLUMN account.created_at IS '作成日時';
COMMENT ON COLUMN account.updated_at IS '更新日時';


-- =====================================================
-- players
-- =====================================================

CREATE TABLE players (
    player_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(20) NOT NULL,
    disp_name varchar(4) NOT NULL,
    throw_distance integer NOT NULL,
    positions varchar(9) NOT NULL
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()

);

COMMENT ON TABLE players IS '選手';

COMMENT ON COLUMN players.player_id IS 'プレイヤーID';
COMMENT ON COLUMN players.name IS '選手名';
COMMENT ON COLUMN players.disp_name IS '表示名（最大4文字）';
COMMENT ON COLUMN players.throw_distance IS '遠投距離';
COMMENT ON COLUMN players.positions IS 'ポジションコード';
COMMENT ON COLUMN Players.created_at IS '作成日'
COMMENT ON COLUMN Players.updated_at IS '更新日'


-- =====================================================
-- teams
-- =====================================================

CREATE TABLE teams (
    team_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id varchar(20) UNIQUE NOT NULL,
    team_name varchar(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    regist_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    description text,
    leader_id uuid,
    icon text,
    pref prefecture NOT NULL,
    area varchar(50) NOT NULL,

    FOREIGN KEY (leader_id) REFERENCES account(account_id)
);

COMMENT ON TABLE teams IS 'チーム';

COMMENT ON COLUMN teams.team_id IS 'チームID';
COMMENT ON COLUMN teams.public_id IS '公開用チームID';
COMMENT ON COLUMN teams.team_name IS 'チーム名';
COMMENT ON COLUMN teams.created_at IS '設立日';
COMMENT ON COLUMN teams.regist_at IS '登録日';
COMMENT ON COLUMN teams.updated_at IS '更新日';
COMMENT ON COLUMN teams.description IS 'チーム説明';
COMMENT ON COLUMN teams.leader_id IS '代表者アカウントID';
COMMENT ON COLUMN teams.icon IS 'アイコン画像';
COMMENT ON COLUMN teams.pref IS '活動都道府県';
COMMENT ON COLUMN teams.area IS '活動地域';


-- =====================================================
-- accounts_players
-- =====================================================

CREATE TABLE accounts_players (
    account_id uuid NOT NULL,
    player_id uuid NOT NULL,

    PRIMARY KEY (account_id, player_id),

    FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

COMMENT ON TABLE accounts_players IS 'アカウントとプレイヤーの紐付け';

COMMENT ON COLUMN accounts_players.account_id IS 'アカウントID';
COMMENT ON COLUMN accounts_players.player_id IS 'プレイヤーID';


-- =====================================================
-- players_teams
-- =====================================================

CREATE TABLE players_teams (
    player_id uuid NOT NULL,
    team_id uuid NOT NULL,
    role player_role NOT NULL,
    status player_status NOT NULL DEFAULT 'active',
    del_flg boolean DEFAULT false,
    join_at timestamp with time zone DEFAULT now(),
    leave_at timestamp with time zone,

    PRIMARY KEY (player_id, team_id),

    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY  (team_id) REFERENCES teams (team_id)
);

COMMENT ON TABLE players_teams IS '選手のチーム所属履歴';

COMMENT ON COLUMN players_teams.player_id IS 'プレイヤーID';
COMMENT ON COLUMN players_teams.team_id IS 'チームID';
COMMENT ON COLUMN players_teams.role IS '権限';
COMMENT ON COLUMN players_teams.status IS '活動状態';
COMMENT ON COLUMN players_teams.del_flg IS '削除フラグ';
COMMENT ON COLUMN players_teams.join_at IS '加入日';
COMMENT ON COLUMN players_teams.leave_at IS '退団日';


-- =====================================================
-- tournament
-- =====================================================

CREATE TABLE tournament (
    tournament_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id uuid NOT NULL,
    name varchar(30) NOT NULL,
    type tournament_type NOT NULL,
    start_dt timestamp with time zone,
    end_dt timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),

    FOREIGN KEY  (team_id) REFERENCES teams (team_id)
);

COMMENT ON TABLE tournament IS '大会';

COMMENT ON COLUMN tournament.tournament_id IS '大会ID';
COMMENT ON COLUMN tournament.team_id IS 'チームID';
COMMENT ON COLUMN tournament.name IS '大会名';
COMMENT ON COLUMN tournament.type IS '大会タイプ';
COMMENT ON COLUMN tournament.start_dt IS '開始日';
COMMENT ON COLUMN tournament.end_dt IS '終了日';
COMMENT ON COLUMN tournament.created_at IS '作成日';
COMMENT ON COLUMN tournament.updated_at IS '更新日';


-- =====================================================
-- games
-- =====================================================

CREATE TABLE games (
    game_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id uuid NOT NULL,
    tournament_id uuid,
    seq integer DEFAULT 1,
    opponent varchar(50),
    my_point integer NOT NULL,
    op_point integer NOT NULL,
    result game_result DEFAULT 'no-game',
    game_dt date NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),

    FOREIGN KEY  (team_id) REFERENCES teams (team_id),
    FOREIGN KEY (tournament_id) REFERENCES tournament(tournament_id)
);

COMMENT ON TABLE games IS '試合';

COMMENT ON COLUMN games.game_id IS 'ゲームID';
COMMENT ON COLUMN games.team_id IS 'チームID';
COMMENT ON COLUMN games.tournament_id IS '大会ID';
COMMENT ON COLUMN games.seq IS '同日の試合順';
COMMENT ON COLUMN games.opponent IS '対戦相手';
COMMENT ON COLUMN games.my_point IS '自チーム得点';
COMMENT ON COLUMN games.op_point IS '相手得点';
COMMENT ON COLUMN games.result IS '試合結果';
COMMENT ON COLUMN games.game_dt IS '試合日';
COMMENT ON COLUMN games.created_at IS '作成日'
COMMENT ON COLUMN games.updated_at IS '更新日'


-- =====================================================
-- scores
-- =====================================================

CREATE TABLE scores (
    score_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id uuid NOT NULL,
    game_id uuid NOT NULL,
    is_turn boolean DEFAULT false,
    box integer,
    hit integer,
    hr integer,
    steal integer,
    err integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),

    UNIQUE (player_id, game_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);

COMMENT ON TABLE scores IS '試合成績';

COMMENT ON COLUMN scores.score_id IS '成績ID';
COMMENT ON COLUMN scores.player_id IS 'プレイヤーID';
COMMENT ON COLUMN scores.game_id IS 'ゲームID';
COMMENT ON COLUMN scores.is_turn IS '出場フラグ';
COMMENT ON COLUMN scores.box IS '打席数';
COMMENT ON COLUMN scores.hit IS '安打';
COMMENT ON COLUMN scores.hr IS '本塁打';
COMMENT ON COLUMN scores.steal IS '盗塁';
COMMENT ON COLUMN scores.err IS 'エラー';
COMMENT ON COLUMN scores.created_at IS '作成日'
COMMENT ON COLUMN scores.updated_at IS '更新日'