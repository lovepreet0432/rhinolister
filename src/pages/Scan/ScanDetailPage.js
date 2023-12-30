import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import styled from "styled-components";
import { exportCSV } from "../../utils/common";
import ManuallyEnterItem from "./ManuallyEnterItem";
import ExportItems from "./ExportItems";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import DefaultScanImage from "../../assets/images/defaultScanImage.jpg";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import 'react-datepicker/dist/react-datepicker.css';
import { getScanData, scanProductNonLogin, scanProduct, checkUserCanScan, scanHistoryData } from "../../utils/API/scan";
import { formatDateInNumber } from "../../utils/common";
import { formatDate } from "../../utils/common";
import { ScanHistoryRecords } from "./ScanHistoryRecords";
import axios from 'axios';
import { API_BASE_URL } from "../../Constants";


const ScanDetailPage = () => {
  document.title = "Scan Detail - Rhinolister";
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  let scanData = location.state?.scanData || {};
  const scanBy = location.state?.scanBy || 'number';
  const filterdate = location.state?.filterDate || new Date();

  const { id } = useParams();
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [showScanDetail, setShowScanDetail] = useState(true);

  const [planFeatures, setplanFeatures] = useState({});
  const [useCamera, setUseCamera] = useState(false);
  const [freeError, setFreeError] = useState('');
  const [disableNewBatch, setDisableNewBatch] = useState(true);
  const userSubscription = useSelector(state => state.auth.userSubscription);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [scanHistory, setScanHistory] = useState([]);
  const [showManuallyPopup, setShowManuallyPopup] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [barcodeNumber, setBarcodeNumber] = useState("");
  const [error, setError] = useState("");
  const [errorCamera, setErrorCamera] = useState("");
  const [showUpgradeLink, setShowUpgradeLink] = useState(true);
  const [showRegisterLink, setShowRegisterLink] = useState(false);
  const [startDate, setStartDate] = useState(filterdate);
  const [loadData, setLoadData] = useState({});
  const [keys, setKeys] = useState([]);
  const [batchNumber, setBatchNumber] = useState(1);
  const [paginationKey, setPaginationKey] = useState(10);
  let isScanningEnabled = true;

  useEffect(async () => {
    if (id == undefined) {
      setShowScanDetail(false);
      const response = await axios.get(API_BASE_URL + `/get-features/${userSubscription.plan_id}`);
      if (response.status == 200) {
        setplanFeatures(response.data);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      window.scrollTo(0, 0);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      if (user) {
        try {
          const response = await getScanData(user.id, formatDate(startDate));
          if (response.status === 200) {
            const groupedScanHistory = response.data.data;
            if (groupedScanHistory.length != 0) {
              if ("0" in groupedScanHistory) {
                setDisableNewBatch(false);
              }
              const formattedDate = formatDateInNumber(startDate);
              const firstKey = Object.keys(groupedScanHistory)[0];
              const keysWithFormattedDate = Object.keys(groupedScanHistory).map(key => formattedDate + key);
              setLoadData(groupedScanHistory);
              setKeys(keysWithFormattedDate);
              setBatchNumber(keysWithFormattedDate[0]);
              setPaginationKey((prevKey) => prevKey - 1);
              setScanHistory(groupedScanHistory[firstKey]);
            }
            else {
              setScanHistory([]);
            }
          }
          else {
            setError(response.data.message);
            setShowUpgradeLink(false);
            setTimeout(() => {
              setError('');
              setShowUpgradeLink(true);
            }, 3000);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }

    fetchData();
  }, [user]);

  const exportfree = () => {
    setFreeError("Upgrade your plan for Export");
  };

  const useCameraHandler = () => {
    setErrorCamera('');
    setUseCamera(!useCamera);
  }

  const handleNonAuthenticatedUser = async (barcodeNumber, type = "number") => {
    try {
      const result = await scanProductNonLogin();
      if (result.data.status === 403) {
        setLoading(false);
        setShowRegisterLink(true);
        setShowUpgradeLink(false);
        setBarcodeNumber('');
        if (type == 'number') {
          setError('60 Second Wait for Unregistered Users ');
        } else {
          setErrorCamera("60 Second Wait for Unregistered Users ");
        }
        return;
      } else {
        const mainApiResponse = await scanProduct(barcodeNumber, null);
        if (!mainApiResponse.data || Object.keys(mainApiResponse.data).length === 0) {
          setLoading(false);
          setShowRegisterLink(false);
          setShowUpgradeLink(false);
          setBarcodeNumber('');
          if (type == 'number') {
            setError('No data found');
          } else {
            setErrorCamera("No data found");
          }
          return;
        } else {
          setLoading(false);
          setError('');
          if (type == 'camera') {
            setErrorCamera("");
          }
          setBarcodeNumber('');
          setUseCamera(false);
          navigate(`/scandetail/${barcodeNumber}`, {
            state: { scanData: mainApiResponse.data, scanBy: type },
          });
        }
      }
    } catch (error) {
      setBarcodeNumber('');
      console.error("Error: " + error.message);
    }
  }

  const scanHandler = async (e) => {
    e.preventDefault();
    if (barcodeNumber === "") {
      setShowRegisterLink(false);
      setShowUpgradeLink(false);
      setError("Please Enter Barcode Number");
      return;
    }
    try {
      setLoading(true);
      if (!isAuthenticated) {
        await handleNonAuthenticatedUser(barcodeNumber);
      }
      else {
        setLoading(true);
        if (userSubscription == null) {
          setLoading(false);
          setBarcodeNumber('');
          setError('Please purchase subscription plan to proceed further');
          return;
        }

        // Check if the user can scan or not based on subscription
        const countForTodayResponse = await checkUserCanScan(user.id, userSubscription.plan_id);
        if (!countForTodayResponse.data.success) {
          setLoading(false);
          setBarcodeNumber('');
          setError(countForTodayResponse.data.error);
          return;
        }

        //  Make the main API call
        const mainApiResponse = await scanProduct(barcodeNumber, userSubscription.plan_id);

        if (
          !mainApiResponse.data ||
          Object.keys(mainApiResponse.data).length === 0
        ) {
          setLoading(false);
          setShowUpgradeLink(false);
          setBarcodeNumber('');
          setError("No data found");
          return;
        }
        else {
          const response = await scanHistoryData(mainApiResponse, user.id);
          if (response.status == 201) {
            setLoading(false);
            setStartDate(new Date());
            setShowScanDetail(true);
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
              setPaginationKey((prevKey) => prevKey - 1);
              setScanHistory(groupedScanHistory[firstKey]);
            }
            else {
              setScanHistory([]);
            }

            setBarcodeNumber('');
            navigate(`/scandetail/${barcodeNumber}`, {
              state: { scanData: mainApiResponse.data, scanBy: 'number' },
            });
          } else {
            setLoading(false);
            setBarcodeNumber('');
          }
        }
      }
    } catch (error) {
      setLoading(false);
      setBarcodeNumber('');
      setError("An error occurred. Please try again later.");
    }
  };

  const scanHandlerCamera = async (barcode) => {

    if (barcode === "") {
      isScanningEnabled = true;
      setErrorCamera("Please Enter Barcode Number");
      return;
    }

    try {
      if (!isAuthenticated) {
        await handleNonAuthenticatedUser(barcode, "camera");
      } else {
        // Check if the user can scan or not based on subscription
        const countForTodayResponse = await checkUserCanScan(user.id, userSubscription.plan_id);
        if (!countForTodayResponse.data.success) {
          isScanningEnabled = true;
          setErrorCamera(countForTodayResponse.data.error);
          return;
        }

        //  Make the main API call
        const mainApiResponse = await scanProduct(barcode, userSubscription.plan_id);
        if (
          !mainApiResponse.data ||
          Object.keys(mainApiResponse.data).length === 0
        ) {
          isScanningEnabled = true;
          setShowUpgradeLink(false);
          setErrorCamera("No data found");
          return;
        }
        else {
          setErrorCamera("");
          const response = await scanHistoryData(mainApiResponse, user.id);
          if (response.status == 201) {
            setUseCamera(false);
            setStartDate(new Date());
            setShowScanDetail(true);
            isScanningEnabled = true;
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
              setPaginationKey((prevKey) => prevKey - 1);
              setScanHistory(groupedScanHistory[firstKey]);
            }
            else {
              setScanHistory([]);
            }

            navigate(`/scandetail/${barcode}`, {
              state: { scanData: mainApiResponse.data, scanBy: 'camera' },
            });
          }
        }
      }
    } catch (error) {
      setErrorCamera("An error occurred. Please try again later.");
    }
  }

  //Manually Enter Item Popup
  const handleManuallyEnterItem = () => {
    setShowManuallyPopup(true);
  };

  const handleManuallyClosePopup = () => {
    setShowManuallyPopup(false);
  };

  //Export Options Popup
  const handleExportProducts = () => {
    setShowExportOptions(true);
    document.body.classList.add('bodyfixed');
  };

  const handleExportClosePopup = () => {
    document.body.classList.remove('bodyfixed');
    setShowExportOptions(false);
  };

  return (
    <>
      <Wrapper className="scan-details">
        <div className="scan-deatils">
          <Container>
            <Row className="justify-content-center align-items-end ">
              <Col sm={12}>
                <Row className="justify-content-center ">
                  <Col sm={12} lg={8}>
                    <div className="scan-row">
                      <div className="upc">
                        {scanBy == 'number' ? (
                          <>
                            <form className="cover-area" onSubmit={scanHandler}>
                              <div className="cov">
                                <div className="cover">
                                  <p className="padd-0">Scan Next Item</p>
                                  <input
                                    type="text"
                                    ref={inputRef}
                                    className="form-control"
                                    value={barcodeNumber}
                                    onChange={(event) => {
                                      setError("");
                                      setBarcodeNumber(event.target.value);
                                    }}
                                  />
                                </div>
                                <button
                                  type="submit"
                                  className="custom-btn custom-8 btn-3 d-flex align-items-center"
                                >
                                  <span >Scan Detail </span>{" "}
                                  {loading && (
                                    <TailSpin color="#fff" height={18} width={18} />
                                  )}
                                </button>
                              </div>
                              {error &&
                                <>
                                  <span className="error-message mb-3">{error} {' '}
                                    {showUpgradeLink && <Link to='/subscription' className="error-message" style={{ textDecoration: "underline" }}>
                                      Upgrade Subscription
                                    </Link>}
                                    {showRegisterLink && <Link to='/registration' className="error-message" style={{ textDecoration: "underline" }}>
                                      Register for free here
                                    </Link>}
                                  </span>
                                </>
                              }
                            </form>
                          </>
                        ) :
                          (<>
                            <div className="cover cameraText camera-scan">
                              <p className="padd-0">Scan Next Item    <button className="use-camera-btn" onClick={useCameraHandler}>{useCamera ? 'Turn Off Camera (Beta)' : 'Use Camera (Beta)'}</button>
                              </p>
                               <div>
                                {useCamera &&
                                  <BarcodeScannerComponent
                                    width={250}
                                    height={250}
                                    onUpdate={(err, result) => {
                                      if (isScanningEnabled && result) {
                                        const scannedText = result.text;
                                        const cleanedText = scannedText.slice(1);
                                        scanHandlerCamera(cleanedText);
                                        isScanningEnabled = false;
                                      }
                                    }}
                                  />
                                }
                              </div>
                              {errorCamera && <>
                                <span className="error-message mb-3 eror-cam">{errorCamera} {' '}
                                  {showUpgradeLink && <Link to='/subscription' className="error-message" style={{ textDecoration: "underline" }}>
                                    Upgrade Subscription
                                  </Link>}
                                </span>
                              </>
                              }
                            </div>
                          </>
                          )}
                      </div>
                    </div>
                  </Col>
                <Col sm={12}>
                {!showScanDetail && <div className=" mt-2 text-center">
        <div className="or-line mb-4"><span>or</span></div>
          <button className="use-camera-btn" onClick={useCameraHandler}>{useCamera ? 'Turn Off Camera (Beta)' : 'Use Camera (Beta)'}</button>
          {useCamera && <Container>
            <Row className="justify-content-center">
              <Col sm={6}>
                <p style={{ margin: 0 }}>Hold the camera to the Barcode</p>
                <div className="camera-border">
                    <BarcodeScannerComponent
                      width={400}
                      onUpdate={(err, result) => {
                        if (isScanningEnabled && result) {
                          const scannedText = result.text;
                          const cleanedText = scannedText.slice(1);
                          scanHandlerCamera(cleanedText);
                          isScanningEnabled = false;
                        }
                      }}
                    />
                </div>
                <h3 className="text-center">Scanning...</h3>
              </Col>
            </Row>
          </Container>}
          {errorCamera && <p className="text-center error-message">{errorCamera} {' '}
            {showUpgradeLink && <Link to='/subscription' className="error-message" style={{ textDecoration: "underline" }}>
              Upgrade Subscription
            </Link>}</p>}
          </div>}
                </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      

      
          {showScanDetail &&   <div className="scan-display"><Container>
            <Row>
              <Col sm="12"> <h2>Scan Display window</h2></Col>
            </Row>
            <Row>
              <Col sm={6} className="text-start">
                <p className="batch"><span>Scan ID:</span> {id} </p>
                <div className="apple-arirport">
                  <p>{scanData.Title && <><span>Title:</span> {scanData.Title}</>}</p>
                  <p>{scanData.Desc && <><span>Desc:</span> {scanData.Desc}</>}</p>
                  <p>{scanData.MaxPrice && <><span>Max Price:</span> {scanData.MaxPrice}</>}</p>
                  <p>{scanData.MinPrice && <><span>Min Price:</span> {scanData.MinPrice}</>}</p>
                  <p>{scanData.AveragePrice && <><span>Average Price:</span> ${scanData.AveragePrice}</>}</p>
                  <p>{scanData.Weight && <><span>Weight Price:</span>{scanData.Weight}</>}</p>
                </div>
                <div className="btn-row">
                  <div className="d-sm-flex align-items-center">
                    {scanData.manuallyEnter == true &&
                      <div className="text-center"><Button onClick={handleManuallyEnterItem} className="custom-btn btn-3 me-sm-4">
                        <span>Manually Enter item</span>
                      </Button>
                      </div>}
                    {scanData.export_options == true && <>
                      <div className="text-center"> <Button onClick={handleExportProducts} disabled={scanHistory.length == 0} className="custom-btn btn-3 m-0">
                        <span>Export Products</span>
                      </Button></div>
                    </>
                    }
                  </div>
                </div>
              </Col>
              <Col sm={6} className="text-center">
                {scanData.Images ?
                  <Carousel showThumbs={false}>
                    {scanData?.Images?.map((image, index) => (
                      <div key={index} className="image-size">
                        <img src={image} alt={`Image ${index + 1}`} />
                      </div>
                    ))}
                  </Carousel>
                  :
                  <p className="error-message"><img src={DefaultScanImage} />
                    <Link to='/subscription' className="error-message" style={{ textDecoration: "underline" }}>Upgrade your plan to view Images</Link></p>
                }
              </Col>
            </Row>
            <Row className="justify-content-center pt-3 btn-row">
              <Col sm={12}>
                <Row className="justify-content-between">
                  {scanData.export_to_csv &&
                    <Col sm={4} className="text-end">
                      <Link to="#" className="custom-btn btn-3" onClick={(e) => { e.preventDefault(); exportCSV(scanHistory) }}>
                        Export Products
                      </Link>
                    </Col>}
                  {scanData.export_free === true && isAuthenticated ? (
                    <>
                      <Col sm={4} className="text">
                        <Button className="custom-btn btn-3" onClick={exportfree}>
                          Export Products
                        </Button>
                        <p className="error-message">
                          <Link
                            to="/subscription"
                            className="error-message"
                            style={{ textDecoration: "underline" }}
                          >
                            {freeError}
                          </Link>
                        </p>
                      </Col>

                    </>
                  ) : (
                    ""
                  )}
                </Row>
              </Col>
            </Row>
          </Container>
          </div>
          }
          {showManuallyPopup && <ManuallyEnterItem userId={user.id} setDisableNewBatch={setDisableNewBatch} setPaginationKey={setPaginationKey} setBatchNumber={setBatchNumber} setKeys={setKeys} setLoadData={setLoadData} setStartDate={setStartDate} onClose={handleManuallyClosePopup} setScanHistory={setScanHistory} />}
          {showExportOptions && <ExportItems batchNumber={batchNumber} scanHistory={scanHistory} userId={user.id} onClose={handleExportClosePopup} startDate={startDate} />}

    

        <div className="History-sec">
          <ScanHistoryRecords
            user={user}
            setStartDate={setStartDate}
            startDate={startDate}
            scanHistory={scanHistory}
            setScanHistory={setScanHistory}
            loadData={loadData}
            setLoadData={setLoadData}
            keys={keys}
            setKeys={setKeys}
            batchNumber={batchNumber}
            setBatchNumber={setBatchNumber}
            paginationKey={paginationKey}
            setPaginationKey={setPaginationKey}
            disableNewBatch={disableNewBatch}
            setDisableNewBatch={setDisableNewBatch}
            planFeatures={planFeatures}
            handleManuallyEnterItem={handleManuallyEnterItem}
            handleExportProducts={handleExportProducts}
            showScanDetail={showScanDetail}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </Wrapper>
    </>
  );
};

export default ScanDetailPage;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 4.75rem 0 0 ;
  .History-sec .btn-row-r button:focus {
    background: none;
  }
  video{
    height: 100%;
    border: 1px solid #b5b5b5;
    padding: 20px;
    border-radius: 20px;
}
  .pagination-data1{
    ul li.activePage a{color:#fff; font-weight:500;}
    a{
      color: #4E4E4E;
    }
  }
  .camera-scan p.padd-0 {
    order: 2;
    width: 100%;
    text-align: center;
}
.upc {
    display: flex;
    justify-content: center;
}
  .react-datepicker-wrapper{
      width:50%;
      padding-right:8px;
      .btn{
        height:36px;
        padding: 0rem 1.875rem;
      }
      input[type="text"] {
        width: 100%;
        outline:none;
   }
  }
  .w-t {
    padding: 9px 14px;
   }

  Table{
    tr{
      th{color:#4b4b4b}
      td{color:#4b4b4b}
    }
  }
  .History-sec {
    background: #FFF7EA;
    padding: 80px 0;
    h3{
      font-size:16px;
    }
    .btn-row-r{
     
    button{border:none; font-size:16px;border-bottom:1px solid;border-radius:0; padding:0;     margin: 0 12px;
    &:hover{
      background:none;
      color:#4b4b4b;
    }
    }
  }
    .date-picker {
    display: flex;
    align-items: center;
    
}
}
  h3{
    font-size: 20px;
  }

  .carousel-root {
    background: #fffc;
    padding: 50px;
    border-radius: 20px;
    border: 1px solid #e1e1e1;
}
  .scan-deatils {
      padding:80px 0 60px;
   }
  .scan-display {
      padding:40px 0 80px;
  }
  .error-message.mb-3.mobile {
    display: none;
  }
  .scan-row .error-message {
    color: #dc3545;
    font-size: 16px;
    margin-top: 0.5rem;
    display:block;
    text-align: center;
    .error-message{
      margin-top:0px;
    }
  }
  .or-line {
    position: relative;
    width: 8%;
    margin: 24px auto 24px;
    border-top: 1px solid #ccc;
  }
  .use-camera-btn {
    border: none;
    padding: 10px 18px;
    background: #666666;
    color: #ffffff;
    border-radius: 20px;
    font-weight: 700;
    margin-bottom: 20px;
    font-size: 14px;
    margin-left: 8px;
  }
  .or-line span {
    display: inline-block;
    position: absolute;
    top: 50%;
    background: #fff;
    padding: 0 5px;
    margin: 0 auto;
    left: 50%;
    transform: translate(-50%,-50%);
}
  .icon-container svg {
    margin: 4px;
    color: #E99714;
  }
  body.bodyfixed {
    position: fixed;
  }
  .space2 {
    margin: 0px;
    width: 200px;
    display: inline-block;
    text-align: left;
}
.pagination-data1 {
  margin-top: 20px;
}
.eror-cam {
  position: relative;
  top: -30px;
}
  .pagination-data1 a:hover {
    color: #fff;
  }
  .carousel.carousel-slider .control-arrow:hover {
    background: rgba(0,0,0,0.2);
    z-index: -1;
}
.cov {
  display: flex;
  justify-content: space-between;
}

ul.pagination-data {
  display: flex;
  justify-content: center;
  padding: 30px 0 0;
}
  ul.pagination-data li {
    list-style: none;
  }
   ul.pagination-data li a {
    text-decoration: none;
    padding: 6px 17px;
    text-align:center;
    font-weight:bold;
  }
  ul.pagination-data li:hover {
    background: #e99714;
    color:#fff;
    border-radius: 5px;
  }
   li.activePage {
    background: #e99714;
    color: #fff;
    margin-right: 10px;
      margin-left: 10px;
    border-radius: 5px;
   
  }
  li.next.disabled {
    margin-left: 5px;
  }
  li.previous.disabled {
    margin-right: 5px;
  }
  .carousel{
    .slide{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .control-dots {
      .dot.selected {
          background: #E99714;
          opacity: 1;
      }
    }
  }
  .scan-row {
    .btn-3 {
    margin: 0 5px 0px;
    display: flex;
    justify-content: center;
    font-size:16px;
}
.cameraText {
  width: 85%;
  display: flex;
  flex-direction: column;
}
.cover-area svg {
  margin-left: 5px;
}
}
.image-size img {
  max-width: 150px;
}
.cov .cover {
  width:90%;
  display: flex;
  align-items: center;
  .form-control{
    outline:none;
    box-shadow:none;
  }
}
  .items-row {
  h2 {
    padding: 0 0 0.625rem; 
    text-align:center;  
    font-weight:300;
    font-size:30px;
  }

}
.scan-card6 {
  button {
  margin: 28px 0px 0px 0px;
  
}
svg {
  margin-left: 8px;
  width: 15px;
  height: 15px;
}
}
.sale-price {
  display: flex;
  input{
      margin-left: 10px;
  }
  }
  .apple-arirport{ p {
    margin: 0 0 30px;
    color: #4b4b4b;
    font-size: 18px;
    line-height: 37px;
    padding-left:0px}
}
.images-text {
  color: red;
  font-size: 16px;
  font-weight: 600;
}

  .counter {
    width: 6.25rem; 
  }



  h2 {
     text-align:  center;
     margin-bottom: 60px;
     font-weight:300;
     font-size:40px;
  }

  h4 {
    font-weight: bold;
    color: #4b4b4b;
  }

  p.batch {
    span{
      font-weight: 600;
      padding-left:0px;
      color:#43423E
    }
    margin: 0 0 30px;
    color: #4b4b4b;
  }

  .cover p {
    width: 260px;
    padding: 0;
    margin: 0;
    font-weight: 400;
    color: #43423E;
    font-size: 20px;
  }
  .scan-row video {
    width:100%;
    margin: 0 0 20px;
    border:none;
    padding:0px;
}

  .apple-arirport {
    span{
      font-weight:600;
      padding-left:0px;
      color:#4b4b4b;
    }

    h3 {
      font-weight: bold;
      margin: 0 0 0.75rem; 
      color: #4b4b4b;
    }

    p {
      color: #4b4b4b;
    }
  }

  .average {
    h4 {
      font-weight: bold;
      color: #4b4b4b;
    }
  }
  .cov{
  .btn-3 {
    span {
      width: 95px;
  }
  }
}

  .carousel.carousel-slider {
    padding: 0 0 3.5rem; 
  }

  .carousel .control-dots .dot {
    transition: opacity 0.25s ease-in;
    opacity: 0.3;
    background: #bababa;
    border-radius: 50%;
    width: 0.75rem; 
    height: 0.75rem;
    cursor: pointer;
    display: inline-block;
    margin: 0 0.5rem; 
  }
  .items-row{
  .btn-3{
    margin:0px 5px;
  }
}
.space {
    margin: 0px 30px;
    display: inline-block;
    text-align: left;
    width: 200px
}

@media (max-width: ${({ theme }) => theme.breakpoints.large}) {
      .items-row{
      width: 90%;
      }
    .scan-card6 {
      button {
      margin: 14px 0px 36px 0px;
      justify-content: center;
    }
    }
}
@media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
  .apple-arirport {
      padding: 0 0 32px;
    }
  .featured-product{position:realtive}
  .featured-product .container {
    position: relative;
    z-index: 1;
}
  .History-sec {
               padding: 46px 0;
  }
  .scan-display{padding: 40px 0 30px;}
  .btn-3{    margin: 0;}
            h2 {
              text-align: left;
              margin-bottom: 24px;
              font-size: 30px;
           }
            .scan-deatils {
                padding: 40px 0 0;
            }
          .btn-3 span {
              width: 113px;
          }
          .btn-3 {
            margin: 1.25rem 0;
            padding: 0.5rem 1.5rem;
          }
          .apple-arirport p{
              margin:0px;
            }
            .featured-product:after {
            background: #f6f8fad4;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            content: "";
}
}
@media (max-width: ${({ theme }) => theme.breakpoints.small}) {
            padding: 4.75rem 0 0;
   
            .react-datepicker-wrapper{width:100%;}
            .upc{display:block;}
            .subbanner {
              h2{
                text-align:center;
              }
            }
            .History-sec{
              table{width:400px;}
              padding: 44px 0;
              .btn-row-r {
               padding-top: 20px;
             }
             .space2{
              width: auto;
             }
             .space{
              width: auto;
             }
            }
           
            .use-camera-btn{margin-left: 0;}
            .scan-display {
               padding:0;
            }
            p.batch{
              margin: 0 0 30px;
            }
           
            .btn-row {
              margin: 0 0 57px;
            .custom-btn {
              width: 232px;
              margin: 0 auto 22px;
             }
            }
            .btn-3 {
                margin: 1.25rem 0;
            }
            .scan-row {
                margin: 0 0 20px;
            }
            .items-row {
                .btn-3 {
                    margin: 0 5px 10px;
                }
            }
           
            .cov {
                display: block;
                .btn-3{
                  margin:0 auto;
                }
            }
            .cov .cover {
              p{width:100%}
                width: 100%;
                display:block;
                text-align:center;
                margin:0 0 20px;
            }
           
            .error-message.mb-3.desktop {
                display: none;
            }
            .error-message.mb-3.mobile {
                display: block;
            }
            .over {
                overflow-x: scroll;
            }
           
        }
`;