import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Thumbnail from "../../assets/images/video-image.png";
const HomeBanner = ({heading,content}) => {
  return (
    <Wrapper className="banner">
      <Container>
        <Row className="align-items-center">
          <Col sm={6} className="text-start order-2 order-sm-1" data-aos="fade-right" data-aos-duration="1000"
          >
            <h1 className="text-uppercase">
            {heading}
            </h1>
            <p>
           {content}
            </p>
            {<Link to="#" className="custom-btn btn-3">
              <span>Read More </span>
            </Link>}
          </Col>
          <Col
            sm={6}
            className="text-end order-1 order-sm-2"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <video width="100%" controls poster={Thumbnail}>
              <source src="/videos/intro.mp4" type="video/mp4" />
            </video>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default HomeBanner;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding-top: 11.125rem;
  padding-bottom: 7rem;

  video{
    border-radius: 10px;
    border:none;
    padding:0px;
  }

  a {
  text-decoration: none;
  font-size: 1rem;

  svg {
    path {
      fill: #E7A83E;
    }
  }

  &:hover {
    color: #fff;

    svg {
      path {
        fill: #fff; 
      }
    }
  }
}
  p {
    font-size: 18px;
    color: #4E4E4E;
    line-height: 30px;
    padding:0 0 30px
  }
  h1 {
          font-size: 40px;
          color:#000000;
          font-weight:700;
          font-family:inter;
          span {
          color: #E7A83E;
          }
    }




  
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}){
    padding-top: 7.625rem;
        h1 {
          font-size: 30px;
          line-height: 2.188rem;
        }
        img{margin:0 0 30px}
    }
  
`;
