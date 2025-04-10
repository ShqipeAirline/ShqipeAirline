import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import {Routes, Route} from 'react-router-dom'
import AcdLayout from './layouts/AcdLayout'
import Dashboard from './pages/acd/AcdDashboard'
import Schedule from './pages/acd/AcdSchedule'
import FlightDetails from './pages/acd/FlightDetails'
import AcdPassView from './pages/acd/AcdPassView'
import AcdAddFlight from './pages/acd/AcdAddFlight'
import AcdUpdateFlight from './pages/acd/AcdUpdateFlight'
import AcdRemoveFlight from './pages/acd/AcdRemoveFlight'
import Header from './layouts/Header'
import Home from './landingpages/Home'
import Minishop from './landingpages/Minishop'
import Shoppingcart from './landingpages/ShoppingCart'
import PaymentForm from './landingpages/PaymentForm'
import About from './landingpages/About'
import ProtectedRoute from './components/ProtectedRoute'
import Unauthorized from './components/Unauthorized'

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Public Landing pages */}
        <Route path="/" element={<Header/>} >
          <Route index element={<Home/>} />
          <Route path="about-us" element={<About />}/>
          <Route path="mini-shop" element={<Minishop />} />
          <Route path="shopping-cart" element={<Shoppingcart />} />
          <Route path="payment" element={<PaymentForm />} />
        </Route>

        {/* Protected Air Control Department Routes */}
        <Route path="/acd-dashboard" element={
          <ProtectedRoute allowedRoles={['air control staff']}>
            <AcdLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="schedule/flight-details/:flightId" element={<FlightDetails />} />
          <Route path="add-flight" element={<AcdAddFlight />} />
          <Route path="update-flight" element={<AcdUpdateFlight />} />
          <Route path="remove-flight" element={<AcdRemoveFlight />} />
          <Route path="passenger-records" element={<AcdPassView />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
