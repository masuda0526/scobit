import './App.css'
import { GameList } from './pages/gamelist/GameList'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Members } from './pages/Members/Members'
import { Loading } from './component/Loading/Loading'
import { Member } from './pages/Member/Member'
import { Login } from './pages/Login/Login'
import { NewTeam } from './pages/NewTeam/NewTeam'
import { TeamPage } from './pages/Team/TeamPage'
import { MemberGames } from './pages/Member/game/MemberGames'
import { GameDetail } from './pages/gamelist/Score/GameDetail'
import { LayoutShell } from './component/Layout/LayoutShell'

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
            <Route path='/new-team'     element={<NewTeam />} />
            <Route path='/team'         element={<TeamPage />} />
          </Routes>
        </LayoutShell>
      </HashRouter>
    </>
  )
}

export default App
