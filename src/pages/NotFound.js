import React from 'react';
import {Link} from 'react-router-dom';
import { styled } from "styled-components";
import { Container } from 'react-bootstrap';
function NotFound() {
  return (
    <Wrapper className="not-found">
      <Container>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="custom-btn btn">Home</Link>
      </Container>
    </Wrapper>
  );
}

export default NotFound;

const Wrapper = styled.section`
  padding: 12.5rem 0;
  text-align: center;

  a:hover {
    color: #fff;
  }
`;