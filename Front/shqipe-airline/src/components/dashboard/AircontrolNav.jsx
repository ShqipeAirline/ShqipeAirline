import { Link } from 'react-router-dom';

const AircontrolNav = () => {
  return (
    <div className="acd-navbar">
          <Link to="/acd-dashboard" className="navbar">
            Dashboard
          </Link>
          
          <Link to="/acd-schedule" className="navbar">
            Schedule
          </Link>
          
          <Link to="/" className="navbar" onClick={""}>
            Sign out
          </Link>
    </div>
  )
}
export default AircontrolNav;
