import z from "zod"
import { GameForm } from "../entity/Game"
import { PlayerFormSchema } from "../entity/Player"
import { ScoreFormSchema } from "../entity/Score"

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