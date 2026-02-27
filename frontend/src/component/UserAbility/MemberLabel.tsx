import type React from "react";
import styles from "./Ability.module.css"

type Props = {
    name: string;
    positions: string;
}

export const MemberLabel: React.FC<Props> = (props) => {
    return (
        <div className={[styles.name_block, styles[getLabelColorClassName(props.positions)]].join(' ')}>
            {props.name.split("").map((char,idx) => {
                return <p key={idx}>{char}</p>
            })}
        </div>
    );
}

function getLabelColorClassName(positions:string){
    let cls = '';
    if(positions.includes('1')){
        cls += 'p'
    }
    if(positions.includes('2')){
        cls +='c'
    }
    if(positions.includes('3') || positions.includes('4') || positions.includes('5') || positions.includes('6')){
        cls +='i'
    }
    if(positions.includes('7') || positions.includes('8') || positions.includes('9')){
        cls +='o'
    }
    console.log(`pos_${cls}`)
    return `pos_${cls}`
}