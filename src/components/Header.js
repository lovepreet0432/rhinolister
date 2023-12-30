import React, { useEffect, useState } from "react";
import axios from 'axios';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";
import Logo from "../assets/images/logo23.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { API_BASE_URL } from "../Constants";
import { useDispatch } from 'react-redux';
import { setUser,setUserProfile,setUserSubscription, setToken, setIsAuthenticated} from '../redux/slices/authSlice';
import loginocon from "../assets/images/login.svg"
import rigstericon from "../assets/images/rigster.svg"
import profileicon from "../assets/images/profile.svg"
import Offcanvas from 'react-bootstrap/Offcanvas'
import { Button } from "react-bootstrap";
import logout from "../assets/images/logout.svg"

const Header = () => {
  const navigate = useNavigate();
  const accessToken=localStorage.getItem('access_token');
  const [isSticky, setIsSticky] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const scrollToTop = () => {
    setShow(false); 
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const logoutHandler = async () => {
    // Show a confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'No, cancel',
      customClass: {
        confirmButton: 'btn', // Add custom class to confirm button
        cancelButton: 'btn cancel-btn ',   // Add custom class to cancel button
    },
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(API_BASE_URL+"/logout", {token:atob(accessToken)}, {
              headers: {
                  Authorization: `Bearer ${atob(accessToken)}`
              }
          });
          console.log(response,'qwerty')
          if (response.status === 200) {
            // Remove access token from localStorage
            localStorage.removeItem('access_token');
            dispatch(setUser(''));
            dispatch(setUserProfile(''));
            dispatch(setUserSubscription(''));
            dispatch(setToken(''));
            dispatch(setIsAuthenticated(false));
            navigate("/");
        } else {
            console.error("Logout failed with status:", response.status);
        }
      } catch (error) {
          console.error(error);
      }
    }
};

  return (
    
    <Wrapper className={isSticky ? "sticky-header active" : "sticky-header"}>
      <Navbar expand="lg" className="bg-body-tertiary mt-0 mb-0"  expanded={expanded}>
        <Container>
          <NavLink to="/">
            <img src={Logo} alt="Logo" />
          </NavLink>
          {/* <Navbar.Toggle aria-controls="navbarScroll" variant="primary" className="d-lg-none" onClick={() => setExpanded(!expanded)}/> */}
          <Navbar.Toggle aria-controls="navbarScroll" variant="primary" className="d-lg-none" onClick={handleShow}/>
          <Navbar.Collapse id="navbarScroll">
            <Nav className="mx-auto my-2 my-lg-0">   
              <NavLink
                to="/"
                onClick={scrollToTop}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "isActive" : ""
                } data-hover=""
              >
                Home
              </NavLink>
              <NavLink
                to="/scan"
                onClick={scrollToTop}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "isActive" : ""
                } data-hover=""
              >
                Scan
              </NavLink>
              {!accessToken ? (
                <>
                  <NavLink
                    to="/subscription"
                    onClick={scrollToTop}
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "isActive" : ""
                    }
                    data-hover=""
                  >
                    Pricing
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/subscription"
                    onClick={scrollToTop}
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "isActive" : ""
                    }
                    data-hover=""
                  >
                    Subscription
                  </NavLink>
                </>
              )}
            </Nav>
            <div className="d-lg-flex login-btn">
              {!accessToken ? (
                <>
                  <NavLink to="/login" onClick={scrollToTop} className="">
                    <span><img src={loginocon}/>Login</span>
                  </NavLink>
                  <NavLink
                    to="/registration"
                    onClick={scrollToTop}
                    className="pending"
                  >
                     <span><img src={rigstericon}/>Register</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/myprofile/profile" onClick={scrollToTop}  className="">
                    <span><img src={profileicon}/>My Profile</span>
                  </NavLink>
                  <a className=""  onClick={logoutHandler}><span><img src={logout}/></span>Logout</a>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <Offcanvas show={show} onHide={handleClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>  <NavLink to="/">
            <img src={Logo} alt="Logo" />
          </NavLink></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Navbar.Collapse id="navbarScroll">
            <div className="my-lg-0">   
              <NavLink
                to="/"
                onClick={scrollToTop}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "isActive" : ""
                } data-hover=""
              >
                Home
              </NavLink>
              <NavLink
                to="/scan"
                onClick={scrollToTop}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "isActive" : ""
                } data-hover=""
              >
                Scan
              </NavLink>
              {!accessToken ? (
                <>
                  <NavLink
                    to="/subscription"
                    onClick={scrollToTop}
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "isActive" : ""
                    }
                    data-hover=""
                  >
                    Pricing
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/subscription"
                    onClick={scrollToTop}
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "isActive" : ""
                    }
                    data-hover=""
                  >
                    Subscription
                  </NavLink>
                </>
              )}
            </div>
            <div className="d-lg-flex login-btn">
              {!accessToken ? (
                <>
                  <NavLink to="/login" onClick={scrollToTop} className="">
                    <span><img src={loginocon}/>Login</span>
                  </NavLink>
                  <NavLink
                    to="/registration"
                    onClick={scrollToTop}
                    className="pending"
                  >
                     <span><img src={rigstericon}/>Register</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/myprofile/profile" onClick={scrollToTop}  className="">
                    <span><img src={profileicon}/>My Profile</span>
                  </NavLink>
                  <a className=""  onClick={logoutHandler}><span><img src={logout}/></span>Logout</a>
                </>
              )}
            </div>
            </Navbar.Collapse>
        </Offcanvas.Body>
      </Offcanvas>


    </Wrapper>
  );
};

export default Header;

// Styled component named StyledButton
const Wrapper = styled.section`
   width: 100%;
   padding:0;
   top:0;
   z-index: 2;
 
   img{
    transition:all 0.5s;
   }
   .isActive{
    color: #E99714 !important;
   }
   .navbar-toggler-icon {
    width: 2.4rem;
    height: 2.4rem;
  }
   nav{
    width:100%;
    background:#fff !important;
    text-transform:uppercase;
    box-shadow: 0px 2px 8px rgba(0,0,0,0.1);
}
.navbar-nav{
a:before,
 a:after {
  position: absolute;
  -webkit-transition: all 0.35s ease;
  transition: all 0.35s ease;
}
 a:before {
  bottom: 0;
  display: block;
  height: 2px;
  width: 0%;
  content: "";
  background-color: #E99714;
}
a:after {
  left: 0;
  top: 0;
  padding: 0.5em 0;
  position: absolute;
  content: attr(data-hover);
  color: #ffffff;
  white-space: nowrap;
  max-width: 0%;
  overflow: hidden;
}
a:hover:before,
 .current a:before {
  opacity: 1;
  width: 100%;
}
 a:hover:after,
 .current a:after {
  max-width: 100%;
}
}
    .login-btn a{
     text-decoration:none;
     margin: 0 1.625rem;
    }
    .login-btn
      a{
        line-height: 1.688rem;
        text-algin:left;
        color:#070707;
        letter-spacing: 0.5px;
        font-weight:400;
        cursor: pointer;
        img {
          width: 15px;
          margin: -5px 3px 0;
      }
      }
    button{
      background-color: #E99714;
        color: #fff;
        padding: 0.625rem  1.875rem;
        border: none;
        font-size: 0.875rem;
        font-family: 'Poppins',sans-serif;
        font-weight: 700;
        border-radius: 3.125rem;
        text-decoration:none;
        margin-right: 0.625rem;
        text-transform:uppercase;
        width: 9.063rem;
       
        &:hover{background:#bd7400;}
    }
    a:last-child{
          margin:0px;
    }
   
    .navbar-nav a{
      text-decoration:none;
      color:#070707;
      margin: 0px 1.625rem;
      font-weight: 400;
      font-size: 16px;
      letter-spacing:0.5px;
      position:relative;  
      }
    
    img {
    width: 99px;
   }
  }
   .cancel-btn {
    margin: 0px 0.5rem !important;
}
.offcanvas-md{
    max-width:80%
  }
  
@media (max-width: ${({ theme }) => theme.breakpoints.large}){
 
  .offcanvas-header{
    img{
      max-width:80px;
      width:80px;
    }
   }
   .offcanvas-body .navbar-collapse {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    align-items: flex-start;
    .login-btn {
        background:#FFF7EA;
        width: 100%;
        border-radius: 10px;
        padding: 12px;
     }
      a{
        display:block;
        text-decoration: none;
        color: #070707;
        font-weight: 400;
        font-size: 16px;
        margin:0px;
        letter-spacing: 0.5px;
        position: relative;
        padding: 8px 0;
        img{
          margin-right:5px;
        }
      }
    }
  .sticky-header {
    .navbar-collapse{
      border-top: 0.063rem solid #ccc;
      margin-top: 1.125rem;
    .navbar-nav{
    a{
      padding:0.400rem 0;
    }
  }

}
button:focus:not(:focus-visible) {
  outline: 0;
  border: none;
  box-shadow: none;
}
    nav {
      button {
        background: none;
        width: auto;
        padding: 0;
        margin: 0;
        color:#010101;
        &:hover {
          background-color: transparent;
        }
      }
      .login-btn {
        margin:0px;
        position:relative;
        top:-10px;
        a{
          background-color: transparent;
          color: #010101;
          padding:0.400rem 0;
          margin:0px;
          display:block;
          text-align:left;
         
        }
      }
    }
  }
}

@media (max-width: ${({ theme }) => theme.breakpoints.small}){
  .sticky-header{
    img{width:6.25rem;}
  }
  .sticky-header.active{
    img{width:6.25rem;}
}
}


`;
