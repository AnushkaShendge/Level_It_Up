import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/dashboard'
import AIAgentsPage from './pages/aiAgents'
import DynamicCalendar from './pages/Calendar'
import AgentPlayground from './pages/aiPlayground'
import GTranslate from './components/gTranslate'
import LandingPage from './pages/Landing'
import Inbox from './pages/inbox'
import EmployeeManagementDashboard from './pages/exployee'
import Login from './pages/login'
import Signup from './pages/signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GTranslate/>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/inbox' element={<Inbox />} />
        <Route path='/agents' element={<AIAgentsPage />} />
        <Route path='/calendar' element={<DynamicCalendar />} />
        <Route path='/playground' element={<AgentPlayground />} />
        <Route path='/employee' element={<EmployeeManagementDashboard />} />
      </Routes>
    </>
  )
}

export default App
