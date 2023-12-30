import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import footerbg from '../../src/assets/images/footer-bg.jpg';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    // <Wrapper className="footer" data-aos="fade-up" data-aos-duration="500">
    <Wrapper className="footer" >
      <Container>
        <Row className="justify-content-between">
          <Col className="text-start">
            <div className="ft-heading">Heading</div>
            <ul>
              <li>
                <Link to="/" onClick={scrollToTop}>Home</Link>
              </li>
              <li>
                <Link to="/scan" onClick={scrollToTop}>Scan</Link>
              </li>
              <li>
                <Link to="/subscription" onClick={scrollToTop}>Subscription</Link>
              </li>
            </ul>
          </Col>

          <Col>
            <div className="ft-heading">Social Links</div>
            <ul className="d-flex social-icon">
              <li>
                <Link to="/">
                  <FaFacebookF />
                </Link>
              </li>
              <li>
                <Link to="/scan">
                  <FaTwitter />
                </Link>
              </li>
              <li>
                <Link to="/subscription">
                  <FaInstagram />
                </Link>
              </li>
            </ul>
          </Col>

          <Col sm={3} >
            <div className="ft-heading">Newsletter</div>
            <p>Lorem Ipsum is simply dummy text of the </p>
            <div className="newsletter">
              <Form>
                <input type="text" />
                <Button type="submit">Go</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col sm={12}>
            <div className="copywrite text-center">
              {" "}
              <p>Copyright All Rights Reserved</p>
            </div>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default Footer;

// Styled component named StyledButton
const Wrapper = styled.section`
  background: url(${footerbg});
  padding: 4rem 0 0;
  background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  p {
    font-weight: 400;
    position: relative;
    color: #bdbdbd;
}

  form {
    position: relative;

    .btn {
      position: absolute;
    right: 0px;
    padding: 0rem 0.625rem;
    background: #E7A83E;
    border: none;
    border-radius: 0px;
    height: 1.875rem;
    margin: 0!important;
    color: #fff;
}
    }

    input {
      width: 100%;
      border: none;
      height: 1.875rem; 
    }
  }

  .ft-heading {
    font-weight: 600;
    color: #ffff;
    padding: 0 0 0.625rem;
  }


  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    li a {
      color: #bdbdbd;
      text-decoration: none;
      display: block;
      padding: 0.3125rem 0;
      font-weight:400;
    }
  }

  .social-icon li a {
    padding-left: 0.3125rem;
    font-size: 1.125rem;
  }

  .copywrite {
    border-top: 0.0625rem solid #707070;
    padding: 1.25rem 0 0;
    margin-top: 1.25rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.medium}) {
    ul {
      padding-bottom: 1.875rem;
    }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints. small}) {
    padding: 2rem 0 0;
  }
`;
