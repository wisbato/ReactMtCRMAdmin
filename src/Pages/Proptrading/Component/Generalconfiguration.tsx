import { useNavigate, useLocation } from 'react-router-dom';
import './generalconfiguration.css';

const GeneralConfiguration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const updatedTime = location.state?.updatedTime || '22:00';
  const navigateToAddnews = () => {
      navigate('/systemtimeedit');}
  return (
    <div className='general-configuration-wrapper'style={{background:'none'}}>
      <div className="general-configuration-container">
        <div className="general-configuration-body">
          <h2 className="config-title">System Time</h2>
          <div className="time-container">
            <p className="time-value">{updatedTime}</p>
            <h3 className="time-zone">UTC</h3>
          </div>
          <div className='user-list-btn' >
            <button style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', fontSize: '16px' }} onClick={navigateToAddnews} >Edit</button>
          </div>     </div>
      </div>
    </div>
  );
};

export default GeneralConfiguration;
