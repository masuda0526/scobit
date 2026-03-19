import { Ability } from "../entity/Ability"
import { ScoreItemDto } from "../entity/Score"

export type MemberForm = {
    info:Ability,
    scores:ScoreItemDto[]
}
