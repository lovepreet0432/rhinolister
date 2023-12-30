import React, { useState, useEffect } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { categories, getSubCategories, shippingProfile, hazmat, type } from "../../../utils/common";
import { styled } from "styled-components";
import CurrencyInput from 'react-currency-input-field';

const WhatNot = ({ whatNotData, setwhatNotData }) => {
    
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

    useEffect(() => {
        const subArray = getSubCategories(categories[0]);
        setSubCategoryOptions(subArray);
        setwhatNotData(prevState => ({
            ...prevState,
            category: categories[0],
            subCategory: subArray[0],
            shippingProfile: shippingProfile[0],
            hazmat: hazmat[0],
            type: type[0]
        }));
    }, []);

    useEffect(() => {
        const subArray = getSubCategories(whatNotData.category);
        setSubCategoryOptions(subArray);
        setwhatNotData(prevState => ({
            ...prevState,
            subCategory: subArray[0],
           }));
    }, [whatNotData.category]);



    return (
        <Wrapper>
            <div className="export-row">
                <Row>
                    <Col sm="6" className="mb-2"><p>Category</p>
                        <select
                            className="form-select"
                            value={whatNotData.category}
                            onChange={(e) => 
                                setwhatNotData(prevState => ({
                                    ...prevState,
                                    'category': e.target.value
                                }))}
                        >
                            {categories.map((category) => (
                                <option key={category.toLowerCase().replace(/\s/g, '')} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col sm="6" className="mb-2"><p>Sub Category</p>
                        <select
                            className="form-select"
                            value={whatNotData.subCategory}
                            onChange={(e) => 
                                setwhatNotData(prevState => ({
                                    ...prevState,
                                    'subCategory': e.target.value
                                }))}
                        >
                            {subCategoryOptions.map((category) => (
                                <option key={category.toLowerCase().replace(/\s/g, '')} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col sm="6" className="mb-2">
                        <p>Shipping Profile</p>
                        <select
                            className="form-select"
                            value={whatNotData.shippingProfile}
                            onChange={(e) => 
                                setwhatNotData(prevState => ({
                                    ...prevState,
                                    'shippingProfile': e.target.value
                                }))}
                        >
                            {shippingProfile.map((category) => (
                                <option key={category.toLowerCase().replace(/\s/g, '')} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col sm="6"> <p>Hazmat</p>
                        <select
                            className="form-select"
                            value={whatNotData.hazmat}
                            onChange={(e) => 
                                setwhatNotData(prevState => ({
                                    ...prevState,
                                    'hazmat': e.target.value
                                }))}
                        >
                            {hazmat.map((category) => (
                                <option key={category.toLowerCase().replace(/\s/g, '')} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6"> <p>Type</p>
                        <select
                            className="form-select"
                            value={whatNotData.type}
                            onChange={(e) =>
                                setwhatNotData(prevState => ({
                                    ...prevState,
                                    'type': e.target.value
                                }))}
                        >
                            {type.map((category) => (
                                <option key={category.toLowerCase().replace(/\s/g, '')} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </Col>
                    {whatNotData.type == 'Auction' && <Col sm="6">
                        <p>Start Bid</p>
                        <CurrencyInput
                            className="form-control"
                            prefix="$"
                            name="auction_start_bid"
                            decimalsLimit={2}
                            allowNegativeValue={false}
                            defaultValue={0}
                            onValueChange={(value) => {
                                if (value == undefined) {
                                    setwhatNotData(prevState => ({
                                        ...prevState,
                                        startBid: 0
                                    }));
                                }
                                if (value <= 10000) {
                                    setwhatNotData(prevState => ({
                                        ...prevState,
                                        startBid: value
                                    }));
                                }
                            }}
                            value={whatNotData.startBid}
                        />
                    </Col>}
                    {whatNotData.type == 'Buy It Now' && <Col sm="6">
                        <p>Discount</p>
                        <select
                            className="form-select"
                            value={whatNotData.discount}
                            onChange={(e) => 
                                setwhatNotData(prevState => ({
                                    ...prevState,
                                    discount: e.target.value
                                }))}
                        >
                                <option value="0">Select</option>
                                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => (
                                    <option key={value} value={value}>
                                    {value}%
                                    </option>
                                ))}
                        </select>
                    </Col>}
                </Row>
            </div>
        </Wrapper>
    )
}

export default WhatNot;

const Wrapper = styled.div`
  .export-row {
    margin-bottom: 10px;
    align-items: center;
    background: #efefef;
    padding: 16px;
    border-radius: 16px;
}`;

