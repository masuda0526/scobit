import { Ability } from "../entity/Ability"
import { TeamForm } from "../entity/Team"

export type MembersForm = {
    info:TeamForm,
    members:Ability[]
}