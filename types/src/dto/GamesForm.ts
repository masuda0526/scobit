import { GameForm } from "../entity/Game.js"
import { TeamForm } from "../entity/Team.js"

export type GamesForm = {
    team:TeamForm
    games:GameForm[]
}