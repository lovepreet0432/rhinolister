import React,{useState,useEffect} from "react";
import {
  Col,
  Container,
  Row,
  Tab,
  Nav,
} from "react-bootstrap";
import { styled } from "styled-components";
import { FaUserLarge } from "react-icons/fa6";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { FaHouseChimney,FaWindowMaximize,FaWindowRestore,FaRegCircleUser } from "react-icons/fa6";
import { FaUserFriends } from 'react-icons/fa';
import accountSetting from "../assets/images/setting.png";
import communication from "../assets/images/communication.png";
import exporticon from "../assets/images/export.png";
import Profile from '../components/MyProfile/Profile';
import ChangePassword from '../components/MyProfile/ChangePassword';
import AccountSetting from '../components/MyProfile/AccountSetting';
import SubscriptionPlan from '../components/MyProfile/SubscriptionPlan';
import Exports from '../components/MyProfile/Exports';
import HomePage from '../components/MyProfile/Admin/HomePage';
import UserSubscriptions from '../components/MyProfile/Admin/UserSubscriptions';
import Subscription from '../components/MyProfile/Admin/Subscription';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import UserList from "../components/MyProfile/Admin/UserList";
import ContactFormList from "../components/MyProfile/Admin/ContactFormList";
import { FaFileLines } from "react-icons/fa6";
import { FaUserGear } from "react-icons/fa6";
import { FaFileExport } from "react-icons/fa6";
import scanbg from '../assets/images/scanbg.jpg';
const MyProfile = ({ url }) => {
  const user = useSelector(state => state.auth.user);
  const isAdmin = user && user.is_admin;
  const userRole = user ? user.role : null;
  const isSupport = userRole === "support";

  const [activeComponent, setActiveComponent] = useState('profile');

  useEffect(() => {
    setActiveComponent(url);
  })


  const renderComponent = () => {
    switch (activeComponent) {
      case "profile":
        return <Profile />;
      case "changepassword":
        return <ChangePassword />;
      case "accountsetting":
        return <AccountSetting />;
      case "subscriptionplan":
        return <SubscriptionPlan />;
      case "exports":
        return <Exports />;
      case "homepage":
        return <HomePage />;
      case "adminSubscription":
        return <Subscription />;
      case "userSubscriptions":
        return <UserSubscriptions />;
      case "userList":
        return <UserList/>;
      case "contactFormList":
        return <ContactFormList/>;
        // case "inactiveSubscriptions":
        // return <InactiveSubscriptions />;  
      default:
        return <Profile />; // Default to Home component
    }
  };

  return (
    <Wrapper className="Profilepage">
      <Container>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3} className="text-start">
              <div className="left-sidebar">
                <h4>Account Settings</h4>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <NavLink to="/myprofile/profile" className="nav-link">
                      <span>
                        <FaUserLarge />
                      </span>
                      Profile
                      </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to="/myprofile/password"  className="nav-link">
                      <span>
                        <FaUnlockKeyhole />
                      </span>
                      Password
                    </NavLink>
                  </Nav.Item>
                  {!isAdmin && <> <Nav.Item>
                    <NavLink to="/myprofile/subscription"  className="nav-link"> 
                      <span>
                      <FaFileLines />
                      </span>
                      Subscriptions
                    </NavLink>
                  </Nav.Item>
                  
                  <Nav.Item>
                    <NavLink to="/myprofile/account"  className="nav-link">
                      <span>
                      <FaUserGear />
                      </span>
                      Export Settings
                    </NavLink>
                  </Nav.Item>
                  {/* <Nav.Item>
                    <NavLink to="/myprofile/export"  className="nav-link">
                      <span>
                      <FaFileExport />
                      </span>
                      Export Products
                    </NavLink>
                  </Nav.Item> */}
                  </>
                }
                </Nav>
                {isAdmin ?
                <>
                <h4 className="pt-4">Admin Settings</h4>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                  <NavLink to="/myprofile/admin/homepage"  className="nav-link">
                      <span>
                        <FaHouseChimney />
                      </span>
                      HomePage
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to="/myprofile/admin/subscription"  className="nav-link">
                      <span>
                        <FaWindowMaximize />
                      </span>
                      Subscription
                    </NavLink>
                  </Nav.Item> 
                  <Nav.Item>
                    <NavLink to="/myprofile/admin/userList"  className="nav-link">
                      <span>
                        <FaUserFriends />
                      </span>
                      User List
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to="/myprofile/admin/contactFormList"  className="nav-link">
                      <span>
                        <FaUserFriends />
                      </span>
                      Contact Form List
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to="/myprofile/admin/user-subscriptions"  className="nav-link">
                      <span>
                        <FaRegCircleUser />
                      </span>
                      User Subscriptions
                    </NavLink>
                  </Nav.Item>
                </Nav>
                </>:''
                }
                {isSupport ? <>
                  <h4>Admin Settings</h4>
                  <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                  <NavLink to="/myprofile/admin/subscription"  className="nav-link">
                    <span>
                      <FaWindowMaximize />
                    </span>
                    Subscription
                  </NavLink>
                </Nav.Item>
                </Nav>
                </>
                :'' 
                }
              </div>
            </Col>
           
            <Col sm={9}> 
             {renderComponent()}
           </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Wrapper>
  );
};

export default MyProfile;

// Styled component named StyledButton
const Wrapper = styled.section`
  width: 100%;
  padding: 6.75rem 0 5.75rem; 
  background: url(${scanbg});
  background-repeat:no-repeat;
  background-position:center;
  background-size:cover;
  background-attachment: fixed;

  
  .active-link {
    color: #E99714; 
    font-weight: bold; 
  }
  .container .left-sidebar .nav-link:hover {
    background: rgb(233, 151, 20);
    color: rgb(255, 255, 255);
}
.container .left-sidebar a.active {
  background: rgb(233, 151, 20);
  color: rgb(255, 255, 255);
}
  .container {
    padding: 3.125rem; 
    border-radius: 0.625rem; 

    .bass-row {
      padding: 0.875rem; 
      border-radius: 0.625rem; 
    }

    .nav-link span {
      padding-right: 0.625rem;
      font-size: 1.125rem;
    }

    .rgt-row {
      background: #fff;
      padding: 1.875rem; 
      border-radius: 0.625rem; 
      box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.1); 

      .nav-pills {
        background: #ededed;
      }
    }

    h2 {
      padding: 0 0 1.875rem; 
      font-size: 1.5625rem;
      font-weight: 600;
      color: #4b4b4b;
      text-align: center;
    }
    h4 {
      font-size: 1.125rem;
      font-weight: 500;
      font-size: 18px;
      padding: 0 0 12px;
      margin:0px;
}

    .left-sidebar {
      background: #ffffffd6;
      padding: 0.875rem; 
      border: 0.0625rem solid #e7e7e7; 
      box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.1); 

      a{text-decoration:none;
        padding:7px 10px;
        display:block;
        &:hover {
          background: #E99714;
          color:#fff;
          span{
            color:#fff;
          }
        }
        span{padding-right:10px;
          font-size: 17px;
          color: #5a5a5a;
        }
      }
      a.active {
        background: #e99714;
        color: #fff;
        span{
          color:#fff;
        }
      }

      .nav-link {
        color: #4b4b4b;
        border-radius: 0px;
        padding: 12px 12px;
        background:#f1f1f1;
        border-bottom:1px solid #fff;
      }

      .nav-link:hover {
        background: #e99714;
        color: #fff;
      }
    }

    .tab-content {
      background: #fff;
      border-radius: 0.625rem; 
      padding: 1.875rem; 
      box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.1); 
    }
    .profile-sec {
        background:#ffffffd6;
        padding:30px;
        box-shadow:0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.1);
        margin:0 0 30px;
    }

    .profile-pic {
      .profile-row {
        display: flex;
        align-items: center;
        button {
          margin: 0px 0.3125rem; 
        }

        .imgprofile {
          width: 9.125rem; 
          height: 9.125rem; 
          margin-right: 1.875rem; 
          border: 0.0625rem solid #cccc; 
          border-radius: 6.25rem; 
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 0;
        }

        img {
          max-width: 100%;
        }
      }
    }

    .account-setting {
      text-align: left;
    }

    .tp-label {
      padding: 0 0 0.625rem; 
    }

    .accountCard {
      border: 0.0625rem solid #e6e6e6; 
      padding: 1.25rem; 
      box-shadow: 0px 0.0625rem 0.625rem rgba(96, 96, 96, 0.1); 
      border-radius: 0.3125rem; 
    }
  }

  .btn {
    margin: 0 0.625rem !important;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints. large}) {
    .container{
 
      .tab-content{
      margin-top: 15px;
    }

    .col-sm-3{
      width: 100%
    }
    .col-sm-9{
      width: 100%
    }
    .col-sm-6{
      width: 100%
    }
    .custom-btn {
      margin: 0 auto;
      justify-content: center;
  }
  .profile-row button {
    padding: 10px 17px;
}
    .left-sidebar{margin: 0 0 26px;}
    }
    
}
  @media (max-width: ${({ theme }) => theme.breakpoints. medium}) {   
    padding: 7.75rem 0 2.25rem;
    
    .container{
      padding: 2.125rem;
      .tab-content{
      padding: 1rem;
    }
      .profile-pic {
        .remove-bt {
          position: relative;
          top: 15px;
      }
        button{
          width: 240px;
        }
        .remove-bt1 {
          position: relative;
          top: 5px;
      }
      
      .profile-row{
        display:block;
        .btn{
          margin:auto!important;
        }
      }
      .imgprofile{
        margin:10px  auto!important;
      }
     
    }
  }
 
  }

  @media (max-width: ${({ theme }) => theme.breakpoints. small}) {
    .container {
      padding: 1rem;
  }
  }
`;
