import { prefArray } from "@scobit/types";
import { createHash } from "crypto";

// 使用予定の関数
export const rand = (min: number, max: number) => Math.random() * (max - min) + min;
export const randInt = (min: number, max: number) => Math.floor(rand(min, max));
export const randomPositions = () => {
  const count = randInt(1, 5);
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(randInt(1, 9));
  }
  return [...nums].sort().join('')
}
export const randomDate = () => {
  const date = new Date(
    [2023, 2024, 2025, 2026][randInt(0, 3)],
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  )
  // let ymd = 0
  // let minNm = Number.parseInt(minDt);
  // while (ymd === 0 || minNm > ymd) {
  //   const y = [2023, 2024, 2025, 2026][randInt(0, 3)];
  //   const m = randInt(1, 12).toString().padStart(2, "0");
  //   const d = randInt(1, 28).toString().padStart(2, "0");
  //   ymd = Number.parseInt(`${y}${m}${d}`)
  // }
  // return ymd.toString();
  return date;
};
export const createRandomAlias = (len:number) => {
  const STRING_SET = 'abcdefghijklmnopqrstuvwxyz0123456789_-';
  const LEN = STRING_SET.length

  let id = '';

  for(let i = 0; i < len; i++){
    const idx = randInt(0, LEN);
    id += STRING_SET[idx]
  }
  return id;
}
const hash = (pass:string, prefix?:string) => {
  const beforehash = `${pass}${prefix??''}`;
  const hash = createHash('sha256').update(beforehash).digest('hex');
  return hash
}

export const getRandomPref = () => {
  return prefArray[randInt(0,46)];
}