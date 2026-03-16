import { localDbConfig } from "./00_init_setting.ts";
import { Account, AccountsPlayers, Game, Player, PlayersTeams, Score, Team, Tournament } from "@scobit/types";
import { Pool } from "pg";
import { randInt } from "./seeder_functions/util.js";
import { makeAccount } from "./seeder_functions/Account.js";
import { makePlayer } from "./seeder_functions/Players.js";
import { makePlayersAccount } from "./seeder_functions/Players_Accounts.js";
import { makeTeam } from "./seeder_functions/Teams.js";
import { makePlayersTeams } from "./seeder_functions/Players_Teams.js";
import { makeTournament } from "./seeder_functions/Tournament.js";
import { makeGame } from "./seeder_functions/Games.js";
import { makeScore } from "./seeder_functions/Scores.js";
import { bulkInsert } from "./seeder_functions/query_func.js";

const pool = new Pool(localDbConfig);

const makeData = async () => {
  const client = await pool.connect();

  // アカウント作成
  const accounts: Account[] = [];
  const account_count = randInt(10, 20);
  for (let i = 0; i < account_count; i++) {
    accounts.push(makeAccount());
  }

  // プレイヤー作成
  const players: Player[] = [];
  const player_count = randInt(account_count, 30);
  for (let i = 0; i < player_count; i++) {
    players.push(makePlayer())
  }

  // player-account
  const player_accounts: AccountsPlayers[] = [];
  for (let i = 0; i < account_count; i++) {
    player_accounts.push(makePlayersAccount(accounts[i], players[i]))
  }

  // チーム作成
  const team: Team = makeTeam(accounts[randInt(0, account_count - 1)].account_id);

  // プレイヤー-チームリレーション
  const player_teams: PlayersTeams[] = [];
  for (let i = 0; i < player_count; i++) {
    player_teams.push(makePlayersTeams(players[i], team))
  };

  // 大会情報作成
  const tournaments: Tournament[] = [];
  const tournaments_count = randInt(3, 5);
  for (let i = 0; i < tournaments_count; i++) {
    tournaments.push(makeTournament(team));
  }

  // ゲーム情報作成
  const games: Game[] = [];
  const games_count = randInt(30, 50);
  for (let i = 0; i < games_count; i++) {
    games.push(makeGame(team, tournaments[randInt(0, tournaments_count - 1)]));
  }

  const scores: Score[] = [];
  for (let game of games) {
    for (let player of players) {
      scores.push(makeScore(player, game))
    }
  }

  // 登録処理
  try {
    await client.query('BEGIN');

    await bulkInsert(client, 'account', accounts);
    await bulkInsert(client, 'players', players);
    await bulkInsert(client, 'accounts_players', player_accounts);
    await bulkInsert(client, 'teams', [team]);
    await bulkInsert(client, 'players_teams', player_teams);
    await bulkInsert(client, 'tournament', tournaments);
    await bulkInsert(client, 'games', games);
    await bulkInsert(client, 'scores', scores);

    await client.query('COMMIT');

  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);

  } finally {
    client.release();
  }

}

async function run() {
  const CREATE_TEAM_COUNT = 10;
  for (let i = 0; i < CREATE_TEAM_COUNT; i++) {
    await makeData();
    console.log(`${i + 1}チーム目作成完了`)
  }
}
run();






