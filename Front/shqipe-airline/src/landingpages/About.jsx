import earth from '../images/earth.png'
import logo from '../images/shqipelogo.png'
import './About.css'
const About = () => {
    const stats = [
        { number: 'Millions', text: 'of passengers worldwide' },
        { number: '50+', text: 'countries' },
        { number: '100+', text: 'modern aircrafts' },
        { number: '30%', text: 'reduction of carbon emissions' },
    ];

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

        </>
    );
};

export default About;
