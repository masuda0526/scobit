import './App.css'
import { GameList } from './pages/gamelist/GameList'
import { Header } from './common/Header/Header'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Members } from './pages/Members/Members'
import { Loading } from './component/Loading/Loading'
import { Member } from './pages/Member/Member'
import { Login } from './pages/Login/Login'
import { NewTeam } from './pages/NewTeam/NewTeam'

function App() {

  return (
    <>
      <Loading/>
      <Header />
      <div className='wrapper'>
      <HashRouter>
        <Routes>
          <Route path='/games' element={<GameList />} />
          <Route path='/members' element={<Members />} />
          <Route path='/member' element={<Member/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/new-team' element={<NewTeam/>}/>
        </Routes>
      </HashRouter>
      </div>
    </>
  )
}

export default App
