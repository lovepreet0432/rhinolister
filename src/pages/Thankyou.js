import React from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { styled } from "styled-components";
import { Link } from "react-router-dom";
const Thankyou = () => {
  return (
    <Wrapper className="thankyou">
      <Container>
        <Row className="justify-content-center">
          <Col sm="6">
            <h2>Thank You !</h2>
            <p>
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making
            </p>

            <p>
              <span>
                <FaCheck />
              </span>
            </p>
            <p>Check Your Email</p>
            <p>Contrary to popular belief, Lorem Ipsum</p>
            {/* <Button className="btn">Back to home page</Button> */}
            <Link className="btn" to="/">
              Back to home page
            </Link>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default Thankyou;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 10.75rem 0 6.25rem;
  text-align: center;

  h2 {
    font-size: 3.125rem;
    text-align: center;
  }

  p {
    margin: 0;
  }

  span {
    font-size: 4.75rem;
    color: #e99714;
    display: block;
    padding: 3.125rem 0;
  }

  .payment-row {
    padding: 3.125rem;
    background: #f1f1f1;
  }

  .imgpayment {
    width: 100%;
    height: 18.75rem;
    background: #fff;
  }

  .subtotalrow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  .btn {
    margin-top: 0.625rem;
  }

  .btn:hover {
    background: #e99714;
    color: #fff;
    background: #bd7400;
  }

  .form-control {
    font-size: 0.875rem;
  }
`;
