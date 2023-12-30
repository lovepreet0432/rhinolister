import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Col, Row , Table} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../Constants";
import Swal from "sweetalert2";
import { useDispatch } from 'react-redux';
import { TailSpin } from "react-loader-spinner";
import { styled } from "styled-components";
import { setUserSubscription } from "../../redux/slices/authSlice";

const SubscriptionPlan = () => {
  const userSubscription = useSelector((state) => state.auth.userSubscription);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const accessToken = localStorage.getItem('access_token');

  // Function to format date to yyyy-mm-dd
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const cancelHandler = (subscriptionId) => {
    Swal.fire({
      icon: "warning",
      title: "Warning!",
      text: "Are you sure you want to cancel subscription ?",
      showCancelButton: true, // Display "Cancel" button
      confirmButtonText: "OK", // Text for the "OK" button
      cancelButtonText: "Cancel", // Text for the "Cancel" button
      customClass: {
        confirmButton: "btn",
        cancelButton: "btn cancel-btn"
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios
            .post(API_BASE_URL + "/cancel-subscription", {
              subscription_id: subscriptionId, 
              user_id: user.id,
            }, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${atob(accessToken)}`
              },
            })
            .then((response) => {
              setLoading(false);
              if (response.status == 200) {
                dispatch(setUserSubscription(response.data.subscription));
              } else {
                Swal.fire("Error!", "Failed to cancel subscription.", "error");
              }
            })
            .catch((error) => {
              setLoading(false);
              Swal.fire("Error!", "Failed to cancel subscription.", "error");
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const cancelFreeSubscription = (userId) => {
    Swal.fire({
      icon: "warning",
      title: "Warning!",
      text: "Are you sure you want to cancel subscription ?",
      showCancelButton: true, // Display "Cancel" button
      confirmButtonText: "OK", // Text for the "OK" button
      cancelButtonText: "Cancel", // Text for the "Cancel" button
      customClass: {
        confirmButton: "btn",
        cancelButton: "btn cancel-btn"
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          setLoading(true);
          axios
            .post(API_BASE_URL + "/cancel-free-subscription", {
              userId: userId, // Replace with the actual user ID
            }, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              },
            })
            .then((response) => {
              setLoading(false);
              if (response.status == 200) {
                if(Array.isArray(response.data.subscription) && response.data.subscription.length === 0){
                dispatch(setUserSubscription(null));
                }
                Swal.fire("Canceled!", response.data.message, "success");
              } else {
                // Handle any cancellation errors
                Swal.fire("Error!", "Failed to cancel subscription.", "error");
              }
            })
            .catch((error) => {
              setLoading(false);
              Swal.fire("Error!", "Failed to cancel subscription.", "error");
            });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }
  return (
    <Wrapper>
    <div className="profile-sec">
      <Row>
        <Col sm={12} className="text-end mb-3">
          <Link to="/subscription" className="custom-btn ex-btn btn-3">
            Upgrade Subscription
          </Link>
        </Col>

      

      </Row>
      <div className="bass-row">
      
      {!userSubscription && <p>No subscription yet</p>}
      {userSubscription && <>
        <Row>
<Col sm={12}>
<div class="table-responsive">
<Table striped bordered hover>
      <thead>
        <tr>
          <th>
            <strong>Title</strong>
          </th>

          <th>
            <strong>Price</strong>
          </th>

          <th>
            <strong>Created At</strong> {/* Display formatted created_at */}
          </th>

          <th>
            <strong>Expires At</strong> {/* Display formatted expires_at */}

          </th>

          <th>
            <strong>Status</strong> {/* Display formatted expires_at */}
          </th>

        </tr>
      </thead>
      <tbody key={userSubscription.id}>
        <tr>
          <td>
              {userSubscription.title}
          </td>

          <td>
              $ {userSubscription.price}
           
          </td>

          <td>
              {formatDate(userSubscription.created_at)} {/* Display formatted created_at */}
          
          </td>

          <td>
         
              {userSubscription.expires_at ? formatDate(userSubscription.expires_at) : '-'} {/* Display formatted expires_at */}
       
          </td>

          <td>
       
              {userSubscription.status === "cancelled" ?
                <span>Cancelled</span> : <span>Active</span>
              }
        
          </td>
        </tr>

      </tbody>
    </Table>
    </div>
</Col>
        </Row>
    
        </>
        }
      
           {userSubscription &&  <>
        <Row>
            <Col className="text-end">
              {userSubscription.status === "active" && userSubscription.plan_id != 'plan_free' &&
                <Button onClick={() => cancelHandler(userSubscription.subscription_id)} className="btn">
                  <div className="deactivate-load"> <span>Deactivate</span>{" "}
                    {loading && (
                      <TailSpin color="#fff" height={20} width={20} />
                    )}
                    </div>
                </Button>
              }
              {userSubscription.status === "active" && userSubscription.plan_id == 'plan_free' &&
                <Button onClick={() => cancelFreeSubscription(userSubscription.user_id)} className="btn" disabled={loading}>
                  <div className="deactivate-load"><span>Deactivate </span>{" "}
                    {loading && (
                      <TailSpin color="#fff" height={20} width={20} />
                    )}
                    </div>
                </Button>
              }
            </Col>
          </Row>
          
          </>
          }
          </div>
      </div>
    </Wrapper>
  );
};

export default SubscriptionPlan;

  const Wrapper = styled.section`

.profile-sec {
  .btn-3 {
    &:hover {
      color: #fff;
    }
  }
}

.swal2-actions {
  justify-content: space-between;
  width: 40%;
}

.bass-row {
  .btn {
    &:hover {
      color: #fff;
    }
  }
}


.deactivate-load {
  display: flex;
  span {
    margin-right: 8px;
  }
}

@media (max-width: ${({ theme }) => theme.breakpoints.large}) {
  .col-sm-2 {
    width: 100%;
  }
}

@media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    .bass-row {
      border: none !important;
      padding: 0 !important;
    }
    .container{
    .ex-btn {
      display: inline;
    }
}
}
`;