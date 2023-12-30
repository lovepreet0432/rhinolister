import React from "react";
import { Row, Col } from "react-bootstrap"; 
import CurrencyInput from "react-currency-input-field";

const EbayOptions = ({
  ebayData,
  setEbayData
}) => {
  return (
    <div className="export-row">
      <Row>
        <Col sm="6" className="mb-2">
          <p>Condition of item</p>
          <select
            className="form-select"
            value={ebayData.conditionOfItem}
            onChange={(e) => setEbayData({
              ...ebayData,
              conditionOfItem:e.target.value
            })}
          >
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="OPEN_BOX">Open Box</option>
            <option value="USED_EXCELLENT">Used Excellent</option>
            <option value="USED_VERY_GOOD">Used Very Good</option>
            <option value="USED_GOOD">Used Good</option>
            <option value="USED_ACCEPTABLE">Used Acceptable</option>
            <option value="FOR_PARTS_OR_NOT_WORKING">
              For Parts Or Not Working
            </option>
          </select>
        </Col>
        <Col sm="6" className="mb-2">
          <p>Format</p>
          <select
            className="form-select"
            value={ebayData.format}
            onChange={(e) => setEbayData({
              ...ebayData,
              format:e.target.value
            })}
          >
            <option value="AUCTION">Auction</option>
            <option value="FIXED_PRICE">Buy It Now</option>
          </select>
        </Col>
      </Row>
      <Row>
        {ebayData.format == "AUCTION" && (
          <>
            <Col sm="6" className="mb-2">
              <p>Auction Duration</p>
              <select
                className="form-select"
                value={ebayData.auctionDuration}
                onChange={(e) => 
                  setEbayData({
                    ...ebayData,
                    auctionDuration:e.target.value
                  })}
              >
                {[1, 3, 5, 7, 10, 30].map((value) => (
                  <option key={value} value={`DAYS_${value}`}>
                    {value} Days
                  </option>
                ))}
              </select>
            </Col>
            <Col sm="6" className="mb-2">
              <p>Starting Bid</p>
              <CurrencyInput
                className="form-control"
                prefix="$"
                name="ebayStartBid"
                decimalsLimit={2}
                allowNegativeValue={false}
                defaultValue={0}
                onValueChange={(value) => {
                  if (value == undefined) {
                    setEbayData({
                      ...ebayData,
                      startBid:0
                    })
                  }
                  if (value <= 1000) {
                    setEbayData({
                      ...ebayData,
                      startBid:value
                    })
                  }
                }}
                value={ebayData.startBid}
              />
            </Col>
          </>
        )}
        {ebayData.format == "FIXED_PRICE" && (
          <Col sm="6" className="mb-2">
            <p>Set Discount</p>
            <select
              className="form-select"
              value={ebayData.discount}
              onChange={(e) => 
                setEbayData({
                  ...ebayData,
                  discount:e.target.value
                })}
            >
              <option value="0">Select</option>
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option> 
              ))}
            </select>
          </Col>
        )}
      </Row>
      {/* <Row>
        <div className="mt-2">
          <label>
            <input
              type="checkbox"
              checked={ebayData.freeShipping}
              onChange={() => 
                setEbayData({
                  ...ebayData,
                  freeShipping:!ebayData.freeShipping
                })}
            />
            {" Free Shipping"}
          </label>
        </div>
      </Row> */}
    </div>
  );
};

export default EbayOptions;