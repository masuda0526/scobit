import { getAbilityClassName } from "../../Util/AbilityUtil/AbilityUtil";
import styles from "./Ability.module.css"
type Props = {
    label: string;
    value: string;
}

export const AbilityContainer: React.FC<Props> = (props) => {
    const abilityClass = getAbilityClassName(props.value);
    return (
        <div className={styles.ability_parts}>
            <div className={styles.ability_label}>{props.label}</div>
            <div className={[styles.ablitiy_value,styles[abilityClass]].join(" ")}>{props.value}</div>
        </div>
    );
}