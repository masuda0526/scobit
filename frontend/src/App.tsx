import './App.css'
import { GameList } from './pages/public/gamelist/GameList'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Members } from './pages/public/Members/Members'
import { Loading } from './component/Loading/Loading'
import { Member } from './pages/public/Member/Member'
import { Login } from './pages/public/Login/Login'
import { NewTeam } from './pages/public/NewTeam/NewTeam'
import { TeamPage } from './pages/public/Team/TeamPage'
import { MemberGames } from './pages/public/Member/game/MemberGames'
import { GameDetail } from './pages/public/gamelist/Score/GameDetail'
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
