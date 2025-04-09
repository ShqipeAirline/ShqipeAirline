import earth from '../images/earth.png'
import logo from '../images/shqipelogo.png'
import './About.css'
import { IoPricetagsOutline } from "react-icons/io5";
import { LiaClipboardCheckSolid } from "react-icons/lia";
import { RiLockLine } from "react-icons/ri";
import { TfiLayoutTabWindow } from "react-icons/tfi";
import { CgSearchFound } from "react-icons/cg";
import { PiRowsPlusBottomBold } from "react-icons/pi";
import React, { useState } from "react";


const faqs = [
    {
      question: "What should I do if I need to change or cancel my flight?",
      answer:
        "You can modify or cancel your flight through the 'Manage Booking' section on our website or contact customer support.",
    },
    {
      question: "What luggage allowance do I have?",
      answer:
        "Luggage allowance depends on your ticket class. Please check your booking details or contact support.",
    },
    {
      question: "Are pets allowed on board?",
      answer:
        "Yes, pets are allowed in the cabin or as checked baggage, depending on the size and destination.",
    },
    {
      question: "Do I need to arrive at the airport earlier than the flight time?",
      answer:
        "We recommend arriving at least 2 hours before domestic flights and 3 hours before international flights.",
    },
    {
      question: "How can I request special assistance?",
      answer:
        "You can request assistance during booking or by contacting us at least 48 hours before departure.",
    },
    {
      question: "Can I bring liquids in my carry-on?",
      answer:
        "Yes, but each liquid must be in a container of 100ml or less and placed in a clear plastic bag.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "Visit our Contact page or call the customer service hotline listed on your booking confirmation.",
    },
    {
      question: "Can I request a special meal on board?",
      answer:
        "Yes, you can select a special meal when booking or through 'Manage Booking' at least 24 hours in advance.",
    },
    {
      question: "Do I need to print my boarding pass?",
      answer:
        "Printing is optional. You can use a mobile boarding pass if accepted at your departure airport.",
    },
  ];

const About = () => {
    const stats = [
        { number: 'Millions', text: 'of passengers worldwide' },
        { number: '50+', text: 'countries' },
        { number: '100+', text: 'modern aircrafts' },
        { number: '30%', text: 'reduction of carbon emissions' },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
        <div className="about">
            <div className="firstabout">
                <img src={earth} alt="earth" className="earth-img" />
                <div className="discover">
                    <h1>Discover why millions of travelers choose Shiqipe Airline for an unforgettable journey — from takeoff to touchdown.</h1>

                    <div className="stats-container">
                        {stats.map((item, index) => (
                            <div className="stat" key={index}>
                                <div className="line"></div>
                                <div>
                                    <h2>{item.number}</h2>
                                    <p>{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='aboutboxes'>
                <div className='box'>
                    <h3>Our Mission</h3>
                    <p>At Shiqipe Airline, our mission is simple: to provide safe, comfortable, and reliable air travel that connects people, businesses, and cultures across the globe.</p>
                </div>
                <div className='box'>
                    <h3>Our Vision</h3>
                    <p>"To be the world’s most customer-centric airline, where passengers always come first, and air travel is more than just a journey — it’s an experience."</p>
                </div>
                <div className='box'>
                    <h3>Our Values</h3>
                    <p>Customer First, Innovation,Safety, Sustainability, Integrity</p>
                </div>
                <div className='box'>
                    <h3>Our History</h3>
                    <p>Over the years, we have grown into a major player in the global airline industry, consistently innovating and improving to meet the evolving needs of our passengers.</p>
                </div>
            </div>
        </div>
        <div className='shqipeinfo'>
            <img src={logo} alt="logo" />
            <p>"Founded with a vision to redefine air travel, Shiqipe Airline has always prioritized exceptional service, comfort, and safety. Over the years, we’ve embraced innovation and sustainability, growing into a global leader in connecting people across the world. Our journey is built on a commitment to care, reliability, and ensuring every travel experience exceeds expectations."</p>
        </div>
        <div className='teamabout'>
             <h1>Our Team</h1>
             <div className='team'>
                
                <div className='team-info'>
                    <IoPricetagsOutline/>
                <h3>Dedicated to Excellence</h3>
                <p>Our team is committed to providing the highest standard of service, ensuring that every passenger feels valued and cared for. Each department works seamlessly together to create a smooth, enjoyable travel experience from start to finish.</p>
                </div>
                <div className='team-info'>
                    <LiaClipboardCheckSolid/>
                <h3>Experienced Professionals</h3>
                <p>Shiqipe Airline’s team consists of skilled professionals with years of experience in the aviation industry. From pilots to ground staff, every individual brings expertise and a passion for making air travel safe and comfortable.</p>
                </div>
                <div className='team-info'>
                    <RiLockLine/>
                <h3>Customer-Centered Approach</h3>
                <p>Our customer service team is at the forefront of our mission. With a focus on personalized care, they’re always ready to assist, ensuring that every passenger’s needs are met with professionalism and warmth.</p>
                </div>
                <div className='team-info'>
                    <TfiLayoutTabWindow/>
                <h3>Diverse and Global</h3>
                <p>Our team members come from all over the world, bringing unique perspectives and cultural insights. This diversity enriches our service and strengthens our ability to connect people from different backgrounds and places.</p>
                </div>
                <div className='team-info'>
                    <PiRowsPlusBottomBold/>
                <h3>Innovation-Driven</h3>
                <p>We’re constantly evolving, and our team is key to driving innovation in every aspect of our airline. Whether it's adopting the latest technologies or improving the travel experience, our team embraces change to provide better solutions for our passengers.</p>
                </div>
                <div className='team-info'>
                    <CgSearchFound/>
                <h3>Safety and Trust First</h3>
                <p>At Shiqipe Airline, safety is our top priority. Our flight crew and ground staff follow strict safety protocols, ensuring that every flight is secure and every passenger feels confident in our care. Trust is built into everything we do.</p>
                </div>
            </div>
        </div>
        <div className="faq-container">
      <h2 className="faq-title">Frequently asked questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="faq-item"
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <span>{faq.question}</span>
              <span className="faq-toggle">{openIndex === index ? "−" : "+"}</span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
        </>
    );
};

export default About;
