import React, { useState } from "react";
import { Col, Row, Form } from 'react-bootstrap';
import hibid from '../../../assets/images/hibid.png';
import Swal from 'sweetalert2';
import { TailSpin } from "react-loader-spinner";
import { useDispatch } from 'react-redux';
import { saveHibidData } from "../../../utils/API/accountSetting";

const Hibid = ({ user, setOption, optionData, handleOptionChange, errorMessage, setOptionData, setErrorMessage, accessToken }) => {
    const dispatch = useDispatch();
    const [hibidLoading, setHibidLoading] = useState(false);

    const validateField = (name, value) => {
        const validationMessages = {
            seller: 'Seller is required',
            sellerCode: 'Seller Code is required',
        };

        return value.trim() === '' ? validationMessages[name] : '';
    };

    const handleHibidChange = (e) => {
        const { name, value } = e.target;
        setOptionData({
            ...optionData,
            [name]: value,
        });
        setErrorMessage((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value),
        }));
    }


    const handleHibidSubmit = async (e) => {
        e.preventDefault();

        if (optionData.hibid == 'enable') {
            const fields = ["seller", "sellerCode"];
            const newFormErrors = {};
            fields.forEach((field) => {
                newFormErrors[field] = validateField(field, optionData[field]);
            });
            setErrorMessage(newFormErrors);
            if (
                newFormErrors.seller ||
                newFormErrors.sellerCode
            ) {
                return;
            }
        }

        setHibidLoading(true);

        const response = await saveHibidData(optionData, optionData.hibid, user.id, accessToken);
          
        if (response.status === 200) {
            setHibidLoading(false);
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
            setHibidLoading(false);
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
                    <div className="tp-label"><img src={hibid} alt="hibid" /><span>Hi-Bid</span></div>
                    <Form.Check
                        inline
                        label="Enable"
                        name="hibid"
                        type="radio"
                        value="enable"
                        id="hibidEnable"
                        htmlFor="hibidEnable"
                        checked={optionData.hibid === 'enable'}
                        onChange={handleOptionChange}
                    />
                    <Form.Check
                        inline
                        label="Disable"
                        name="hibid"
                        type="radio"
                        value="disable"
                        id="hibidDisable"
                        htmlFor="hibidDisable"
                        checked={optionData.hibid === 'disable'}
                        onChange={handleOptionChange}
                    />
                    {optionData.hibid === 'disable' ? '' :
                        <Row>
                            <Col sm={6}>
                                <Form.Label htmlFor="inputText">Seller</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="seller"
                                    name="seller"
                                    aria-describedby="textHelpBlock"
                                    value={optionData.seller}
                                    onChange={handleHibidChange}
                                />
                                {errorMessage.seller && <p className="text-start error-message">{errorMessage.seller}</p>}
                            </Col>
                            <Col sm={6}>
                                <Form.Label htmlFor="inputText">
                                    Seller Code
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    id="sellerCode"
                                    name="sellerCode"
                                    aria-describedby="textHelpBlock"
                                    value={optionData.sellerCode}
                                    onChange={handleHibidChange}
                                />
                                {errorMessage.sellerCode && <p className="text-start error-message">{errorMessage.sellerCode}</p>}
                            </Col>
                        </Row>}
                    <div className="mt-3 col-sm-12 ">
                        <button type='button' onClick={handleHibidSubmit} disabled={hibidLoading} className="custom-btn btn-3">
                            <span>Save</span>{" "}
                            {hibidLoading && (
                                <TailSpin color="#fff" height={20} width={20} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Hibid;
