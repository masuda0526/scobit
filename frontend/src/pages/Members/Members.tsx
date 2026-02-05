import type React from "react";
import { UserAbility } from "../../component/UserAbility/UserAbility";
import { testPlayers } from "../../testdatas/members";
import { Title } from "../../parts/title/title";

export const Members: React.FC = () => {
    const members = testPlayers;
    return (
        <>
            <Title text="選手一覧"/>
            {members.map(member => {
                return <UserAbility player={member} />
            })}
        </>
    );
}