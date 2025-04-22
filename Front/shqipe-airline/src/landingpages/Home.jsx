import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { BsCalendar4Week } from "react-icons/bs";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { AiFillUnlock } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { VscActivateBreakpoints } from "react-icons/vsc";

import tradition from "../images/tradition-sky.png";
import earth from "../images/Air-Delivery.png";
import ticket from '../images/ticket.png';
import feedback from "../images/feedback.png";
import travels from '../images/travels.png';
import places from '../images/places.png';

import './Home.css';

const Home = () => {
    const [activeClass, setActiveClass] = useState('Economy');

    const flightClasses = ['Economy', 'Business', 'First'];

    const infoItems = [
        { icon: <CiLocationOn className='icons' />, title: 'Location', subtitle: 'Where are you going?' },
        { icon: <GoPeople className='icons' />, title: 'Travelers', subtitle: 'Add guest' },
        { icon: <BsCalendar4Week className='icons' />, title: 'Check-in', subtitle: 'Add date' },
        { icon: <BsCalendar4Week className='icons' />, title: 'Check-out', subtitle: 'Add date' },
    ];

    const features = [
        {
            icon: <MdOutlineAirplaneTicket className='feature-icon' />,
            title: 'Easy Flight Booking',
            description:
                'Finding and booking flights has never been easier! With our user-friendly search tool, passengers can quickly find flights based on their destination, travel dates, and budget.',
        },
        {
            icon: <CiDiscount1 className='feature-icon' />,
            title: 'More Discount',
            description:
                'Enjoy special discounts, seasonal promotions, and exclusive deals when you book with us! Our frequent flyer program lets you earn points on every journey.',
        },
        {
            icon: <AiFillUnlock className='feature-icon' />,
            title: 'Flexible',
            description:
                'Take control of your journey with our easy-to-use trip management features. Whether you need to reschedule a flight or request special services, managing your trip is just a few clicks away.',
        },
        {
            icon: <BiSupport className='feature-icon' />,
            title: 'Support',
            description:
                'Enhance your journey with travel add-ons designed for your comfort and convenience. Book extra baggage allowance, airport transfers, and lounge access.',
        },
    ];

    const bulletPoints = [
        "Dynamic pricing based on demand, availability, and promotions.",
        "On-time performance & hassle-free travel experience.",
        "Multiple route options to fit your schedule.",
        "Fly to top cities and exotic getaways worldwide.",
    ];

    return (
        <div className='home'>
            {/* Flight Class Tabs */}
            <div className='flight-classes'>
                {flightClasses.map((item) => (
                    <h2
                        key={item}
                        className={activeClass === item ? 'active' : ''}
                        onClick={() => setActiveClass(item)}
                    >
                        {item}
                    </h2>
                ))}
            </div>

            {/* Booking Form */}
            <div className='book-board'>
                <div className='main-infos'>
                    {infoItems.map((info, index) => (
                        <div key={index} className='info'>
                            {info.icon}
                            <div className='info-text'>
                                <h2>{info.title}</h2>
                                <h5>{info.subtitle}</h5>
                            </div>
                        </div>
                    ))}
                </div>
                <Link to="/login" className="book-button">Book Now</Link>
            </div>

            {/* Features Section */}
            <div className='features-cont'>
                <h1>Our Features</h1>
                <div className='features'>
                    {features.map((feature, idx) => (
                        <div key={idx} className='feature'>
                            {feature.icon}
                            <h2>{feature.title}</h2>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tradition Info Section */}
            <div className='basic-info'>
                <img src={tradition} alt="tradition meets sky image" />
                <div className='tradition-info'>
                    <h3>Where Tradition Meets the Sky!</h3>
                    <h1>One of the leading online flight booking platforms </h1>
                    {bulletPoints.map((point, index) => (
                        <div key={index} className='bulletpoint-txt'>
                            <VscActivateBreakpoints /> <p>{point}</p>
                        </div>
                    ))}
                    <Link to="/login" className="book-button">Book Now</Link>
                </div>
            </div>

            {/* Popular Flights */}
            <div className='popular-flights'>
                <div className='popular-info'>
                    <h1>Book Popular Flight Tickets</h1>
                    <h4>“From the land of eagles to the world!”</h4>
                    <img src={earth} alt="earth flight" />
                </div>
                <img src={ticket} alt="ticket" className='ticketimg' />
            </div>

            {/* Travelers */}
            <div className='travels'>
                <h1>Best travelers of this month</h1>
                <img src={travels} alt="travelers" />
            </div>

            {/* Feedback */}
            <div className='feedback'>
                <h2>What’s our customer saying?</h2>
                <h1>Our Customer Feedback</h1>
                <img src={feedback} alt="feedback" />
            </div>

            {/* Memories */}
            <div className='memories'>
                <h1>Make memories with us</h1>
                <img src={places} alt="places" />
            </div>

            {/* Application CTA */}
            <div className='application'>
                <h1>Want To Become a Part <br /> Of Our Team?</h1>
                <Link className='apply' to={'/job-application'}>Apply here</Link>
            </div>
        </div>
    );
};

export default Home;
