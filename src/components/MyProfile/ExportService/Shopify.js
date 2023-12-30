import React, { useState, useEffect } from "react";
import { Col, Row, Form } from 'react-bootstrap';
import shopify from '../../../assets/images/shopify.png';
import { TailSpin } from "react-loader-spinner";
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { getShopifyData, saveShopifyData } from "../../../utils/API/accountSetting";

const Shopify = ({ user, setOption, optionData, handleOptionChange, accessToken }) => {
    const dispatch = useDispatch();
    const [shopifyLoading, setShopifyLoading] = useState(false);

    const [formData, setFormData] = useState({
        shopify_url: '',
        access_token: '',
    });

    const [errorMessage, setErrorMessage] = useState({
        shopify_url: '',
        access_token: ''
    });

    useEffect(async () => {
        const response = await getShopifyData(user.id, accessToken);
        if (response.status == 200) {
            setFormData(response.data.data);
        } else {
            console.error('API Error:', response);
        }
    }, []);

    const validateField = (name, value) => {
        const validationMessages = {
            shopify_url: 'Shopify Url is required',
            access_token: 'Access Token is required',
        };
        return value.trim() === '' ? validationMessages[name] : '';
    }

    const handleShopifyChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrorMessage((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    }

    const handleShopifySubmit = async (e) => {
        e.preventDefault();

        if (optionData.shopify == 'enable') {
            const fields = ["shopify_url", "access_token"];
            const newFormErrors = {};
            fields.forEach((field) => {
                newFormErrors[field] = validateField(field, formData[field]);
            });
            setErrorMessage(newFormErrors);

            if (
                newFormErrors.shopify_url ||
                newFormErrors.access_token
            ) {
                return;
            }
        }

        setShopifyLoading(true);
        // Make a POST request to the API endpoint
        const response = await saveShopifyData(formData, optionData.shopify, user.id, accessToken);
        if (response.status === 201) {
            setShopifyLoading(false);
            dispatch(setOption(optionData));
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Shopify update successfully.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn',
                },
            });
        } else if (response.status === 401) {
            setShopifyLoading(false);
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
        else if (response.status === 200) {
            setShopifyLoading(false);
            dispatch(setOption(optionData));
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Shopify Disable successfully.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn',
                },
            });
        }
        else {
            setShopifyLoading(false);
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
            <div className=" col-sm-12">
                <div className="profile-sec">
                    <div className="tp-label"><img src={shopify} alt="Shopify" /><span>Shopify</span></div>
                    <Form.Check
                        inline
                        label="Enable"
                        name="shopify"
                        type="radio"
                        id="shopifyEnable"
                        htmlFor="shopifyEnable"
                        value="enable"
                        checked={optionData.shopify === 'enable'}
                        onChange={handleOptionChange}
                    />
                    <Form.Check
                        inline
                        label="Disable"
                        name="shopify"
                        type="radio"
                        id="shopifyDisable"
                        htmlFor="shopifyDisable"
                        value="disable"
                        checked={optionData.shopify === 'disable'}
                        onChange={handleOptionChange}
                    />
                    <Row>
                        {optionData.shopify === 'disable' ? '' :
                            <>
                                <Col sm={6}>
                                    <Form.Label htmlFor="inputText">Shopify Url</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="shopify_url"
                                        name="shopify_url"
                                        aria-describedby="textHelpBlock"
                                        value={formData.shopify_url}
                                        onChange={handleShopifyChange}
                                    />
                                    {errorMessage.shopify_url && <p className="text-start error-message">{errorMessage.shopify_url}</p>}
                                </Col>
                                <Col sm={6}>
                                    <Form.Label htmlFor="inputText">
                                        Access Token
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="access_token"
                                        name="access_token"
                                        aria-describedby="textHelpBlock"
                                        value={formData.access_token}
                                        onChange={handleShopifyChange}
                                    />
                                    {errorMessage.access_token && <p className="text-start error-message">{errorMessage.access_token}</p>}
                                </Col>
                            </>
                        }
                        <div className="mt-3 col-sm-12 ">
                            <button type='button' onClick={handleShopifySubmit} disabled={shopifyLoading} className="custom-btn btn-3">
                                <span>Save</span>{" "}
                                {shopifyLoading && (
                                    <TailSpin color="#fff" height={20} width={20} />
                                )}
                            </button>
                        </div>
                    </Row>

                </div>
            </div>
        </>
    );
}

export default Shopify;
