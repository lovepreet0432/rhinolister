import React, { useEffect, useState } from 'react';
import { Col, Row } from "react-bootstrap";
import axios from 'axios';
import { TailSpin } from "react-loader-spinner";
import { API_BASE_URL } from "../../../Constants";
import styled from "styled-components";

const UserSubscriptions = () => {
  const [loading, setLoading] = useState(false);
  const [usersubscriptions, setUserSubscriptions] = useState({});


  useEffect(() => {
    setLoading(true);
    async function fetchSubscriptionData() {
      try {
        const response = await axios.get(API_BASE_URL + "/user-subscription", {
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.status == 200) {
          setLoading(false);
          setUserSubscriptions(response.data.userSubscriptions);
        } else {
          setLoading(false);
          console.error("Error fetching subscription plans");
        }
      } catch (error) {
        setLoading(false);
        console.error("An error occurred", error);
      }
    }
    fetchSubscriptionData();
  }, []);



  if (loading) {
    return (
      <div className="loader-container">
        <TailSpin height={50} width={50} />
      </div>
    );
  }

  if (usersubscriptions.length === 0) {
    return (
      <div className="loader-container">
        <h3>No data found</h3>
      </div>
    );
  }

  const formatDate=(dateString)=> {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function renderSubscriptionTable(key, usersubscriptions) {
    return (
      
      <Wrapper key={key} className='profile-sec'> 
        <h4>{key} Plan</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {usersubscriptions.map((user) => (
              <tr key={user?.user_id}>
                <td>{user?.user?.name}</td>
                <td>{user?.user?.email}</td>
                <td>{formatDate(user?.created_at)}</td>
                <td>{key !='Free' ?formatDate(user?.expires_at):'-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Wrapper>
    );
  }
  return (
    <Row>
      <Col sm={12} className="text-start">
        {Object.keys(usersubscriptions).map((key) =>
          renderSubscriptionTable(key, usersubscriptions[key])
        )}
      </Col>
    </Row>
  )
}

export default UserSubscriptions

const Wrapper = styled.section`
table{
  th{color:#b4b4b}
  td{color:#666}
}

`;