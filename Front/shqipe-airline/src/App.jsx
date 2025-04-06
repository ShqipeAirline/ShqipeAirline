import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import {Routes, Route} from 'react-router-dom'
import AcdLayout from './layouts/AcdLayout'
import Dashboard from './pages/acd/AcdDashboard'
import Schedule from './pages/acd/AcdSchedule'
import FlightDetails from './pages/acd/FlightDetails'
import AcdPassView from './pages/acd/AcdPassView';
import AcdAddFlight from './pages/acd/AcdAddFlight'
import AcdUpdateFlight from './pages/acd/AcdUpdateFlight'
import AcdRemoveFlight from './pages/acd/AcdRemoveFlight'
import Header from './layouts/Header'
import Home from './landingpages/Home'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="register/" element={<Register />} />
        
        {/*Landing pages*/}
        <Route path="/" element={<Header/>} >
          <Route index element={<Home/>} />
          <Route path="about-us"  />
        </Route>
        {/* Air Control Department Routes */}
        <Route path="/acd-dashboard" element={<AcdLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="schedule/flight-details/:flightId" element={<FlightDetails />} />
          <Route path="/acd-dashboard/add-flight" element={<AcdAddFlight />} />
          <Route path="/acd-dashboard/update-flight" element={<AcdUpdateFlight />} />
          <Route path="/acd-dashboard/remove-flight" element={<AcdRemoveFlight />} />
        </Route>
         <Route path="/passenger-records" element={<AcdPassView />} />
      </Routes>
    </>
  )
}

export default App
