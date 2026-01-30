import {createHash} from 'crypto'

/**
 * パスワードをハッシュ化して返却します
 * @param pass 平文のパスワード
 * @returns ハッシュ化したパスワード
 */
export const hashPass = (pass:string) => {
  return createHash('sha256').update(pass).digest('hex');
}