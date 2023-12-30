import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import emailicon from "../../assets/images/email.svg";
import password from "../../assets/images/password.svg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import { useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { resetPasswordApi } from "../../utils/API/auth";

const ResetPassword = () => {
  document.title = "Login - Rhinolister";
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlToken = queryParams.get("token");
  const urlEmail = queryParams.get("email");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };
  const [formValues, setFormValues] = useState({
    email: urlEmail,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputKeyDown = (e, name) => {
    if (e.key === " " && e.target.selectionStart === 0) {
      e.preventDefault();
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = ["password","confirmPassword"];
    const newFormErrors = {};

    fields.forEach((field) => {
      newFormErrors[field] = validateField(field, formValues[field]);
    });
    if (formValues.password !== formValues.confirmPassword) {
      newFormErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newFormErrors);
    const hasErrors = Object.values(newFormErrors).some(
      (error) => error !== ""
    );

    if (!hasErrors) {
        const response = await resetPasswordApi(formValues.email,formValues.password,urlToken);
        if (response.status === 200) {
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
            customClass: {
              confirmButton: "btn",
            },
          })
            .then(() => {
              navigate("/");
            })
            .catch((error) => {
              console.log(error);
            });
        }  else if (response.status == 422) {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "An error occurred. Please try again.",
            customClass: {
              confirmButton: "btn",
            },
          }).then(() => {
            setLoading(false);
          });
        }
      }
  }


  const validateField = (field, value) => {
    if (!value) {
      return `This field is required`;
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    } else if (!/\d/.test(value)) {
      return "Password must contain at least one digit";
    } else if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter";
    } else if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
      
    setFormValues((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateField(field, value),
    }));
  };


  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      navigate("/");
    }
  }, []);


  return (
    <Wrapper className="login">
      <Container>
        <Row className="justify-content-center">
          <Col sm="6">
            <div className="login p-5">
              <h3>Reset Password</h3>
              <form onSubmit={handleSubmit}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextEmail"
                >
                  <Col sm="12">
                    <Form.Label column sm="2">
                      Email
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Email address"
                      value={urlEmail}
                      readOnly
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3 pass-ab"
                  controlId="formPlaintextPassword"
                >
                  <Col sm={12} className="text-start">
                    <Form.Label column sm="4">
                      New Password
                    </Form.Label>
                  </Col>
                  <Col sm="12" className="mb-2">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="New Password"
                      value={formValues.password}
                      onChange={handleInputChange("password")}
                      onKeyDown={(e) => handleInputKeyDown(e, "password")}
                    />
                     <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                      } password-icon`}
                      onClick={togglePasswordVisibility}
                    ></i>
                      {errors.password && (
                        <div className="error-message">{errors.password}</div>
                      )}
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Col sm={12} className="text-start">
                    <Form.Label column sm="6">
                      Confirm New Password
                    </Form.Label>
                  </Col>
                  <Col sm="12" className="mb-2 pass-ab2">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      name="confirmPassword"
                      value={formValues.confirmPassword}
                      onChange={handleInputChange("confirmPassword")}
                      onKeyDown={(e) => handleInputKeyDown(e, "confirmPassword")}
                    />
                    <i
                    className={`bi ${
                      showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                    } password-icon`}
                    onClick={toggleConfirmPasswordVisibility}
                  ></i>
                    {errors.confirmPassword && (
                      <div className="error-message">{errors.confirmPassword}</div>
                    )}
                  </Col>
                </Form.Group>
                <Col sm={12} className="text-center">
                  <Button
                    type="submit"
                    className="custom-btn btn-3 mb-2 loader-bt"
                  >
                    <span>Submit</span>{" "}
                    {loading && (
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

export default ResetPassword;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 172px 0 100px;
  background: #f1f1f1;
  h3 {
    padding: 0 0 20px;
    text-align: center;
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
      background-image: url(${emailicon});
      background-repeat: no-repeat;
      background-position: 14px center;
      padding-left: 42px;
    }
    input#formPlaintextPassword {
      background-image: url(${password});
      background-repeat: no-repeat;
      background-position: 14px center;
      padding-left: 42px;
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
  .sc-dmRblv button {
    width: auto;
    margin: auto;
    border: none;
  }
  .loader-bt {
    display: flex;
  }
  .loader-bt {
    svg {
      margin-left: 10px;
    }
  }
  .pass-ab {
    position: relative;
}

 .pass-ab .password-icon {
  position: absolute;
  top: 45px;
  right: 21px;
}
.pass-ab2 {
  position: relative;
}
.pass-ab2 .password-icon {
  position: absolute;
  top: 10px;
  right: 21px;
}
`;
