import type React from "react";
import { Input } from "../../parts/input/Input";
import { useState } from "react";
import { Title } from "../../parts/title/title";
import { ButtonArea } from "../../parts/button/buttonArea";
import { Button } from "../../parts/button/button";
import { ContentBox } from "../../parts/content/contentBox";

export const Login: React.FC = () => {
    const [info, setInfo] = useState<string>('');
    const [pass, setPass] = useState<string>('');

    return (
        <>
            <ContentBox>
                <Title text="ログイン" />
                <Input 
                    label="メールアドレス or ユーザーID" 
                    value={info} 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setInfo(e.target.value)} 
                />
                <Input 
                    label="パスワード" 
                    value={pass} 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} 
                />
                <ButtonArea>
                    <Button label="ログイン" size="md"/>
                </ButtonArea>

            </ContentBox>
        </>
    )
}