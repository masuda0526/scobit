import { Game } from "../entity/Game"
import { Score } from "../entity/Score"

export type GameDetail = {
    game:Game,
    scores:Score[]
}