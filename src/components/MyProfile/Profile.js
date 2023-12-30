import React, { useRef, useState, useEffect } from "react";
import { Button, Col, Row, Form, Card } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../../Constants";
import { styled } from "styled-components";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setUserProfile, setUser } from "../../redux/slices/authSlice";
import CountryDropdown from "../../components/CountryDropdown";
import StatesDropdown from "../../components/StatesDropdown";
import { IMAGE_PATH } from "../../Constants";
import { TailSpin } from "react-loader-spinner";

const Profile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const accessToken = useSelector((state) => state.auth.token);

  const [imageUrl, setImageUrl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedState, setSelectedState] = useState("");
  const [disableProfileBtn, setDisableProfileBtn] = useState(false);
  const [formValues, setFormValues] = useState({});
  //Profile Image
  const imageRef = useRef(null);

  let userFirstName = "";
  let userLastName = "";
  // Splitting the full name into first name and last name
  if (user) {
    const fullNameParts = user.name.split(" ");
    userFirstName = fullNameParts[0];
    userLastName = fullNameParts.slice(1).join(" ");
  }

  // Set initial values of input fields
  useEffect(() => {
    setSelectedCountry(userProfile.country);
    setSelectedState(userProfile.state);
    if (userProfile.image === "default.jpg" || userProfile.image === null) {
      setDisableProfileBtn(true);
    }
    setImageUrl(userProfile.image ? IMAGE_PATH + userProfile.image : null);
    // Update formValues based on userProfile
    setFormValues({
      firstName: userFirstName,
      lastName: userLastName,
      company: userProfile.company !== "null" ? userProfile.company : "",
      street: userProfile.street_one,
      street_two: userProfile.street_two !== "null" ? userProfile.street_two : "",
      city: userProfile.city,
      zipcode: userProfile.zipcode,
      image: userProfile.image ? IMAGE_PATH + userProfile.image : null,
    });
  }, [userProfile]);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    zipcode: "",
    state: "",
    country: ""
  });

  const validateField = (field, value) => {
    const validationRules = {
      firstName: /^[A-Za-z ]+$/,
      lastName: /^[A-Za-z ]+$/,
      street: /^.+$/,
      city: /^[A-Za-z ]+$/
    };
    const zipPattern = /^[A-Z\d]{3,6}$/;

    if (value == undefined || value === '' && !value && field !== "company" && field !== "street_two") {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (!value.match(validationRules[field]) && field === "street") {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} Address is required`;
    } else if (field === "zipcode") {
      const cleanedValue = value.replace(/\s/g, "");
      if (!cleanedValue.match(zipPattern)) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;
      }
    } else if (validationRules[field] && !value.match(validationRules[field])) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;
    } else if (
      (field === "firstName" || field === "lastName") &&
      value.length > 15
    ) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)
        } should not exceed 15 characters`;
    }

    return "";
  };

  const handleCountryChange = (countryValue) => {
    setSelectedCountry(countryValue);
    setSelectedState("");
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

  //handling image
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
        setDisableProfileBtn(false);
      };
      reader.readAsDataURL(file);
    }
  };

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
          setDisableProfileBtn(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const state = selectedState;
    const country = selectedCountry;
    // Validate all fields
    const fields = [
      "firstName",
      "lastName",
      "street",
      "city",
      "zipcode"
    ];
    const newFormErrors = {};
    fields.forEach((field) => {
      newFormErrors[field] = validateField(field, formValues[field]);
    });
    if (state.trim() == "") {
      newFormErrors["state"] = "State is required";
    }
    setErrors(newFormErrors);

    // Check for form validation errors before submitting
    if (
      newFormErrors.firstName ||
      newFormErrors.lastName ||
      newFormErrors.street ||
      newFormErrors.street_two ||
      newFormErrors.city ||
      newFormErrors.zipcode ||
      newFormErrors.state ||
      newFormErrors.country
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("first_name", formValues.firstName);
    formData.append("last_name", formValues.lastName);
    formData.append("company", formValues.company);
    formData.append("street_one", formValues.street); 
    formData.append("street_two", formValues.street_two);
    formData.append("city", formValues.city);
    formData.append("zipcode", formValues.zipcode);
    formData.append("state", state);
    formData.append("country", country);

    if (imageUrl) {
      // Only append the image if the imageUrl is not null
      formData.append("image", imageRef.current.files[0]); // Get the selected image
    } else {
      formData.append("setDefault", "default.jpg"); // Get the selected image
    }
    setLoading(true);
    axios
      .post(API_BASE_URL + "/userprofiles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${atob(accessToken)}`
        },
      })
      .then((response) => {
        if (response.status == 201) {
          setLoading(false);
          const userProfileData = response.data;
          // Update the user profile data in the Redux store
          const fullName = userProfileData.first_name + " " + userProfileData.last_name;
          dispatch(setUser({ ...user, name: fullName }));
          dispatch(setUserProfile(userProfileData));

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "User Updated Successfully.",
            customClass: {
              confirmButton: "btn",
            },
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <>
      <Wrapper className="accountsetting">
        <div className="profile">
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

          <form onSubmit={handleSubmit}>
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
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </Col>
              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor="firstName">First Name</Form.Label>
                <Form.Control
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formValues.firstName || ''}
                  aria-describedby="NameHelpBlock"
                  onChange={handleInputChange("firstName")}
                  onKeyDown={(e) => handleInputKeyDown(e, "firstName")}
                />
                {errors.firstName && (
                  <div className="error-message">{errors.firstName}</div>
                )}
              </Col>
              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor="lastName">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formValues.lastName || ''}
                  aria-describedby="NameHelpBlock"
                  onChange={handleInputChange("lastName")}
                  onKeyDown={(e) => handleInputKeyDown(e, "lastName")}
                />
                {errors.lastName && (
                  <div className="error-message">{errors.lastName}</div>
                )}
              </Col>
              
              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor="lastName">Company (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  id="company"
                  name="company"
                  value={formValues.company || ''}
                  onChange={handleInputChange("company")}
                  onKeyDown={(e) => handleInputKeyDown(e, "company")}
                />
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
                  id="street"
                  name="street"
                  value={formValues.street || ''}
                  aria-describedby="NameHelpBlock"
                  onChange={handleInputChange("street")}
                  onKeyDown={(e) => handleInputKeyDown(e, "street")}
                />
                {errors.street && (
                  <div className="error-message">{errors.street}</div>
                )}
              </Col>

              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor="street_two">Street Address 2</Form.Label>
                <Form.Control
                  type="text"
                  id="street_two"
                  name="street_two"
                  value={formValues.street_two || ''}
                  aria-describedby="NameHelpBlock"
                  onChange={handleInputChange("street_two")}
                  onKeyDown={(e) => handleInputKeyDown(e, "street_two")}
                />
                {errors.street_two && (
                  <div className="error-message">{errors.street_two}</div>
                )}
              </Col>
              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor="country">Country</Form.Label>
                <CountryDropdown
                  selectedCountry={selectedCountry}
                  onChange={handleCountryChange}
                />
              </Col>
              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor="state">State</Form.Label>

                <div>
                  <StatesDropdown
                    selectedState={selectedState}
                    selectedCountry={selectedCountry}
                    onChange={(stateValue) => {
                      setSelectedState(stateValue);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        state: "",
                      }));
                    }}
                  />
                  {errors.state && (
                    <div className="error-message">{errors.state}</div>
                  )}
                </div>
              </Col>
              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor="city">City</Form.Label>
                <Form.Control
                  type="text"
                  id="city"
                  name="city"
                  value={formValues.city || ''}
                  onChange={handleInputChange("city")}
                  onKeyDown={(e) => handleInputKeyDown(e, "city")}
                />
                {errors.city && (
                  <div className="error-message">{errors.city}</div>
                )}
              </Col>
              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor="zipcode">Zipcode</Form.Label>
                <Form.Control
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formValues.zipcode || ''}
                  onChange={handleInputChange("zipcode")}
                  onKeyDown={(e) => handleInputKeyDown(e, "zipcode")}
                  onKeyPress={(e) => {
                    if (formValues.zipcode && formValues.zipcode.length >= 7) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.zipcode && (
                  <div className="error-message">{errors.zipcode}</div>
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
                  id="email"
                  name="email"
                  aria-describedby="EmailHelpBlock"
                  value={user?.email}
                  readOnly
                  onChange={handleInputChange("email")}
                  onKeyDown={(e) => handleInputKeyDown(e, "email")}
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </Col>
             
              </Row>
              </div>

              <Col sm={12} className="profile-submit">
                <button className="custom-btn btn-3 " disabled={loading}>
                  <span style={{ marginRight: loading ? '5px' : '0' }}> Save </span>{" "}
                  {loading && (
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
