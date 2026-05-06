import type React from "react";
import { PositionToggleBtn } from "./PositionToggleBtn";
import styles from "./GroundPosition.module.css"
import type { CSSProperties } from "react";

type Props = {
    positions:string[];
    clickToggle?:(position:string) => void;
}

export const GroundPosition : React.FC<Props> = ({
    positions,
    clickToggle = ()=>{},
}) => {
    return (
        <div className={styles.ground}>
            <PositionToggleBtn isOn={positions.includes("1")} label="ピッチャー" clickToggle={()=>clickToggle("1")} style={POSITION_STYLE["1"]}/>
            <PositionToggleBtn isOn={positions.includes("2")} label="キャッチャー" clickToggle={()=>clickToggle("2")} style={POSITION_STYLE["2"]}/>
            <PositionToggleBtn isOn={positions.includes("3")} label="ファースト" clickToggle={()=>clickToggle("3")} style={POSITION_STYLE["3"]}/>
            <PositionToggleBtn isOn={positions.includes("4")} label="セカンド" clickToggle={()=>clickToggle("4")} style={POSITION_STYLE["4"]}/>
            <PositionToggleBtn isOn={positions.includes("5")} label="サード" clickToggle={()=>clickToggle("5")} style={POSITION_STYLE["5"]}/>
            <PositionToggleBtn isOn={positions.includes("6")} label="ショート" clickToggle={()=>clickToggle("6")} style={POSITION_STYLE["6"]}/>
            <PositionToggleBtn isOn={positions.includes("7")} label="レフト" clickToggle={()=>clickToggle("7")} style={POSITION_STYLE["7"]}/>
            <PositionToggleBtn isOn={positions.includes("8")} label="センター" clickToggle={()=>clickToggle("8")} style={POSITION_STYLE["8"]}/>
            <PositionToggleBtn isOn={positions.includes("9")} label="ライト" clickToggle={()=>clickToggle("9")} style={POSITION_STYLE["9"]}/>
            <img src="ground.png" className={styles.groundImg} alt="" />
        </div>
    )
}

const POSITION_STYLE: Record<string, CSSProperties> = {
  "1": { left: "50%", top: "48%", transform: "translate(-50%, -50%)" }, // 投手
  "2": { left: "50%", top: "85%", transform: "translate(-50%, -50%)" }, // 捕手
  "3": { left: "80%", top: "45%", transform: "translate(-50%, -50%)" }, // 一塁
  "4": { left: "70%", top: "30%", transform: "translate(-50%, -50%)" }, // 二塁
  "5": { left: "20%", top: "45%", transform: "translate(-50%, -50%)" }, // 三塁
  "6": { left: "30%", top: "30%", transform: "translate(-50%, -50%)" }, // 遊撃手
  "7": { left: "20%", top: "15%", transform: "translate(-50%, -50%)" }, // 左翼手
  "8": { left: "50%", top: "10%", transform: "translate(-50%, -50%)" }, // 中堅手
  "9": { left: "80%", top: "15%", transform: "translate(-50%, -50%)" }, // 右翼手
};