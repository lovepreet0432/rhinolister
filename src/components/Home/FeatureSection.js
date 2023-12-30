import React from 'react'
import {  Col, Container, Row } from 'react-bootstrap'
import styled from "styled-components";
import videoBg from '../../assets/images/vido-bg.jpg'
import BannerImage from "../../assets/images/mainpicture.png";

const FeatureSection = ({content}) => {
  return (
    <Wrapper className='featured-product' data-aos="fade-up" data-aos-duration="1000">
        <Container>
         <Row>
            <Col lg={6} className='text-start order-2 order-sm-1 mt-5 mt-sm-0'>
              <h2>Features of product</h2>
              <p>
                  {/*content*/}
                  Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. “It's not Latin, though it looks like it, and it actually says nothing,”Until recently, the prevailing view assumed
                </p>
                <p>
                  {/*content*/}
                  Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. “It's not Latin, though it looks like it, and it actually says nothing,”Until recently, the prevailing view assumed
                </p>
                <p className='mb-0'>
                  {/*content*/}
                  Until recently, the prevailing view assumed lorem ipsum was born as a nonsense text. “It's not Latin, though it looks like it, and it actually says nothing,”Until recently, the prevailing view assumed
                </p>
            </Col>
            <Col lg={6} className='text-start order-1 order-sm-2'>
              <img src={BannerImage}/>
           </Col>
         </Row>
         
        </Container>
    </Wrapper>
  )
}

export default FeatureSection;


// Styled component named StyledButton
const Wrapper = styled.section`
    width: 100%;
    padding: 4rem 0; 
    background: url(${videoBg});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    .featured-product p:last-child {
       margin: 0;
     }
   h2{
    padding: 0 0 1.5rem;
    margin: 0;
    color: #323232;
    font-family: Roboto;
    font-size: 40px;
    font-style: normal;
    font-weight: 300;
    line-height: 20px; /* 50% */
    }
    video{border-radius:20px}
   .card{
        box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.10); /* 1px = 0.0625rem, 10px = 0.625rem */
        border: none;
       .price{color:#E99714}
        p{
            margin: 0;
            padding: 0.3125rem 0 0;
            line-height: 1.5625rem;
        }
        span{
            font-family: 'Poppins';
            font-weight: 600;
            display: block;
            padding: 0.3125rem 0;
        }
       
   .size-row {
    display: flex;
    border-bottom: 0.0625rem solid #ccc;
    padding: 0.3125rem 0; 
   
    span.spcol{
        padding-right: 3.5rem;    
    }
   
   }
}
@media (max-width: ${({ theme }) => theme.breakpoints.large}){
    h2{font-size:30px;}
    video{
      margin: 0 0 20px
    }
}

`;