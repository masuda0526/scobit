import './App.css'
import { GameList } from './pages/gamelist/GameList'
import { Header } from './common/Header/Header'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Members } from './pages/Members/Members'
import { Loading } from './component/Loading/Loading'

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
        </Routes>
      </HashRouter>
      </div>
    </>
  )
}

export default App
