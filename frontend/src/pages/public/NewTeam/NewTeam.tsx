import type React from "react";
import { Title } from "../../../parts/title/title";
import { ContentBox } from "../../../parts/content/contentBox";
import { SubTitle } from "../../../parts/subtitle/subtitle";
import { Input } from "../../../parts/input/Input";
import { useState } from "react";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { useLoading } from "../../../component/Loading/LoadingContext";
import type { NewTeamPageForm } from "@scobit/types";

export const NewTeam : React.FC = () => {
    const [teamName, setTeamName] = useState('');
    const [establishDt, setEstablishDt] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [teamId, setTeamId] = useState('');
    const [pass, setPass] = useState('');
    const [repass, setRePass] = useState('');
    const [email, setEmail] = useState('');

    const loading = useLoading();

    const doRegist = () => {
        loading.startLoading('登録中...')
        
        // APIを叩く処理
        const form : NewTeamPageForm = {teamName,teamId,establishDt,leaderName, pass, repass, email};
        console.log(form.leaderName);

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
                <Input label="代表者名" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setLeaderName(e.target.value)} />
                <Input label="メールアドレス" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                <Input label="管理者パスワード"  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} />
                <Input label="管理者パスワード（確認用）"  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setRePass(e.target.value)} />
            </ContentBox>
        
            <ButtonArea>
                <Button label="登録する" isRadius={'isRadius'} size="md" onClick={doRegist}/>
            </ButtonArea>
        </>
    )
}