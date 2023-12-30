import React, { useState, useEffect } from "react";
import ebay from '../../../assets/images/ebay2.png';
import { Col, Row, Form } from 'react-bootstrap';
import { TailSpin } from "react-loader-spinner";
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setOption } from "../../../redux/slices/accountSlice";
import { saveEbayData, getEbayData } from "../../../utils/API/accountSetting";

const Ebay = ({ optionData, handleOptionChange, user, accessToken }) => {
    const dispatch = useDispatch();
    const [ebayLoading, setEbayLoading] = useState(false);
    const [ebayData, setEbayData] = useState({
        client_id: '',
        client_secret: '',
        redirect_uri: ''
    });
    const [errorMessage, setErrorMessage] = useState({
        client_id: '',
        client_secret: '',
        redirect_uri: ''
    });

    useEffect(async () => {
        const ebayResponse = await getEbayData(user.id, accessToken);
        if (ebayResponse.status == 200) {
            setEbayData(ebayResponse.data.data);
        } else {
            console.error('API Error:', ebayResponse);
        }
    }, []);

    const validateField = (name, value) => {
        const validationMessages = {
            client_id: 'Client ID is required',
            client_secret: 'Client Secret is required',
            redirect_uri: 'Redirect URI is required',
        };
        return value.trim() === '' ? validationMessages[name] : '';
    }

    const handleEbayChange = (e) => {
        const { name, value } = e.target;
        setEbayData({
            ...ebayData,
            [name]: value,
        });
        setErrorMessage((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    }

    const handleEbaySubmit = async (e) => {
        e.preventDefault();
        if (optionData.ebay == 'enable') {
            const fields = ["client_id", "client_secret", "redirect_uri"];
            const newFormErrors = {};
            fields.forEach((field) => {
                newFormErrors[field] = validateField(field, ebayData[field]);
            });
            setErrorMessage(newFormErrors);

            if (
                newFormErrors.client_id ||
                newFormErrors.client_secret ||
                newFormErrors.redirect_uri
            ) {
                return;
            }
        }

        setEbayLoading(true);
        const response = await saveEbayData(ebayData, optionData.ebay, user.id, accessToken);
        if (response.status === 201) {
            dispatch(setOption(optionData));
            window.location.href = response.data.url;
        }
        else if (response.status === 200) { 
            setEbayLoading(false);
            dispatch(setOption(optionData));
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Ebay Disable successfully.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn',
                },
            });
        } else if (response.status === 401) {
            setEbayLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: response.data.message,
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn',
                },
            });
        }
        else {
            setEbayLoading(false);
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
        <div className=" col-sm-12">
            <div className="profile-sec">
                <div className="tp-label"><img src={ebay} alt="ebay" /><span>eBay</span></div>
                <Form.Check
                    inline
                    label="Enable"
                    name="ebay"
                    type="radio"
                    id="enableRadio"
                    htmlFor="enableRadio"
                    value="enable"
                    checked={optionData.ebay === 'enable'}
                    onChange={handleOptionChange}
                />
                <Form.Check
                    inline
                    label="Disable"
                    name="ebay"
                    type="radio"
                    id="disableRadio"
                    htmlFor="enableRadio"
                    value="disable"
                    checked={optionData.ebay === 'disable'}
                    onChange={handleOptionChange}
                />

                {optionData.ebay === 'disable' ? '' :
                    <>
                        <Row>
                            <Col sm={6}>
                                <Form.Label htmlFor="inputText">Client Id</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="client_id"
                                    name="client_id"
                                    aria-describedby="textHelpBlock"
                                    value={ebayData?.client_id}
                                    onChange={handleEbayChange}
                                />
                                {errorMessage.client_id && <p className="text-start error-message">{errorMessage.client_id}</p>}
                            </Col>
                            <Col sm={6}>
                                <Form.Label htmlFor="inputText">
                                    Client Secret
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    id="client_secret"
                                    name="client_secret"
                                    aria-describedby="textHelpBlock"
                                    value={ebayData?.client_secret}
                                    onChange={handleEbayChange}
                                />
                                {errorMessage.client_secret && <p className="text-start error-message">{errorMessage.client_secret}</p>}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <Form.Label htmlFor="inputText">Redirect Uri</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="redirect_uri"
                                    name="redirect_uri"
                                    aria-describedby="textHelpBlock"
                                    value={ebayData?.redirect_uri}
                                    onChange={handleEbayChange}
                                />
                                {errorMessage.redirect_uri && <p className="text-start error-message">{errorMessage.redirect_uri}</p>}
                            </Col>
                        </Row>
                    </>
                }

                <div className="mt-3 col-sm-12 ">
                    <button type='button' onClick={(e) => handleEbaySubmit(e, 'ebay', optionData.ebay)} className="custom-btn btn-3">
                        <span>Save</span>{" "}
                        {ebayLoading && (
                            <TailSpin color="#fff" height={20} width={20} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Ebay;