import React, { useRef, useState, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { styled } from "styled-components";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { setUserProfile, setUser } from "../../redux/slices/authSlice";
import CountryDropdown from "../../components/CountryDropdown";
import StatesDropdown from "../../components/StatesDropdown";
import { IMAGE_PATH } from "../../Constants";
import { ProfileValidationSchema } from "../../utils/validations";
import { TailSpin } from "react-loader-spinner";
import { UserProfileApi } from "../../utils/API/auth";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const accessToken = useSelector((state) => state.auth.token);
  const [validationErrors, setValidationErrors] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [disableProfileBtn, setDisableProfileBtn] = useState(true);
  //Profile Image
  const imageRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      fullName: user.name,
      company: userProfile.company !== null ? userProfile.company : "",
      street: userProfile.street_one,
      street_two: userProfile.street_two !== null ? userProfile.street_two : "",
      city: userProfile.city,
      zipcode: userProfile.zipcode,
      country: userProfile.country || 'US',
      state: userProfile.state || '',
      image: userProfile.image !== null ? userProfile.image : null,
    },
    validationSchema: ProfileValidationSchema,
    onSubmit: async (values) => {
      setValidationErrors({});
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("full_name", values.fullName);
      formData.append("company", values.company);
      formData.append("street_one", values.street);
      formData.append("street_two", values.street_two);
      formData.append("city", values.city);
      formData.append("zipcode", values.zipcode);
      formData.append("state", values.state);
      formData.append("country", values.country);

      if (values.image) {
        formData.append("image", values.image);
      } else {
        formData.append("setDefault", "default.jpg");
      }

      const response = await UserProfileApi(formData, accessToken);
      if (response.status === 201) {
        const userProfileData = response.data.userProfile;
        dispatch(setUser({ ...user, name: userProfileData.full_name }));
        dispatch(setUserProfile(userProfileData));

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User Updated Successfully.",
          customClass: {
            confirmButton: "btn",
          },
        });
      } else if (response.status === 422) {
        const validationErrors = response.data.errors;
        setValidationErrors(validationErrors);
      }else
      {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Something went wrong.",
          customClass: {
            confirmButton: "btn",
          },
        });
      }
    }
  });
  // Set initial values of input fields
  useEffect(() => {
    if (userProfile.image === "default.jpg" || userProfile.image === null) {
      setDisableProfileBtn(true);
    } else {
      setDisableProfileBtn(false);
    }
    setImageUrl(userProfile.image ? IMAGE_PATH + userProfile.image : null);

  }, [userProfile]);


  const handleEditProfileClick = () => {
    imageRef.current.click();
  };


  const handleRemovePicture = () => {
    Swal.fire({
      icon: "warning",
      title: "Warning!",
      text: "Are you sure,you want to remove profile picture?",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary warning-btn",
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          setImageUrl(null);
          formik.setFieldValue("image", null);
          setDisableProfileBtn(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Wrapper className="accountsetting">

        <div className="profile">

          {Object.keys(validationErrors).length > 0 && <div className="profile-sec">
            {Object.keys(validationErrors).map((fieldName) => (
              <p key={fieldName} className="error-message">
                {validationErrors[fieldName]}
              </p>
            ))}
          </div>}

          <div className="profile-pic">

            <div className="profile-row profile-sec">
              <div className="imgprofile">
                {imageUrl ? (
                  <img src={imageUrl} alt="Profile" />
                ) : (
                  <img src={IMAGE_PATH + 'default.jpg'} alt="Profile" />
                )}
              </div>
              <Button
                className="custom-btn btn-3 remove-bt1"
                onClick={handleEditProfileClick}
              >
                <span>Edit Image</span>
              </Button>
              {!disableProfileBtn && <Button
                className="custom-btn btn-3 remove-bt"
                onClick={handleRemovePicture}
              >
                <span>Remove Current Image</span>
              </Button>
              }
            </div>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="profile-sec">
              <Row>
                <Col sm={12}> <h4>Personal Information</h4></Col>
                <Col sm={12}>
                  <Form.Control
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    ref={imageRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setImageUrl(reader.result);
                          setDisableProfileBtn(false);
                        };
                        reader.readAsDataURL(file);
                        formik.setFieldValue("image", file);
                      }
                    }}
                    style={{ display: "none" }}
                  />
                </Col>
                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="firstName">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.fullName && formik.touched.fullName && (
                    <div className="error-message">{formik.errors.fullName}</div>
                  )}
                </Col>

                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="company">Company (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={formik.values.company}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.company && formik.touched.company && (
                    <div className="error-message">{formik.errors.company}</div>
                  )}
                </Col>
              </Row>
            </div>

            <div className="profile-sec">
              <Row>
                <Col sm={12}>
                  <h4 className="paddtop">Address Information</h4>
                </Col>
                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="street">Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={formik.values.street}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.street && formik.touched.street && (
                    <div className="error-message">{formik.errors.street}</div>
                  )}
                </Col>
                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="street_two">Street Address 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="street_two"
                    value={formik.values.street_two}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.street_two && formik.touched.street_two && (
                    <div className="error-message">{formik.errors.street_two}</div>
                  )}
                </Col>
                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="country">Country</Form.Label>
                  <CountryDropdown
                    selectedCountry={formik.values.country}
                    onChange={(value) => formik.setFieldValue('country', value)}
                  />
                  {formik.errors.country && formik.touched.country && (
                    <div className="error-message">{formik.errors.country}</div>
                  )}
                </Col>
                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="state">State</Form.Label>
                  <StatesDropdown
                    selectedState={formik.values.state}
                    selectedCountry={formik.values.country}
                    onChange={(stateValue) => {
                      formik.setFieldValue('state', stateValue);
                      formik.setFieldTouched('state', true, false);
                    }}
                  />
                  {formik.errors.state && formik.touched.state && (
                    <div className="error-message">{formik.errors.state}</div>
                  )}
                </Col>
                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="city">City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.city && formik.touched.city && (
                    <div className="error-message">{formik.errors.city}</div>
                  )}
                </Col>
                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="zipcode">Zipcode</Form.Label>
                  <Form.Control
                    type="text"
                    name="zipcode"
                    value={formik.values.zipcode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.zipcode && formik.touched.zipcode && (
                    <div className="error-message">{formik.errors.zipcode}</div>
                  )}
                </Col>
              </Row>
            </div>

            <div className="profile-sec">
              <Row>
                <Col sm={6} ></Col><h4>Contact Information</h4>
                <Col sm={6} className="mb-3 text-start">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={user?.email}
                    readOnly
                    onChange={formik.handleChange}
                  />
                </Col>

              </Row>
            </div>

            <Col sm={12} className="profile-submit">
              <button className="custom-btn btn-3 " disabled={formik.isSubmitting}>
                <span style={{ marginRight: formik.isSubmitting ? '5px' : '0' }}> Save </span>{" "}
                {formik.isSubmitting && (
                  <TailSpin color="#fff" height={20} width={20} />
                )}
              </button>
            </Col>

          </form>
        </div>
      </Wrapper>
    </>
  );
};

export default Profile;

// Styled component named StyledButton
const Wrapper = styled.section`
  h3 {
    font-size: 1.25rem;
  }
  .form-check-inline {
    margin-right: 4rem;
  }
  .profile-submit button {
    display: flex;
    margin: 0;
}
.profile-submit span {
  margin-right: 10px;
}
`;
