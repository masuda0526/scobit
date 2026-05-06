import type React from "react";
import { UserAbility } from "../../../component/UserAbility/UserAbility";
import { Title } from "../../../parts/title/title";
import { useEffect, useState } from "react";
import { useLoading } from "../../../component/Loading/LoadingContext";
import { generateMembersForm } from "../../../testdatas/testDataCreater";
import type { Ability } from "@scobit/types";

export const Members: React.FC = () => {
    const loading = useLoading();
    const [members, setMembers] = useState<Ability[]>([]);
    useEffect(() => {
        loading.stopLoading();
        const data = generateMembersForm();
        setMembers(data.members)
    }, [])

    return (
        <>
            <Title text="選手一覧"/>
            {members.map(member => {
                return <UserAbility key={member.player_id} player={member} />
            })}
        </>
    );
}