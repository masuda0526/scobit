import { Ability } from "../entity/Ability"
import { Team } from "../entity/Team"

export type MembersForm = {
    info:Team,
    members:Ability[]
}