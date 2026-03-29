import { APIGatewayProxyEvent } from "aws-lambda"
import { GameDetailPatterns } from "./GameDetail.js"

export type SearchOption = {
  api_id:string,
  test_case:string,
}
export type TestPattern = SearchOption & {
  name:string,
  event:APIGatewayProxyEvent
}

export const allPatterns:TestPattern[] = [
  ...GameDetailPatterns
]

export const findTestPattern = (api_id:string, test_case:string) => {
  return allPatterns.find(pattern => pattern.api_id === api_id && pattern.test_case)
}

export const findTestPatterns = (searchOptions:SearchOption[]) => {
  const testPatternList:TestPattern[] = [];
  for(const searchOpt of searchOptions){
    const pattern = findTestPattern(searchOpt.api_id, searchOpt.test_case);
    if(!pattern){
      console.log(`一致するテストパターンが存在しません。`);
      continue;
    }
    testPatternList.push(pattern);
  }
  return testPatternList;
}