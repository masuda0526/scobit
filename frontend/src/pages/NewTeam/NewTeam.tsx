import type React from "react";
import { Title } from "../../parts/title/title";
import { ContentBox } from "../../parts/content/contentBox";
import { SubTitle } from "../../parts/subtitle/subtitle";
import { Input } from "../../parts/input/Input";
import { useState } from "react";
import { ButtonArea } from "../../parts/button/buttonArea";
import { Button } from "../../parts/button/button";
import { useLoading } from "../../component/Loading/LoadingContext";

export const NewTeam : React.FC = () => {
    const [teamName, setTeamName] = useState('');
    const [establishDt, setEstablishDt] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [teamId, setTeamId] = useState('');
    const [pass, setPass] = useState('');

    const loading = useLoading();

    const doRegist = () => {
        loading.startLoading('登録中...')
        
        // APIを叩く処理

        window.location.href = '/#/login'
    }
    return (
        <>
            <Title text="チーム新規登録" />
            
            <ContentBox>
                <SubTitle text="チーム情報"/>
                <Input label="チーム名" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTeamName(e.target.value)} />
                <Input label="設立日" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEstablishDt(e.target.value)} />
                <Input label="チームID" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTeamId(e.target.value)} />
            </ContentBox>

            <ContentBox>
                <SubTitle text="代表者情報"/>
                <Input label="代表者名" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)} />
                <Input label="管理者パスワード"  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} />
            </ContentBox>
        
            <ButtonArea>
                <Button label="登録する" isRadius={'isRadius'} size="md" onClick={doRegist}/>
            </ButtonArea>
        </>
    )
}