import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../Constants";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import Pagination from "react-paginate";
import styled from "styled-components";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa6";

const ContactFormList = () => {
  const [contactFormlist, setContactFormList] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const numPages = Math.ceil(contactFormlist.length / 10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setDataLoading(true);
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(API_BASE_URL + "/contact-form");
      if (response.ok) {
        setDataLoading(false);
        const result = await response.json();
        setContactFormList(result.data);
      } else {
        setDataLoading(false);
      }
    } catch (error) {
      setDataLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="loader-container">
        <TailSpin height={40} width={40} />
      </div>
    );
  }

  const deleteHandler = (e, id) => {
    e.preventDefault();
    Swal.fire({
      icon: "warning",
      title: "Warning!",
      text: "Are you sure you want to delete it ?",
      showCancelButton: true,
      customClass: {
        confirmButton: "btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(API_BASE_URL + `/contact-form-record/${id}`)
          .then(response => {
            setContactFormList(response.data.data);
          })
          .catch(error => {
            console.error('Error deleting record:', error);
          });
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  if (contactFormlist.length === 0) {
    return (
      <div className="loader-container">
        <h3>No data found</h3>
      </div>
    );
  }

  return (
    <>
      <Wrapper>
        <div className="profile-sec">
          <h4>Contact Form List </h4>
          <div className="table-scroll">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th style={{ width: '10%' }}>Name</th>
                  <th>Email</th>
                  <th style={{ width: '20%' }}>Company</th>
                  <th style={{ width: '40%' }}>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>

                {contactFormlist && contactFormlist.slice((currentPage - 1) * 10, currentPage * 10).map((list, index) => (
                  <tr key={list.id}>
                    <td>{index + 1}</td>
                    <td style={{ width: '10%' }}>{list.name}</td>
                    <td>{list.email}</td>
                    <td style={{ width: '20%' }}>{list.company}</td>
                    <td style={{ width: '40%' }}>{list.description}</td>

                    <td style={{ textAlign: 'center', color: '#4b4b4b' }}><FaTrash
                      title="Delete"
                      onClick={(e) => deleteHandler(e, list.id)} // Add the click event handler
                    /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {contactFormlist.length != 0 ?
            <div className="pagination-data1">
              <Pagination
                className="pagination-data"
                pageCount={numPages}
                currentPage={currentPage}
                activeClassName="activePage"
                onPageChange={(page) => setCurrentPage(page.selected + 1)}
              />
            </div> : ''}
        </div>
      </Wrapper>
    </>
  );
};

export default ContactFormList;

const Wrapper = styled.section`
ul.pagination-data {
  display: flex;
  justify-content: center;
  padding: 0;
}
table tr td{
    width:500px;
}
.table-scroll {
    overflow-y: hidden;
    width: 100%;
    margin-bottom:20px;
    table{
        width:1000px
    }
}
.pagination-data1 a:hover {
  color: #fff;
}
li.activePage a {
  color: #fff!important;
}
ul.pagination-data li {
  list-style: none;
}
 ul.pagination-data li a {
  text-decoration: none;
  padding: 6px 15px;
}
ul.pagination-data li:hover {
  background: #e99714;
  color:#fff;
  border-radius: 5px;
}
 li.activePage {
  background: #e99714;
  color: #fff;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 5px;
}
li.next.disabled {
  margin-left: 5px;
}
li.previous.disabled {
  margin-right: 5px;
}
.pagination-data1 a {
  color: #4b4b4b;
}
table{
  th{color:#b4b4b}
  td{color:#666}
  svg{cursor:pointer;}
}
* {
  scrollbar-width: 10px;
  scrollbar-color: #b4b4b;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 8px;
  height:8px;
}

*::-webkit-scrollbar-track {
  background: #e5e5e5;
  border-radius: 20px;
}

*::-webkit-scrollbar-thumb {
  background-color: #e99714;
  border-radius: 20px;
}
`;
