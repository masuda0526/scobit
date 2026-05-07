import type React from "react";
import { Input } from "../../../parts/input/Input";
import { useEffect, useState } from "react";
import { Title } from "../../../parts/title/title";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { ContentBox } from "../../../parts/content/contentBox";
import { useLoading } from "../../../component/Loading/LoadingContext";

export const Login: React.FC = () => {
    const [info, setInfo] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const loading = useLoading();

    const doLogin = async () => {
        loading.startLoading('ログイン中...');
        await sleep(2000);
        const accessToken = 'test-access-token';
        localStorage.setItem('accessToken', accessToken);
        window.location.href = '/#/members'
    }

    useEffect(() => {
        loading.stopLoading();
    }, [])

    return (
        <>
            <ContentBox>
                <Title text="ログイン" />
                <Input 
                    label="メールアドレス" 
                    attr="email"
                    value={info} 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setInfo(e.target.value)} 
                />
                <Input 
                    label="パスワード" 
                    attr="pass"
                    value={pass} 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} 
                />
                <ButtonArea>
                    <Button label="ログイン" size="md" onClick={doLogin}/>
                </ButtonArea>

                <ButtonArea position="right">
                    <a href="/#/new-team"> 新規登録はコチラ ＞</a>
                </ButtonArea>

            </ContentBox>
        </>
    )
}

async function sleep(msTime:number) {
    await new Promise(resolve => {
        setTimeout(() => {
            resolve('');
        }, msTime)
    });
}