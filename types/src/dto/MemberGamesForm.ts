import { Score } from "../entity/Score"
import { User } from "../entity/User"

export type MemberGamesForm = {
    info:User,
    scores:Score[]
}