import React, { useState } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import { styled } from "styled-components";
import { FaXmark } from "react-icons/fa6";
import CurrencyInput from 'react-currency-input-field';
import Swal from "sweetalert2";
import { TailSpin } from "react-loader-spinner";
import { manuallyEnterScanItem } from "../../utils/API/scan";
import { formatDateInNumber } from "../../utils/common";
import { ManuallyEnterItemSchema } from "../../utils/validations";
import { useFormik } from "formik";

 
const ManuallyEnterItem = ({ userId, setDisableNewBatch, setPaginationKey, setBatchNumber, setKeys, setLoadData, setStartDate, onClose, setScanHistory }) => {
  const formik = useFormik({
    initialValues: {
      identifier: "",
      title: "",
      price: 0,
      description: "",
      quantity: 1
    },
    validationSchema: ManuallyEnterItemSchema,
    onSubmit: async (values) => {
      const response = await manuallyEnterScanItem(values, userId);

      if (response.status == 201) {
        setStartDate(new Date());
        const groupedScanHistory = response.data.data;
        if (groupedScanHistory.length != 0) {
          if ("0" in groupedScanHistory) {
            setDisableNewBatch(false);
          }
          const formattedDate = formatDateInNumber(new Date());
          const firstKey = Object.keys(groupedScanHistory)[0];
          const keysWithFormattedDate = Object.keys(groupedScanHistory).map(key => formattedDate + key);
          setLoadData(groupedScanHistory);
          setKeys(keysWithFormattedDate);
          setBatchNumber(keysWithFormattedDate[0]);
          setPaginationKey((prevKey) => prevKey + 1);
          setScanHistory(groupedScanHistory[firstKey]);
        }
        else {
          setScanHistory([]);
        }
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Item is added in the manifest",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn",
          },
        }).then(() => {
          onClose();
        }).catch((error) => {
          console.log(error, 'errorr')
        })
      } else {
        console.log(response.data.message, 'error');
      }
    }
  });


  const plusHandler = (event) => {
    formik.handleChange(event);
    const currentQuantity = formik.values.quantity;
    const newQuantity = Math.min(currentQuantity + 1, 100);
    formik.setFieldValue('quantity', newQuantity);
    formik.setFieldTouched('quantity', true);
  };

  const minHandler = (event) => {
    formik.handleChange(event);
    const currentQuantity = formik.values.quantity;
    const newQuantity = Math.max(currentQuantity - 1, 1);
    formik.setFieldValue('quantity', newQuantity);
    formik.setFieldTouched('quantity', true);
  };



  return (
    <Wrapper className="manually-section">
      <Container>
        <Row className="justify-content-center">
          <Col sm={6}>
            <div className="items-row p-4">
              <Col sm={12}>
                <h2>Manually Enter item</h2>
                <button className="close-btn" onClick={onClose}>
                  <FaXmark />
                </button>
              </Col>
              <form onSubmit={formik.handleSubmit}>
                <Row>
                  <Form.Group className="mb-2 col" controlId="formBasic">
                    <Form.Label>Identifier </Form.Label>
                    <Form.Control
                      type="text"
                      name="identifier"
                      placeholder="Identifier"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.identifier && formik.errors.identifier && <p className=" text-start error-message">{formik.errors.identifier}</p>}
                  </Form.Group>

                  <Form.Group className="mb-2 col" controlId="formBasic">
                    <Form.Label>Title </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Title"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.title && formik.errors.title && <p className=" text-start error-message">{formik.errors.title}</p>}
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-2 col" controlId="formBasic">
                    <label className="mb">Qty</label>
                    <div className="counter">
                      <button onClick={minHandler} className="btn">
                        -
                      </button>{" "}
                      <div className="value">

                        <input
                          type="text"
                          className="value"
                          name='quantity'
                          value={formik.values.quantity}
                          onChange={(e) => {
                            formik.handleChange(e);
                            const newQuantity = e.target.value;
                            if (!isNaN(newQuantity) && newQuantity >= 0 && newQuantity <= 100) {
                              formik.setFieldValue('quantity', newQuantity);
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />
                      </div>
                      <button onClick={plusHandler} className="btn">
                        +
                      </button>
                    </div>
                    {formik.touched.quantity && formik.errors.quantity && <p className=" text-start error-message">{formik.errors.quantity}</p>}

                  </Form.Group>
                  <Form.Group className="mb-2 col" controlId="formBasic">
                    <Form.Label>Price </Form.Label>

                    <CurrencyInput
                      className="form-control"
                      prefix="$"
                      name="price"
                      decimalsLimit={2}
                      allowNegativeValue={false}
                      defaultValue={0}
                      value={formik.values.price}
                      onValueChange={(value) => {
                        if (value == undefined) {
                          formik.setFieldValue('price', 0);
                        } else if (value <= 10000) {
                          formik.setFieldValue('price', value);
                        }
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.price && formik.errors.price && <p className=" text-start error-message">{formik.errors.price}</p>}
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" controlId="formBasic">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.description && formik.errors.description && <p className=" text-start error-message">{formik.errors.description}</p>}
                  </Form.Group>
                </Row>
                <div className="dblock">
                  <Button
                    variant="primary"
                    type="submit"
                    className="custom-btn btn-3 main-btns"
                    disabled={formik.isSubmitting}
                  >
                    <span>Submit{" "} {formik.isSubmitting && (
                      <TailSpin color="#fff" height={18} width={18} />
                    )}</span>
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={onClose}
                    className="custom-btn secondary btn-3"
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
};

export default ManuallyEnterItem;

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

    button{
      width:auto;
      span{
        display:flex;
      }
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
      padding: 6px;
      display: flex;
      align-items: center;
      border-radius: 10px;
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
  .dblock svg {
    margin-left: 10px;
}
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    .items-row{
      width: 90%;
      h2{
        font-size: 24px;
      }
    }
    .dblock{disply:block;}
  }
`;