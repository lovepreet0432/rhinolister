import React, { useState } from "react";
import { Col, Row, Form, Button } from "react-bootstrap";
import styled from "styled-components";
import axios from "axios";
import { API_BASE_URL } from "../../../Constants";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { useSelector,useDispatch } from 'react-redux';
import { useEffect } from "react";
import Swal from "sweetalert2";
import { setHomepage } from "../../../redux/slices/homeSlice";
import { TailSpin } from "react-loader-spinner";

const HomePage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    heading: '',
    content: '',
    scanContent: '',
    services: [
      { servicesHeading: '', servicesContent: '' }
    ],
    videoContent: '',
    shopify: [''],
    ebay: [''],
    hibid: [''],
    amazon: [''],
    whatnot: ['']
  });

  const [errors, setErrors] = useState({
    heading: '',
    content: '',
    scanContent: '',
    services: [
      { servicesHeading: '', servicesContent: '' }
    ],
    videoContent: '',
    shopify: [''],
    ebay: [''],
    hibid: [''],
    amazon: [''],
    whatnot: ['']
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  const access_token = useSelector((state) => state.auth.token);

  const validation = (field, value) => {

    //const validationRules = /^[A-Za-z,. ]+$/;
    
    if (!value || value === undefined) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  
    // if (typeof value !== "string" || !field || !value.match(validationRules)) {
    //   return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;
    // } else 
    if (
      (field === "content" ||
        field === "servicesContent" ||
        
        field === "videoContent" ||
       
        field === "scanContent" 
        ) &&
      value.length > 400
    ) {
      return `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } should not exceed 400 characters`;
    }else if ((
        field === "whatnot" ||
        field === "services" ||
        field === "heading" || field === "servicesHeading" ||
        field === "ebay" ||
        field === "amazon" ||
        field === "shopify" ||
        field === "hibid" ) &&
      value.length > 150
    ) {
      return `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } should not exceed 150 characters`;
    }
  
    return "";
  };



  // const validation = (field, value) => {
  //   console.log(field, typeof value,'sss')
  //   const validationRules = {
  //     scanContent: /^[A-Za-z ]+$/,
  //     content: /^[A-Za-z ]+$/,
  //     heading: /^[A-Za-z ]+$/,
  //     videoContent: /^[A-Za-z ]+$/,
  //     shopify: /^[A-Za-z ]+$/,
  //     ebay: /^[A-Za-z ]+$/,
  //     hibid: /^[A-Za-z ]+$/,
  //     amazon: /^[A-Za-z ]+$/,
  //     whatnot : /^[A-Za-z ]+$/,
  //     servicesContent : /^[A-Za-z ]+$/
  //   };
  
  //   if (!value || value === undefined) {
  //     return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
  //   }
 
  //   if (typeof value !== 'string' || !value.match(validationRules[field])) {
  //       return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`;
  //   }else if (
  //     (field === "content") &&
  //     value.length > 250
  //   ) {
  //     return `${field.charAt(0).toUpperCase() + field.slice(1)
  //       } should not exceed 250 characters`;
  //   }  else if (
  //     (field === "servicesContent" || field === "whatnot" || field === "videoContent" || field === "services" || field === "heading" || field === "ebay" || field === "scanContent" || field === "amazon" || field === "shopify" || field === "hibid") &&
  //     value.length > 100
  //   ) {
  //     return `${field.charAt(0).toUpperCase() + field.slice(1)
  //       } should not exceed 100 characters`;
  //   }

  //   return "";
  // };

  useEffect(()=>{ 
      // Make a GET request to retrieve the homepage data
      setDataLoading(true);
      axios.get(API_BASE_URL+'/admin-getHomepage', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${atob(access_token)}`
        }
      })
        .then((response) => {
          // Handle the successful response here
        const decodedData = {
          ...response.data.data,
          // Decode specific JSON fields
          services: response.data.data.services ? JSON.parse(response.data.data.services) : [],
          shopify: response.data.data.shopify ? JSON.parse(response.data.data.shopify) : [''],
          ebay: response.data.data.ebay ? JSON.parse(response.data.data.ebay) : [''],
          hibid: response.data.data.hibid ? JSON.parse(response.data.data.hibid) : [''],
          amazon: response.data.data.amazon ? JSON.parse(response.data.data.amazon) : [''],
          whatnot: response.data.data.whatnot ? JSON.parse(response.data.data.whatnot) : [''],
        };
        setDataLoading(false);
        // Set the formData state with the decoded data
        setFormData(decodedData);
        })
        .catch((error) => {
          setDataLoading(false);
          // Handle any errors that occur during the request
          console.error('Error:', error);
        });
  },[])

  // Check arrays for empty strings at each index
  const checkArray = (arrayName, newErrors) => {
    const featureErrors = [];
    formData[arrayName].forEach((value, index) => {
      if (value === '') {
        featureErrors[index] = `This is required`;
      }
    });

    // Check if there are any feature errors and add them to newErrors
    if (featureErrors.length > 0) {
      newErrors[arrayName] = featureErrors;
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    for (const key in formData) {
      if (formData[key] === '') {
        newErrors[key] = `${key} is required`;
      }
    }

    // Check services array for empty fields
    formData.services.forEach((service, index) => {
      if (service.heading === '') {
        newErrors[`services[${index}][heading]`] = `Service heading is required`;
      }
      if (service.servicesContent === '') {
        newErrors[`services[${index}][servicesContent]`] = `Service content is required`;
      }
    });

    checkArray('shopify', newErrors);
    checkArray('ebay', newErrors);
    checkArray('hibid', newErrors);
    checkArray('amazon', newErrors);
    checkArray('whatnot', newErrors);

  // Check if there are no errors
    if (Object.keys(newErrors).length === 0) {
      // No errors, make the API request
      setLoading(true);
      axios.post(API_BASE_URL+'/admin-homepage', formData,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${atob(access_token)}`
        }
      })
      .then(response => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your Homepage data is saved successfully.",
          customClass: {
            confirmButton: "btn",
          },
        }).then(() => {
              const decodedData = {
                ...response.data.data,
                // Decode specific JSON fields
                services: response.data.data.services ? JSON.parse(response.data.data.services) : [],
                shopify: response.data.data.shopify ? JSON.parse(response.data.data.shopify) : [''],
                ebay: response.data.data.ebay ? JSON.parse(response.data.data.ebay) : [''],
                hibid: response.data.data.hibid ? JSON.parse(response.data.data.hibid) : [''],
                amazon: response.data.data.amazon ? JSON.parse(response.data.data.amazon) : [''],
                whatnot: response.data.data.whatnot ? JSON.parse(response.data.data.whatnot) : [''],
              };
              // Set the formData state with the decoded data
              setFormData(decodedData);
              dispatch(setHomepage(decodedData));
        }).catch((error) => {
          setLoading(false);
        })
      })
      .catch(error => {
        // Handle the error response
        console.error('API Error:', error);
      });
    } else {
      // There are errors, update the errors state
      setErrors(newErrors);
    }
    // setErrors(newErrors);
  };

  // const handleChange = (event) => {
  //   const { id, value } = event.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [id]: value,
  //   }));

  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [id]: validation(id, value),
  //   }));
  // }

  const handleInputChange = (event, index, fieldName) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => {
      if (fieldName === "servicesHeading" || fieldName === "servicesContent") {

        const updatedServices = [...prevFormData.services];
        updatedServices[index][fieldName] = value;
  
        return {
          ...prevFormData,
          services: updatedServices,
        };
      } else {
        return {
          ...prevFormData,
          [id]: value,
        };
      }
    });
  
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (fieldName === "servicesHeading" || fieldName === "servicesContent") {
        newErrors[`services[${index}][${fieldName}]`] = validation(fieldName, value);
      } else {
        newErrors[id] = validation(id, value);
      }
      
      return newErrors;
    });
    
  };

  // const handleServiceChange = (event, index, fieldName) => {
  //   const { value } = event.target;

  //   setFormData((prevFormData) => {
  //     const updatedServices = [...prevFormData.services];
  //     updatedServices[index][fieldName] = value;

  //     return {
  //       ...prevFormData,
  //       services: updatedServices,
  //     };
  //   });

  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [`services[${index}][${fieldName}]`]: validation(fieldName, value),
  //   }));

  // }

  const addServiceRow = (e) => {
    e.preventDefault();
    if (formData.services.length < 5) {
      const newErrors = { ...errors };
      if (!newErrors.services) {
        newErrors.services = [{ heading: '', content: '' }];
      } else {
        newErrors.services.push({ heading: '', content: '' });
      }
      setFormData({
        ...formData,
        services: [...formData.services, { heading: '', content: '' }],
      });
      setErrors(newErrors);
    }
  };

  const removeServiceRow = (index) => {
    const updatedServices = [...formData.services];
    updatedServices.splice(index, 1);
    // Remove the corresponding error message when a service row is removed
    const newErrors = { ...errors };
    newErrors.services.splice(index, 1);
    setFormData({ ...formData, services: updatedServices });
    setErrors(newErrors);
  };

  const addFeature = (e, fieldName) => {
    e.preventDefault();
    if (formData[fieldName].length < 3) {
      const updatedFeatures = [...formData[fieldName]];
      updatedFeatures.push('');

      // Initialize or update the error message for the new feature
      const newErrors = { ...errors };
      if (!newErrors[fieldName]) {
        newErrors[fieldName] = [''];
      } else {
        newErrors[fieldName].push('');
      }

      setErrors(newErrors);
      setFormData({
        ...formData,
        [fieldName]: updatedFeatures,
      });
    }
  };

  const removeFeature = (index, fieldName) => {
    if (formData[fieldName].length > 1) {
      const updatedFeatures = [...formData[fieldName]];
      const newErrors = { ...errors };
      newErrors[fieldName].splice(index, 1);
      setErrors(newErrors);

      updatedFeatures.splice(index, 1);
      setFormData({
        ...formData,
        [fieldName]: updatedFeatures,
      });
    }
  };

  const handleFeatureChange = (value, index, fieldName) => {
    const updatedFeatures = [...formData[fieldName]];
    updatedFeatures[index] = value;

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (!newErrors[fieldName]) {
        newErrors[fieldName] = []; // Initialize the array if it doesn't exist
      }
      newErrors[fieldName][index] = validation(fieldName, value);
      return newErrors;
    });

    setFormData({
      ...formData,
      [fieldName]: updatedFeatures,
    });
  };

  if (dataLoading) {
    return (
      <div className="loader-container">
        <TailSpin height={40} width={40} />
      </div>
    );
  }

  
  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
      <div className="profile-sec">
        <Row>
        <Col sm={12} className="text-start"><h4>Home Banner</h4></Col>
        </Row>
        <Row>
          <Col sm={12} className="mb-3 text-start">
            <Form.Label htmlFor="heading">Heading</Form.Label>
            <Form.Control
              type="text"
              id="heading"
              value={formData.heading}
              onChange={handleInputChange}
              aria-describedby="NameHelpBlock"
            />
            {errors['heading'] && (
              <div className="error-message">{errors['heading']}</div>
            )}
          </Col>
        </Row>
        <Row>
          <Col sm={12} className="mb-3 text-start">
            <Form.Label htmlFor="content">Content</Form.Label>
            <Form.Control
              as="textarea" // Set the "as" prop to "textarea"
              id="content"
              value={formData.content}
              onChange={handleInputChange}
              aria-describedby="NameHelpBlock"
            />
            {errors['content'] && (
              <div className="error-message">{errors['content']}</div>
            )}
          </Col>
        </Row>
        </div>

        <div className="profile-sec">
        <Row>
        <Col sm={12} className="text-start"> <h4>Scan Product</h4></Col>
        </Row>
        <Row>
          <Col sm={12} className="mb-3 text-start">
            <Form.Label htmlFor="scanContent">Content</Form.Label>
            <Form.Control
              type="textarea"
              id="scanContent"
              name="scanContent"
              value={formData.scanContent}
              onChange={handleInputChange}
            />
            {errors['scanContent'] && (
              <div className="error-message">{errors['scanContent']}</div>
            )}
          </Col>
        </Row>
        </div>


        <div className="profile-sec">
        <Col sm={12} className="text-start"><h4>Our Services</h4></Col>
          {formData.services.map((service, index) => (
            <Row key={index} className="btn-addon">
              <Col sm={5} className="mb-3 text-start">
                <Form.Label htmlFor={`servicesHeading${index}`}>Heading </Form.Label>
                <Form.Control
                  type="text"
                  id={`servicesHeading${index}`}
                  name={`servicesHeading${index}`}
                  value={formData.services[index].servicesHeading}
                  onChange={(e) => handleInputChange(e, index, 'servicesHeading')}
                />
                {errors[`services[${index}][servicesHeading]`] && (
                  <div className="error-message">{errors[`services[${index}][servicesHeading]`]}</div>
                )}
              </Col>
              <Col sm={6} className="mb-3 text-start">
                <Form.Label htmlFor={`servicesContent${index}`}>Content </Form.Label>
                <Form.Control
                  type="text"
                  id={`servicesContent${index}`}
                  value={service.servicesContent}
                  onChange={(e) => handleInputChange(e, index, 'servicesContent')}
                />
                {errors[`services[${index}][servicesContent]`] && (
                  <div className="error-message">{errors[`services[${index}][servicesContent]`]}</div>
                )}
              </Col>
              <Col sm={1} style={{ minHeight: "52px" }}>
                <Form.Label></Form.Label>
                {formData.services.length > 1 && (
                  <button onClick={() => removeServiceRow(index)}><FaCircleMinus /></button>
                )}
              </Col>
            </Row>
          ))}
          {formData.services.length < 5 && (
            <button onClick={addServiceRow} className="add-btn"><FaCirclePlus /></button>
          )}
        </div>

        <div className="profile-sec">
        <Row>
        <Col sm={12} className="text-start"> <h4>Video Content</h4></Col>
        </Row>
        <Row>
          <Col sm={12} className="mb-3 text-start pb-4">
            <Form.Label htmlFor="servicesHeading">Content</Form.Label>
            <Form.Control
              type="textarea"
              id="videoContent"
              value={formData.videoContent}
              onChange={handleInputChange}
            />
            {errors['videoContent'] && (
              <div className="error-message">{errors['videoContent']}</div>
            )}
          </Col>
        </Row>
</div>


<div className="profile-sec">
        <Row>
          <Col sm={12}><h4>Integrations</h4></Col>
          <Col sm={6}>
            <div className="pb-4">
              <h6>Shopify Features</h6>
              <ul className="list-ui">
                {formData.shopify.map((feature, index) => (
                  <>
                    <li key={index}>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(e.target.value, index, 'shopify')}
                      />

                      {formData.shopify.length > 1 && (
                        <button onClick={() => removeFeature(index, 'shopify')}><FaCircleMinus /></button>
                      )}

                    </li>
                    {errors['shopify'] && errors['shopify'][index] && (
                      <div className="error-message">{errors['shopify'][index]}</div>
                    )}
                  </>
                ))}
              </ul>
              {formData.shopify.length < 3 && (
                <button onClick={(e) => addFeature(e, 'shopify')} className="plus-btn"><FaCirclePlus /></button>
              )}
            </div>
          </Col>

          <Col sm={6}>
            <div className="pb-4">
              <h6>Ebay Features</h6>
              <ul className="list-ui">
                {formData.ebay.map((feature, index) => (
                  <>
                    <li key={index}>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(e.target.value, index, 'ebay')}
                      />
                      {formData.ebay.length > 1 && (
                        <button onClick={() => removeFeature(index, 'ebay')}><FaCircleMinus /></button>
                      )}
                    </li>
                    {errors['ebay'] && errors['ebay'][index] && (
                      <div className="error-message">{errors['ebay'][index]}</div>
                    )}
                  </>
                ))}
              </ul>
              {formData.ebay.length < 3 && (
                <button onClick={(e) => addFeature(e, 'ebay')} className="plus-btn"><FaCirclePlus /></button>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="pb-4">
              <h6>Hibid Features</h6>
              <ul className="list-ui">
                {formData.hibid.map((feature, index) => (
                  <>
                    <li key={index}>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(e.target.value, index, 'hibid')}
                      />
                      {formData.hibid.length > 1 && (
                        <button onClick={() => removeFeature(index, 'hibid')}><FaCircleMinus /></button>
                      )}
                    </li>
                    {errors['hibid'] && errors['hibid'][index] && (
                      <div className="error-message">{errors['hibid'][index]}</div>
                    )}
                  </>
                ))}
              </ul>
              {formData.hibid.length < 3 && (
                <button onClick={(e) => addFeature(e, 'hibid')} className="plus-btn"><FaCirclePlus /></button>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="pb-4">
              <h6>Amazon Features</h6>
              <ul className="list-ui">
                {formData.amazon.map((feature, index) => (
                  <>
                    <li key={index}>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(e.target.value, index, 'amazon')}
                      />
                      {formData.amazon.length > 1 && (
                        <button onClick={() => removeFeature(index, 'amazon')}><FaCircleMinus /></button>
                      )}
                    </li>
                    {errors['amazon'] && errors['amazon'][index] && (
                      <div className="error-message">{errors['amazon'][index]}</div>
                    )}
                  </>
                ))}
              </ul>
              {formData.amazon.length < 3 && (
                <button onClick={(e) => addFeature(e, 'amazon')} className="plus-btn"><FaCirclePlus /></button>
              )}
            </div>
          </Col>
          <Col sm={6}>
            <div className="pb-4">
              <h6>whatnot Features</h6>
              <ul className="list-ui">
                {formData.whatnot.map((feature, index) => (
                  <>
                    <li key={index}>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(e.target.value, index, 'whatnot')}
                      />
                      {formData.whatnot.length > 1 && (
                        <button onClick={() => removeFeature(index, 'whatnot')}><FaCircleMinus /></button>
                      )}
                    </li>
                    {errors['whatnot'] && errors['whatnot'][index] && (
                      <div className="error-message">{errors['whatnot'][index]}</div>
                    )}
                  </>
                ))}

              </ul>
              {formData.whatnot.length < 3 && (
                <button onClick={(e) => addFeature(e, 'whatnot')} className="plus-btn"><FaCirclePlus /></button>
              )}
            </div>
          </Col>


        </Row>
        </div>
        <div className="text-center">
        {/* <Button type="submit" className="custom-btn btn-3">
          <span>Submit</span>
        </Button> */}
        <Button type="submit" className="custom-btn btn-3 mb-2" disabled={loading}>
                    <span className="d-flex align-items-center" style={{ marginRight: "10px" }}>Submit</span>  {" "}{loading && (
                      <TailSpin color="#fff" height={18} width={18} />
                    )}
        </Button>
        </div>
      </Form>
    </Wrapper>
  );
};
export default HomePage;
const Wrapper = styled.section`
form button {
  background: #6f6c6c;
  border: navajowhite;
  border-radius: 20px;
  padding: 5px 15px;
  color: #fff;
  font-weight: 500;
}
.btn-addon button {
  margin-top: 30px;
}
.video-here {
  margin-top: 20px;
}
ul.list-ui {
  padding: 0;
  li {
    list-style: none;
    margin-bottom: 15px;
    display:flex;
  }
  input{
    width: 100%;
    outline: none;
    border: var(--bs-border-width) solid var(--bs-border-color);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    border-radius: var(--bs-border-radius);
  }
  button{
    border-radius: 4px;
    padding:0;
    width:42px;
    margin-left: 10px;
}

}
.btn{margin:0 auto !important; padding:7px 30px;background-color: #E99714; border:1px solid #E99714;}
.btn-addon{
  button{
    border-radius: 4px;
    padding: 0;
    width: 35px;
    margin-left: 10px;
    text-align: center;
    height: 35px;
    margin-top: 8px;
  }
}
.add-btn{
    border-radius: 4px;
    padding: 0;
    width: 35px;
    text-align: center;
    height: 35px;

} 
.plus-btn{
  border-radius: 4px;
  padding: 0;
  width: 35px;
  text-align: center;
  height: 35px;
}

@media (max-width: ${({ theme }) => theme.breakpoints.small}){
  .service-row{
    position: relative;
    .add-btn{
      right: 0;
       bottom: 21px;
       position: absolute;
    }
  }
  .btn-addon{
    position:relative;
    button{
      margin-left: 0;
      text-align: center;
      height: 35px;
      margin-top: 0;
      margin-bottom:20px;
      
    }
  }
}

`;


