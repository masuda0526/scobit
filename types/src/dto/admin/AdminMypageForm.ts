import { Ability } from "../../entity/Ability.js"
import { AccountForm } from "../../entity/Account.js"
import { ScoreItemDto } from "../../entity/Score.js"
import { TeamForm } from "../../entity/Team.js"

export type MypageFormOfTeams = {
  teams:TeamForm[]
}

export type MypageFormOfIndividualUser = {
  ability:Ability,
  account:AccountForm,
  scores:ScoreItemDto[]
}