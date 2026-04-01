import type React from "react";
import { UserAbility } from "../../../component/UserAbility/UserAbility";
import { Title } from "../../../parts/title/title";
import { ButtonArea } from "../../../parts/button/buttonArea";
import { Button } from "../../../parts/button/button";
import { useEffect } from "react";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { generateMembersForm } from "../../../testdatas/testDataCreater";

export const Members: React.FC = () => {
    const data = generateMembersForm();
    const members = data.members
    const loading = useLoading();
    const handleClick = () => {
        console.log('click')
    }

    useEffect(() => {
        loading.stopLoading();
    }, [])
    return (
        <>
            <Title text="選手一覧"/>
            {members.map(member => {
                return <UserAbility key={member.player_id} player={member} />
            })}
            <ButtonArea position="center">
                <Button 
                    label="選手追加" 
                    isRadius="isRadius" 
                    size="md"
                    onClick={handleClick}
                />
            </ButtonArea>
        </>
    );
}