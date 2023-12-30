import React, { useState } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { styled } from "styled-components";
import { FaXmark } from "react-icons/fa6";
import CurrencyInput from 'react-currency-input-field';
import { TailSpin } from "react-loader-spinner";
import { formatDate } from "../../utils/common"; 
import { scanEditing } from "../../utils/API/scan";

const EditScanHistory = ({user,startDate,onClose,batchNumber ,record, setScanHistory ,setIsEdit}) => {
    const [loading, setLoading] = useState(false);
    const [errorApi, setErrorApi] = useState('');
    
    const [formData, setFormData] = useState({
        identifier: record.scan_id,
        title: record.title,
        price: record.price,
        quantity: record.qty
    })

    const [error, setErrors] = useState({
        title: '',
        price: '',
        quantity: ''
    })

    const handleFieldChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: validateField(field, value),
        }));
    }

    const validateField = (field, value) => {
        const requiredFields = ['identifier', 'title', 'price','quantity'];
        if (field == 'price' && value == 0) {
            return `${field[0].toUpperCase()}${field.slice(1)} is required.`;
        }
        else if (field === 'quantity' && value === 0 || value == '') {
            return `${field[0].toUpperCase()}${field.slice(1)} should be required.`;
        }
        else if (field != 'quantity' && requiredFields.includes(field) && value.trim() === '') {
            return `${field[0].toUpperCase()}${field.slice(1)} is required.`;
        }
        if (field === 'price' && isNaN(value)) {
            return 'Price must be a valid number.';
        }
        return '';
    }

    const handleInputKeyDown = (e) => {
        if (e.key === " " && e.target.selectionStart === 0) {
            e.preventDefault();
        }
    }

    const plusHandler = (event) => {
        event.preventDefault();
        if (formData.quantity < 100) {
            setFormData({
                ...formData,
                quantity: formData.quantity + 1,
              });
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            quantity: validateField('quantity', formData.quantity+1),
          }));
    }

    const minHandler = (event) => {
        event.preventDefault();
        if (formData.quantity > 0) {
            setFormData({
              ...formData,
              quantity: formData.quantity - 1,
            });
            setErrors((prevErrors) => ({
              ...prevErrors,
              quantity: validateField('quantity', formData.quantity-1),
            }));
          }
          
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fields = ["identifier", "title", "price","quantity"];
        const newFormErrors = {};
        fields.forEach((field) => {
            newFormErrors[field] = validateField(field, formData[field]);
        });
        setErrors(newFormErrors);

        if (
            newFormErrors.identifier ||
            newFormErrors.title ||
            newFormErrors.price ||
            newFormErrors.quantity
        ) {
            return;
        }
        setLoading(true);
        const response = await scanEditing(formatDate(startDate),formData,user.id);
        if(response.status==200){
            setErrorApi('');
            const groupedScanHistory = response.data.data;
            setLoading(false);
            setIsEdit(true);
            setScanHistory(groupedScanHistory[batchNumber.substring(8)]);
            onClose();
        }else
        {
            setLoading(false);
            setErrorApi(response.data.message);
            setTimeout(() => {
                setErrorApi('');
            }, 3000);
        }

    } 

    const handleQuantityChange = (event) => {
        const newQuantity = event.target.value;
        if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity <= 100) {
          setFormData({
            ...formData,
            quantity: newQuantity
          });
      
        } 
        setErrors((prevErrors) => ({
          ...prevErrors,
          quantity: validateField('quantity', newQuantity),
        }));
    }

    return (
        <Wrapper className="manually-section">
            <Container>
                <Row className="justify-content-center">
                    <Col sm={6}>
                        <div className="items-row p-3 p-sm-5">
                            <Col sm={12}>
                                <h2>Edit Scan</h2>
                                <button className="close-btn" onClick={onClose}>
                                    <FaXmark />
                                </button>
                            </Col>
                            {errorApi && <div><p className="error-message">{errorApi}</p></div>}
                            <form onSubmit={handleSubmit}>
                            <Row>
                                <Form.Group className="mb-2 col" controlId="formBasic">
                                    <Form.Label>Identifier </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="identifier"
                                        placeholder="Identifier"
                                        value={formData.identifier}
                                        onChange={(e) => handleFieldChange('identifier', e.target.value)}
                                        onKeyDown={handleInputKeyDown}
                                        readOnly
                                    />
                                    {error.identifier && <p className=" text-start error-message">{error.identifier}</p>}
                                </Form.Group>

                                <Form.Group className="mb-2 col" controlId="formBasic">
                                    <Form.Label>Title </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Title"
                                        value={formData.title}
                                        onChange={(e) => handleFieldChange('title', e.target.value)}
                                        onKeyDown={handleInputKeyDown}
                                    />
                                    {error.title && <p className=" text-start error-message">{error.title}</p>}
                                </Form.Group>
                                </Row>
                                <Form.Group className="mb-2" controlId="formBasic">
                                    <label className="mb-2">Qty</label>
                                    <div className="counter">
                                        <button onClick={minHandler} className="btn">
                                            -
                                        </button>{" "}
                                        <div className="value">
                                            <input
                                                type="text"
                                                className="value"
                                                value={formData.quantity}
                                                onChange={handleQuantityChange}
                                            />  
                                        </div>
                                        <button onClick={plusHandler} className="btn">
                                            +
                                        </button>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasic">
                                    <Form.Label>Price </Form.Label>
                                    <CurrencyInput
                                        className="form-control"
                                        prefix="$"
                                        name="price"
                                        decimalsLimit={2}
                                        allowNegativeValue={false}
                                        defaultValue={0}
                                        onValueChange={(value) => {
                                            if (value == undefined) {
                                                handleFieldChange('price', 0);
                                            }
                                            if (value <= 1000) {
                                                handleFieldChange('price', value)
                                            }
                                        }}
                                        value={formData.price}
                                        onKeyDown={handleInputKeyDown}
                                    />
                                    {error.price && <p className=" text-start error-message">{error.price}</p>}
                                </Form.Group>
                              
                                <div className="dblock">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="custom-btn btn-3 d-flex"
                                    >
                                        <span>Submit</span>{" "}
                                        {loading && (
                                            <TailSpin color="#fff" height={18} width={18} />
                                        )}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        onClick={onClose}
                                        className="custom-btn btn-3 secondary"
                                    >
                                        <span>Cancel</span>
                                    </Button>
                                    
                                </div>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Wrapper>
    );
}

export default EditScanHistory;


// Styled component named StyledButton
const Wrapper = styled.div`
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  z-index: 9;
  height: 100%;
  .items-row button.close-btn{
   border-radius:4px;
  svg{
    width: 0.555em;
    position: absolute;
    top: 0;
    left:5px;
  }
  }
  h2 {
    padding: 0 0 1.25rem; 
  }
  .counter .value {
    border: none;
    outline: none;
}

  .items-row {
    box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.1);
    background: #fff;
    border-radius: 1.25rem;
    position: absolute;
    overflow: hidden;
    top: 50%;
    transform: translate(-50%,-50%);
    left: 50%;
    width: 530px;
    .custom-btn{width:auto;}
   .secondary{
    color: #4E4E4E;
    border: 1px solid #4E4E4E;
    &:hover{
      background:#4E4E4E;
      border:1px solid transparent;
      color:#fff;
    }
   }
   

    .dblock {
    display: flex;
    justify-content: center;
        svg{
            margin-left:10px;
        }
    }

    h2{
      padding: 0;
      margin-bottom: 26px;
      font-size: 30px;
    }

    p {
      font-weight: 600;
      line-height: 20px;
    }

    .counter {
      margin: 0 0 0.25rem; 
      align-items: center;
    }

    button.close-btn {
      position: absolute;
      right: 0.75rem;
      top: 0.875rem;
      font-size: 1.5rem;
      background: #e99714;
      width: 1.375rem;
      height: 1.375rem;
      text-align: center;
      color: #fff;
      border: none;

      input {
        margin: 0;
      }
    }

    .counter {
      display: flex;

      .btn {
        background-color: #e99714;
        color: #fff;
        padding: 0.375rem 0.75rem;
        border: none;
        font-family: "Poppins", sans-serif;
        font-weight: 500;
        border-radius: 0.125rem; 
        line-height: 1.375rem; 
        font-size: 1.375rem;
      }

      .value {
        padding: 0.375rem 0;
        width: 1.875rem; 
        text-align: center;
      }
    }
  }

  label {
    font-weight: 600;
    width: 100%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    .items-row{
      width: 90%;
      h2{
        font-size: 24px;
      }
    }
  }
`;