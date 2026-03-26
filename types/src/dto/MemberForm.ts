import { Ability } from "../entity/Ability.js"
import { ScoreItemDto } from "../entity/Score.js"

export type MemberForm = {
    info:Ability,
    scores:ScoreItemDto[]
}
