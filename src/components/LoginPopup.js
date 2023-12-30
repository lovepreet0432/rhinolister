import React from 'react'
import { Col, Container, Row} from 'react-bootstrap'
import { styled } from 'styled-components';
import { FaXmark } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const LoginPopup = ({onClose,showPopup}) => {
  return (
    <Wrapper className={`manually-section ${showPopup}`}>
    <Container>
        <Row className='justify-content-center'>
            <Col sm={6}>
                <div className='items-row p-5'>
                
                <Col sm={12}><h2>User Authentication</h2>
                <button className="close-btn" onClick={onClose}><FaXmark/></button>
                </Col>
                   <h4>Login or Registration is required to proceed further!!</h4>
                <Link className="custom-btn btn-3" to="/login"><span>Login</span></Link>
                <Link className="custom-btn btn-3" to="/registration"><span>Register</span></Link>
                
                </div>
            </Col>
        </Row>
    </Container>
</Wrapper>
    )
}

export default LoginPopup;





// Styled component named StyledButton
const Wrapper = styled.div`
  width: 100%;
  padding: 6.25rem 0; 
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  z-index: 9;
  height: 100%;

  h2 {
    padding: 0 0 1.25rem; 
  }

  .items-row {
    box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.1); 
    background: #fff;
    border-radius: 1.25rem; 
    position: relative;
    overflow: hidden;
    h3 {
      color: red;
    }
    a {
      margin: 0 0.625rem; 
    }
    p {
      font-weight: 600;
    }
    .counter {
      margin: 0 0 1.25rem; 
    }

    button.close-btn {
      position: absolute;
      right: 0.75rem; 
      top: 0.875rem; 
      font-size: 1.5rem;
      background: #e99714;
      width: 2.375rem;
      text-align: center;
      color: #fff;
      border: none;

      input {
        margin: 0;
      }
    }

    .counter {
      display: flex;
      .btn {
        background-color: #e99714;
        color: #fff;
        padding: 0.375rem 0.75rem; 
        border: none;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        border-radius: 0.125rem; 
        line-height: 1.375rem; 
        font-size: 1.375rem;
      }
      .value {
        padding: 0.375rem 0; 
        width: 1.875rem; 
        text-align: center;
      }
    }
  }
  
  label {
    font-weight: 600;
    width: 100%;
  }
`;




