import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";
import Productimg from '../../assets/images/product-img.jpg'

const Service = ({services}) => {
  return (
    <Wrapper className="service" data-aos="fade-up" data-aos-duration="1000">
      <Container>
        <Row>
          <Col md={12} lg={12}>
            <Row>
              <Col sm={12} className="mb-2">
                <h2>Our service</h2>
              </Col>
              {services.map((service,index)=>(
                 <Col key={index} sm={6} md={6} lg={3} className="pb-4">
                   <div className="card-row">
                     <div className="product-img"><img src={Productimg}/></div>
                      <h4>{service.servicesHeading}</h4>
                      <p>
                       {service.servicesContent}
                      </p>
                      </div>
                    </Col>
              ))}
              <Col sm={6} md={6} lg={3} className="pb-4">
                   <div className="card-row">
                     <div className="product-img"><img src={Productimg}/></div>
                      <h4>Trial will be for 20</h4>
                      <p>
                      Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. “It's not Latin, though it looks like it, and it actually says nothing,”Until recently, the prevailing view assumed
                      </p>
                      </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default Service;

// Styled component named StyledButton
const Wrapper = styled.section`
padding:4rem 0;
h2 {
  font-weight: 300;
  font-size: 40px;
  text-align: center;
  padding: 0 0 1.5rem;
}
.card-row{
  border-radius: 25px;
  background: #FFF;
  box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.09);
  padding:18px;
  text-align:center;
    .product-img 
      img {
        width: 100%;
        margin:0 0 20px;
      }
      h4{
      color: var(--black, #43423E);
      font-family: Roboto;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 20px; /* 111.111% */
      }
}

.singup {
    background: #ffff;
    box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.10); 
    border-radius: 0.625rem; 
    border: 0.0625rem solid #e5e5e5; 
    padding: 1.875rem; 
    h2{padding:0}
      svg {
        font-size: 1.3125rem; margin-right: 0.3125rem; 
      }
    p{text-align:center}
}

p.accout-txt {border-top: 0.0625rem solid #D9D9D9;padding-top: 1rem;}

input { background: #F5F5F5;}

      .btn[type="submit"] {
        background-color: #E99714;
        color: #fff;
        padding: 0.625rem 1.875rem; 
        border: none;
        font-size: 0.875rem;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        border-radius: 0.3125rem; 
        margin: 0 0 0.5625rem;
      }

      .btn-3 {
        width: 100%;
        line-height: 2.625rem; 
        padding: 0;
        border: none;
        margin: 0 0 0.625rem;
        border-radius: 0.25rem; 
      }

      .accout-text, p.accout-txt {
          text-align: center
      }

      label {
          font-weight: 500;
          margin: 0
      }

      .btn {
        border: 0.0625rem solid #D9D9D9;
        background: #fff;
        color: #000;
        width: 100%;
      
        span {
          padding: 0.625rem;
        }
      }
      p {
        font-weight: 400;
        position: relative;
      
        span {
          background: #fff;
          position: relative;
          z-index: 1;
          padding: 0 0.5625rem; 
          color: #9F9F9F;
        }
      }

      span.border-row {
          border-bottom: 0.0625rem solid #ccc;
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          z-index: 0;
      }

    a {
        color: #E99714;
        text-decoration: none;
        font-weight: 600;
    }

@media (max-width: ${({ theme }) => theme.breakpoints.medium}){
         width: 100%;
          background:#fff;
          padding:4rem 0 3rem;
    h4,p{
      text-align: center;
    }
    .singup {
    background: #ededed;
    padding: 1.25rem;
    border-radius: 0.625rem;
    }
    h2 {
    margin: 0;
    font-size:30px;
    
    }
}


`;
