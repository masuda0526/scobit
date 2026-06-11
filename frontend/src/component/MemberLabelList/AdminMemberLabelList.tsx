import type React from "react";
import { MemberLabel } from "../UserAbility/MemberLabel";
import styles from "./MemberLabelList.module.css"
import type { PlayerForm } from "@scobit/types";

export const AdminMemberLabelList: React.FC<{ players: PlayerForm[] }> = ({ players }) => {
  return (
    <div className={styles.container}>
      <div className={styles.list} >
        {(players.map(player => {
          return (
            <a href="/#/admin/member" className={styles.item}>
              <MemberLabel key={player.player_id} name={player.disp_name} positions={player.positions} />
            </a>
          )
        }))}
      </div>
    </div>
  )
}