import {z} from "zod";
import { GameForm } from "../../entity/Game.js";
import { PlayerForm } from "../../entity/Player.js";
import { ScoreForm } from "../../entity/Score.js";
import { Tournament } from "../../entity/Tournament.js";

export type AdminGameEditForm = {
  game:GameForm;
  members:PlayerForm[];
  scores:ScoreForm[];
  tournaments:Tournament[];
}