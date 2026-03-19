import { GameForm } from "../entity/Game"
import { TeamForm } from "../entity/Team"

export type GamesForm = {
    team:TeamForm
    games:GameForm[]
}