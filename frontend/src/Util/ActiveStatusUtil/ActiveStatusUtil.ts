import { ActiveInfo, Intervals, type IntervalKey } from "@scobit/types";

export const perseActiveStatus = (interval:IntervalKey, activeInfoVals:string[]) => {
    const dispList:string[] = [];
    const intervalObj = Intervals[interval];
    const activeInfos = ActiveInfo[interval];
    activeInfos.forEach(info => {
        if(activeInfoVals.includes(info.val)){
            dispList.push(info.label)
        }
    })
    return `${intervalObj.label} ${dispList.join(',')}`;
}