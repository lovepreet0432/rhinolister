import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../Constants";
import { TailSpin } from "react-loader-spinner";
import Pagination from "react-paginate";
import styled from "styled-components";

const UserList = () => {
  const [userlist, setUserList] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const numPages = Math.ceil(userlist.length / 10);
  const [currentPage, setCurrentPage] = useState(1);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setDataLoading(true);
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await fetch(API_BASE_URL + "/fetch-users");
      if (response.ok) {
        setDataLoading(false);
        const data = await response.json();
        setUserList(data?.users);
      } else {
        setDataLoading(false);
        console.error("Failed to fetch data. Status:", response.status);
      }
    } catch (error) {
      setDataLoading(false);
      console.error("An error occurred while fetching data:", error);
    }
  };

  if (dataLoading) {
    return (
      <div className="loader-container">
        <TailSpin height={40} width={40} />
      </div>
    );
  }

  return (
    <>
      <Wrapper>
      <div className="profile-sec">
        <h4>User List </h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {userlist.slice((currentPage - 1) * 10, currentPage * 10).map((user,index) => (
              <tr key={user?.id}>
                <td>{index+1}</td>
                <td>{user?.name}</td>
                <td>{user?.email}</td>
                <td>{formatDate(user?.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {userlist.length != 0 ?
        <div className="pagination-data1">
        <Pagination
          className="pagination-data"
          pageCount={numPages}
          currentPage={currentPage}
          activeClassName="activePage"
          onPageChange={(page) => setCurrentPage(page.selected + 1)}
        />
        </div>:''}
      </div>
      </Wrapper>
    </>
  );
};

export default UserList;

const Wrapper = styled.section`
ul.pagination-data {
  display: flex;
  justify-content: center;
  padding: 0;
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
}
`;
