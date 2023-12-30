import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { styled } from "styled-components";
import { Link } from "react-router-dom";
const ServerError = () => {
  return (
    <Wrapper className="not-found">
      <Container>
      <h1>500 - Server Error</h1>
      <p>Something went wrong please try again later...</p>
      <Link to="/" className="custom-btn btn">Home</Link>
      </Container>
    </Wrapper>
  );
};

export default ServerError;

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
