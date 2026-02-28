import { type Ability, type Game, type GameDetail, type GammesForm, type MemberForm, type MemberGamesForm, type MembersForm, type Score, type Team, type TeamTopForm, type User } from "@scobit/types";

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

const makeUser = (t_id:string):User => {
    return {
        u_id:crypto.randomUUID(),
        t_id,
        name:`テスト　太郎${randInt(0,99)}`,
        disp_name:`選手${randInt(0,99)}`,
        throw_distance:randInt(20, 150),
        sprint_sec:rand(5, 10),
        pos:randomPositions(),
        status:'',
        delflg:false,
        created_at:randomDate(),
        updated_at:randomDate(),
        join_at:randomDate(),
    }
}

const makeGame = (t_id:string, index:number = 1):Game => {
    return {
        t_id,
        g_id:crypto.randomUUID(),
        seq:index,
        opponent:`対戦相手${randInt(1, 99)}`,
        my_point:randInt(0, 20),
        op_point:randInt(0, 20),
        g_dt:randomDate()
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

const makeScores = (t_id:string, u_id:string, index = 1):Score => {
    const isTurn = [true, false, false][randInt(0,2)];
    const box = isTurn?randInt(1, 10):0;
    const hit = isTurn?randInt(0, box):0;

    return {
        t_id,u_id,isTurn,box,hit,
        hr:isTurn?randInt(0, hit):0,
        steal:isTurn?randInt(0, 5):0,
        err:isTurn?randInt(0, 5):0,
        gameDt:randomDate(),
        seq:index,
        opponent:`テスト相手${randInt(1, 99)}`,
        disp_name:`選手${randInt(0,99)}`,
        positions:randomPositions(),
        g_id:crypto.randomUUID()
    }
}

export const generateMembersForm = ():MembersForm => {
    const t_id = crypto.randomUUID();

    return {
        info:makeTeam(t_id),
        members: Array.from({ length: rand(9, 40) }).map((_) => (makeAbility(t_id)))
    }
}

export const generateMemberForm = ():MemberForm => {
    const t_id = crypto.randomUUID();
    const throw_distance = randInt(10, 150);
    const dispName = `選手${randInt(0,99)}`;
    const sprint_sec = rand(5, 10);
    const u_id = crypto.randomUUID();
    const name = `テスト　太郎${randInt(0,99)}`;
    const positions = randomPositions();
    
    return {
        info:{...makeUser(t_id), throw_distance, disp_name:dispName, sprint_sec, u_id, name, pos:positions},
        ability:{...makeAbility(t_id), throw_distance, dispName, sprint_sec, u_id, userName:name, positions},
        scores: Array.from({length:randInt(1, 10)}).map((_, i) => ({...makeScores(t_id, u_id, i), disp_name:dispName, positions}))
    }
}

export const generateMemberGamesForm = ():MemberGamesForm => {
    const t_id = crypto.randomUUID();
    const throw_distance = randInt(10, 150);
    const dispName = `選手${randInt(0,99)}`;
    const sprint_sec = rand(5, 10);
    const u_id = crypto.randomUUID();
    const name = `テスト　太郎${randInt(0,99)}`;
    const positions = randomPositions();
    const g_id = crypto.randomUUID();

    return {
        info:{...makeUser(t_id), u_id, disp_name:dispName, throw_distance, sprint_sec, name, pos:positions},
        scores:Array.from({length:randInt(0, 50)}).map((_, i) => ({...makeScores(t_id, u_id, i), disp_name:dispName, positions, g_id}))
    }
}

export const generateGamesForm = ():GammesForm => {
    const t_id = crypto.randomUUID();
    return {
        team:makeTeam(t_id),
        games:Array.from({length:randInt(0, 100)}).map((_, i) => ({...makeGame(t_id, i)}))
    }
}
export const generateGameDetailForm = ():GameDetail => {
    const t_id = crypto.randomUUID();
    return {
        game:makeGame(t_id),
        scores:Array.from({length:randInt(0, 30)}).map((_, i) => ({...makeScores(t_id, crypto.randomUUID())}))
    }
}