import React,{useState} from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import emailIcon from "../../assets/images/email.svg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import { forgotPasswordApi } from "../../utils/API/auth";
import scanbg from '../../assets/images/scanbg.jpg';
import { useFormik } from "formik";
import { ForgotPasswordSchema } from "../../utils/validations";


const ForgotPassword = () => {
    document.title = "Forgot Password - Rhinolister";
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();
  
    const formik = useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: ForgotPasswordSchema,
      onSubmit: async (values) => {
        try {
          setValidationErrors({});
          const response = await forgotPasswordApi(values.email);
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: response.data.message,
              customClass: {
                confirmButton: "btn",
              },
            }).then(() => {
              navigate("/login");
            });
          } else if (response.status === 422) {
            setValidationErrors(response.data.errors);
          }
           else if (response.status === 404) {
            formik.setFieldError("email", response.data.message);
          }
        } catch (error) {
          console.error("Error:", error);
        } 
      },
    });
  
    return (
      <Wrapper className="login">
        <Container>
          <Row className="justify-content-center">
            <Col sm="6">
              <div className="login p-md-5">
                <h3>Forgot Password</h3>
                <form onSubmit={formik.handleSubmit}>
                {Object.keys(validationErrors).map((fieldName) => (
                  <p key={fieldName} className="error-message">
                    {validationErrors[fieldName]}
                  </p>
                ))}
                  <Form.Group as={Row} className="mb-4" controlId="formPlaintextEmail">
                    <Col sm="12">
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          placeholder="Email address"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span className="email icon"><img src={emailIcon} alt="Email Icon" /></span>
                      </div>
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-start error-message">{formik.errors.email}</p>
                      )}
                    </Col>
                  </Form.Group>
                  <Col sm={12} className="text-center">
                    <Button type="submit" className="custom-btn btn-3 mb-2" disabled={formik.isSubmitting}>
                      <span className="d-flex align-items-center">Submit</span>{" "}
                      {formik.isSubmitting && (
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
  

export default ForgotPassword;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 172px 0 100px;
  background: url(${scanbg});
  background-repeat:no-repeat;
  background-position:center;
  background-size:cover;
  background-attachment: fixed;
  h3 {
    padding: 0 0 20px;
    text-align: center;
  }
  .form-control.is-invalid {
    background: none;
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
    button{display:flex; align-items:center;
    svg{margin-left:10px;}
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
  @media (max-width: ${({ theme }) => theme.breakpoints.small}){
    .login {
      padding: 21px;
  }
  
`;
