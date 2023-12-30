import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import contentbg from "../../assets/images/barcode-banner.jpg"
import scan from "../../assets/images/scan-sub.svg"




const Content = () => {
  return (
    <Wrapper className="content-sec">
      <Container>
        <Row className="align-items-center">
          <Col sm={8} className="order-2 order-sm-1">
            <h2>Bulk Lookup</h2>
            <p>
              Get all the product data you need in a formatted spreadsheet file.
              Do you need to look up a large number of products at once, without
              typing each barcode number individually into our search engine?
              Use our Bulk Lookup service to submit a list of UPC, EAN or ISBN
              codes, manufacturer part numbers with their associated brand and
              product names, or search terms. We'll track them down in our
              database and provide you with detailed product info, all presented
              in a clean, clear, easy-to-read CSV format within 24 to 48 hours.
            </p>
          </Col>

          <Col sm={4} className="text-sm-end text-center pb-4 pb-sm-0  order-1 order-sm-2">
            <img src={scan} />
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default Content;

// Styled component named StyledButton
const Wrapper = styled.div`
  width: 100%;
  text-align: left;
  background: #e7e7e7;
  padding-top: 7.75rem;
  margin-bottom: 4rem;
  background: url(${contentbg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position:relative;
  .container{
    position:relative;
    z-index:1;
    padding-bottom:40px;
    img{width:70%}
    h2 {
    text-align: left;
    color:#fff;
    font-weight:300;
    font-size:40px;
  }
  p{
    color:#fff;
  }
  }
  &:after{
    background: rgba(0,0,0,0.8);
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
  

  
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    padding-top: 8.75rem;
    .container
         h2{
          margin:0;
          font-size:30px;
         }
  }
`;
