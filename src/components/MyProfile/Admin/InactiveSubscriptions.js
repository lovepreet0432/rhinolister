import React, { useEffect, useState } from 'react';
import { Col, Row } from "react-bootstrap";
import axios from 'axios';
import Swal from 'sweetalert2';
import { TailSpin } from "react-loader-spinner";
import { API_BASE_URL } from "../../../Constants";
import { FaPrescriptionBottle } from "react-icons/fa6";

const InactiveSubscriptions = () => {
  const [loading, setLoading] = useState(false);
  const [usersubscriptions, setUserSubscriptions] = useState([]);

  const handleDelete = (subscriptionId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this subscription!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Make an API request to delete the subscription
          const response = await axios.delete(
            `${API_BASE_URL}/delete-subscription/${subscriptionId}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.status === 200) {
            // Subscription deleted successfully, you can reload the data or update the UI as needed.
            Swal.fire('Deleted!', 'Your subscription has been deleted.', 'success');
          } else {
            Swal.fire('Error', 'Failed to delete the subscription.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'An error occurred while deleting the subscription.', 'error');
        }
      }
    });
  };


  useEffect(() => {
    setLoading(true);
    async function fetchSubscriptionData() {
      try {
        const response = await axios.get(API_BASE_URL + "/inactive-subscription-plans", {
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (response.status == 200) {
          setLoading(false);
          console.log(response.data.subscriptionPlans,'ss');
          setUserSubscriptions(response.data.subscriptionPlans);
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

  const formatDate=(dateString)=> {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  if (usersubscriptions.length === 0) {
    return (
      <div className="loader-container">
        <h3>No data found</h3>
      </div>
    );
  }

 
  return (
    <Row>
      <Col sm={12} className="text-start">
      <table className="table table-striped table-bordered table-hover">
           <thead>
             <tr>
               <th>Title</th>
               <th>Price</th>
               <th>Subscription Type</th>
               <th>Created At</th>
               <th>Updated At</th>
               <th>Permanent Delete</th>
             </tr>
           </thead>
        {usersubscriptions.map((user) =>
           <tbody>
               <tr key={user.id}>
                 <td>{user.title}</td>
                 <td>{user.price}</td>
                 <td>{user.subscriptionType}</td>
                 <td>{formatDate(user.created_at)}</td>
                 <td>{formatDate(user.updated_at)}</td>
                 <td><FaPrescriptionBottle onClick={() => handleDelete(user.id)}
                  style={{ cursor: 'pointer' }}/></td>
               
               </tr>
           </tbody>
        )}
         </table>
      </Col>
    </Row>
  )
}

export default InactiveSubscriptions;
