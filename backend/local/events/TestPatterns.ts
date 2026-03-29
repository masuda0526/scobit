import { APIGatewayProxyEvent } from "aws-lambda"
import { GameDetailPatterns } from "./GameDetailPageTest.js"
import { GamesPatterns } from "./GamesPageTest.js"
import { MemberPatterns } from "./memberPageTest.js"
import { memberGamesPage } from "@func/memberGames/index.js"
import { MemberGamesPatterns } from "./MemberGamesPageTest.js"
import { MembersPattern } from "./MembersPageTest.js"
import { TeamPattern } from "./TeamPageTest.js"

export type SearchOption = {
  api_id:string,
  test_case:string,
}
export type TestPattern = SearchOption & {
  name:string,
  event:APIGatewayProxyEvent
}

export const allPatterns:TestPattern[] = [
  ...GameDetailPatterns,
  ...GamesPatterns,
  ...MemberPatterns,
  ...MemberGamesPatterns,
  ...MembersPattern,
  ...TeamPattern,
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