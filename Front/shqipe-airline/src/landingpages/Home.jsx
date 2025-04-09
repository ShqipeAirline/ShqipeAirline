import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import { BsCalendar4Week } from "react-icons/bs";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { AiFillUnlock } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import tradition from "../images/tradition-sky.png"
import earth from "../images/Air-Delivery.png"
import ticket from '../images/ticket.png'
import feedback from "../images/feedback.png"
import travels from '../images/travels.png'
import places from '../images/places.png'
import { VscActivateBreakpoints } from "react-icons/vsc";
import './Home.css';
const Home = () => {
    const [activeClass, setActiveClass] = useState('Economy');

    return (
        <div className='home'>
            <div className='flight-classes'>
                {['Economy', 'Business', 'First'].map((item) => (
                    <h2 
                        key={item} 
                        className={activeClass === item ? 'active' : ''} 
                        onClick={() => setActiveClass(item)}
                    >
                        {item}
                    </h2>
                ))}
            </div>

            <div className='book-board'>
                <div className='main-infos'>
                    <div className='info'>
                        <CiLocationOn className='icons' />
                        <div className='info-text'>
                             <h2>Location</h2>
                        <h5>Where are you going?</h5>
                        </div>
                    </div>

                    <div className='info'>
                        <GoPeople className='icons' />
                        <div className='info-text'>
                            <h2>Travelers</h2>
                            <h5>Add guest</h5>
                        </div>
                    </div>

                    <div className='info'>
                        <BsCalendar4Week className='icons' />
                        <div  className='info-text'>
                            <h2>Check-in</h2>
                            <h5>Add date</h5>
                        </div>
                    </div>

                    <div className='info'>
                        <BsCalendar4Week className='icons' />
                        <div  className='info-text'>
                            <h2>Check-out</h2>
                             <h5>Add date</h5>
                        </div>
                    </div>

                  
                </div> 
                 <Link to="/login" className="book-button">Book Now</Link>
            </div>
            <div className='features-cont'>
                <h1>Our Features</h1>
                <div className='features'>
                    <div className='feature'>
                        <MdOutlineAirplaneTicket className='feature-icon'/>
                        <h2>Easy Flight Booking</h2>
                        <p>Finding and booking flights has never been easier! With our user-friendly search tool, passengers can quickly find flights based on their destination, travel dates, and budget. </p>
                    <br /><br />
                    </div>
                    <div className='feature'>
                        <CiDiscount1 className='feature-icon'/>
                        <h2>More Discount</h2>
                        <p>Enjoy special discounts, seasonal promotions, and exclusive deals when you book with us! Our frequent flyer program lets you earn points on every journey, which can be redeemed for free flights, seat upgrades, and other travel perks.</p>
                    <br /> <br />
                    </div>
                    <div className='feature'>
                        <AiFillUnlock className='feature-icon'/>
                        <h2>Flexible</h2>
                        <p>Take control of your journey with our easy-to-use trip management features. Whether you need to reschedule a flight or request special services, managing your trip is just a few clicks away.</p>
                   <br /> <br /> <br /><br />
                    </div>
                    <div className='feature'>
                        <BiSupport className='feature-icon'/>
                        <h2>Support</h2>
                        <p>Enhance your journey with a variety of travel add-ons designed for your comfort and convenience. Passengers can book extra baggage allowance, airport transfers, and access to premium lounges. Whatever your travel needs, we’ve got you covered</p>
                   <br />
                    </div>
                </div>

            </div>
            <div className='basic-info'>
                <img src={tradition} alt="tradition meets sky image" />
                <div className='tradition-info'>
                    <h3>Where Tradition Meets the Sky!</h3>
                    <h1>One of the leading online flight booking platforms </h1>
                    <div className='bulletpoint-txt'>
                        <VscActivateBreakpoints /> <p>Dynamic pricing based on demand, availability, and promotions.</p> 
                    </div>
                    <div className='bulletpoint-txt'>
                        <VscActivateBreakpoints /> <p>On-time performance & hassle-free travel experience.</p> <br />
                    </div>
                    <div className='bulletpoint-txt'>
                        <VscActivateBreakpoints /> <p>Multiple route options to fit your schedule.</p> <br />
                    </div>
                    <div className='bulletpoint-txt'>
                         <VscActivateBreakpoints /> <p>Fly to top cities and exotic getaways worldwide.</p> <br />
                    </div>
                    <Link to="/login" className="book-button">Book Now</Link>
                </div>
            </div>
            <div className='popular-flights'>
                <div className='popular-info'>
                    <h1>Book Popular Flight Tickets</h1>
                    <h4>“From the land of eagles to the world!”</h4>
                    <img src={earth} alt="earth flight" />
                </div>
                <img src={ticket} alt="" className='ticketimg'/>
            </div>
            <div className='travels'>
                <h1>Best travelers of this month</h1>
                <img src={travels} alt="travelers" />
            </div>
            <div className='feedback'>
                <h2>What’s our customer saying?</h2>
                <h1>Our Customer Feedback</h1>
                <img src={feedback} alt="feedback" />
            </div>
            <div className='memories'>
                <h1>Make memories with us</h1>
                <img src={places} alt="places images" />
            </div>
            <div className='application'>
                <h1>Want To Become a Part <br /> Of Our Team?</h1>
                <Link className='apply'>Apply here</Link>

            </div>
        </div>
    );
};

export default Home;
