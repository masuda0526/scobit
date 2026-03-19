import { TeamForm } from "../entity/Team";
import { GameForm } from "../entity/Game";
import { Player, PlayerForm } from "../entity/Player";

export type TeamTopForm = {
    info:TeamForm;
    games:GameForm[];
    players:PlayerForm[]
}