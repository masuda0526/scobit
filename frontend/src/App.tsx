import './App.css'
import { GameList } from './pages/public/gamelist/GameList'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Members } from './pages/public/Members/Members'
import { Loading } from './component/Loading/Loading'
import { Member } from './pages/public/Member/Member'
import { Login } from './pages/public/Login/Login'
import { TeamPage } from './pages/public/Team/TeamPage'
import { MemberGames } from './pages/public/Member/game/MemberGames'
import { GameDetail } from './pages/public/gamelist/Score/GameDetail'
import { LayoutShell } from './component/Layout/LayoutShell'
import { AdminTeam } from './pages/admin/Team/AdminTeam'
import { AdminMember } from './pages/admin/Member/Member'
import { AdminGames } from './pages/admin/Games/Games'
import { AdminGame } from './pages/admin/Games/Score/Game'
import { AdminGameEdit } from './pages/admin/Games/Score/GameEdit'
import { AdminMembers } from './pages/admin/Members/Members'
import { Account } from './pages/admin/Account/Account'
import { Mypage } from './pages/admin/Mypage/Mypage'
import { NewTeamPage } from './pages/admin/NewTeam/NewTeam'
import { AddGameForKojinUser } from './pages/admin/AddGameForKojin/AddGameForKojinUser'
import { AdminMemberForKojinAccount } from './pages/admin/Member/MemberForKojinAccount'

function App() {

  return (
    <>
      <Loading />
      <HashRouter>
        <LayoutShell>
          <Routes>
            <Route path='/games'        element={<GameList />} />
            <Route path='/game'         element={<GameDetail />} />
            <Route path='/members'      element={<Members />} />
            <Route path='/member'       element={<Member />} />
            <Route path='/member/games' element={<MemberGames />} />
            <Route path='/login'        element={<Login />} />
            {/* <Route path='/new-team'     element={<NewTeam />} /> */}
            <Route path='/team'         element={<TeamPage />} />
            <Route path='/new/'          element={<Account/>}/>
            <Route path='/new/:tmpId'          element={<Account/>}/>
            <Route path='/admin/mypage' element={<Mypage/>}/>
            <Route path='/admin/new/team' element={<NewTeamPage/>}/>
            <Route path='/admin/team'   element={<AdminTeam/>} />
            <Route path='/admin/member'   element={<AdminMember/>} />
            <Route path='/admin/members' element={<AdminMembers/>}/>
            <Route path='/admin/games'   element={<AdminGames/>} />
            <Route path='/admin/game'   element={<AdminGame/>} />
            <Route path='/admin/game/edit'   element={<AdminGameEdit/>} />
            <Route path='/admin/game/kojin' element={<AddGameForKojinUser/>} />
            <Route path='/admin/game/kojin/:gameId' element={<AddGameForKojinUser/>} />
            <Route path='/admin/member/kojin' element={<AdminMemberForKojinAccount/>} />
          </Routes>
        </LayoutShell>
      </HashRouter>
    </>
  )
}

export default App
