import type React from "react";
import { Select } from "./Select";
import { prefArray } from "@scobit/types";

export const PrefSelect:React.FC<React.InputHTMLAttributes<HTMLSelectElement>> = ({...props}) => {
  const prefs = [...prefArray]
  return (
    <Select 
      label="都道府県"
      options={prefs}
      {...props}
    />
  )
}