import React, { useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useFormik } from "formik";
import { ChangePasswordValidationSchema } from '../../utils/validations';
import { ChangePasswordApi } from "../../utils/API/auth";
const ChangePassword = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const navigate = useNavigate();


  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'oldPassword':
        setShowCurrentPassword((prev) => !prev);
        break;
      case 'newPassword':
        setShowPassword((prev) => !prev);
        break;
      case 'confirmPassword':
        setShowConfirmPassword((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema :ChangePasswordValidationSchema,
    onSubmit: async (values) => {
      setValidationErrors({})
      const response = await ChangePasswordApi({ ...values, userId: user.id }, token);
      if (response.status === 200) {
        formik.resetForm();
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
      } else if (response.status === 422) {
        const validationErrors = response.data.errors;
        setValidationErrors(validationErrors);
      } else if (response.status === 400) {
        setValidationErrors({"Password":"Old password is incorrect"});
      } else {
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
    },
  });

  return (
    <Wrapper>
      <form onSubmit={formik.handleSubmit}>
        <div className="profile-sec">
          <Row>
            <Col sm={12}>
              <h4>Update Password</h4>
            </Col>
            {Object.keys(validationErrors).length > 0 &&
              <Row>
                <Col>
                  {Object.keys(validationErrors).map((fieldName) => (
                    <p key={fieldName} className="error-message">
                      {validationErrors[fieldName]}
                    </p>
                  ))}
                </Col>
              </Row>
            }
            <Col sm={6} className="mb-3 text-start pass-ab">
              <Form.Label htmlFor="oldPassword">Old Password</Form.Label>
              <Form.Control
                className="old-pass"
                type={showCurrentPassword ? "text" : "password"}
                name="oldPassword"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <i
                className={`bi ${showCurrentPassword
                  ? "bi-eye-slash-fill"
                  : "bi-eye-fill"
                  } password-icon`}
                onClick={()=>togglePasswordVisibility('oldPassword')}
              ></i>
              {formik.touched.oldPassword && formik.errors.oldPassword && (
                <div className="error-message">
                  {formik.errors.oldPassword}
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3 text-start pass-ab1">
              <Form.Label htmlFor="newPassword">New Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <i
                className={`bi ${showPassword
                  ? "bi-eye-slash-fill"
                  : "bi-eye-fill"
                  } password-icon`}
                onClick={()=>togglePasswordVisibility('newPassword')}
              ></i>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="error-message">
                  {formik.errors.newPassword}
                </div>
              )}
            </Col>
            <Col sm={6} className="mb-3 text-start pass-ab2">
              <Form.Label htmlFor="confirmPassword">
                Confirm New Password
              </Form.Label>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />{" "}
              <i
                className={`bi ${showConfirmPassword
                  ? "bi-eye-slash-fill"
                  : "bi-eye-fill"
                  } password-icon`}
                onClick={()=>togglePasswordVisibility('confirmPassword')}
              ></i>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="error-message">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </Col>
            <Col sm={12} className="profile-submit">
              <button
                type="submit"
                className="custom-btn btn-3 "
                disabled={formik.isSubmitting}
              >
                <span style={{ marginRight: formik.isSubmitting ? "5px" : "0" }}>
                  Save
                </span>{" "}
                {formik.isSubmitting && (
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
