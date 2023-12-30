import React, { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import emailIcon from "../../assets/images/email.svg";
import passwordIcon from "../../assets/images/password.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { setUser, setToken, setIsAuthenticated, setUserProfile, setUserSubscription } from '../../redux/slices/authSlice';
import { setOption } from '../../redux/slices/accountSlice';
import { loginApi } from "../../utils/API/auth";
import scanbg from '../../assets/images/scanbg.jpg';
import { useFormik } from "formik";
import "bootstrap-icons/font/bootstrap-icons.css";
import { LoginSchema } from "../../utils/validations";

const Login = () => {
  document.title = "Login - Rhinolister";
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const response = await loginApi(values);

      if (response.status === 200) {
        const token = response.data.access_token;
        const decodedToken = btoa(token);
        localStorage.setItem("access_token", decodedToken);
        dispatch(setUser(response.data.user));

        if (response.data.user_profile !== null) {
          dispatch(setUserProfile(response.data.user_profile));
        }

        if (response.data.user_accounts !== null) {
          dispatch(setOption(response.data.user_accounts));
        }

        dispatch(setUserSubscription(response.data.user_subscription));
        dispatch(setToken(decodedToken));
        navigate("/scandetail");
        dispatch(setIsAuthenticated(true));
      }else if (response.status === 422) {
        const validationErrors = response.data.errors;
        setValidationErrors(validationErrors);
      }
       else if (response.status === 302) {
        navigate('/email/verify', {
          state: { email: values.email }
        });
      } else if (response.status === 401) {
        formik.setFieldError('_error', 'Invalid credentials. Please try again.');
      } else {
        formik.setFieldError('email', response);
      }
    },
  });

  return (
    <Wrapper className="login">
      <Container>
        <Row>
          <Col sm="12">
            <h2>Login</h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col sm="6">
            <div className="login p-5">
              {formik.errors._error && <p className="text-danger">{formik.errors._error}</p>}
              <form onSubmit={formik.handleSubmit}>
              {Object.keys(validationErrors).map((fieldName) => (
                  <p key={fieldName} className="error-message">
                    {validationErrors[fieldName]}
                  </p>
                ))}
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
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <span className="email icon"><img src={emailIcon} alt="email icon" /></span>
                      {formik.errors.email && formik.touched.email && (
                        <p className="text-start error-message">{formik.errors.email}</p>
                      )}
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
                  <Col sm="12" className="mb-3 pass-log">
                    <div className="position-relative">
                      <Form.Control
                        type={formik.values.showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <span className="pass icon"><img src={passwordIcon} alt="password icon" /></span>
                      {" "}
                      <i
                        className={`bi ${formik.values.showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          } password-icon`}
                        onClick={() => formik.setFieldValue('showPassword', !formik.values.showPassword)}
                      ></i>
                      {formik.errors.password && formik.touched.password && (
                        <p className=" text-start error-message">{formik.errors.password}</p>
                      )}
                    </div>
                  </Col>
                </Form.Group>

                <Col sm={12} className="text-center">
                  <Button type="submit" className="custom-btn btn-3 mb-2" disabled={formik.isSubmitting}>
                    <span className="d-flex align-items-center" style={{ marginRight: "10px" }}>Login</span>  {" "}{formik.isSubmitting && (
                      <TailSpin color="#fff" height={18} width={18} />
                    )}
                  </Button>
                  <p>
                    <Link to="/forgot-password">Forgot password?</Link>
                  </p>
                  <p>
                    <span className="or">or</span>
                    <span className="border-row"></span>
                  </p>
                  <p>
                    Don’t have an account?{" "}
                    <Link to="/registration">Register</Link>
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

export default Login;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 130px 0 70px;
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
    input#formPlaintextPassword {
      padding-left: 42px;
    }
    button {
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
      text-align: center;
      font-size:13px;
      font-weight:bold;
      margin-top:0px;
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
  .pass-log {
    position: relative;
  }
  .pass-log .password-icon {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  #formPlaintextEmail::placeholder {
    font-size: 13px;
  }
  #formPlaintextPassword::placeholder {
    font-size: 13px;
  }

  a {
    color: #E99714;
    text-decoration: none;
    font-weight: 600;
}
 .btn:first-child:active{color:#E7A83E !important;}

  @media (max-width: ${({ theme }) => theme.breakpoints.small}){
    padding: 6.75rem 0 2.25rem;
    .login {
      padding: 21px;
  }

`;


