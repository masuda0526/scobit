import { Ability } from "../entity/Ability"
import { Score } from "../entity/Score"
import { User } from "../entity/User"

export type MemberForm = {
    info:User,
    ability:Ability,
    scores:Score[]
}