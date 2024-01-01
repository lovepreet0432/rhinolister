import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Col, Row } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { formatDate } from "../../utils/common"; 
import { getScanData, scanProductNonLogin, scanProduct, checkUserCanScan, scanHistoryData } from "../../utils/API/scan";
import scanbg from '../../assets/images/scanbg.jpg'

function BarcodeScanPage() {
  document.title = "Scan - Rhinolister";
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [useCamera, setUseCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCurrentDateData, setLoadingCurrentDateData] = useState(false);

  const [filterLoading, setFilterLoading] = useState(false);
  const [filterDate, setFilterDate] = useState();
  const [error, setError] = useState("");
  const [errorCamera, setErrorCamera] = useState("");
  const [barcodeNumber, setBarcodeNumber] = useState("");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userSubscription = useSelector(state => state.auth.userSubscription);
  const [showUpgradeLink, setShowUpgradeLink] = useState(true);
  const [showRegisterLink, setShowRegisterLink] = useState(false);
  let isScanningEnabled = true;

  useEffect(() => {
    if (user) {
      const currentDate = new Date();
      setLoadingCurrentDateData(true);
      const fetchData = async () => {
        try {
          const response = await getScanData(user.id, formatDate(currentDate));
          if (response.status === 200) {
            setLoadingCurrentDateData(false);
            const responseData = response.data.data;
            if (responseData.length !== 0) {
              navigate('/scandetail');
            }
          }
        } catch (error) {
          setLoadingCurrentDateData(false);
          console.error('Error:', error);
        }
      }
      fetchData();
    }
  }, []);

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
      } else {
        const mainApiResponse = await scanProduct(barcodeNumber, null);
        if (!mainApiResponse.data || Object.keys(mainApiResponse.data).length === 0) {
          setLoading(false);
          setShowUpgradeLink(false);
          setBarcodeNumber('');
          if (type == 'number') {
            setError('No data found');
          } else {
            setErrorCamera("No data found");
          }
        } else {
          setBarcodeNumber('');
          navigate(`/scandetail/${barcodeNumber}`, {
            // state: { scanData: mainApiResponse.data, scanBy: 'number' },
            state: { scanData: mainApiResponse.data, scanBy: type },
          });
        }
      }
    } catch (error) {
      console.error("Error: " + error.message);
    }
  };


  const scanHandlerCamera = async (barcode) => {

    if (barcode === "") {
      setErrorCamera("Please Enter Barcode Number");
      isScanningEnabled = true;
      return;
    }

    try {
      if (!isAuthenticated) {
        await handleNonAuthenticatedUser(barcode, "camera");
      } else {
        // Check if the user can scan or not based on subscription
        const countForTodayResponse = await checkUserCanScan(user.id, userSubscription.plan_id);
        if (!countForTodayResponse.data.success) {
          setErrorCamera(countForTodayResponse.data.error);
          isScanningEnabled = true;
          return;
        }

        //  Make the main API call
        const mainApiResponse = await scanProduct(barcode, userSubscription.plan_id);
        if (
          !mainApiResponse.data ||
          Object.keys(mainApiResponse.data).length === 0
        ) {
          setShowUpgradeLink(false);
          isScanningEnabled = true;
          setErrorCamera("No data found");
          return;
        }
        else {
          setErrorCamera("");
          const scanHistoryResponse = await scanHistoryData(mainApiResponse, user.id);
          if (scanHistoryResponse.status == 201) {
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

  const handleDateChange = (date) => {
    setFilterDate(date);
    setFilterLoading(true);
    setTimeout(() => {
      navigate(`/scandetail`, {
        state: { filterDate: date },
      });
    }, 2000);
  }

  const scanHandler = async (e) => {
    e.preventDefault();
    if (barcodeNumber === "") {
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
        } else {
          const scanHistoryResponse = await scanHistoryData(mainApiResponse, user.id);
          if (scanHistoryResponse.status == 201) {
            setBarcodeNumber('');
            navigate(`/scandetail/${barcodeNumber}`, {
              state: { scanData: mainApiResponse.data, scanBy: 'number' },
            });
          } else {
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

  const useCameraHandler = () => {
    // if (userSubscription == null || Object.keys(userSubscription).length === 0 || userSubscription.plan_type == 'free') {
    //   setErrorCamera('Please purchase paid subscription plan to use camera');
    //   return;
    // }
    setUseCamera(!useCamera);
  }



  return (
    <>
      <Wrapper className="scan">
        {loadingCurrentDateData ? 
        <div className="loading-scan">
          <div className="loader-container">
            <TailSpin height={80} width={80} />
          </div> 
        </div> : ''}

        <div className="container">
          <Row className="align-items-center scan-main3s">
            <Col md={8} lg={6} className="text-center">
              <div className="scan0-row">
                <h2 class="">Scan Barcode</h2>
                {isAuthenticated && 
                <>
                  <div className="date-picker">
                    <h3>Filter History by Date   {filterLoading && (
                      <TailSpin color="#E99714" height={18} width={18} />
                    )}</h3>
                    <DatePicker
                      selected={filterDate}
                      onChange={handleDateChange}
                      placeholderText="Select Date" className="form-control"
                    />
                  
                  </div>
                  <div className="or-line"><span>or</span></div>
                </>
                }
                <form className="scan-input-form" onSubmit={scanHandler}>
                  <div className="scan-input">
                    <input
                      type="text"
                      className="form-control"
                      value={barcodeNumber}
                      placeholder="Enter your UPC/ASIN"
                      onChange={(event) => {
                        setBarcodeNumber(event.target.value);
                        setError("");
                      }}
                    />
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
                  </div>

                  <button
                    className="custom-btn btn-3 d-flex align-items-center"
                    type="submit"
                    disabled={loading}
                  >
                    <span style={{ marginRight: loading ? '5px' : '0' }}>Scan Detail</span>{" "}
                    {loading && (
                      <TailSpin color="#fff" height={18} width={18} />
                    )}
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </div>
        <button className="use-camera-btn" onClick={useCameraHandler}>{useCamera ? 'Turn Off Camera (Beta)' : 'Use Camera (Beta)'}</button>
        {useCamera && <Container>
          <Row className="justify-content-center">
            <Col sm={6}>
              <p style={{ margin: 0 }}>Hold the camera to the Barcode</p>
              <BarcodeScannerComponent
                height={380}
                onUpdate={(err, result) => {
                  if (isScanningEnabled && result) {
                    const scannedText = result.text;
                    const cleanedText = scannedText.slice(1);
                    scanHandlerCamera(cleanedText);
                    isScanningEnabled = false;
                  }
                }}
              />
              <h3 className="text-center">Scanning...</h3>
            </Col>
          </Row>
        </Container>}
        {errorCamera && <p className="text-center error-message">{errorCamera} {' '}
          {showUpgradeLink && <Link to='/subscription' className="error-message" style={{ textDecoration: "underline" }}>
            Upgrade Subscription
          </Link>}</p>}
      </Wrapper>
    </>
  );
}

export default BarcodeScanPage;

// Styled component named StyledButton
const Wrapper = styled.section`
width: 100%;
padding:11.75rem 0 6.75rem;
text-align: center;
background: url(${scanbg});
background-repeat:no-repeat;
background-position:center;
background-size:cover;
background-attachment: fixed;
.or-line {
  position: relative;
  width: 60%;
  margin: 24px auto 24px;
  border-top: 1px solid #ccc;
  span{
    display: inline-block;
    position: absolute;
    top: 50%;
    background: #fff;
    padding: 0 5px;
    margin: 0 auto;
    left: 50%;
    transform: translate(-50%,-50%);

  }
}
.loading-scan {
  background: #fff;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 50%;
  transform: translate(-50%,-50%);
  left: 50%;
  z-index: 1;
}
.react-datepicker-wrapper{display:block;}

.date-picker {
  align-items: center;
  max-width: 60%;
  margin: auto;
  h3{
    display: flex;
    svg{
      margin-left:10px;
    }
  }
}

.btn-row {
    display: flex;
    justify-content: center;
}
  .scan-input {
    width: 60%;
    margin:0 auto 20px;
  }
  h2{
    margin: 0 0 30px;
  }
  h3 {
    font-size: 15px;
    color: var(--bs-heading-color);
    text-align: center;
    margin: 0px 0 4px;
    font-weight: 500;
    text-align:left;
   
  }
  .error-message{
    margin-top: 0.5rem;
    display: block;
  }
.scan0-row {
  background:#ffffffd6;
  padding: 40px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius:5px;
  box-shadow: 0px 1px 10px rgba(96, 96, 96, 0.1);
  
}

}

.scan-input-form button {
  display: flex;
  justify-content: center;
  margin-left: 10px;
  height: 40px;
  margin:0 auto;

}

.use-camera-btn {
  border: none;
  padding: 10px 18px;
  background: none;
  color: #666666;
  border-radius: 20px;
  font-weight: 700;
  border:1px solid #666666;
  border-radius:50px;
  &:hover{
    background:#666666;
    color:#fff;
  }
}
.scan-main3s {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

  video {
    border: 0.125rem solid #c9c9c9; 
    border-radius: 2.5rem; 
    padding: 2.5rem;
    width:100%;
  }
  p{padding:10px 0;}

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding: 7.75rem 0 2.75rem;

  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    h2{font-size:30px;}
    video {
      width: 100% !important;
    }
    form.scan-input-form {
      display: block;
  }
  .scan-input-form button{margin: 0 auto; width:auto}
  .scan-input {
    width: 100%;
    margin: 0 0 20px;
}
.scan0-row{padding: 30px;}
  }
`;
