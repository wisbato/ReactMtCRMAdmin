import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, InputGroup, Dropdown, Placeholder } from "react-bootstrap";
import { addUser } from "../../../api/user/addUser";
import "./adduser.css";
import { toast } from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";

interface Country {
  cca2: string;
  callingCodes: string[];
  name: {
    common: string;
  };
  flag: string;
}

interface FormData {
  email: string;
  password: string;
  fullName: string;
  country: string;
  phoneNumber: string;
  countryCode: string;
}

const Adduser = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
    country: "",
    phoneNumber: "",
    countryCode: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  
  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.fullName.trim()) newErrors.fullName = "Please fill the Full Name";
    if (!/^[+]?[\d\s\-()]{10,20}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }    
    else if (!/^\d+$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Phone number should contain only digits";
    if (!formData.country.trim()) newErrors.country = "Please select a country";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password should be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch countries data from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v2/all?fields=alpha2Code,name,flag,callingCodes");
        const data = await response.json();
        
        // Transform data to match our interface structure
        const formattedData = data
          .filter((country: any) => country.callingCodes && country.callingCodes.length > 0 && country.callingCodes[0] !== "")
          .map((country: any) => ({
            cca2: country.alpha2Code,
            name: { common: country.name },
            flag: country.flag,
            callingCodes: country.callingCodes
          }))
          .sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
        
        setCountries(formattedData);
        
        // Set default country (optional)
        if (formattedData.length > 0) {
          const usCountry = formattedData.find((c: Country) => c.cca2 === "US") || formattedData[0];
          setFormData(prev => ({
            ...prev,
            country: usCountry.name.common,
            countryCode: `+${usCountry.callingCodes[0]}`
          }));
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        toast.error("Failed to load country data");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);
    

  // Handle country selection from dropdown
  const handleCountrySelect = (country: Country) => {
    setFormData(prev => ({
      ...prev,
      country: country.name.common,
      countryCode: `+${country.callingCodes[0]}`
    }));
    setShowCountryDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {

        // Combine country code with phone number
        const fullPhoneNumber = `${formData.countryCode} ${formData.phoneNumber}`;


        const payload = {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          country: formData.country,
          phone: fullPhoneNumber
        };
  
        const response = await addUser(payload);
        console.log('Response:', response);
        toast.success("User added successfully!");

        // Reset form after successful submission
        setFormData({
          email: "",
          password: "",
          fullName: "",
          country: "",
          phoneNumber: "",
          countryCode: "",
        });
      } catch (error: any) {
        toast.error(error.message || "Something went wrong while adding the user.");
      }
    }
  };
  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className="addusermain-wrapper">
      <div className="adduser-wrapper">
        <h3 className="fw-bold">Add User</h3>
        <div className={`container mt-4 p-4 shadow-sm rounded ${theme === "dark" ? "bg-dark text-light" : "bg-white"}`}>
          {successMsg && (
            <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>
              {successMsg}
            </Alert>
          )}
          {errorMsg && (
            <Alert variant="danger" onClose={() => setErrorMsg(null)} dismissible>
              {errorMsg}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    style={inputStyle}
                    className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    style={inputStyle}
                    className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formFullName">
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Enter Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    isInvalid={!!errors.fullName}
                    style={inputStyle}
                    className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fullName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formCountry">
                  <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="country"
                    value={formData.country}
                    onChange={(e) => {
                      handleChange(e);
                      // Update country code when selecting from this dropdown too
                      const selectedCountry = countries.find(c => c.name.common === e.target.value);
                      if (selectedCountry && selectedCountry.callingCodes[0]) {
                        setFormData(prev => ({
                          ...prev,
                          countryCode: `+${selectedCountry.callingCodes[0]}`
                        }));
                      }
                    }}
                    isInvalid={!!errors.country}
                    style={inputStyle}
                    className={theme === "dark" ? "dark-mode-placeholder" : ""}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.cca2} value={country.name.common}>
                        {country.name.common}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.country}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formPhoneNumber" className="mb-3">
              <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
              <InputGroup>
                <Dropdown show={showCountryDropdown} onToggle={(isOpen) => setShowCountryDropdown(isOpen)}>
                  <Dropdown.Toggle 
                    variant="light" 
                    id="dropdown-country-code"
                    className={`country-code-dropdown ${theme === "dark" ? "bg-dark" : ""}`}
                    style={{ 
                      width: '120px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: '#f8f9fa',
                      borderColor: '#ced4da',
                      borderRight: 'none',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      color: theme === "dark" ? '#ffffff' : '#000000'
                    }}
                  >
                    {loadingCountries ? (
                      "Loading..."
                    ) : (
                      <>
                        {formData.country && 
                          countries.find(c => c.name.common === formData.country) && (
                            <img 
                              src={countries.find(c => c.name.common === formData.country)?.flag} 
                              alt="country flag"
                              style={{ width: '20px', height: 'auto', marginRight: '5px' ,}}
                            />
                          )
                        } {formData.countryCode}
                      </>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ maxHeight: '300px', overflow: 'auto' }}>
                    {countries.map((country) => (
                      <Dropdown.Item 
                        key={country.cca2} 
                        onClick={() => handleCountrySelect(country)}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <span className="flag-icon me-2">
                          <img 
                            src={country.flag} 
                            alt={`${country.name.common} flag`}
                            style={{ width: '24px', height: 'auto', marginRight: '5px', marginLeft: '8px' }}
                          />
                        </span>
                        <span style={{ marginRight: '8px' }}>+{country.callingCodes[0]}</span>
                        <span>{country.name.common}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.phoneNumber}
                  style={inputStyle}
                  className={theme === "dark" ? "dark-mode-placeholder" : ""}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button
              type="submit"
              style={{
                background: 'var(--primary-gradient)',
                border: 'none'
              }}
              className="btn fw-bold px-4"
              disabled={loadingCountries}
            >
              Submit Form
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Adduser;