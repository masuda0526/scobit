import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { awsConfig } from "./00_init_setting.ts";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Ability, AbilityDb, Game, GameDb, Score, ScoreDb, Team, TeamDb, User, UserDb } from "@scobit/types";

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

// 仮登録データ生成用関数
const makeTeam = (): Team => {
  const t_id = crypto.randomUUID();
  return {
    t_id,
    teamName: `テストチーム${randInt(1000, 9999)}`,
    area: ['大阪', '京都', '兵庫', '滋賀', '奈良', '和歌山', '三重', '徳島', '高知', '香川', '愛媛'][randInt(0, 10)],
    interval: 'WEEK',
    activeInfo: ['sun'],
    createdDt: randomDate(),
    registeredDt: randomDate(),
    payMode: randInt(1, 2),
    leaderName: ['青木', '石田', '上田', '榎田', '岡田', '金本', '岸田', '黒沢', '剣持', '小松'][randInt(0, 9)],
    icon: ''
  }
}

const makeGame = (t_id: string, team_create_dt: string, index: number = 1): Game => {
  return {
    t_id,
    g_id: crypto.randomUUID(),
    seq: index,
    opponent: `対戦相手${randInt(1, 99)}`,
    my_point: randInt(0, 20),
    op_point: randInt(0, 20),
    g_dt: randomDate(team_create_dt)
  }
}

const makeScores = (t_id: string, u_id: string, g_id: string, gameDt: string, disp_name: string, positions: string, index = 1): Score => {
  const isTurn = [true, true, true, true, true, true, false, false][randInt(0, 7)];
  const box = isTurn ? randInt(0, 10) : 0;
  const hit = isTurn ? randInt(0, box) : 0;

  return {
    t_id, u_id, isTurn, box, hit,
    hr: isTurn ? randInt(0, hit) : 0,
    steal: isTurn ? randInt(0, 5) : 0,
    err: isTurn ? randInt(0, 5) : 0,
    gameDt,
    seq: index,
    opponent: `テスト相手${randInt(1, 99)}`,
    disp_name,
    positions,
    g_id
  }
}

const makeUser = (t_id: string, team_create_dt: string): User => {
  const created_at = randomDate(team_create_dt);
  const updated_at = created_at

  return {
    u_id: crypto.randomUUID(),
    t_id,
    name: `テスト　太郎${randInt(0, 99)}`,
    disp_name: `選手${randInt(0, 99)}`,
    throw_distance: randInt(40, 150),
    sprint_sec: rand(5, 10),
    pos: randomPositions(),
    status: '',
    delflg: false,
    created_at,
    updated_at,
    join_at: randomDate(created_at),
  }
}

const makeAbility = (t_id: string, u_id:string, disp_name:string, userName:string, positions:string): Ability => {
  return {
    a_id: crypto.randomUUID(),
    t_id,
    avr: Number(rand(0, 1).toFixed(3)),
    hr_per_game: Number(rand(0, 1).toFixed(2)),
    steal_per_game: Number(rand(0, 1).toFixed(2)),
    err_per_game: Number(rand(0, 0.5).toFixed(2)),
    throw_distance: randInt(70, 100),
    sprint_sec: Number(rand(5.5, 7.5).toFixed(2)),
    u_id,
    hr: randInt(0, 100),
    steal: randInt(0, 100),
    dispName:disp_name,
    userName,
    positions
  }
}
const makeTestData = () => {
  const team: Team = makeTeam();
  const users: User[] = Array.from({ length: randInt(10, 30) }).map((_, i) => {
    return makeUser(team.t_id, team.createdDt);
  })
  const games: Game[] = Array.from({ length: randInt(10, 100) }).map((_, i) => {
    return makeGame(team.t_id, team.createdDt)
  })
  const scores: Score[] = []
  games.forEach(game => {
    users.forEach(user => {
      scores.push(makeScores(team.t_id, user.u_id, game.g_id, game.g_dt, user.disp_name, user.pos))
    })
  })
  const abilities: Ability[] = []
  users.forEach(user => {
    abilities.push(makeAbility(team.t_id, user.u_id, user.disp_name, user.name, user.pos))
  })
  return {team, users, games, scores,abilities};
}

async function run() {
  const items: any[] = [];
  const data = makeTestData();
  
  const teamData:TeamDb = {
    pk:`TEAM#${data.team.t_id}`,
    sk:'INFO',
    ...data.team,
  }
  items.push(teamData);

  data.users.forEach(user => {
    const userData:UserDb = {
      pk:`USER#${user.u_id}`,
      sk:'INFO',
      ...user
    }
    items.push(userData);
  })

  data.games.forEach(game => {
    const gameData:GameDb = {
      pk:`TEAM#${game.t_id}`,
      sk:`GAME#${game.g_dt}#${game.seq}`,
      ...game
    } 
    items.push(gameData)
  })

  data.scores.forEach(score => {
    const scoreByGame : ScoreDb = {
      pk:`GAME#${score.g_id??crypto.randomUUID()}`,
      sk:`SCORE#${score.u_id}`,
      ...score
    }
    const scoreByMember : ScoreDb = {
      pk:`USER#${score.u_id}`,
      sk:`SCORE#${score.gameDt}#${score.seq}`,
      ...score
    }
    items.push(scoreByGame, scoreByMember);
  })

  data.abilities.forEach(ability => {
    const abilityByTeam : AbilityDb = {
      pk:`TEAM#${ability.t_id}`,
      sk:`MEMBER#${ability.u_id}`,
      ...ability
    }
    const abilityByUser : AbilityDb = {
      pk:`USER#${ability.u_id}`,
      sk:'ABILITY',
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

run();






