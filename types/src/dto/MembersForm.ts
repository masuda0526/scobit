import { Ability } from "../entity/Ability.js"
import { TeamForm } from "../entity/Team.js"

export type MembersForm = {
    info:TeamForm,
    members:Ability[]
}