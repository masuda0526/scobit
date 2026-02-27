import type { Ability, MembersForm, Team, TeamTopForm } from "@scobit/types";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max));

const randomPositions = () => {
    const count = randInt(1, 9);
    const nums = new Set<number>();
    while (nums.size < count) {
        nums.add(randInt(1, 9));
    }
    return [...nums].sort().join('')
}

const randomDate = () => {
    const y = 2025;
    const m = randInt(1, 12).toString().padStart(2, "0");
    const d = randInt(1, 28).toString().padStart(2, "0");
    return `${y}${m}${d}`;
};

const makeTeam = (t_id:string):Team => {
    return {
            t_id,
            teamName: `テストチーム${randInt(1000, 9999)}`,
            area: '大阪',
            interval: 'WEEK',
            activeInfo: ['sun'],
            createdDt: randomDate(),
            registeredDt: randomDate(),
            payMode: randInt(1, 2),
            leaderName: ['青木', '石田', '上田', '榎田', '岡田'][randInt(0, 4)],
            icon: ''
        }
}

const makeAbility = (t_id:string):Ability => {
    return {
            a_id: crypto.randomUUID(),
            t_id,
            avr: Number(rand(0, 1).toFixed(3)),
            hr_per_game: Number(rand(0, 1).toFixed(2)),
            steal_per_game: Number(rand(0, 1).toFixed(2)),
            err_per_game: Number(rand(0, 0.5).toFixed(2)),
            throw_distance: randInt(70, 100),
            sprint_sec: Number(rand(5.5, 7.5).toFixed(2)),
            u_id:crypto.randomUUID(),
            hr:randInt(0, 100),
            steal:randInt(0, 100),
            dispName: `選手${randInt(1, 99)}`,
            userName: `テスト　太郎${randInt(1, 99)}`,
            positions: randomPositions()
        }
}


export const generateTeamForms = (): TeamTopForm => {
    const t_id = crypto.randomUUID();

    return {
        info: makeTeam(t_id),
        games: Array.from({ length: 5 }).map((_, i) => ({
            g_id: crypto.randomUUID(),
            t_id,
            seq: i,
            opponent: `テスト相手${randInt(0, 100)}`,
            my_point: randInt(0, 99),
            op_point: randInt(0, 99),
            g_dt: randomDate()
        })),
        members: Array.from({ length: rand(9, 20) }).map((_) => (makeAbility(t_id)))
    }
}

export const generateMembersForm = ():MembersForm => {
    const t_id = crypto.randomUUID();

    return {
        info:makeTeam(t_id),
        members: Array.from({ length: rand(9, 40) }).map((_) => (makeAbility(t_id)))
    }
}