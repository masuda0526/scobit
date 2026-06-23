import type React from "react";
import { Input } from "../../../parts/input/Input";
import { useEffect, useState } from "react";
import { Title } from "../../../parts/title/title";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { ContentBox } from "../../../parts/content/contentBox";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { AccessTokenUtil } from "../../../Util/TokenUtil/AccessTokenUtil";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { useErrorArea } from "../../../component/ErrorArea/ErrorAreaContext";
import { convertToErrorInfos } from "../../../Util/ZodUtils";
import { ajaxPublicApi } from "../../../Util/AjaxUtil/AjaxUtil";
import type { ResponseFormat } from "@scobit/types";
import { ErrorArea } from "../../../component/ErrorArea/ErrorArea";
import { exceptionProcess } from "../../../Util/CommonUtil/CommonUtil";

export const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const loading = useLoading();
    const navigator = useNavigate();
    const err = useErrorArea();

    const doLogin = async () => {
        loading.startLoading('ログイン中...');
        err.reset();
        const valid = schema.safeParse({email, pass});
        if(!valid.success){
            err.setErrors(convertToErrorInfos(valid.error));
            loading.stopLoading();
            return;
        }
        try {
            await ajaxPublicApi.post('/login', {email, pass})
            .then(res => {
                const data = res.data as ResponseFormat;
                // console.log(data);
                if(!data.isSuccess){
                    err.setErrors(data.errors??[]);
                    loading.stopLoading();
                    return ;
                }
                const token = data.data.token;
                AccessTokenUtil.setToken(token);
                
                loading.stopLoading();
                navigator('/admin/mypage');
            }).catch(err => {
                console.log(err);
                exceptionProcess();
                return;
            })
        } catch (error) {
            exceptionProcess();
            return;
        }
    }

    useEffect(() => {
        err.reset();
        loading.stopLoading();
    }, [])

    return (
        <>
            <ContentBox>
                <Title text="ログイン" />
                <ErrorArea/>
                <Input 
                    label="メールアドレス" 
                    attr="email"
                    value={email} 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                />
                <Input 
                    type="password"
                    label="パスワード" 
                    attr="pass"
                    value={pass} 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPass(e.target.value)} 
                />
                <ButtonArea>
                    <Button label="ログイン" size="md" onClick={doLogin}/>
                </ButtonArea>

                <ButtonArea position="right">
                    <a href="/new"> 新規登録はコチラ ＞</a>
                </ButtonArea>

            </ContentBox>
        </>
    )
}

const schema = z.object({
    email: z.string().trim().toLowerCase().email(),
    pass: z.string().min(1).max(20)
})