import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { awsConfig } from "./00_init_setting.ts";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Ability, AbilityDb, Game, GameDb, Score, ScoreDb, Slug, SlugDb, Team, TeamDb, User, UserDb } from "@scobit/types";

const client = new DynamoDBClient({
  region: awsConfig.AWS_REGION,
  endpoint: awsConfig.AWS_ENDPOINT,
  credentials: {
    accessKeyId: awsConfig.AWS_ACCESS_KEY_ID,
    secretAccessKey: awsConfig.AWS_SECRET_ACCESS_KEY
  }
})

const doc = DynamoDBDocumentClient.from(client);

// 使用予定の関数
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max));
const randomPositions = () => {
  const count = randInt(1, 5);
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(randInt(1, 9));
  }
  return [...nums].sort().join('')
}
const randomDate = (minDt: string = '0') => {
  let ymd = 0
  let minNm = Number.parseInt(minDt);
  while (ymd === 0 || minNm > ymd) {
    const y = [2023, 2024, 2025, 2026][randInt(0, 3)];
    const m = randInt(1, 12).toString().padStart(2, "0");
    const d = randInt(1, 28).toString().padStart(2, "0");
    ymd = Number.parseInt(`${y}${m}${d}`)
  }
  return ymd.toString();
};
const createRandomAlias = (len:number) => {
  const STRING_SET = 'abcdefghijklmnopqrstuvwxyz0123456789_-';
  const LEN = STRING_SET.length

  let id = '';

  for(let i = 0; i < len; i++){
    const idx = randInt(0, LEN);
    id += STRING_SET[idx]
  }
  return id;
}

// 仮登録データ生成用関数
const makeTeam = (): Team => {
  const t_id = crypto.randomUUID();
  const created_at = randomDate();
  return {
    t_id,
    teamName: `テストチーム${randInt(1000, 9999)}`,
    area: ['大阪', '京都', '兵庫', '滋賀', '奈良', '和歌山', '三重', '徳島', '高知', '香川', '愛媛'][randInt(0, 10)],
    interval: 'WEEK',
    activeInfo: ['sun'],
    registeredDt: randomDate(),
    payMode: randInt(1, 2),
    leaderName: ['青木', '石田', '上田', '榎田', '岡田', '金本', '岸田', '黒沢', '剣持', '小松'][randInt(0, 9)],
    icon: '',
    created_at,
    updated_at:created_at,
    ver:1,
  }
}

const makeSlug = (team:Team):Slug => {
  return {
    ver:1,
    created_at:team.created_at,
    updated_at:team.created_at,
    alias_id:createRandomAlias(randInt(5, 20)),
    t_id:team.t_id
  }
}

const makeUser = (team:Team): User => {
  const created_at = randomDate(team.registeredDt);

  return {
    u_id: crypto.randomUUID(),
    t_id: team.t_id,
    name: `テスト　太郎${randInt(0, 99)}`,
    disp_name: `選手${randInt(0, 99)}`,
    throw_distance: randInt(40, 150),
    sprint_sec: rand(5, 10),
    positions: randomPositions(),
    status: '',
    delflg: false,
    created_at,
    updated_at: created_at,
    join_at: randomDate(created_at),
    ver:1
  }
}

const makeGame = (team:Team): Game => {
  const g_dt = randomDate(team.created_at);
  return {
    t_id:team.t_id,
    g_id: crypto.randomUUID(),
    seq: 1,
    opponent: `対戦相手${randInt(1, 99)}`,
    my_point: randInt(0, 20),
    op_point: randInt(0, 20),
    g_dt,
    created_at:g_dt,
    updated_at:g_dt,
    ver:1
  }
}

const makeScores = (team:Team, user:User, game:Game): Score => {
  const isTurn = [true, true, true, true, true, true, false, false][randInt(0, 7)];
  const box = isTurn ? randInt(0, 10) : 0;
  const hit = isTurn ? randInt(0, box) : 0;
  const created_at = randomDate(game.created_at);

  return {
    t_id: team.t_id,
    u_id: user.u_id,
    isTurn, 
    box, 
    hit,
    hr: isTurn ? randInt(0, hit) : 0,
    steal: isTurn ? randInt(0, 5) : 0,
    err: isTurn ? randInt(0, 5) : 0,
    g_dt: game.g_dt,
    seq: 1,
    opponent: `テスト相手${randInt(1, 99)}`,
    disp_name: user.disp_name,
    positions: user.positions,
    g_id: game.g_id,
    created_at,
    updated_at: created_at,
    ver: 1
  }
}

const makeAbility = (team:Team, user:User): Ability => {
  return {
    a_id: crypto.randomUUID(),
    t_id: team.t_id,
    avr: Number(rand(0, 1).toFixed(3)),
    hr_per_game: Number(rand(0, 1).toFixed(2)),
    steal_per_game: Number(rand(0, 1).toFixed(2)),
    err_per_game: Number(rand(0, 0.5).toFixed(2)),
    throw_distance: randInt(70, 100),
    sprint_sec: Number(rand(5.5, 7.5).toFixed(2)),
    u_id: user.u_id,
    hr: randInt(0, 100),
    steal: randInt(0, 100),
    disp_name: user.disp_name,
    user_name: user.name,
    positions: user.positions,
    created_at: user.created_at,
    updated_at: randomDate(user.created_at),
  }
}
const makeTestData = () => {
  const team: Team = makeTeam();
  const slug: Slug = makeSlug(team);

  const users: User[] = Array.from({ length: randInt(10, 30) }).map((_, i) => {
    return makeUser(team);
  })

  const games: Game[] = Array.from({ length: randInt(10, 100) }).map((_, i) => {
    return makeGame(team)
  })

  const scores: Score[] = []
  games.forEach(game => {
    users.forEach(user => {
      scores.push(makeScores(team, user, game))
    })
  })

  const abilities: Ability[] = []
  users.forEach(user => {
    abilities.push(makeAbility(team, user))
  })
  return {team, slug, users, games, scores,abilities};
}

async function insertData() {
  const items: any[] = [];
  const data = makeTestData();

  const teamData:TeamDb = {
    pk:`TEAM#${data.team.t_id}`,
    sk:'INFO',
    ...data.team,
  }
  items.push(teamData);
  
  const slugData: SlugDb = {
    pk: `SLUG`,
    sk: `ALIAS#${data.slug.alias_id}`,
    ...data.slug
  }
  items.push(slugData);

  data.users.forEach(user => {
    const userData:UserDb = {
      pk:`TEAM#${user.t_id}`,
      sk:`MEMBER#INFO#${user.u_id}`,
      ...user
    }
    items.push(userData);
  })
  
  data.games.forEach(game => {
    const gameData:GameDb = {
      pk:`TEAM#${game.t_id}`,
      sk:`GAME#${game.g_dt}_${game.seq}#${game.g_id}`,
      ...game
    } 
    items.push(gameData)
  })

  data.scores.forEach(score => {
    const scoreByGame : ScoreDb = {
      pk:`TEAM#${score.t_id}`,
      sk:`GAME#${score.g_dt}_${score.seq}#${score.g_id}#SCORE#${score.u_id}`,
      ...score
    }
    const scoreByMember : ScoreDb = {
      pk:`TEAM#${score.t_id}#MEMBER#${score.u_id}`,
      sk:`GAME#${score.g_dt}_${score.seq}#SCORE#${score.u_id}`,
      ...score
    }
    items.push(scoreByGame, scoreByMember);
  })

  data.abilities.forEach(ability => {
    const abilityByTeam : AbilityDb = {
      pk:`TEAM#${ability.t_id}`,
      sk:`ABILITY#MEMBER#${ability.u_id}`,
      ...ability
    }
    const abilityByUser : AbilityDb = {
      pk:`TEAM#${ability.t_id}#MEMBER#${ability.u_id}`,
      sk:`ABILITY#MEMBER#${ability.u_id}`,
      ...ability
    }
    items.push(abilityByTeam, abilityByUser)
  })
  
  for (const item of items) {
    await doc.send(
      new PutCommand({
        TableName: awsConfig.AWS_TABLE,
        Item: item
      })
    )
  }
}

async function run(){
  const CREATE_TEAM_COUNT = 10;
  for(let i = 0; i < CREATE_TEAM_COUNT; i++){
    console.log(`${i+1}チーム目作成開始`)
    await insertData();
    console.log(`${i+1}チーム目作成完了`)
  }

}
run();






