import type React from "react";
import { MemberLabel } from "../UserAbility/MemberLabel";
import styles from "./MemberLabelList.module.css"
import type { PlayerForm } from "@scobit/types";
import { useParams } from "react-router-dom";

export const MemberLabelList: React.FC<{ players: PlayerForm[] }> = ({ players }) => {
  const {publicId} = useParams()
  return (
    <div className={styles.container}>
      <div className={styles.list} >
        {(players.map(player => {
          return (
            <a href={`/member/${publicId}/${player.player_id}`} className={styles.item} key={player.player_id}>
              <MemberLabel name={player.disp_name} positions={player.positions} />
            </a>
          )
        }))}
      </div>
    </div>
  )
}