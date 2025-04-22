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
import Minishop from './landingpages/Minishop';
import Shoppingcart from './landingpages/ShoppingCart';
import PaymentForm from './landingpages/PaymentForm';
import About from './landingpages/About'
import Footer from './layouts/Footer'
import JobApplication from './landingpages/JobApplication'; 
import JobApplicationForm from './landingpages/JobApplicationForm';
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'

import AirCraftDetails from './landingpages/AirCraftDetails';
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="register/" element={<Register />} />
        
        {/*Landing pages*/}
        <Route path="/" element={<><Header /><Footer /></>}>
          <Route index element={<Home/>} />
          <Route path="about-us"  element={<About />}/>
          <Route path="mini-shop" element={<Minishop />} />
          <Route path="shopping-cart" element={<Shoppingcart />} />
          <Route path="payment" element={<PaymentForm />} />
          <Route path="job-application" element={<JobApplication />} />
          <Route path="job-application-form" element={<JobApplicationForm />} />
                    <Route path="/aircraft-details" element={<AirCraftDetails />} />

        </Route>
        
        {/*Admin pages*/ }
        <Route path="/admin-dashboard" element={<AdminLayout/>} >
          <Route index element={<AdminDashboard/>} />

        </Route>
        
        {/*Admin pages*/ }
        <Route path="/admin-dashboard" element={<AdminLayout/>} >
          <Route index element={<AdminDashboard/>} />

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
