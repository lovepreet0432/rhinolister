import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Form } from 'react-bootstrap';
import { setOption } from './../../redux/slices/accountSlice';
import { TailSpin } from "react-loader-spinner";
import Swal from 'sweetalert2';
import styled from "styled-components";
import Hibid from './ExportService/Hibid';
import Shopify from './ExportService/Shopify';
import { saveServices } from '../../utils/API/accountSetting';
import what from '../../assets/images/what.png';
import Ebay from './ExportService/Ebay';

const AccountSetting = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const access_token = useSelector((state) => state.auth.token);
  const options = useSelector((state) => state.accounts);
  const [optionData, setOptionData] = useState({});
  const [current, setCurrent] = useState('');
  const [errorMessage, setErrorMessage] = useState({});

  useEffect(() => {
    setOptionData({ ...options });
  }, [options]);

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptionData({ ...optionData, [name]: value });
  }

  const handleAccountSaves = async (event, exportName, exportValue) => {
    event.preventDefault();
    setCurrent(exportName);
    const response = await saveServices(exportName, exportValue, user.id, access_token);
    if (response.status === 200) {
      setCurrent('');
      dispatch(setOption(optionData));
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Data saved successfully.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn',
        },
      });
    }
    else {
      setCurrent('');
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong please try again.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn',
        },
      });
    }
  }

  return (
    <>
      <Wrapper>
        <div className="accountsetting">
          <Row>
            <Col sm="12">
              <div className="account-setting">
                <Form className="row">
                  {/* Shopify */}
                  <Shopify
                    optionData={optionData}
                    user={user}
                    setOption={setOption}
                    setOptionData={setOptionData}
                    handleOptionChange={handleOptionChange}
                    accessToken={access_token}
                  />
                  {/* eBay */}
                  <Ebay
                    optionData={optionData}
                    handleOptionChange={handleOptionChange}
                    user={user}
                    accessToken={access_token}
                  />

                  {/* Whatnot */}
                  <div className=" col-sm-12">
                    <div className="profile-sec">
                      <div className="tp-label"><img src={what} alt="what" /><span>WhatNot</span></div>
                      <Form.Check
                        inline
                        label="Enable"
                        name="whatnot"
                        type="radio"
                        id="whatnotEnable"
                        htmlFor="whatnotEnable"
                        value="enable"
                        checked={optionData.whatnot === 'enable'}
                        onChange={handleOptionChange}
                      />
                      <Form.Check
                        inline
                        label="Disable"
                        name="whatnot"
                        type="radio"
                        id="whatnotDisable"
                        htmlFor="whatnotDisable"
                        value="disable"
                        checked={optionData.whatnot === 'disable'}
                        onChange={handleOptionChange}
                      />
                      <div className="mt-3 col-sm-12 ">
                        <button type='button' onClick={(e) => handleAccountSaves(e, 'whatnot', optionData.whatnot)} className="custom-btn btn-3">
                          <span>Save</span>{" "}
                          {current == 'whatnot' && (
                            <TailSpin color="#fff" height={20} width={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hi-Bid */}
                  <Hibid
                    user={user}
                    setOption={setOption}
                    optionData={optionData}
                    handleOptionChange={handleOptionChange}
                    errorMessage={errorMessage}
                    setOptionData={setOptionData}
                    setErrorMessage={setErrorMessage}
                    accessToken={access_token}
                  />

                  {/* Manifest */}
                  <div className=" col-sm-12">
                    <div className="profile-sec">
                      <div className="tp-label">Manifest</div>
                      <Form.Check
                        inline
                        label="Enable"
                        name="manifest"
                        type="radio"
                        id="manifestEnable"
                        htmlFor="manifestEnable"
                        value="enable"
                        checked={optionData.manifest === 'enable'}
                        onChange={handleOptionChange}
                      />
                      <Form.Check
                        inline
                        label="Disable"
                        name="manifest"
                        type="radio"
                        id="manifestDisable"
                        htmlFor="manifestDisable"
                        value="disable"
                        checked={optionData.manifest === 'disable'}
                        onChange={handleOptionChange}
                      />
                      <div className="mt-3 col-sm-12 ">
                        <button type='button' onClick={(e) => handleAccountSaves(e, 'manifest', optionData.manifest)} className="custom-btn btn-3">
                          <span>Save</span>{" "}
                          {current == 'manifest' && (
                            <TailSpin color="#fff" height={20} width={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
      </Wrapper>
    </>
  );
};

export default AccountSetting;


const Wrapper = styled.section`
.tp-label{
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img{
    order:2;
    width:60px;
  }
}
button{
  display: flex;
  margin: 0;
  svg {
    margin-left: 10px;
}
}
`;