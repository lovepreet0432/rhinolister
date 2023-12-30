import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { scanProductNonLogin, scanProduct, checkUserCanScan, scanHistoryData } from "../../utils/API/scan.js";
import Scanbg from '../../assets/images/scan-bg.jpg'

const Scanner = ({content}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [barcodeNumber, setBarcodeNumber] = useState("");
  const [showUpgradeLink, setShowUpgradeLink] = useState(true);
  const [showRegisterLink, setShowRegisterLink] = useState(false);
  const user = useSelector(state => state.auth.user);
  const userSubscription = useSelector(state => state.auth.userSubscription);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  


  const handleNonAuthenticatedUser = async (barcodeNumber) => {
    try {
      const result = await scanProductNonLogin();
      if (result.data.status === 403) {
        setBarcodeNumber('');
        setShowRegisterLink(true);
        setShowUpgradeLink(false);
        setError('60 Second Wait for Unregistered Users ');
        return;
      } else {
        const mainApiResponse = await scanProduct(barcodeNumber, null);
        if (!mainApiResponse.data || Object.keys(mainApiResponse.data).length === 0) {
          setBarcodeNumber('');
          setShowRegisterLink(false);
          setShowUpgradeLink(false);
          setError("No data found");
          return;
        } else {
          setError('');
          navigate(`/scandetail/${barcodeNumber}`, {
            state: { scanData: mainApiResponse.data, scanBy: 'number' },
          });
        }
      }
    } catch (error) {
      setBarcodeNumber('');
      console.error("Error: " + error.message);
    }
  };

  const cameraHandler = (e) => {
    e.preventDefault();
    // if (userSubscription == null ||Object.keys(userSubscription).length === 0|| userSubscription.plan_type == 'free') {
    //   setError('Please purchase paid subscription plan to use camera');
    //   return;
    // }
    navigate('/scan');
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
        if (!userSubscription) {
        setShowUpgradeLink(true);
          setError('Please purchase subscription plan to proceed further');
          return;
        }
        // Check if the user can scan or not based on subscription
        const countForTodayResponse = await checkUserCanScan(user.id, userSubscription.plan_id);
        if (countForTodayResponse.data.success) {
          const mainApiResponse = await scanProduct(barcodeNumber, userSubscription.plan_id);
          if (
            !mainApiResponse.data ||
            Object.keys(mainApiResponse.data).length === 0
          ) {
            
            setShowUpgradeLink(false);
            setError("No data found");
            return;
          } else {
            const scanHistoryResponse = await scanHistoryData(mainApiResponse, user.id);
            if (scanHistoryResponse.status == 201) {
              console.log(mainApiResponse.data);
              navigate(`/scandetail/${barcodeNumber}`, {
                state: { scanData: mainApiResponse.data, scanBy: 'number' },
              });
            } else {
              console.log(scanHistoryResponse);
            }
          }
        } else {
          setError(countForTodayResponse.data.error);
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Wrapper className="cam-row" data-aos="fade-up" data-aos-duration="1000" >
        <Container>
          <Row className="align-items-center">
            <Col md={6} lg={7} className="text-start">
              <h2 className="mb-2">Scan Product</h2>
              <p className="leftcontent">
               {content}{" "}
              </p>
            </Col>
            <Col md={6} lg={5} className="text-center">
              <div className="upc">
                <h2>Try Me</h2>
                <p className="padd-0">
                    Enter your UPC/ASIN or <button className="use-camera" onClick={cameraHandler} >Use Camera (Beta)</button>
                </p>
                <form onSubmit={scanHandler}>
                  <input
                    type="text"
                    className="form-control"
                    value={barcodeNumber}
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
                  <button
                    className="custom-btn btn-3 d-flex align-items-center"
                    disabled={loading}
                  >
                    <span style={{ marginRight: "8px" }}>Scan Detail </span>{" "}
                    {loading && (
                      <TailSpin color="#fff" height={20} width={20} />
                    )}
                  </button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </Wrapper>
    </>
  );
};

export default Scanner;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding:4rem 0;
  background: url(${Scanbg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  .container {max-width:1000px;
    h2{font-size:40px; font-weight:300;color:#fff}
    p{color:#fff; font-size:16px;line-height: 28px;}
    p.leftcontent {padding-right: 50px;}
    .upc {border: 0.0625rem solid #51504A;border-radius: 1.0625rem;background: linear-gradient(180deg, rgba(231,168,62,1) 0%, rgba(208,138,27,1) 100%);padding: 3.0625rem 1.75rem;
    h2{
      font-size:16px;
      font-weight:bold;
    }
    p{padding: 0 0 4px; font-weight:bold;}
    span {display: block; font-size:16px}
    .use-camera {
    border: none;
    background: none;
    padding: 0;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
  }
  .use-camera {
    text-decoration: underline;
  }
  .custom-btn{border:1px solid #fff; color:#fff; font-weight:400;
  &:hover{
    border:1px solid #E99714; 
  }
  }
  }
  }
  .error-ms {
    color: red;
    font-size: 0.7rem; 
    font-weight: 500;
    position: relative;
    top: 0.3125rem;
  }
 
  .padd-0 {
    margin: 0;
}
  a {
    text-decoration: none;
  }
  

  .hidePopup {
    opacity: 0;
    visibility: hidden;
    transition: all 0.5s;
  }
  .cam-row {
    background: #f2f2f2;
    padding: 4rem 0;
    width: 100%;
    .padd-0 {
      padding-bottom: 0.625rem;
    }
    
    p {
      font-size: 0.875rem;
      line-height: 1.3125rem;
      margin: 0;
      padding: 0 0 1.875rem;
    }
    h3 {
      font-size: 1rem;
      font-weight: 600;
    }
  }
  .cam-row {
    background: #f2f2f2;
    padding: 4rem 0;
    width: 100%;
    .padd-0 {
      padding-bottom: 0.625rem;
    }
    
  }
  p {
    font-size: 0.8rem;
     line-height: 2.125rem;
  }
  input {
    width: 100%;
    margin: 0 0 1rem;
  }


@media (max-width: ${({ theme }) => theme.breakpoints.large}){
  .cam-row{
   margin-top:0;
  }
  p{
    font-size:1rem;
  }
}

@media (max-width: ${({ theme }) => theme.breakpoints.small}){
  .cam-row{
    padding-top: 1.875rem;
    padding-bottom: 1.875rem;
    padding-left: 0rem;
    padding-right: 0rem;
    .container 
    h2{
      font-size: 30px ;
      line-height: 2.3125rem;
    }
  }
    .banner{
      p {
        font-size: 1rem;
      }
  }
  }
  video{width:100% !important}
}

`;
