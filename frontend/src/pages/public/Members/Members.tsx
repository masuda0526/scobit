import type React from "react";
import { UserAbility } from "../../../component/UserAbility/UserAbility";
import { Title } from "../../../parts/title/title";
import { useEffect, useState } from "react";
import { useLoading } from "../../../component/Loading/LoadingContext";
// import { generateMembersForm } from "../../../testdatas/testDataCreater";
import type { Ability, MembersForm, ResponseFormat } from "@scobit/types";
import { ajaxPublicApi } from "../../../Util/AjaxUtil/AjaxUtil";
import { useNavigate, useParams } from "react-router-dom";
import { exceptionProcess } from "../../../Util/CommonUtil/CommonUtil";
import { RelativeWrapper } from "../../../parts/RelativeWrapper/RelativeWrapper";
import { CornerIcon } from "../../../component/Modal/CornerIcon";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { PageHistory, type PageHistoryItem } from "../../../component/PageHistory/PageHistory";

export const Members: React.FC = () => {
    const {publicId} = useParams();
    const nav = useNavigate();
    
    const loading = useLoading();
    const [members, setMembers] = useState<Ability[]>([]);

    const pages:PageHistoryItem[] = [
        {display:'チーム情報', url:`/team/${publicId}`}
    ]
    useEffect(() => {
        const init = async() => {
            loading.startLoading();
            try {
                const r = await ajaxPublicApi.get(`/members?public_id=${publicId}`);
                const res = r.data as ResponseFormat;
                const data = res.data.data as MembersForm;
                setMembers(data.members);
                loading.stopLoading();
            } catch (error) {
                exceptionProcess();
            }
        }
        // const data = generateMembersForm();
        init();
    }, [])

    return (
        <>
            <PageHistory pages={pages}/>
            <Title text="選手一覧"/>
            {members.map(member => {
                return (
                    <>
                        <RelativeWrapper key={member.player_id}>
                            <CornerIcon icon={faRightToBracket} 
                                position='bottom-left' 
                                x={15} 
                                y={8} 
                                style={{ fontSize:'20px' }}
                                onClick={() => nav(`/member/${publicId}/${member.player_id}`)}
                            />
                            <UserAbility player={member} />
                        </RelativeWrapper>
                    </>
                )
            })}
        </>
    );
}