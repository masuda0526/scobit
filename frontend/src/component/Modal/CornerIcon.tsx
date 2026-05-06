import React, { type CSSProperties } from "react";
import styles from './Modal.module.css'
import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

type PositionType = 'top-right'|'top-left'|'bottom-right'|'bottom-left'

type CornerIconType = {
  position?:PositionType,
  x?:number,
  y?:number,
} & FontAwesomeIconProps

export const CornerIcon:React.FC<CornerIconType> = ({
  position = 'top-right',
  x = 10,
  y = 10,
  style,
  ...props
}) => {
  const css = createPositionStyle(position, x, y);
  return (
    <FontAwesomeIcon 
      className={styles.icon}
      style={{...css, ...style}}
      {...props}
    />
  )
} 

const createPositionStyle = (position: PositionType, x: number, y: number): CSSProperties => {
  const base: CSSProperties = { position: "absolute", fontSize:'x-large' };

  switch (position) {
    case 'top-right':
      return { ...base, top: y, right: x };
    case 'top-left':
      return { ...base, top: y, left: x };
    case 'bottom-right':
      return { ...base, bottom: y, right: x };
    case 'bottom-left':
      return { ...base, bottom: y, left: x };
  }
};