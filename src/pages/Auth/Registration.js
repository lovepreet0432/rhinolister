import React, { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import emailIcon from "../../assets/images/email.svg";
import passwordIcon from "../../assets/images/password.svg";
import username from "../../assets/images/user.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import "bootstrap-icons/font/bootstrap-icons.css";
import { registerApi } from "../../utils/API/auth";
import scanbg from '../../assets/images/scanbg.jpg';
import { useFormik } from "formik";
import { RegistrationSchema } from "../../utils/validations";

const Registration = () => {
  document.title = "Signup - Rhinolister";
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
    },
    validationSchema: RegistrationSchema,
    onSubmit: async (values) => {
      try {
        const response = await registerApi(values);
        console.log(response,'eee')
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Your account is created successfully. Please confirm your email.",
            customClass: {
              confirmButton: "btn",
            }
          }).then(() => {
            navigate("/login");
          });
        } else if (response.status === 422) {
          const validationErrors = response.data.errors;
          setValidationErrors(validationErrors);
        } else if (response.status === 500) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: response.data.error,
            customClass: {
              confirmButton: "btn",
            }
          })
        } 
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const togglePasswordVisibility = () => {
    formik.setFieldValue("showPassword", !formik.values.showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    formik.setFieldValue("showConfirmPassword", !formik.values.showConfirmPassword);
  };


  return (
    <Wrapper className="register">
      <Container>
        <Row>
          <Col sm="12">
            <h2>Create an Account</h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col sm="6">
            <div className="login p-5">
              <form onSubmit={formik.handleSubmit}>
                {Object.keys(validationErrors).map((fieldName) => (
                  <p key={fieldName} className="error-message">
                    {validationErrors[fieldName]}
                  </p>
                ))}
                <Form.Group as={Row} className="mb-2" controlId="formPlaintextName">
                  <Col sm={12} className="text-start">
                    <Form.Label column sm="2">
                      Full Name
                    </Form.Label>
                  </Col>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                      <p className="error-message">{formik.errors.fullName}</p>
                    )}
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                  <Col sm={12} className="text-start">
                    <Form.Label column sm="2">
                      Email
                    </Form.Label>
                  </Col>
                  <Col sm="12">
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <span className="email icon">
                        <img src={emailIcon} alt="Email Icon" />
                      </span>
                      {formik.touched.email && formik.errors.email && (
                        <p className="error-message">{formik.errors.email}</p>
                      )}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-2" controlId="formPlaintextPassword">
                  <Col sm={12} className="text-start">
                    <Form.Label column sm="2">
                      Password
                    </Form.Label>
                  </Col>
                  <Col sm="12" className="position-relative">
                    <div className="position-relative">
                      <Form.Control
                        type={formik.values.showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
        
                      <i
                        className={`ps-1 bi ${formik.values.showPassword
                          ? "bi-eye-slash-fill"
                          : "bi-eye-fill"
                          } password-icon`}
                        onClick={togglePasswordVisibility}
                      ></i>

                      {formik.touched.password && formik.errors.password && (
                        <p className="error-message">{formik.errors.password}</p>
                      )}
                    </div>
                  </Col>
                </Form.Group>

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextConfirmPassword"
                >
                  <Col sm={12} className="text-start">
                    <Form.Label column sm="4">
                      Confirm Password
                    </Form.Label>
                  </Col>
                  <Col sm="12" className="position-relative">
                    <div className="position-relative">
                      <Form.Control
                        type={formik.values.showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                   
                      <i
                        className={`ps-1 bi ${formik.values.showConfirmPassword
                          ? "bi-eye-slash-fill"
                          : "bi-eye-fill"
                          } password-icon`}
                        onClick={toggleConfirmPasswordVisibility}
                      ></i>
                    </div>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <p className="error-message">
                          {formik.errors.confirmPassword}
                        </p>
                      )}
                  </Col>
                </Form.Group>

                <Col sm={12} className="text-center">
                  <Button
                    type="submit"
                    className="custom-btn btn-3 mb-2"
                    disabled={formik.isSubmitting}
                  >
                    <span className="d-flex align-items-center" style={{ marginRight: "10px" }}>
                      Register
                    </span>{" "}
                    {formik.isSubmitting && (
                      <TailSpin color="#fff" height={18} width={18} />
                    )}
                  </Button>
                  <p>
                    <span className="or">or</span>
                    <span className="border-row"></span>
                  </p>
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                </Col>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};


export default Registration;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 130px 0 70px;
  background: #f1f1f1;
  background: url(${scanbg});
  background-repeat:no-repeat;
  background-position:center;
  background-size:cover;
  background-attachment: fixed;

  h2 {
    padding: 0 0 20px;
    text-align: center;
  }
  .icon {
    position: absolute;
    top: 8px;
    left: 15px;
}
.login .ps-1 {
  position: absolute;
  top: 10px;
  right: 14px!important;
}
a {
  color: #E99714;
  text-decoration: none;
  font-weight: 600;
}
  .login {
    box-shadow: 0px 1px 10px rgba(96, 96, 96, 0.1);
    border: none;
    border-radius: 5px;
    background: #ffffffd6;
    label {
      font-weight: 600;
    }
    input#formPlaintextEmail {
      padding-left: 42px;
    }
    input#formPlaintextPassword, input#formPlaintextConfirmPassword {
      background-image: url(${passwordIcon});
      background-repeat: no-repeat;
      background-position: 14px center;
      padding-left: 42px;
    }
    input#formPlaintextName {
      background-image: url(${username});
      background-repeat: no-repeat;
      background-position: 14px center;
      padding-left: 42px;
    }
    #formPlaintextConfirmPasswordIcon {
      background-image: url(${passwordIcon});
      background-repeat: no-repeat;
      background-position: 14px center;
      padding-left: 42px;
    }
    .password-toggle {
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      cursor: pointer;
    }

  
    .password-icon {
      position: absolute;
      top: 10px;
      right: 25px;
    }

    Button {
      border: 0px;
      width: 100%;
      display: flex;
      justify-content: center;
      opacity: 1;
      border: 1px solid #e99714;
        &:hover{
          color:#fff;
        }
    }
    p {
      position: relative;
      margin-bottom: 5px;
      font-size:13px;
      font-weight:bold;
      line-height:20px;
   
    }
    span.or {
      background: #fff;
      position: relative;
      z-index: 1;
      padding: 0 9px;
      color: #9f9f9f;
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
  .password-icon {
    position: absolute;
    top: 5px;
    right: 21px;
  }
  #formPlaintextConfirmPassword {
    position: relative;
    padding-left:42px;
  }
  #formPlaintextName::placeholder {
    font-size: 13px;
  }
  #formPlaintextEmail::placeholder {
    font-size: 13px;
  }
  #formPlaintextConfirmPassword::placeholder {
    font-size: 13px;
  }
  #formPlaintextPassword::placeholder {
    font-size: 13px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.small}){
    padding: 6.75rem 0 2.25rem;

    .login {
      padding: 21px;
  }
  }
 
`;
