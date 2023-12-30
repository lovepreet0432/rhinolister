import React from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import styled from "styled-components";

const AccountSettingPage = () => {
  document.title = "Account Settings - Rhinolister";
  return (
    <Wrapper className="accountsettings">
      <Container>
        <Row>
          <Col sm="12">
            <h2>Account Setting</h2>
          </Col>
        </Row>

        <Row className="align-items-center justify-content-center text-start">
          <Col sm="6">
            <div className="account-seeting p-4">
              <Form className="row">
                {["radio"].map((type) => (
                  <>
                    <div key={`inline-${type}`} className="mb-3 col-sm-6">
                      <div className="tp-label">Shopify</div>
                      <Form.Check
                        inline
                        label="Enable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                      <Form.Check
                        inline
                        label="Disable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                    </div>

                    <div key={`inline-${type}`} className="mb-3 col-sm-6">
                      <div className="tp-label">Ebay</div>
                      <Form.Check
                        inline
                        label="Enable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                      <Form.Check
                        inline
                        label="Disable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                    </div>

                    <div key={`inline-${type}`} className="mb-3 col-sm-6">
                      <div className="tp-label">Whatnot</div>
                      <Form.Check
                        inline
                        label="Enable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                      <Form.Check
                        inline
                        label="Disable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                    </div>

                    <div key={`inline-${type}`} className="mb-3 col-sm-6">
                      <div className="tp-label">Hi-Bid</div>
                      <Form.Check
                        inline
                        label="Enable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                      <Form.Check
                        inline
                        label="Disable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                    </div>

                    <div key={`inline-${type}`} className="mb-3 col-sm-6">
                      <div className="tp-label">Manifest</div>
                      <Form.Check
                        inline
                        label="Enable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                      <Form.Check
                        inline
                        label="Disable"
                        name="group1"
                        type={type}
                        id={`inline-${type}-2`}
                      />
                    </div>
                  </>
                ))}
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default AccountSettingPage;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 10.75rem 0 6.25rem; 

  h2 {
    padding: 0 0 1.25rem; 
    text-align: center;
  }

  .account-seeting {
    box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.1); 
    border: none;
    border-radius: 0.3125rem; 

    .form-check-input[type="radio"] {
      border-radius: 50%;
      border: 0.0625rem solid #ccc; 
    }

    .tp-label {
      padding: 0 0 0.625rem; 
      font-weight: bold;
      font-size: 1rem; 

      img {
        padding-right: 0.3125rem; 
      }
    }
  }
`;