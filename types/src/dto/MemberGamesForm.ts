import { PlayerForm } from "../entity/Player"
import { ScoreItemDto } from "../entity/Score"

export type MemberGamesForm = {
    info:PlayerForm,
    scores:ScoreItemDto[]
}