import React, { useState, useEffect } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import { API_BASE_URL } from "../../../Constants";
import Swal from 'sweetalert2';
import axios from "axios";
import TextEditor from "../../TextEditor";
import { useSelector } from 'react-redux';
import CurrencyInput from 'react-currency-input-field';
import styled from "styled-components";
import { TailSpin } from "react-loader-spinner";
import Table from 'react-bootstrap/Table';


const Subscription = () => {
  const [maxId, setMaxId] = useState(1);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [saveloadingIndex, setSaveLoadingIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [disableBtn, setDisableBtn] = useState(false);
  
  const [isFreeSubscriptionAvailable, setIsFreeSubscriptionAvailable] = useState(false);
  const access_token = useSelector((state) => state.auth.token);

  const [subscriptionPlan, setSubscriptionPlan] = useState([{
    id: 1,
    title: "",
    price: "0",
    subscriptionType: "free",
    type: "free",
    plan_id: 'plan_free',
    scans_per_day: 100,
    delay_btw_scans: 15,
    features: [],
    isDisabled: false
  }]);

  const [errors, setErrors] = useState([
    {
      id: 1,
      title: "",
      price: "",
      subscriptionType: "",
      type: "",
      scans_per_day: "",
      delay_btw_scans: "",
      features: "",
    }
  ]);

  const updateErrors = (index, field, errorMessage) => {
    setErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index][field] = errorMessage;
      return newErrors;
    });
  };

  useEffect(() => {
    async function fetchSubscriptionData() {
      try {
        const response = await axios.get(API_BASE_URL + "/subscription-plans", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${atob(access_token)}`
          }
        });
        if (response.status == 200) {
          const responseData = response.data;
          if (Array.isArray(responseData.subscriptionPlans) && responseData.subscriptionPlans.length > 0) {
            const decodedSubscriptionPlans = responseData.subscriptionPlans.map(plan => ({
              id: plan.id,
              title: plan.title,
              price: plan.price,
              subscriptionType: plan.subscriptionType,
              type: plan.type,
              plan_id: plan.plan_id,
              scans_per_day: plan.scans_per_day,
              delay_btw_scans: plan.delay_btw_scans,
              features: JSON.parse(plan.features),
              isDisabled: true,
            }));
            // Check if there is any plan with subscriptionType "free"
            const hasFreeSubscription = decodedSubscriptionPlans.some(plan => plan.subscriptionType === "free");
            setIsFreeSubscriptionAvailable(hasFreeSubscription);
            // Create an array of error objects based on the subscription plans
            const initialErrors = decodedSubscriptionPlans.map(plan => ({
              id: plan.id,
              title: "",
              price: "",
              subscriptionType: "",
              type: "",
              scans_per_day: "",
              delay_btw_scans: "",
              features: "",
            }));
            setMaxId(responseData.maxId);
            setSubscriptionPlan(decodedSubscriptionPlans);
            setErrors(initialErrors);
          }
        } else {
          console.error("Error fetching subscription plans");
        }
      } catch (error) {
        console.error("An error occurred", error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchSubscriptionData();
  }, []);

  const addSubscriptionPlan = () => {
    if (subscriptionPlan.length < 6) {
      // const highestId = Math.max(...subscriptionPlan.map((plan) => plan.id));
      const newId = maxId + 1;
      setMaxId(newId);
      setSubscriptionPlan([...subscriptionPlan, {
        id: newId,
        title: "",
        price: "0",
        subscriptionType: "",
        type: "free",
        scans_per_day: 100,
        delay_btw_scans: 15,
        features: [],
        isDisabled: false
      }]);
      setErrors([
        ...errors,
        {
          id: newId,
          title: "",
          price: "",
          subscriptionType: "",
          type: "",
          scans_per_day: "",
          delay_btw_scans: "",
          features: "",
        },
      ]);
    }
  };

  const removeSubscription = async (plan_id, title, index) => {
  
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this subscription?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn', // Add custom class to confirm button
        cancelButton: 'btn cancel-btn ',   // Add custom class to cancel button
      },
    });

    if (result.isConfirmed) {
      setLoadingIndex(index);
      setDisableBtn(true);

    if(!subscriptionPlan[index]['isDisabled'])
    {
      setLoadingIndex(-1);
      setDisableBtn(false);
      const updatedSubscriptionPlan = subscriptionPlan.filter((_, i) => i !== index);
      setSubscriptionPlan(updatedSubscriptionPlan);
      return;
    }
    
      try {
        const response = await fetch(API_BASE_URL + `/subscription-plans/${plan_id}/${title}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${atob(access_token)}`
          },
        });
        if (response.ok) {
          setDisableBtn(false);
          setLoadingIndex(-1);
          const responseData = await response.json();
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Plan deleted Successfully",
            customClass: {
              confirmButton: "btn",
            },
          }).then(() => {
            const updatedSubscriptionPlans = responseData.subscriptionPlans.map((plan) => ({
              ...plan,
              isDisabled: true,
            }));
            setSubscriptionPlan(updatedSubscriptionPlans);
            setErrors((prevErrors) => {
              const newErrors = [...prevErrors];
              newErrors.splice(index, 1);
              return newErrors;
            });
          });
        } else {
          setDisableBtn(false);
          setLoadingIndex(-1);
          const errorData = await response.json();
          console.error('Error deleting subscription plan:', errorData.error);
        }
      } catch (error) {
        setDisableBtn(false);
        setLoadingIndex(-1);
        console.error('An unexpected error occurred:', error);
      }
    };
  }

  const handleChange = (event, index) => {
    const { name, value } = event.target;

    setSubscriptionPlan((prevSubscriptions) => {
      const updatedSubscriptions = [...prevSubscriptions];
      const updatedSubscription = { ...updatedSubscriptions[index], [name]: value };

      if (name === 'subscriptionType') {
        if (value === 'free') {
          updatedSubscription.price = '0';
        }
        updateErrors(index, name, "");
      } else if (!value || value === 0 || value === '0') {
        updateErrors(index, name, "This field is required");
      } else {
        updateErrors(index, name, ""); // Clear error message if value is provided
      }

      updatedSubscriptions[index] = updatedSubscription;
      return updatedSubscriptions;
    });
  };

  const handleEditorChange = (content, index = 0) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const listItems = doc.querySelectorAll("ul li");
    const listContent = Array.from(listItems).map((li) => li.textContent);
    const hasEmptyContent = listContent.length === 0 || (listContent.length === 1 && listContent[0] === "");
    setSubscriptionPlan((prevSubscriptions) => {
      const updatedSubscriptions = [...prevSubscriptions];
      updatedSubscriptions[index].features = listContent;
      return updatedSubscriptions;
    });
    // Update errors state based on the hasEmptyContent condition
    setErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      if (hasEmptyContent) {
        newErrors[index].features = "Features is required";
      } else {
        newErrors[index].features = ""; // Clear error message if content is provided
      }
      return newErrors;
    });
  };

  const handleSubmit = async (event, index) => {
    event.preventDefault();

    const updatedSubscription = { ...subscriptionPlan[index] };
    const priceWithoutDollarSign = updatedSubscription.price.replace('$', '');
    updatedSubscription.price = priceWithoutDollarSign;

    const errorObj = {
      title: !updatedSubscription.title ? "Title is required" : "",
      price: !updatedSubscription.price || (updatedSubscription.price === "0" && updatedSubscription.subscriptionType != 'free') ? "Price is required" : "",
      features: updatedSubscription.features.every((feature) => feature.trim() === '') ? "Features is required" : "",
      type: !updatedSubscription.type ? "Type is required" : "",
      subscriptionType: !updatedSubscription.subscriptionType ? "Subscription Type is required" : "",
    };

    const newErrors = [...errors];
    newErrors[index] = { id: newErrors[index].id, ...errorObj };
    setErrors(newErrors);

    const hasErrors = Object.values(errorObj).some((value) => value !== "");

    if (!hasErrors) {
      setSaveLoadingIndex(index);
      setDisableBtn(true);
      try {
        const response = await axios.post(API_BASE_URL + "/subscription-plans", updatedSubscription, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${atob(access_token)}`
          }
        });
        if (response.status == 200) {
          setDisableBtn(false);
          setSaveLoadingIndex(-1);
          const responseData = response.data;
          const updatedPlans = [...subscriptionPlan];
          updatedPlans[index] = response.data.subscription;
          updatedPlans[index].isDisabled = true;
          const hasFreeSubscription = updatedPlans.some(plan => plan.subscriptionType === "free");
          setIsFreeSubscriptionAvailable(hasFreeSubscription);
          setSubscriptionPlan(updatedPlans);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: responseData.message,
            customClass: {
              confirmButton: "btn",
            },
          }).then(() => {
            console.log("done");
          });
        } else if (response.status === 422) {
          setDisableBtn(false);
          setSaveLoadingIndex(-1);
          const errorResponse = response.data;
          const validationErrors = errorResponse.error;
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: validationErrors,
            customClass: {
              confirmButton: "btn",
            },
          });
        }
      } catch (error) {
        setDisableBtn(false);
        setSaveLoadingIndex(-1);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong !!",
          customClass: {
            confirmButton: "btn",
          },
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <TailSpin height={40} width={40} />
      </div>
    );
  }

  return (
    <>
      <Wrapper>

     


        {subscriptionPlan.map((subscription, index) => {

          return (


            <Form  onSubmit={(e) => handleSubmit(e, index)} key={index}>
              <div key={index} className="subscription-plan-container">
              <div className="profile-sec">
                <Row>
                <Col sm={12} className="text-start"><h4>Subscription Plan {index + 1}</h4></Col>
                </Row>
                <Row>
                  <Col sm={6} className="mb-3 text-start">
                    <Form.Label htmlFor={`heading_${index}`}>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={subscription.title}
                      onChange={(event) => handleChange(event, index)}
                      disabled={subscriptionPlan[index].isDisabled}
                    />
                    {errors[index].title && (
                      <div className="text-danger  error-message">{errors[index].title}</div>
                    )}
                  </Col>
                  <Col sm={6} className="mb-3 text-start">
                    <Form.Label htmlFor="subHeading">Price</Form.Label>
                    <div className="input-group">
                      <CurrencyInput
                        className="form-control"
                        prefix="$"
                        name="price"
                        decimalsLimit={2}
                        allowNegativeValue={false}
                        defaultValue={0}
                        disabled={subscriptionPlan[index].subscriptionType == 'free' || subscriptionPlan[index].isDisabled}
                        onValueChange={(value) => {
                          if (value == undefined) {
                            handleChange({ target: { name: "price", value: 0 } }, index);
                          }
                          if (value <= 1000) {
                            handleChange({ target: { name: "price", value } }, index);
                          }
                        }}
                        value={subscription?.price}
                      />
                    </div>
                    {errors[index].price && (
                      <div className="text-danger error-message">{errors[index].price}</div>
                    )}
                  </Col>
                </Row>
               

                <Row>
                  <Col sm={6} className="mb-3 text-start">
                    <Form.Label htmlFor={`subscriptionType_${index}`}>Subscription Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="subscriptionType"
                      value={subscription?.subscriptionType}
                      onChange={(event) => handleChange(event, index)}
                      disabled={subscriptionPlan[index].isDisabled}
                    > 
                      <option value="">Select subscription type</option>
                      {subscription.subscriptionType=='free' && <option value="free">Free</option>}
                      {!isFreeSubscriptionAvailable && <option value="free">Free</option>}
                      <option value="day">Daily</option>
                      <option value="month">Monthly</option>
                      <option value="year">Annually</option>
                    </Form.Control>
                   
                    {errors[index].subscriptionType && (
                      <div className="text-danger error-message">{errors[index].subscriptionType}</div>
                    )}
                  </Col>
                  <Col sm={6} className="mb-3 text-start">
                    <Form.Label htmlFor={`type_${index}`}>Features Get</Form.Label>
                    <Form.Control
                      as="select" // Use "as" prop to render a dropdown select
                      name="type"
                      value={subscription.type}
                      onChange={(event) => handleChange(event, index)}
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="advance">Advance</option>
                      <option value="enterprise">Enterprise</option>
                    </Form.Control>
                    {errors[index].type && (
                      <div className="text-danger error-message">{errors[index].type}</div>
                    )}
                  </Col>
                </Row>
                
  
                <Row>
                  <Col sm={6} className="mb-3 text-start">
                    <Form.Label htmlFor={`scans_per_day_${index}`}>Scans per day</Form.Label>
                    <Form.Control
                      as="select" // Use "as" prop to render a dropdown select
                      name="scans_per_day"
                      value={subscription.scans_per_day}
                      onChange={(event) => handleChange(event, index)}
                    >
                      <option value="100">100</option>
                      <option value="1000">1000</option>
                      <option value="5000">5000</option>
                      <option value="10000">10000</option>
                      <option value="-1">Unlimited</option>
                    </Form.Control>
                    {errors[index].scans_per_day && (
                      <div className="text-danger error-message">{errors[index].scans_per_day}</div>
                    )}
                  </Col>

                  <Col sm={6} className="mb-3 text-start">
                    <Form.Label htmlFor={`delay_btw_scans_${index}`}>Delay b/w scans</Form.Label>
                    <Form.Control
                      as="select" // Use "as" prop to render a dropdown select
                      name="delay_btw_scans"
                      value={subscription.delay_btw_scans}
                      onChange={(event) => handleChange(event, index)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </Form.Control>
                    {errors[index].delay_btw_scans && (
                      <div className="text-danger error-message">{errors[index].delay_btw_scans}</div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="mb-5 text-start">
                    Features
                    <TextEditor subscriptionPlan={subscription} onChange={(content) => handleEditorChange(content, index)} />
                  </Col>
                  {
                    errors[index].features && (
                      <div className="text-danger error-message">{errors[index].features}</div>
                    )
                  }
                </Row>




                <Row>

                  <Col className="pt-3 save-remove-btn">
                    <Button
                      type="submit"
                      className="custom-btn btn-3"
                      disabled={disableBtn} >
                      <span>Save</span> {" "}
                      {index == saveloadingIndex && (
                        <TailSpin color="#fff" height={15} width={15} />
                      )}
                    </Button>
                    {index > 0 && (
                      <Button
                        type="button"
                        className="custom-btn btn-3 d-flex focus-btn"
                        onClick={() => removeSubscription(subscription.plan_id, subscription.title, index)}
                        disabled={disableBtn}
                      >
                        <span>Remove Subscription</span>{" "}
                        {index == loadingIndex && (
                          <TailSpin color="#fff" height={15} width={15} />
                        )}
                      </Button>
                    )}
                  </Col>
                </Row>
</div>

                <Row>
                  <Col className="pt-3">
                    {index === subscriptionPlan.length - 1 && subscriptionPlan.length < 6 && (
                      <Button
                        type="button"
                        className="custom-btn btn-3"
                        onClick={addSubscriptionPlan}
                        
                      >
                        <span>Add Subscription</span>
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            </Form>
          )
        })}
      </Wrapper>

    </>
  );
};
export default Subscription;

const Wrapper = styled.section`

select {
  appearance: auto;
  background: url('path-to-your-arrow-icon.png') no-repeat right center;
  background-size: 20px; /* Adjust the size as needed */
  padding-right: 30px; /* Adjust the padding to make space for the arrow icon */
  cursor: pointer;
}
.subscription-plan-container:first-child {
  margin: 0px;
}
button{
    display: flex;
    justify-content: end;
    align-items: center;
    span{padding:0 5px}
}
.save-remove-btn.col {
  display: flex;
  justify-content: space-between;
}
.focus-btn{
  border: 1px solid #E7A83E;
  background:#E7A83E;
  color:#fff;
}
`;