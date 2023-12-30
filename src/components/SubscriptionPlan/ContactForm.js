import React, { useState } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { styled } from "styled-components";
import Swal from "sweetalert2";
import axios from "axios";
import { API_BASE_URL } from "../../Constants";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import havequestion from "../../assets/images/contact.jpg"
import scanbg from '../../assets/images/scanbg.jpg';
const ContactForm = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    comment: ''
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    company: "",
    comment: ""
  });

  
  const validateField = (field, value) => {
    const validationRules = {
      name: /^[A-Za-z ]+$/,
      email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      comment: /^.{0,500}$/,
      company: /^[A-Za-z0-9\s]+$/
    };

    if (value === undefined || value === null) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }


    if (validationRules[field] && value === '') {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (validationRules[field] && !value.match(validationRules[field]) && field == 'comment') {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must not exceed 500 characters`;
    } else if (validationRules[field] && !value.match(validationRules[field])) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;
    } else if (
      (field === "name") &&
      value.length > 15
    ) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)
        } should not exceed 15 characters`;
    }
    return "";
  };

  const handleInputKeyDown = (e, name) => {
    if (e.key === " " && e.target.selectionStart === 0) {
      e.preventDefault();
    }
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


  const handleSubmit = (event) => {
    event.preventDefault();

    const fields = [
      "name",
      "email",
      "company",
      "comment"
    ];
    const newFormErrors = {};
    fields.forEach((field) => {
      newFormErrors[field] = validateField(field, formValues[field]);
    });

    setErrors(newFormErrors);

    // Check for form validation errors before submitting
    if (
      newFormErrors.name ||
      newFormErrors.email ||
      newFormErrors.company ||
      newFormErrors.comment
    ) {
      return;
    }
    setLoading(true);
    // Make a POST request to submit the data
    axios.post(API_BASE_URL + '/contact-form', { user_id: user?.id, name: formValues.name, email: formValues.email, company: formValues.company, description: formValues.comment })
      .then(response => {
        setLoading(false);
        if (response.status == 201) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Successfully Send Form.",
            customClass: {
              confirmButton: "btn",
            },
          }).then((result) => {
            setFormValues({
              name: '',
              email: '',
              company: '',
              comment: '',
            });
          }).catch((err) => {
            console.log(err);
          })
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Something went wrong.",
            customClass: {
              confirmButton: "btn",
            },
          });
        }
      })
      .catch(error => {
        setLoading(false);
        console.error('Submission failed:', error);
      });
  };

  return (
    <Wrapper className="contact-form">
      <Container>
        <Row className="justify-content-center text-center">
          <Col sm={12} lg={6}>
            <h2>Have a question?</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={12} lg={6}>
            <Form className="text-center" onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group
                  className="mb-2 col-sm-6"
                  controlId="formGridAddress1"
                >
                  <Form.Control
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange("name")}
                    onKeyDown={(e) => handleInputKeyDown(e, "name")}
                  />
                  {errors.name && (
                    <p className="text-start error-message">
                      {errors.name}
                    </p>
                  )}
                </Form.Group>
                <Form.Group className="mb-2 col-sm-6" controlId="formGridEmail">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formValues.email}
                    disabled={isAuthenticated}
                    onChange={handleInputChange("email")}
                    onKeyDown={(e) => handleInputKeyDown(e, "email")}
                  />
                  {errors.email && (
                    <p className="text-start error-message">
                      {errors.email}
                    </p>
                  )}
                </Form.Group>
                <Form.Group
                  className="mb-2 col-sm-12"
                  controlId="formGridAddress1"
                >
                  <Form.Control
                    type="text"
                    placeholder="Company"
                    name="company"
                    value={formValues.company}
                    onChange={handleInputChange("company")}
                    onKeyDown={(e) => handleInputKeyDown(e, "company")}
                  />
                  {errors.company && (
                    <p className="text-start error-message">
                      {errors.company}
                    </p>
                  )}
                </Form.Group>
                <Col sm={12}>
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: "200px" }}
                    value={formValues.comment}
                    onChange={handleInputChange("comment")}
                  />
                  {errors.comment && (
                    <p className="text-start error-message">{errors.comment}</p>
                  )}
                </Col>
              </Row>
              <Button className="d-flex align-items-center " variant="primary" type="submit">
                <span className="d-flex align-items-center">Submit</span>{" "}{loading && (
                  <TailSpin color="#fff" height={18} width={18} />
                )}
              </Button>
            </Form>
          </Col>
      
        </Row>
      </Container>
    </Wrapper>
  );
};

export default ContactForm;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  text-align: left;
  background: url(${scanbg});
  background-repeat:no-repeat;
  background-position:center;
  background-size:cover;
  padding: 4rem 0;
  margin-top: 4rem;
  
  form{
    padding:40px;
    background:#fff;
    border-radius:10px;
    input{
      outline:none;
    }
    textarea.form-control{
      outline:none;
    }
  }
  h2 {
    text-align: center;
    font-size: 40px;
    font-weight: 300;

  }
  .error-message{margin-top:0px;}
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    background-position: left;
    margin-top: 2.5rem;
  }
`;
