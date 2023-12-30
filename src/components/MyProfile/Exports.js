import React, { useState, useEffect } from "react";
import { Col, Row, Table } from "react-bootstrap";
import Papa from 'papaparse';
import axios from "axios";
import styled from "styled-components";
import { API_BASE_URL } from "../../Constants";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import Pagination from "react-paginate";

const exportCSV = (data) => {
  try {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'product_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Your browser does not support downloading CSV files.');
    }
  } catch (error) {
    alert('An error occurred while exporting CSV.');
  }
}

const Exports = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const numPages = Math.ceil(scanHistory.length / 10);

  useEffect(() => {
    // Make the GET request using Axios (or fetch)
    if (user) {
      setLoading(true);
      axios.get(API_BASE_URL + `/fetch-all-scan-history/${user.id}`)  
        .then(response => {
          setLoading(false);
          setScanHistory(response.data.data); // Assuming response has a "data" property
        })
        .catch(error => {
          setLoading(false);
          console.error('Error:', error);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <TailSpin height={30} width={30} />
      </div>
    );
  }
  return (
    <Wrapper>
    <div className="profile-sec">
      <Row>
        <Col sm={12} className="text-end mb-3">
          <button type="button" disabled={scanHistory.length === 0} className="custom-btn ex-btn btn-3" onClick={() => exportCSV(scanHistory)}>
            Exports to CSV
          </button>
        </Col>
      </Row>

      <Row>
      <Col sm={12} className="text-start">
      <div class="table-responsive">
        <Table striped bordered hover>
          <tbody>
            <tr>
              <th>UPC</th>
              <th>Title</th>
              <th>Price</th>
              <th>Qty</th>
            </tr>
            { scanHistory.length === 0 ? (
              <tr>
                <td colSpan="3">No data found</td>
              </tr>
            ) : (
              scanHistory.slice((currentPage - 1) * 10, currentPage * 10).map((record, index) => (
                <tr key={index}>
                  <td>{record.scan_id}</td>
                  <td>{record.title}</td>
                  <td>{record.price}</td>
                  <td>{record.qty}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        </div>
        {scanHistory.length != 0 ?
        <div className="pagination-data1">
        <Pagination
          className="pagination-data"
          pageCount={numPages}
          currentPage={currentPage}
          activeClassName="activePage"
          onPageChange={(page) => setCurrentPage(page.selected + 1)}
        />
        </div>:''}
      </Col>
      </Row>
      </div>
    </Wrapper>
  );
};

export default Exports;


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
  color: #000;
}




`;