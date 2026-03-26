import { PlayerForm } from "../entity/Player.js"
import { ScoreItemDto } from "../entity/Score.js"

export type MemberGamesForm = {
    info:PlayerForm,
    scores:ScoreItemDto[]
}