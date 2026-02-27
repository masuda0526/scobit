import { Team } from "../entity/Team";
import { Game } from "../entity/Game";
import { Ability } from "../entity/Ability";

export type TeamTopForm = {
    info:Team;
    games:Game[];
    members:Ability[]
}