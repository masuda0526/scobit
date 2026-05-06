import { Tournament } from "../../entity/Tournament.js"
import { GamesForm } from "../GamesForm.js"

export type AdminGamesForms = {
  tournaments:Tournament[]
} & GamesForm