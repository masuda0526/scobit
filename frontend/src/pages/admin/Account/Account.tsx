import { AccountFormSchema, PlayerInputSchema, type AccountForm, type PlayerInput } from "@scobit/types";
import type React from "react";
import { useEffect, useState } from "react";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { Input } from "../../../parts/input/Input";
import { GroundPosition } from "../../../component/GroundPosition/GroundPosition";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { Title } from "../../../parts/title/title";
import { useParams } from "react-router-dom";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { convertToErrorInfos } from "../../../Util/ZodUtils";

export const Account: React.FC = () => {
  // パスパラメータ取得
  const { tmpId } = useParams();

  // コンテキスト
  const err = useErrorArea();
  const loading = useLoading();

  // 状態管理
  const initAccount = (): AccountForm => { return { account_pub_id: '', email: '' } };
  const initPlayer = (): PlayerInput => { return { name: '', disp_name: '', throw_distance: '0', positions: '' } }
  const [account, setAccount] = useState<AccountForm>(initAccount())
  const [player, setPlayer] = useState<PlayerInput>(initPlayer());

  const updateAccount = (key: keyof AccountForm, val: string) => {
    setAccount(prev => ({ ...prev, [key]: val }));
  }

  const updatePlayer = (key: keyof PlayerInput, val: string) => {
    setPlayer(prev => ({ ...prev, [key]: val }))
  }

  const clickPosition = (position: string) => {
    setPlayer(prev => {
      const befo = prev.positions.split('');
      let afte: string[] = [];
      if (befo.includes(position)) {
        afte = befo.filter(pos => pos !== position);
      } else {
        afte = [...befo, position];
      }
      return { ...prev, positions: afte.sort().join('') }
    })
  }

  useEffect(() => {
    loading.startLoading(); 
    if (tmpId) {
      console.log(`tmpIdあり`);
      setAccount({ account_pub_id: 'aaaaaaa', email: 'test@test.com' })
      setPlayer({ name: 'テスト', disp_name: 'テスト１', throw_distance: '85', positions: '46789' })
    }
    loading.stopLoading();
  }, [])

  const clickRegistButton = () => {
    loading.startLoading();
    err.reset();

    // バリデーション
    const validPlayer = PlayerInputSchema.safeParse(player);
    const validAccount = AccountFormSchema.safeParse(account);

    if (!validAccount.success) {
      err.setErrors(convertToErrorInfos(validAccount.error));
    }
    if (!validPlayer.success) {
      err.setErrors(convertToErrorInfos(validPlayer.error));
    }
    if (Number.isNaN(Number.parseInt(player.throw_distance))) {
      err.addError({ field: 'throw_distance', message: '遠投距離を確認してください。' });
    }

    if (err.isError()) {
      loading.stopLoading();
      return;
    }

    // 登録処理
    
    loading.stopLoading();
  }

  return (
    <>
      <Title text="新規登録" />
      <ErrorArea />
      <ContentBox>
        <SubTitle text="アカウント情報" />
        <Input label="ユーザーID" attr="account_pub_id" value={account.account_pub_id} onChange={(e) => updateAccount('account_pub_id', e.target.value)} />
        <Input label="メールアドレス" attr="email" value={account.email} onChange={(e) => updateAccount('email', e.target.value)} />
      </ContentBox>

      <ContentBox>
        <SubTitle text='選手情報' />
        <Input label="選手名" attr='name' value={player.name} onChange={(e) => updatePlayer('name', e.target.value)} />
        <Input label="表示名" attr='disp_name' value={player.disp_name} onChange={(e) => updatePlayer('disp_name', e.target.value)} />
        <Input type="number" label="遠投距離(m)" attr='throw_distance' value={player.throw_distance} onChange={(e) => updatePlayer('throw_distance', e.target.value)} />
      </ContentBox>

      <ContentBox>
        <SubTitle text="ポジション" />
        <GroundPosition positions={player.positions.split('')} clickToggle={clickPosition} />
      </ContentBox>

      <ButtonArea>
        <Button label="登録する" isRadius='isRadius' size='md' onClick={clickRegistButton} />
      </ButtonArea>
    </>
  )

}