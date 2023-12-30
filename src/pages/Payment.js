import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import { Col, Container, Row, Form } from "react-bootstrap";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { FaCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../Constants";
import CountryDropdown from "../components/CountryDropdown";
import StatesDropdown from "../components/StatesDropdown";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { setUserSubscription } from "../redux/slices/authSlice";


const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.auth.userProfile);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const accessToken = localStorage.getItem('access_token');
  const user = useSelector((state) => state.auth.user);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const streetRef = useRef(null);
  const street_twoRef = useRef(null);
  const zipRef = useRef(null);
  const location = useLocation();
  const planData = location.state ? location.state.subscriptionData : null;
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    street_two: "",
    zip: "",
    state: "",
    country: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    street: "",
    zip: "",
    state: "",
    country: ""
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
  }, [])

  useEffect(() => {
    if (location.state === null) {
      navigate('/');
    }
    setSelectedCountry(userProfile.country);
    setSelectedState(userProfile.state);
    setFormData({
      firstName: userProfile.first_name || '',
      lastName: userProfile.last_name || '',
      street: userProfile.street_one || '',
      street_two: userProfile.street_two || '',
      city: userProfile.city || '',
      zip: userProfile.zipcode || '',
      state: userProfile.state || '',
      country: userProfile.country || ''
    });
  }, [userProfile]);

  const handleCountryChange = (countryValue) => {
    setSelectedCountry(countryValue);
    setSelectedState("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));

  }

  const handleInputKeyDown = (e, name) => {
    if (e.key === " " && e.target.selectionStart === 0) {
      e.preventDefault();
    }
  };

  const buyFreePlan = async (e) => {
    e.preventDefault();

    // If any field is invalid, prevent form submission
    if (!user.id) {
      return;
    }
    try {
      setProcessing(true);
      const response = await axios.post(API_BASE_URL + '/buy-free-plan', {
        userId: user.id
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${atob(accessToken)}`
        },
      });

      setProcessing(false);
      if (response.status === 200) {
        dispatch(setUserSubscription(response.data.subscription));
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message,
          customClass: {
            confirmButton: "btn",
          },
        }).then(() => {
          navigate("/myprofile/subscription");
        }).catch((error) => {
          console.log(error);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.data.error || "An error occurred during subscription creation.",
          customClass: {
            confirmButton: "btn",
          },
        });
      }
    } catch (error) {
      setProcessing(false);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response.data.error,
        customClass: {
          confirmButton: "btn",
        },
      });
    }
  }

  const validateField = (field, value) => {
    const validationRules = {
      firstName: /^[A-Za-z ]+$/,
      lastName: /^[A-Za-z ]+$/,
      street: /^.+$/,
      city: /^[A-Za-z ]+$/
    };
    const zipPattern = /^[A-Z\d]{3,6}$/;

    if (value === '' && !value && field !== "company" && field !== "street_two") {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (validationRules[field] && !value.match(validationRules[field])) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;
    }
    else if (field === "zip") {
      const cleanedValue = value.replace(/\s/g, "");
      if (!cleanedValue.match(zipPattern)) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;
      }
    } else if (
      (field === "firstName" || field === "lastName") &&
      value.length > 15
    ) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} should not exceed 15 characters`;
    } else if (value &&
      (field === "street" || field === "street_two") &&
      value.length > 50
    ) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} should not exceed 50 characters`;
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
    }

    if (!stripe || !elements) {
      return;
    }

    // Validate all fields
    const fields = [
      "firstName",
      "lastName",
      "street",
      "zip",
      "phone",
    ];
    const newFormErrors = {};
    let formIsValid = true;
    fields.forEach((field) => {
      const errorMessage = validateField(field, formData[field]);
      if (errorMessage) {
        newFormErrors[field] = errorMessage;
        formIsValid = false; // Set to false if any field has an error
      } else {
        newFormErrors[field] = ""; // Clear any previous error for the field
      }
    });

    // Validate selectedState
    if (selectedState.trim() === "") {
      newFormErrors["state"] = "State is required";
      formIsValid = false;
    } else {
      newFormErrors["state"] = ""; // Clear any previous state error
    }

    setErrors(newFormErrors);

    // If any field is invalid, prevent form submission
    if (!formIsValid) {
      return;
    }

    setProcessing(true);

    const { token, error } = await stripe.createToken(elements.getElement(CardElement));

    if (error) {
      setProcessing(false);
    } else {
      try {
        const apiUrl = API_BASE_URL + '/buy-plan';
        const response = await axios.post(apiUrl, {
          token: token.id,
          userProfile: formData,
          user: user,
          planId: planData.plan_id
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${atob(accessToken)}`
          },
        });

        setProcessing(false);

        if (response.status === 200) {
          dispatch(setUserSubscription(response.data.subscription));
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Congratulations your plan has been created!!",
            customClass: {
              confirmButton: "btn",
            },
          }).then(() => {
            navigate("/myprofile/subscription");
          }).catch((error) => {
            console.log(error);
          });
        } else {
          setProcessing(false);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: response.data.error || "An error occurred during subscription creation.",
            customClass: {
              confirmButton: "btn",
            },
          });
        }
      } catch (error) {
        setProcessing(false);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong!!",
          customClass: {
            confirmButton: "btn",
          },
        });
      }
    }
  };


  return (

    <Wrapper className="payment-sec" >
      <Container>
        <Row>
          <Col sm={12} className="text-center">
            <h2>Checkout</h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col sm={planData && planData.plan_id != 'plan_free' ? 10 : 6}>
            <Row>
              <div className="payment-row">
                <Row>
                  <Col sm={6} className="text-start">
                    {planData && planData.plan_id != 'plan_free' && <>

                      <div className="persanl">
                        <h2>Personal Details</h2>
                        <Form>
                          <Row>
                            <Form.Group
                              className="mb-3 col-sm-6"
                              controlId="firstName"
                            >
                              <Form.Label>First Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                isInvalid={!!errors.firstName}
                                ref={firstNameRef}
                                onKeyDown={(e) =>
                                  handleInputKeyDown(e, "firstName")
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.firstName}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              className="mb-3 col-sm-6"
                              controlId="lastName"
                            >
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                isInvalid={!!errors.lastName}
                                ref={lastNameRef}
                                onKeyDown={(e) => handleInputKeyDown(e, "lastName")}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.lastName}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Form.Group
                              className="mb-3 col-sm-6"
                              controlId="street"
                            >
                              <Form.Label>Street Address 1</Form.Label>
                              <Form.Control
                                type="text"
                                name="street"
                                placeholder="Street Address"
                                value={formData.street}
                                onChange={handleInputChange}
                                isInvalid={!!errors.street}
                                ref={streetRef}
                                onKeyDown={(e) => handleInputKeyDown(e, "street")}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.street}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              className="mb-3 col-sm-6"
                              controlId="street_two"
                            >
                              <Form.Label>Street Address 2 (Optional) </Form.Label>
                              <Form.Control
                                type="text"
                                name="street_two"
                                placeholder="Street Address 2"
                                value={formData.street_two == 'null' ? '' : formData.street_two}
                                onChange={handleInputChange}
                                isInvalid={!!errors.street_two}
                                ref={street_twoRef}
                                onKeyDown={(e) => handleInputKeyDown(e, "street_two")}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.street_two}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Row>
                          <Row className="pb-4">
                            <Form.Group
                              className="mb-3 col-sm-6"
                            >
                              <Form.Label >Country</Form.Label>
                              <CountryDropdown
                                selectedCountry={selectedCountry}
                                onChange={handleCountryChange}
                                value={formData.country}
                              />
                              {errors.country && (
                                <div className="error-message">
                                  {errors.country}
                                </div>
                              )}
                            </Form.Group>

                            <Form.Group className="mb-3 col-sm-6" >
                              <Form.Label >State</Form.Label>
                              <StatesDropdown
                                selectedState={selectedState}
                                selectedCountry={selectedCountry}
                                onChange={(stateValue) => {
                                  setSelectedState(stateValue);
                                  setFormData((prevData) => ({
                                    ...prevData,
                                    state: stateValue,
                                  }));
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    state: "",
                                  }));
                                }}
                              />
                              {errors.state && (
                                <div className="error-message">{errors.state}</div>
                              )}
                            </Form.Group>
                            <Form.Group className="mb-3 col-sm-6">
                              <Form.Label >Zip</Form.Label>
                              <Form.Control
                                type="text"
                                name="zip"
                                placeholder="zip"
                                value={formData.zip}
                                onChange={handleInputChange}
                                isInvalid={!!errors.zip}
                                ref={zipRef}
                                onKeyDown={(e) => handleInputKeyDown(e, "zip")}
                                onKeyPress={(e) => {
                                  if (formData.zip && formData.zip.length >= 7) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.zip}
                              </Form.Control.Feedback>
                            </Form.Group>

                          </Row>
                        </Form>
                      </div>

                    </>}
                  </Col>
                  <Col sm={planData && planData.plan_id != 'plan_free' ? 6 : 12} className="text-start">
                    <div className="persanl absyello">
                      {planData && ( // Check if planData exists
                        <React.Fragment>
                          <h2>{planData.title}</h2>
                          <ul>
                            {planData.features.map((feature, index) => (
                              <li key={index}>
                                <span>
                                  <FaCheck />
                                </span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          {planData && planData.plan_id &&
                            <div className="subtotalrow">
                              <div className="subtotal total">
                                <strong> Total</strong>
                              </div>
                              <div className="subtotal">${planData.price}</div>
                            </div>
                          }
                        </React.Fragment>
                      )}
                      {planData && planData.plan_id != 'plan_free' ? <>
                        <h2>Payment Details</h2>
                        <form onSubmit={handleSubmit}>
                          <div className="btn-row">
                            <CardElement options={{ hidePostalCode: true }} />

                            <button type="submit" className="btn" disabled={!stripe || processing}>
                              {processing ? 'Processing...' : 'Pay'}
                            </button>
                          </div>
                        </form>
                      </> : <><div className="free-btn"><button type="button" onClick={buyFreePlan} className="btn" >
                        {processing ? 'Processing...' : 'Buy Free Plan'}
                      </button></div></>}

                    </div>
                  </Col>
                </Row>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </Wrapper>

  );
};

export default Payment;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 9.75rem 0 6.25rem; 
  background: #fff;

  h2 {
    padding: 0 0 1.25rem; 
    font-size: 40px;
    font-weight: 300;
  }
  .free-btn {
    text-align: end;
}

  .payment-row {
    padding:0; 
    border: 0.0625rem solid #e3e3e3;
    border-radius: 0.625rem; 
    background: #fff;
    box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.10);
    h2{font-weight:bold;}
    ul{
      list-style: none;
    padding: 0px;
    margin: 22px 0 3.75rem;
    position: relative;
    li {
      list-style: none;
    margin: 0 0 0.875rem;
    display: flex;
    span{
      svg{
        color: #e99714;
    font-size: 1.125rem;
    margin-right: 0.625rem;
      }
    }
    }
    }
    h2 {
      font-size: 1.125rem; 
      color: #666;
      padding: 0 0 0.625rem; 
      margin-bottom: 0.875rem;
    }
    .persanl.absyello {
    background: #fff4e2;
    height: 100%;
    padding: 36px;
   }
   .persanl {
    padding: 31px;
   }
   .subtotal {
    font-weight: 600;
}
.btn-row {
    text-align: right;
}
}

  .imgpayment {
    width: 100%;
    height: 16.75rem; 
    background: #e3e3e3;
  }

  .subtotalrow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-top: 1px solid #959595;
    border-bottom: 1px solid #959595;
    margin-bottom: 30px;

    .card-image {
      background: url([../card-image.png]);
    }
    
  
}

  .btn-3 {
    width: 100%;
    margin-top: 0.625rem; 
  }

  .form-control {
    font-size: 0.875rem; 
  }
  .btn-row{
  button {
    margin: 29px 0 0;
    &:hover{
      background: #bf7500;
      color: #fff;
      }
}
  }
  .StripeElement.StripeElement--empty {
    border: 1px solid #959595;
    padding: 10px;
    border-radius: 6px;
    background: #fff;
}

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding-top: 8.75rem;
  }
`;
