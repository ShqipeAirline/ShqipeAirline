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
import AdminTransactions from './admin/AdminTransactions'
import AirCraftDetails from './landingpages/AirCraftDetails';
import UserManage from './admin/Usermanage'
import PassengerDashboard from './pages/passenger/PassengerDashboard';
import PassagerLayout from './layouts/PassagerLayout'
import Profile from './passanger/Profile'
import SearchFlight from './passanger/SearchFlight'
import BookFlight from './passanger/BookFlight'
import PassangerFeedback from './passanger/PassangerFeedback'
import UserFeedbacks from './passanger/UserFeedbacks'
import BookingConfirmation from './passanger/BookingConfirmation';
import PassangerPayment from './passanger/PassangerPayment';
import ProtectedRoute from './components/ProtectedRoute';

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
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout/>
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard/>} />
          <Route path="admin-transaction" element={<AdminTransactions/>}/>
          <Route path="admin-user-management" element={<UserManage/>}/>
        </Route>
        
        {/*Passenger pages*/ }
        <Route path="/passenger-dashboard" element={
          <ProtectedRoute allowedRoles={['user']}>
            <PassagerLayout/>
          </ProtectedRoute>
        }>
          <Route index element={<PassengerDashboard/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="search" element={<SearchFlight/>}/>
          <Route path="book-flight" element={<BookFlight/>}/>
          <Route path="feedback" element={<PassangerFeedback />} />
          <Route path="feedbacks" element={<UserFeedbacks />} />
          <Route path="booking-confirmation" element={<BookingConfirmation />} />
          <Route path="passanger-payment" element={<PassangerPayment />} />
        </Route>

        {/*Air Control Department pages*/}
        <Route path="/acd-dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'air control staff']}>
            <AcdLayout/>
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard/>} />
          <Route path="schedule" element={<Schedule/>} />
          <Route path="flight-details/:flight_id" element={<FlightDetails/>} />
          <Route path="passenger-records" element={<AcdPassView/>} />
          <Route path="add-flight" element={<AcdAddFlight/>} />
          <Route path="update-flight" element={<AcdUpdateFlight/>} />
          <Route path="remove-flight" element={<AcdRemoveFlight/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
