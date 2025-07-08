import { SetStateAction, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "./phaseconfiguaration.css";

const Phaseconfiguaration = () => {
  const [percentage, setPercentage] = useState(50);

//   const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setPercentage(Number(event.target.value));
//   };
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(Number(event.target.value));
  };

  return (
    <div className="phase-configuration-wrapper">
      <h1>Phase 1</h1>

      {/* Text Input */}
      <div className="phase-configuration-content">
        <p>Phase Name *</p>
        <span><input type="text" /></span>
      </div>

      {/* Checkboxes */}
      {[...Array(4)].map((_, index) => (
        <div className="phase-configuration-content" key={index}>
          <p>Phase Option {index + 1}</p>
          {/* <span className="checkbox-container"> */}
            <Row className="mb-3">
              <Col md={3}>
                <Form.Check type="checkbox" />
              </Col>
            </Row>
          {/* </span> */}
        </div>
      ))}

      {/* Another Text Input */}
      {[...Array(3)].map((_, index) => (
        <div className="phase-configuration-content" key={index + 4}>
          <p>Phase Input {index + 1} *</p>
          <span><input type="text" /></span>
        </div>
      ))}

      {/* Select Dropdown */}
      <div className="phase-configuration-content">
        <p>Select Phase *</p>
        <span>
          <select>
            <option value="">Select Phase</option>
            <option value="phase1">Phase 1</option>
            <option value="phase2">Phase 2</option>
            <option value="phase3">Phase 3</option>
          </select>
        </span>
      </div>

      {/* Percentage Distribution Slider */}
      <div className="phase-configuration-content-slider">
      <p>Percentage Distribution</p>
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={handleSliderChange}
          className="slider"
        />
        <div className="tooltip" style={{ left: `${percentage}%` }}>
          {percentage}
        </div>
      </div>
      <div className="slider-values">
        <span>{percentage}% Client</span>
        <span>{100 - percentage}% Broker</span>
      </div>
    </div>

    
    </div>
  );
};

export default Phaseconfiguaration;
