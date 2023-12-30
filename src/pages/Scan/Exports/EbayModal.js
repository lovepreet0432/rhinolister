import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { API_BASE_URL } from "../../../Constants";
import { TailSpin } from "react-loader-spinner";
import { formatDate } from "../../../utils/common";

const EbayModal = ({
  show,
  ebayData,
  scanHistory,
  batchNumber,
  userId,
  accessToken,
  handleClose,
  onClose,
  startDate,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/send-products-to-ebay`,
        { scanHistory: scanHistory, ebayData, userId: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${atob(accessToken)}`,
          },
        }
      );
      console.log(response,'response')
      if (response.status == 200) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Products Successfully Imported",
          customClass: {
            confirmButton: "btn",
          },
        })
          .then(() => {
            onClose();
          })
          .catch((err) => {
            console.log(err, "err");
          });
      } else {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong. Please try again.",
          customClass: {
            confirmButton: "btn",
          },
        });
      }
    } catch (error) {
      console.log("Errot : ", error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid access token.Please re-authorize ebay account.",
          customClass: {
            confirmButton: "btn",
          },
        });
      } else if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.data.responses[0].errors[0].message,
          customClass: {
            confirmButton: "btn",
          },
        });
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} className="shopify-modal">
      <Modal.Header closeButton>
        <Modal.Title>Please Confirm Ebay Import</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover className="modal-open">
          <tbody>
            <tr>
              <td>Date</td>
              <td>{formatDate(startDate)}</td>
            </tr>
            <tr>
              <td>Batch Number</td>
              <td>{batchNumber}</td>
            </tr>

            <tr>
              <td>No of Products imported </td>
              <td>{scanHistory.length}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body> 
      <Modal.Footer>
        <Button variant="secondary" onClick={handleConfirm}  disabled={loading}>
          Confirm {loading && <TailSpin color="orange" height={18} width={18} />}
        </Button>
        <Button
          variant="primary"
          className="custom-btn secondary btn-3"
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EbayModal;