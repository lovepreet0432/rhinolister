import React, { useState } from "react";
import { styled } from "styled-components";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "../Constants";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const EmailVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || '';

  const clickHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(API_BASE_URL + "/resend-verification", { email: email }, {
        headers: {
          "Content-Type": "application/json",
          withCredentials: true
        },
      })
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Email Sent Successfully.",
            customClass: {
              confirmButton: "btn",
            },
          }).then(() => {
            navigate("/login");
          }).catch((error) => {
            console.log(error);
          })
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }
  return (
    <Wrapper>
      <center>
        <div className="email-verify">
          <h3 className="mb-3">Verify Your Email to proceed further !!!</h3>
          <Button onClick={clickHandler} className="custom-btn btn-3 mb-2 d-flex">
            <span className="d-flex align-items-center" style={{ marginRight: "10px" }}>Resend Confirmation</span>
            {" "}{loading && (
              <TailSpin color="#fff" height={18} width={18} />
            )}
          </Button>
        </div>
      </center>
    </Wrapper>
  )
}
export default EmailVerify;

const Wrapper = styled.section`
  padding: 12.5rem 0; 
  text-align: center;
  
  a:hover {
    color: #fff;
  }

  .email-verify {
    border: 0.0625rem solid #d2cccc; 
    width: 50%;
    text-align: center;
    display: block;
    border-radius: 0.9375rem; 
    padding: 2.5rem 5px; 
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.large}) {
    padding: 10.5rem 0;
     .email-verify {
      width: 95%;
      padding: 2.5rem 5px;
  }
  
  }
`;