import type React from "react";
import { MemberLabel } from "../UserAbility/MemberLabel";
import styles from "./MemberLabelList.module.css"
import type { PlayerForm } from "@scobit/types";
import { useNavigate } from "react-router-dom";

export const AdminMemberLabelList: React.FC<{ players: PlayerForm[] }> = ({ players }) => {
  const nav = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.list} >
        {(players.map(player => {
          return (
            <a className={styles.item} onClick={() => nav(`/admin/member/${player.player_id}`)} key={player.player_id}>
              <MemberLabel key={player.player_id} name={player.disp_name} positions={player.positions} />
            </a>
          )
        }))}
      </div>
    </div>
  )
}