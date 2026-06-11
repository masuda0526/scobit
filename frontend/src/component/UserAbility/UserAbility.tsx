import { AbilityContainer } from "./AbilityContainer";
import styles from "./Ability.module.css"
import { getDefenseAlp, getLongThrowAlp, getMeetAlp, getPowerAlp, getSpeedAlp } from "../../Util/AbilityUtil/AbilityUtil";
import { MemberLabel } from "./MemberLabel";
import type { Ability } from "@scobit/types";

export const UserAbility: React.FC<{player:Ability}> = ({player}) => {

    const battingAvrage = player.avr >= 1 ? (Math.floor(player.avr*1000)/1000).toFixed(3).toString():(Math.floor(player.avr*1000)/1000).toFixed(3).toString().slice(1);

    return (
        <div className={styles.member}>
            <div className={styles.member_box}>
                <MemberLabel name={player.disp_name} positions={player.positions} />
                <div className={styles.abilities}>
                    <AbilityContainer label="ミート" value={getMeetAlp(player.avr)} />
                    <AbilityContainer label="パワー" value={getPowerAlp(player.hr_per_box)} />
                    <AbilityContainer label="走力" value={getSpeedAlp(player.steal_per_game)} />
                    <AbilityContainer label="肩力" value={getLongThrowAlp(player.throw_distance)} />
                    <AbilityContainer label="守備力" value={getDefenseAlp(player.err_per_game)} />
                </div>
            </div>
            <div className={styles.score}>打率：{battingAvrage}　本：{player.hr}本　盗：{player.steal}</div>
        </div>
    );
}