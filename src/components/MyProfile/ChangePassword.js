import React, { useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../Constants";
import { TailSpin } from "react-loader-spinner";
import "bootstrap-icons/font/bootstrap-icons.css";

const ChangePassword = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(
      (prevShowCurrentPassword) => !prevShowCurrentPassword
    );
  };


  const [formValues, setFormValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputKeyDown = (e, name) => {
    if (e.key === " " && e.target.selectionStart === 0) {
      e.preventDefault();
    }
  };

  const validateField = (field, value) => {
    if (
      field === "oldPassword" ||
      field === "newPassword" ||
      field === "confirmPassword"
    ) {
      if (!value) {
        return `This field is required`;
      }
    }
    if(field!='oldPassword')
    {
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
  }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = ["oldPassword", "newPassword", "confirmPassword"];

    const newFormErrors = {};

    fields.forEach((field) => {
      newFormErrors[field] = validateField(field, formValues[field]);
    });
    if (formValues.newPassword !== formValues.confirmPassword) {
      newFormErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newFormErrors);

    const hasErrors = Object.values(newFormErrors).some(
      (error) => error !== ""
    );

    if (!hasErrors) {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}/change-password`,
          {
            oldPassword: formValues.oldPassword,
            newPassword: formValues.newPassword,
            confirmPassword: formValues.confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${atob(token)}`,
            },
          }
        );

        if (response.status === 200) {
          setLoading(false);
          setFormValues({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
            customClass: {
              confirmButton: "btn",
            },
          })
            .then(() => {
              navigate("/myprofile/password");
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setLoading(false);
          Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: response.data.message,
            customClass: {
              confirmButton: "btn",
            },
          })
            .then(() => {
              navigate("/myprofile/password");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 400) {
          Swal.fire({
            icon: "warning",
            title: "Warning!", 
            text: "Old Password is Incorrect",
            customClass: {
              confirmButton: "btn",
            },
          })
            .then(() => {
              navigate("/myprofile/password");
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: "Old Password is Incorrect",
            customClass: {
              confirmButton: "btn",
            },
          })
            .then(() => {
              navigate("/myprofile/password");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  };
  const handleInputChange = (field) => (event) => {
    const value = event.target.value.trim();
      
    setFormValues((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: validateField(field, value),
    }));
  };

  return (
    <Wrapper>

  <form onSubmit={handleSubmit}>
  <div className="profile-sec">
  <Row>
  <Col sm={12}><h4>Update Password</h4></Col>
          <Col sm={6} className="mb-3 text-start pass-ab">
            <Form.Label htmlFor="inputName">Old Password</Form.Label>
            <Form.Control
              className="old-pass"
              type={showCurrentPassword ? "text" : "password"}
              value={formValues.oldPassword}
              name="oldPassword"
              onChange={handleInputChange("oldPassword")}
              onKeyDown={(e) => handleInputKeyDown(e, "oldPassword")}
            />
            <i
              className={`bi ${
                showCurrentPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
              } password-icon`}
              onClick={toggleCurrentPasswordVisibility}
            ></i>
            {errors.oldPassword && (
              <div className="error-message">{errors.oldPassword}</div>
            )}
          </Col>
        </Row>
        <Row>
          <Col sm={6} className="mb-3 text-start pass-ab1">
            <Form.Label htmlFor="inputName">New Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={formValues.newPassword}
              name="newPassword"
              onChange={handleInputChange("newPassword")}
              onKeyDown={(e) => handleInputKeyDown(e, "newPassword")}
            />
            <i
              className={`bi ${
                showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
              } password-icon`}
              onClick={togglePasswordVisibility}
            ></i>
            {errors.newPassword && (
              <div className="error-message">{errors.newPassword}</div>
            )}
          </Col>
          <Col sm={6} className="mb-3 text-start pass-ab2">
            <Form.Label htmlFor="inputName">Confirm New Password</Form.Label>
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              value={formValues.confirmPassword}
              name="confirmPassword"
              onChange={handleInputChange("confirmPassword")}
              onKeyDown={(e) => handleInputKeyDown(e, "confirmPassword")}
            />{" "}
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
          <Col sm={12} className="profile-submit">
            <button type="submit" className="custom-btn btn-3 " disabled={loading}> 
                  <span style={{ marginRight: loading ? '5px' : '0' }}> Save</span> {" "}
                    {loading && (
                      <TailSpin color="#fff" height={20} width={20} />
                    )}
                  </button>
          </Col>
        </Row>
        </div>
      </form>
    </Wrapper>
  );
};

export default ChangePassword;

const Wrapper = styled.section`
  hr{
    margin-top:0px;
  }
  h3{
    font-size:1.25rem;
  }
  
  .pass-ab {
    position: relative;
  }
  .pass-ab1 {
    position: relative;
  }
  .pass-ab2 {
    position: relative;
  }
  .pass-ab .password-icon {
    position: absolute;
    top: 2.375rem;
    right: 1.5rem;
  }
  .pass-ab1 .password-icon {
    position: absolute;
    top: 2.375rem;
    right: 1.5rem;
  }
  .pass-ab2 .password-icon {
    position: absolute;
    top: 2.375rem;
    right: 1.5rem;
  }

  button{
    margin: 0;
    display:flex
  }


`;
