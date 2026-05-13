import { prefArray } from "@scobit/types";

export class TestFunctionUtil{

  static rand(min: number, max: number){
    return Math.random() * (max - min) + min
  };
  
  static randInt(min: number, max: number){
    return Math.floor(this.rand(min, max))
  };
  
  static randomPositions(){
    const count = this.randInt(1, 5);
    const nums = new Set<number>();
    while (nums.size < count) {
      nums.add(this.randInt(1, 9));
    }
    return [...nums].sort().join('')
  }
  static randomDate(){
    const date = new Date(
      [2023, 2024, 2025, 2026][this.randInt(0, 3)],
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
  static createRandomAlias(len:number){
    const STRING_SET = 'abcdefghijklmnopqrstuvwxyz0123456789_-';
    const LEN = STRING_SET.length
  
    let id = '';
  
    for(let i = 0; i < len; i++){
      const idx = this.randInt(0, LEN);
      id += STRING_SET[idx]
    }
    return id;
  }

  static createRandomAliasNotNumberToFirstChar(len:number){
    const STRING_SET = 'abcdefghijklmnopqrstuvwxyz';
    const KIGO_SET = '_-';
    const NUMBER_SET = '0123456789';
  
    let id = '';

    const firstChar = STRING_SET[this.randInt(0, STRING_SET.length)];

    const ALL_CHARS = STRING_SET+KIGO_SET+NUMBER_SET;
    const ALL_LENGTH = ALL_CHARS.length;

    for(let i = 0; i < len - 1; i++){  
      const idx = this.randInt(0, ALL_LENGTH);
      id += ALL_CHARS[idx]
    }
    return id;
  }
  
  static getRandomPref(){
    return prefArray[this.randInt(0,46)];
  }
}