import type { Ability } from "@scobit/types";
import type React from "react";
import { MemberLabel } from "../UserAbility/MemberLabel";
import styles from "./MemberLabelList.module.css"

export const MemberLabelList: React.FC<{ members: Ability[] }> = ({ members }) => {
  return (
    <div className={styles.container}>
      <div className={styles.list} >
        {(members.map(member => {
          return (
            <a href="/#/member" className={styles.item}>
              <MemberLabel name={member.dispName} positions={member.positions} />
            </a>
          )
        }))}
      </div>
    </div>
  )
}