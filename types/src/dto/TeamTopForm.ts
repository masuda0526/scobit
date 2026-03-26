import { TeamForm } from "../entity/Team.js";
import { GameForm } from "../entity/Game.js";
import { Player, PlayerForm } from "../entity/Player.js";

export type TeamTopForm = {
    info:TeamForm;
    games:GameForm[];
    players:PlayerForm[]
}