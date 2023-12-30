import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import emailicon from "../../assets/images/email.svg";
import password from "../../assets/images/password.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser, setToken, setUserProfile, setIsAuthenticated } from '../../redux/slices/authSlice';
import { TailSpin } from "react-loader-spinner";
import { adminLoginApi } from "../../utils/API/auth";

const AdminLogin = () => {
  document.title = "Login - Rhinolister";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validateField = (name, value) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (name === 'email') {
      if (value === '') {
        return 'Email is required';
      } else if (!value.match(emailPattern)) {
        return 'Enter a valid email address'
      }
      return '';
    }
    if (name === 'password') {
      if (value === '') {
        return 'Password is required';
      } else {
        return '';
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === ' ' && e.target.selectionStart === 0) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMessage((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
    setError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields
    const fields = ["email", "password"];
    const newFormErrors = {};
    fields.forEach((field) => {
      newFormErrors[field] = validateField(field, formData[field]);
    });
    setErrorMessage(newFormErrors);

    // Check for form validation errors before submitting
    if (
      newFormErrors.email ||
      newFormErrors.password
    ) {
      return;
    }
    setLoading(true);
    const response = await adminLoginApi(formData);

    if (response.status == 200) {
      const decodeToken=btoa(response.data.access_token);
      setLoading(false);
      dispatch(setUser(response.data.user));
      if (response.data.user_profile != null) {
        dispatch(setUserProfile(response.data.user_profile));
      }
      dispatch(setToken(decodeToken));
      dispatch(setIsAuthenticated(true));
      localStorage.setItem("access_token", decodeToken);
      navigate("/myprofile/profile");
    }
    else if (response.status === 302) {
      setLoading(false);
      navigate('/email/verify', {
        state: { email: formData.email }
      });
    }
    else if (response.status === 401) {
      setLoading(false);
      setError("Invalid credentials. Please try again.");
    } else {
      setLoading(false);
      console.error(error);
    }

  };

  return (
    <Wrapper className="login">
      <Container>
        <Row>
          <Col sm="12">
            <h2>Admin Login</h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col sm="6">
            <div className="login p-5">
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit}>
                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formPlaintextEmail"
                >
                  <Col sm={12} className="text-start">
                    <Form.Label column sm="2">
                      Email
                    </Form.Label>
                  </Col>
                  <Col sm="12">
                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={(e) => handleInputKeyDown(e)}
                      />
                      <span className="email icon"><img src={emailicon} /></span>
                      {errorMessage.email && <p className="text-start error-message">{errorMessage.email}</p>}

                    </div>
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-2"
                  controlId="formPlaintextPassword"
                >
                  <Col sm={12} className="text-start">
                    <Form.Label column sm="2">
                      Password
                    </Form.Label>
                  </Col>
                  <Col sm="12" className="mb-2 pass-log">
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        onKeyDown={(e) => handleInputKeyDown(e)}
                      />
                      <span className="pass icon"><img src={password} /></span>

                      {" "}
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          } password-icon`}
                        onClick={togglePasswordVisibility}
                      ></i>
                      {errorMessage.password && <p className=" text-start error-message">{errorMessage.password}</p>}
                    </div>
                  </Col>
                </Form.Group>

                <Col sm={12}>
                  <Button type="submit" style={{ border: 'none', background: '#e99714', opacity: 1 }} className="custom-btn btn-3 mb-2" disabled={loading}>
                    <span className="d-flex align-items-center" style={{ marginRight: "10px" }}>Login</span>  {" "}{loading && (
                      <TailSpin color="#fff" height={18} width={18} />
                    )}
                  </Button>
                </Col>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default AdminLogin;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 172px 0 100px;
  background: #f1f1f1;
  h2 {
    padding: 0 0 20px;
    text-align: center;
  }
  .icon {
    position: absolute;
    top: 8px;
    left: 15px;
}
 .password-icon {
  position: absolute;
  top: 10px;
  right: 25px;
}
button {
  width: 100%;
  display: flex;
  justify-content: center;
  background: #e99714;
  opacity: 1;
}
  .login {
    box-shadow: 0px 1px 10px rgba(96, 96, 96, 0.1);
    border: none;
    border-radius: 5px;
    background: #fff;
    label {
      font-weight: 600;
    }
    input#formPlaintextEmail {
      background-repeat: no-repeat;
      background-position: 14px center;
      padding-left: 42px;
    }
    input#formPlaintextPassword {
      background-repeat: no-repeat;
      background-position: 14px center;
      padding-left: 42px;
    }
    button {
      width: 100%;
    }
    p {
      position: relative;
      margin-bottom: 5px;
      text-align: center;
    }

    span.border-row {
      border-bottom: 1px solid #ccc;
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      z-index: 0;
    }
  }
  span.or {
    background: #fff;
    z-index: 1;
    position: relative;
  }
`;
