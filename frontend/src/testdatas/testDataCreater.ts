import { GameResultConsts, prefArray, TournamentType, type Ability, type AccountForm, type AdminGameEditForm, type AdminGamesForms, type GameDetail, type GameForm, type GamesForm, type MemberForm, type MemberGamesForm, type MembersForm, type MypageFormOfIndividualUser, type MypageFormOfTeams, type PlayerForm, type ScoreForm, type ScoreItemDto, type TeamForm, type TeamTopForm, type Tournament } from "@scobit/types";
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
    const m = randInt(1, 12);
    const d = randInt(1, 28);
    return new Date(y, m, d);
};

const makeTeam = (team_id:string):TeamForm => {
    return {
            team_id,
            public_id: `pub_id-${randInt(1, 100)}`,
            team_name: `テストチーム${randInt(1000, 9999)}`,
            pref:prefArray[randInt(0, 47)],
            area: 'テスト地域',
            created_at: randomDate(),
            description:'あいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえおあいうえお'
        }
}

const makeAbility = ():Ability => {
    return {
            team_id:crypto.randomUUID(),
            avr: Number(rand(0, 1).toFixed(3)),
            hr_per_box: Number(rand(0, 1).toFixed(2)),
            steal_per_game: Number(rand(0, 1).toFixed(2)),
            err_per_game: Number(rand(0, 0.5).toFixed(2)),
            throw_distance: randInt(70, 100),
            player_id:crypto.randomUUID(),
            hr:randInt(0, 100),
            steal:randInt(0, 100),
            disp_name: `選手${randInt(1, 99)}`,
            name: `テスト　太郎${randInt(1, 99)}`,
            positions: randomPositions()
        }
}

const makeTournament = (team:TeamForm):Tournament => {
  const now = new Date();
  return {
    tournament_id:crypto.randomUUID(),
    team_id:team.team_id,
    name:`テスト用大会${randInt(0, 100)}`,
    type:TournamentType[randInt(0,4)],
    start_dt:now,
    end_dt:now,
    created_at:now,
    updated_at:now,
  }
}

const makePlayer = ():PlayerForm => {
    return {
        player_id:crypto.randomUUID(),
        name:`テスト　太郎${randInt(0,99)}`,
        disp_name:`選手${randInt(0,99)}`,
        throw_distance:randInt(20, 150),
        positions:randomPositions(),
    }
}

const makeGame = ():GameForm => {
    return {
        game_id:crypto.randomUUID(),
        seq:1,
        tournament_id:crypto.randomUUID(),
        opponent:`対戦相手${randInt(1, 99)}`,
        my_point:randInt(0, 20),
        op_point:randInt(0, 20),
        result:GameResultConsts[randInt(0, 4)],
        game_dt:randomDate()
    }
}

export const generateTeamForms = (): TeamTopForm => {
    const t_id = crypto.randomUUID();

    return {
        info: makeTeam(t_id),
        games: Array.from({ length: 5 }).map((_) => ({
            game_id: crypto.randomUUID(),
            seq: 1,
            tournament_id: crypto.randomUUID(),
            opponent: `テスト相手${randInt(0, 100)}`,
            my_point: randInt(0, 99),
            op_point: randInt(0, 99),
            result:GameResultConsts[randInt(0, 4)],
            game_dt: randomDate()
        })),
        players: Array.from({ length: rand(9, 20) }).map((_) => {
            const idx = randInt(0, 99);
            return {
                disp_name:`太郎${idx}`,
                player_id:crypto.randomUUID(),
                positions:randomPositions(),
                throw_distance:randInt(40, 150),
                name:`テスト　太郎${idx}`
            }
        })
    }
}

const makeScores = ():ScoreForm => {
    const is_turn = [true, false, false][randInt(0,2)];
    const box = is_turn?randInt(1, 10):0;
    const hit = is_turn?randInt(0, box):0;

    return {
        player_id:crypto.randomUUID(),
        score_id:crypto.randomUUID(),
        box,hit,is_turn,
        hr:is_turn?randInt(0, hit):0,
        steal:is_turn?randInt(0, 5):0,
        err:is_turn?randInt(0, 5):0,
    }
}

const makeScoreItem = ():ScoreItemDto => {
    return {
        ...makeScores(),
        ...makeGame()
    }
}

export const generateMembersForm = ():MembersForm => {
    const t_id = crypto.randomUUID();

    return {
        info:makeTeam(t_id),
        members: Array.from({ length: rand(9, 40) }).map((_) => (makeAbility()))
    }
}

export const generateMemberForm = ():MemberForm => {    
    return {
        info:makeAbility(),
        scores: Array.from({length:randInt(1, 10)}).map((_) => ({...makeScoreItem()}))
    }
}

export const generateMemberGamesForm = ():MemberGamesForm => {
    return {
        info:{...makePlayer()},
        scores:Array.from({length:randInt(0, 50)}).map((_) => ({...makeScoreItem()}))
    }
}

export const generateGamesForm = ():GamesForm => {
    const t_id = crypto.randomUUID();
    return {
        team:makeTeam(t_id),
        games:Array.from({length:randInt(0, 100)}).map((_) => ({...makeGame()}))
    }
}
export const generateAdminGamesForm = ():AdminGamesForms => {
    const obj = generateGamesForm();
    return {
        ...obj,
        tournaments:Array.from({length:randInt(3, 10)}).map((_)=> makeTournament(obj.team))
    }
}
export const generateGameDetailForm = ():GameDetail => {
    return {
        game:makeGame(),
        scores:Array.from({length:randInt(0, 30)}).map((_) => {
            return {
                ...makeScores(),
                disp_name:`太郎${randInt(0, 99).toString()}`,
                positions:randomPositions()
            }
        })
    }
}
export const generateAdminGameEditForm = ():AdminGameEditForm => {
    const team_id = crypto.randomUUID();
    const game:GameForm = makeGame();
    const team:TeamForm = makeTeam(team_id);
    const members:PlayerForm[] = Array.from({length:randInt(10, 30)}).map((_) => makePlayer());
    const scores:ScoreForm[] = Array.from({length:members.length}).map((_, i) => {
        return {
            ...makeScores(),
            player_id:members[i].player_id,
            game_id:game.game_id
        }
    })
    const tournaments:Tournament[] = Array.from({length:randInt(3, 10)}).map((_)=> makeTournament(team))
    return {game, members, scores, tournaments}
}

export const generateAdminMypageFetchTeams = ():MypageFormOfTeams => {
    return {account:{account_pub_id:`publicId${randInt(0, 100)}`, email:`test${randInt(0, 100)}@test.com`},teams:Array.from({length:randInt(0, 5)}).map((_) => makeTeam(crypto.randomUUID()))}
}

export const generateAdminMypageFetchKojinAccount = ():MypageFormOfIndividualUser => {
    const ability = makeAbility();
    const scores = Array.from({length:randInt(0, 50)}).map((_) => makeScoreItem());
    const account:AccountForm = {email:'teat@test.com', account_pub_id:'testPublicId001'}
    return {ability, account, scores}
}