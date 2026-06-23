import type React from "react";
import { MemberLabel } from "../UserAbility/MemberLabel";
import styles from "./MemberLabelList.module.css"
import type { PlayerForm } from "@scobit/types";

export const MemberLabelList: React.FC<{ players: PlayerForm[] }> = ({ players }) => {
  return (
    <div className={styles.container}>
      <div className={styles.list} >
        {(players.map(player => {
          return (
            <a href="/member" className={styles.item}>
              <MemberLabel name={player.disp_name} positions={player.positions} />
            </a>
          )
        }))}
      </div>
    </div>
  )
}