import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './systemtimeedit.css';
import { ConfigProvider, TimePicker, message } from 'antd';

const Systemtimeedit = () => {
  const [selectedTime, setSelectedTime] = useState(dayjs()); // Temp selection
  const navigate = useNavigate();

  // TimePicker change handler
  const onchange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedTime(date);
    }
  };

  // Handle "Update" button click
  const handleUpdate = () => {
    const formattedTime = selectedTime.format('HH:mm'); // 24hr format
    message.success(`Time updated to: ${formattedTime}`);
    navigate('/generalconfiguaration', {
      state: { updatedTime: formattedTime },
    });
  };

  // Handle "Cancel" button click
  const handleCancel = () => {
    message.info('Time selection cancelled');
    navigate('/generalconfiguaration');
  };

  return (
    <div className='general-configuration-wrapper'>
      <div className="general-configuration-container">
        <h2 className="config-title">System Time</h2>
        <div className="input-group">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1677ff',
              },
            }}
          >
            <TimePicker
              value={selectedTime}
              onChange={onchange}
              use12Hours
              format="hh:mm A"
              minuteStep={5}
              popupClassName="custom-time-popup"
              className="custom-time-input"
              allowClear={false}
              showNow={false}
              style={{ width: '100%', height: '50px', fontSize: '16px' }}
            />
          </ConfigProvider>
        </div>
        <div className='button-group'>
          <button className="update-btn" onClick={handleUpdate}>Update</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Systemtimeedit;
