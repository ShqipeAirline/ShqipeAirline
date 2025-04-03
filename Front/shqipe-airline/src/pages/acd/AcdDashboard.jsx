import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlaneDeparture, FaPlaneArrival, FaRegCalendarCheck, FaUserTimes, FaUsers, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { AiFillEye } from 'react-icons/ai';
import { BsCardChecklist } from 'react-icons/bs';
import plane from '../../images/plane.png';
import eye from '../../images/eye.png';

import check from '../../images/checkmark.png';
import './AcdDashboard.css';

const AcdDashboard = () => {
  const dashboardItems = [
    {
      id: 1,
      title: 'Add a new flight',
      description: 'Add a new flight for Passengers and delight them by our services.',
      icon: <img src={plane} alt="plane" />,
      link: '/acd-dashboard/add-flight'
    },
    {
      id: 2,
      title: 'Update an existing flight',
      description: 'Make changes to previously added flights.',
      icon: (
        <div className="icon-with-arrow">
          <FaArrowRight className="arrow-icon" />
          <img src={plane} alt="plane" />
        </div>
      ),
      link: '/acd-dashboard/update-flight'
    },
    {
      id: 3,
      title: 'Remove an existing flight',
      description: 'Permanently remove a scheduled flight.',
      icon: (
        <div className="icon-with-arrow">
          <FaArrowLeft className="arrow-icon" />
          <img src={plane} alt="plane" />
        </div>
      ),
      link: '/acd-dashboard/remove-flight'
    },
    {
      id: 4,
      title: 'Update reservation status',
      description: 'Make changes to reservation status for booked tickets.',
      icon: <img src={check} alt="check" />,
      link: '/update-reservation'
    },
    {
      id: 5,
      title: 'View all flights',
      description: 'Have a look at all flights available.',
      icon: <img src={eye} alt="eye" />,
      link: '/acd-dashboard/schedule'
    },
    {
      id: 8,
      title: 'View all passenger records',
      description: 'View of the list of passenger that have been registered.',
      icon: <img src={check} alt="check" />,
      link: '/passenger-records'
    }
  ];

  return (
    <div className="dashboard-grid">
      {dashboardItems.map((item) => (
        <Link to={item.link} key={item.id} className="dashboard-card">
          <div className="card-icon">
            {item.icon}
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default AcdDashboard; 