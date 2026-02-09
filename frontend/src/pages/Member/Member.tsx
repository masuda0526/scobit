import type React from "react";
import { Title } from "../../parts/title/title";
import { UserAbility } from "../../component/UserAbility/UserAbility";
import { testPlayers } from "../../testdatas/members";
import { GroundPosition } from "../../component/GroundPosition/GroundPosition";
import { useState } from "react";

export const Member: React.FC = () => {
    const data = testPlayers[0]

    const [positions, setPositions] = useState<string[]>(data.pos.split(""));

    const positionToggle = (position:string) =>{
        if(positions.includes(position)){
            setPositions(prev => prev.filter(p => p !== position))
        }else{
            setPositions(prev => [...prev, position])
        }
    }

    return (
        <>
            <Title text="選手詳細"></Title>
            <UserAbility player={data}></UserAbility>
            <GroundPosition 
                positions={positions}
                clickToggle={positionToggle}
            ></GroundPosition>
        </>
    )
}