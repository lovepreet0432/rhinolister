import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import styled from "styled-components";
import shopify from '../../assets/images/shopify.png';
import ebay from '../../assets/images/ebay2.png';
import hibid from '../../assets/images/hibid.png';
import amazon from '../../assets/images/amazon.png';
import what from '../../assets/images/what.png';


const Integrations = ({ shopifyList, ebayList, hibidList, amazonList, whatnotList }) => {
  return (
    <Wrapper className='Integrations' data-aos="fade-up" data-aos-duration="1000">
      <Container>
        <Row className='align-items-center'>
          <Col sm={12} className="text-start pb-4">
            <h2>Integrations</h2>
          </Col>
        </Row>
        <Row className='align-items-center'>

          <Col md={2} className="text-center">
            <Card className='card-row'>
              <div className='logo-shop'> <img src={shopify} alt="Shopify" /></div>
              <ul>
                {shopifyList.map((featureList, index) => (
                  <li key={`shopify-${index}`}>{featureList}</li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col md={2} className="text-center">
            <Card className='card-row'>
              <div className='logo-shop'>   <img style={{ width: '100px' }} src={ebay} alt="eBay2" /></div>
              <ul>
                {ebayList.map((featureList, index) => (
                  <li key={`ebay-${index}`}>{featureList}</li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col md={2} className="text-center">
            <Card className='card-row'>
              <div className='logo-shop'> <img src={hibid} alt="HiBid" /></div>

              <ul>
                {hibidList.map((featureList, index) => (
                  <li key={`hibid-${index}`}>{featureList}</li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col md={2} className="text-center">
            <Card className='card-row'>
              <div className='logo-shop'> <img src={amazon} alt="Amazon" /></div>

              <ul>
                {amazonList.map((featureList, index) => (
                  <li key={`amazon-${index}`}>{featureList}</li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col md={2} className="text-center">
            <Card className='card-row'>
                <div className='logo-shop'> <img src={what} alt="What" /></div>
                <ul>
                  {whatnotList.map((featureList, index) => (
                    <li key={`whatnot-${index}`}>{featureList}</li>
                  ))}
                </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  )
}

export default Integrations
const Wrapper = styled.section`
  background: #fff;
  padding: 4rem 0;

  h2 {
    color: #323232;
    font-family: Roboto;
    font-size: 40px;
    font-style: normal;
    font-weight: 300;
    line-height: 20px; /* 50% */
    text-align: center;
    padding-bottom: 20px;
  }

  .col-md-2 {
    width: 20%;
  }

  ul {
    padding-left: 0rem;
  }

  ul li {
    text-align: left;
    margin-bottom: 5px;
    position: relative;
    list-style:none;
    position:realtive;

 
  }

  .logo-shop img {
    width: 67px;
  }

  .logo-shop {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-row {
    padding: 15px;
    border-radius: 25px;
    background: #fff;
    box-shadow: 0px 4px 16px 4px rgba(0, 0, 0, 0.08);
    transition: transform 250ms;
    border: none;

    &:hover {
      transform: translateY(-10px);
    }
  }

  .card-row ul {
    padding: 0 0 0 22px;
    margin: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    .col-md-2 {
      flex: 0 0 auto;
      width: 50%;
      margin-bottom:20px
    }

    .col-md-1 {
      flex: 0 0 auto;
      width: 8.33333333%;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
   h2{font-size:30px;}
   .col-md-2 {
    width: 100%;
  }

  }
`;
