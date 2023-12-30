import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {  useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaCheck } from "react-icons/fa6";
import axios from 'axios';
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { API_BASE_URL } from "../Constants";
import Content from "../components/SubscriptionPlan/Content";
import ContactForm from "../components/SubscriptionPlan/ContactForm";

const SubscriptionPlan = () => {
  document.title = "Subscription - Rhinolister";
  const navigate = useNavigate();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const userSubscription = useSelector((state) => state.auth.userSubscription);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Use useMemo to memoize the result of the API request
  // const subscriptionPlansApiData = useMemo(() => {
  //   return axios
  //     .get(API_BASE_URL + '/subscription-plans')
  //     .then((response) => {
  //       const plansWithParsedFeatures = response.data.subscriptionPlans.map((plan) => ({
  //         ...plan,
  //         features: JSON.parse(plan.features),
  //       }));
  //       return plansWithParsedFeatures;
  //     })
  //     .catch((error) => {
  //       throw error;
  //     });
  // }, []);

  const handleSubscribeClick = (plan) => {
    if (!isAuthenticated) { 
            navigate('/login');
    }
    else {
      if (userSubscription && Object.keys(userSubscription).length > 0) {
        if (parseFloat(userSubscription.price) > parseFloat(plan.price)) {

          Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: "Do you want to downgrade your plan?",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            customClass: {
              confirmButton: "btn",
              cancelButton: "btn cancel-btn"
            },
          })
            .then((result) => {
              if (result.isConfirmed) {
                navigate('/payment', { state: { subscriptionData: plan } });
              }
            })
            .catch((error) => {
              setLoading(false);
            });
        }
        else {
          navigate('/payment', { state: { subscriptionData: plan } });
        }
      } else {
        navigate('/payment', { state: { subscriptionData: plan } });
      }
    }
  };

  // useEffect(() => {
  //   if (loading) {
  //     subscriptionPlansApiData
  //       .then((plans) => {
  //         setLoading(false);
  //         setSubscriptionPlans(plans);
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //       });
  //   }
  // }, [loading]);

  useEffect(() => {

    axios.get(API_BASE_URL + '/subscription-plans')
      .then((response) => {
       const plansWithParsedFeatures = response.data.subscriptionPlans.map((plan) => ({
          ...plan,
          features: JSON.parse(plan.features),
        }));

        setSubscriptionPlans(plansWithParsedFeatures);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  return (
    <Wrapper className="subscription">
      <Content />
      <Container>
        <Row className="justify-content-center">
          <Col sm={12} className="text-start">
            <Row>
              {loading ? (
                <Col sm="12">
                  <h2 className="text-center subscription-plan">Subscriptions</h2>
                  <div className="loader-contain">
                    <TailSpin height={40} width={40} />
                  </div>
                </Col>
              ) : (
                subscriptionPlans.map((plan) => {
                  return (
                    <Col key={plan.plan_id} sm={12} lg={3} className="mb-4 mb-md-0">
                      <div className={`plan ${userSubscription && Object.keys(userSubscription).length > 0 && userSubscription.plan_id == plan.plan_id ? "current-plan" : ""}`}>
                        <h3>{plan.title}</h3>
                        <div className="price-row">
                          <h2>$ {plan.price}</h2>
                          {plan?.subscriptionType === 'free' ? '' :
                            <p>
                              / {plan?.subscriptionType}
                            </p>
                          }
                        </div>
                        <div className="t-price">
                          <div className="del-text">
                            <ul>
                              {plan.features.map((feature, index) => (
                                <li key={index}>
                                  <span>
                                    <FaCheck />
                                  </span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button className="custom-btn btn-3" onClick={() => handleSubscribeClick(plan)} disabled={userSubscription && userSubscription.plan_id === plan.plan_id}>
                            <span>{userSubscription && Object.keys(userSubscription).length > 0 && userSubscription.plan_id == plan.plan_id ? 'Subscribed' : 'Subscribe'}</span>
                          </button>
                        </div>
                      </div>
                    </Col>
                  )
                }
                )
              )}
            </Row>
          </Col>
        </Row>
      </Container>
      <ContactForm />
    </Wrapper>
  );
};

export default SubscriptionPlan;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 0;
  position:relative;

  .plan.current-plan{
    background:#FFF1DB;
  }
  h2 {
    padding: 0 0 1.25rem; 
  }
  .loader-contain {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
}
  .plan {
    background: #fff;
    box-shadow:0px 0px 7px 1px rgba(0, 0, 0, 0.09); 
    border: none;
    padding: 1.75rem; 
    height: 100%;
    border-radius: 16px;

    h3 {
      font-size: 1rem; 
      font-weight: 600;
    }
    p {
      color: #4b4b4b;
      padding: 0 0 0.625rem; 
      margin: 0px;
      font-weight: 400;
    }
    .price-row {
      margin: 0 -1.75rem 0.875rem; 
      padding: 0.9375rem 1.75rem; 
      display:flex;
      background:#fff0d7;
      h2 {
        text-align: left;
        font-weight: bold;
        font-size: 1.875rem; 
        margin: 0px;
        padding: 0;
        color: #e99714;
      }
      p {
        margin: 0px;
        padding: 0;
        color: #4E4E4E;
        margin-left: 0.2rem;
        padding-bottom: 0rem;
        margin-top: 0.4rem;
        font-weight:bold;
       }
    }
    .del-text p {
      font-weight: 600;
    }
    ul {
      list-style: none;
      padding: 0px;
      margin: 0px 0 3.75rem;
      position: relative;
      li {
        list-style: none;
        margin: 0 0 0.875rem;
        display: flex;
        span svg {
          color: #e99714;
          font-size: 1.125rem; 
          margin-right: 0.625rem;
        }
      }
    }

    .btn-3 {
      width: 100%;
    }

    .del-text {
      min-height: 19.875rem;
    }
  }
  .loader-container {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
}
.swal2-cancel{
    padding: 6px 17px;
}
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    video {
      width: 100% !important;
    }
  }
`;
