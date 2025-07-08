import { Link, useNavigate } from 'react-router-dom';
import './clientlist.css';
import { useTheme } from '../../../context/ThemeContext';

const Clientlist = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const clients = [
        { name: 'sktesting', date: '2025-03-01' },
        { name: 'Fawaz k', date: '2025-02-28' },
        { name: 'Fawaz k', date: '2025-02-28' },
        { name: 'Fawaz k', date: '2025-02-28' },
        { name: 'Textdxb', date: '2025-02-28' },
        { name: 'Rohith P', date: '2025-02-28' },
        { name: 'krishn', date: '2025-02-28' }
    ];
    const handleViewMore = () => {
        navigate('/usermanagement/userlist');
    };

    return (
        <div className='client-list-containerr'>
        <div className={`client-list-wrapper ${theme === 'dark' ? 'dark-mode' : ''}`}>
            {/* Title Section */}
            <div className='title-section'>
                <h1 style={{ fontSize: '18px' }}>Latest Clients</h1>
                <button className='view-more-btn' onClick={handleViewMore}>View more</button>
            </div>

            {/* Client List Rendering */}
            <div className='client-list-body'>
                {clients.map((client, index) => (
                    <div key={index} className='client-list-item'>
                        <div className='client-icon-section'>
                            <div className='svgg'>
                                <svg width="50" height="50" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="248" cy="256" r="200" fill="black" />
                                    <path fill="#AEB4BE" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z" />
                                </svg>
                            </div>
                            <h2>
                                <Link to="/viewuserlist" className="custom-link">
                                    {client.name}
                                </Link>
                            </h2>

                        </div>
                        <div className='client-list-date'>
                            <p>{client.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Clientlist;
