import { Player } from "@scobit/types";
import { randomInt, randomUUID } from "crypto";
import { randomPositions } from "./util.js";
import { PoolClient } from "pg";

export const makePlayer = ():Player => {
  const now = new Date();
  const prefix = randomInt(0, 99);
  return{
    player_id:randomUUID(),
    name:`テスト　太郎${prefix}}`,
    disp_name:`太郎${prefix}`,
    throw_distance: randomInt(40, 130),
    positions: randomPositions(),
    created_at:now,
    updated_at:now,
  }
}

export const insertPlayer = async (client:PoolClient, players:Player[]) => {
  for (const player of players) {

  await client.query(
    `
    INSERT INTO players
    (player_id, name, disp_name, throw_distance, positions, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
    [
      player.player_id,
      player.name,
      player.disp_name,
      player.throw_distance,
      player.positions,
      player.created_at,
      player.updated_at
    ]
  );

}
}