import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Table } from 'react-bootstrap';
import Swal from "sweetalert2";
import Button from 'react-bootstrap/Button';
import { sendToShopifyStore } from '../../../utils/API/accountSetting';
import { TailSpin } from "react-loader-spinner";
import { formatDate } from '../../../utils/common';

const ShopifyModal = ({ show, shopifyData, scanHistory, batchNumber, userId, accessToken, handleClose, onClose, startDate }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        const response = await sendToShopifyStore(scanHistory, userId, shopifyData.discount, accessToken);
    
        if (response.status == 200) {
            setLoading(false);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Products Successfully Imported',
                customClass: {
                    confirmButton: "btn",
                },
            }).then(() => {
                onClose();
            });
        } else if (response.status == 500) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong.Products not imported.',
                customClass: {
                    confirmButton: "btn",
                },
            }).then(() => {
                onClose();
            });
        } else {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please check your Shopify URL and access token',
                customClass: {
                    confirmButton: "btn",
                },
            }).then(() => {
                onClose();
            });
        }
    }

    return (
            <Modal show={show}  onHide={handleClose} backdrop="static" keyboard={false}  className='shopify-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>Please Confirm Shopify Import</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover className='modal-open'>
                        <tbody>
                            <tr>
                                <td>Discount on Each Product</td>
                                <td>{shopifyData.discount}%</td>
                            </tr>

                            <tr>
                                <td>Date</td>
                                <td >{formatDate(startDate)}</td>
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
                    <Button variant="secondary"  disabled={loading} onClick={handleConfirm}>
                        Confirm{" "} {loading && (
                            <TailSpin color="orange" height={18} width={18} />
                        )}
                    </Button>
                    <Button variant="primary" disabled={loading} className="custom-btn secondary btn-3" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
    );
};

export default ShopifyModal;

