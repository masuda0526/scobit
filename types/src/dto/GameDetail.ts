import z from "zod"
import { GameForm } from "../entity/Game.js"
import { PlayerFormSchema } from "../entity/Player.js"
import { ScoreFormSchema } from "../entity/Score.js"

export type GameDetail = {
    game:GameForm,
    scores:ScorePerPlayer[]
}

export const ScorePerPlayerSchema = ScoreFormSchema.extend({
    ...PlayerFormSchema.pick({
        disp_name:true,
        positions:true
    }).shape
})

export type ScorePerPlayer = z.infer<typeof ScorePerPlayerSchema>