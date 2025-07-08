import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

import { GroupBase, OptionsOrGroups } from 'react-select';

const symbolOptions: OptionsOrGroups<{ value: string; label: string }, GroupBase<{ value: string; label: string }>> = [
  {
    label: 'Symbols',
    options: [
      { value: 'EURUSD', label: 'EURUSD' },
      { value: 'GBPUSD', label: 'GBPUSD' },
      { value: 'USDCAD', label: 'USDCAD' },
    ],
  },
];

interface EditUserIbProps {
  show: boolean;
  handleClose: () => void;
}

const Edituserib: React.FC<EditUserIbProps> = ({ show, handleClose }) => {
  const [planName, setPlanName] = useState('');
  const [symbols, setSymbols] = useState<{ value: string; label: string }[]>([]);
  const [activeUserRequired, setActiveUserRequired] = useState(true);
  const [minActiveUser, setMinActiveUser] = useState('');
  const [minBalance, setMinBalance] = useState('');
  const [minLotSize, setMinLotSize] = useState('');

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const data = {
      planName,
      symbols,
      activeUserRequired,
      minActiveUser,
      minBalance,
      minLotSize,
    };
    console.log('Submitted Data:', data);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Ib</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="ibPlanName" className="mb-3">
            <Form.Label>IB Plan Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter IB plan name"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="symbolSelect" className="mb-3">
            <Form.Label>Select Symbol and Name</Form.Label>
            <Select
              isMulti
              options={symbolOptions}
              value={symbols}
              onChange={(newValue) => setSymbols([...newValue])}
              placeholder="Enter client name or email"
            />
          </Form.Group>

          <Form.Group controlId="activeUserCheckbox" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active User Required"
              checked={activeUserRequired}
              onChange={() => setActiveUserRequired(!activeUserRequired)}
            />
          </Form.Group>

          <Row className="mb-3">
            <Col>
              <Form.Label>Min Active User</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={minActiveUser}
                onChange={(e) => setMinActiveUser(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Label>Minimum Balance</Form.Label>
              <Form.Control
                type="number"
                value={minBalance}
                onChange={(e) => setMinBalance(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Label>Minimum Lot Size</Form.Label>
              <Form.Control
                type="number"
                value={minLotSize}
                onChange={(e) => setMinLotSize(e.target.value)}
              />
            </Col>
          </Row>

          <Button type="submit" variant="success">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Edituserib;
