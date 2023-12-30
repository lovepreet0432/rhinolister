import React, { useEffect, useState } from "react"
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import Pagination from "react-paginate";
import Swal from "sweetalert2";
import styled from "styled-components";
import EditScanHistory from "./EditScanHistory";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { formatDate } from "../../utils/common";
import { loadNewBatch, filterScanByDate, deleteParticularScan } from "../../utils/API/scan";
import { TailSpin } from "react-loader-spinner";
import { formatDateInNumber } from "../../utils/common";

export const ScanHistoryRecords = ({ isAuthenticated, showScanDetail, handleManuallyEnterItem, handleExportProducts, planFeatures, disableNewBatch, setDisableNewBatch, user, loadData, setLoadData, keys, setKeys, batchNumber, setBatchNumber, paginationKey, setPaginationKey, setStartDate, startDate, scanHistory, setScanHistory }) => {
    const [error, setError] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(1);
    const [showEditScanPopup, setEditScanPopup] = useState(false);
    const [editRecord, setEditRecord] = useState(null);

    const calculateTotalScanPrice = () => {
        const individualScanPrices = scanHistory.map(item => item.price * item.qty);
        return individualScanPrices.reduce((total, price) => total + price, 0).toFixed(2);
    };

    const calculateTotalScanQty = () => {
        return scanHistory.reduce((total, item) => total + item.qty, 0);
    };

    useEffect(() => {
        if (!isEdit) {
            setNumPages(Math.ceil(scanHistory.length / 10));
            setPaginationKey((prevKey) => prevKey + 1);
        }
        setIsEdit(false);
    }, [scanHistory]);

    const handleDateChange = async (date) => {
        setStartDate(date);
        if (date) {
            const formattedStartDate = formatDate(date);

            try {
                setLoading(true);
                const response = await filterScanByDate(formattedStartDate, user.id);
                if (response.status === 200) {
                    setLoading(false);
                    const groupedScanHistory = response.data.data;

                    if (groupedScanHistory.length != 0) {
                        if ("0" in groupedScanHistory) {
                            setDisableNewBatch(false);
                        } else {
                            setDisableNewBatch(true);
                        }
                        const formattedDate = formatDateInNumber(date);
                        const firstKey = Object.keys(groupedScanHistory)[0];
                        const keysWithFormattedDate = Object.keys(groupedScanHistory).map(key => formattedDate + key);
                        setLoadData(groupedScanHistory);
                        setKeys(keysWithFormattedDate);
                        setBatchNumber(keysWithFormattedDate[0]);
                        setPaginationKey((prevKey) => prevKey - 1);
                        setScanHistory(groupedScanHistory[firstKey]);
                    }
                    else {
                        setKeys([]);
                        setLoading(false);
                        setScanHistory([]);
                    }
                } else {
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
            }
        }
    }

    const handleCloseEditPopup = () => {
        setEditScanPopup(false);
    }

    const handleEditScan = (e, record) => {
        e.preventDefault();
        setEditRecord(record);
        setEditScanPopup(true);
    }

    const handleNewBatch = async (e) => {
        e.preventDefault();
        Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: "Are you Sure you want to create New Batch ?",
            showCancelButton: true,
            confirmButtonText: "Yes Sure",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn",
                cancelButton: "btn cancel-btn"
            },
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const formattedStartDate = formatDate(startDate);
                        const response = await loadNewBatch(user.id, formattedStartDate);
                        if (response.status === 200) {
                            const groupedScanHistory = response.data.data;
                            if (groupedScanHistory.length != 0) {
                                setDisableNewBatch(true);
                                const formattedDate = formatDateInNumber(startDate);
                                const firstKey = Object.keys(groupedScanHistory)[0];
                                const keysWithFormattedDate = Object.keys(groupedScanHistory).map(key => formattedDate + key);
                                setLoadData(groupedScanHistory);
                                setKeys(keysWithFormattedDate);
                                setBatchNumber(keysWithFormattedDate[0]);
                                setPaginationKey((prevKey) => prevKey - 1);
                                setScanHistory(groupedScanHistory[firstKey]);
                            }
                            else {
                                setScanHistory([]);
                            }
                        } else {
                            setError(response.data.message);
                            setTimeout(() => {
                                setError('');
                            }, 3000);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            })
            .catch((error) => {
                console.log(error, 'error');
            });
    }

    const handleDeleteClick = async (e, scan_id) => {
        e.preventDefault();
        Swal.fire({
            icon: "warning",
            title: "Warning!",
            text: "Are you Sure you want to delete this scan?",
            showCancelButton: true,
            confirmButtonText: "Yes Sure",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "btn",
                cancelButton: "btn cancel-btn"
            },
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const formattedDate = formatDate(startDate);
                    try {
                        const response = await deleteParticularScan(user.id, scan_id, formattedDate);
                        if (response.status === 200) {
                            setError('');
                            const groupedScanHistory = response.data.data;
                            if (groupedScanHistory.length != 0) {
                                if ("0" in groupedScanHistory) {
                                    setDisableNewBatch(false);
                                } else {
                                    setDisableNewBatch(true);
                                }
                                const formattedDate = formatDateInNumber(startDate);
                                const keysWithFormattedDate = Object.keys(groupedScanHistory).map(key => formattedDate + key);
                                setLoadData(groupedScanHistory);
                                setKeys(keysWithFormattedDate);
                                const hasBatchNumber = keysWithFormattedDate.includes(batchNumber);
                                let selectedBatch = '';
                                if (hasBatchNumber) {
                                    setBatchNumber(batchNumber);
                                    selectedBatch = batchNumber.substring(8);
                                }
                                else {
                                    setBatchNumber(keysWithFormattedDate[0])
                                    selectedBatch = keysWithFormattedDate[0].substring(8);
                                }
                                setPaginationKey((prevKey) => prevKey - 1);
                                setScanHistory(groupedScanHistory[selectedBatch]);
                            }
                            else {
                                setBatchNumber('');
                                setKeys([]);
                                setScanHistory([]);
                            }
                        }
                        else {
                            setError(response.data.message)
                            setTimeout(() => {
                                setError('');
                            }, 3000);
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            })
    }

    const handleBatchNumber = async (e, selectedBatch) => {
        e.preventDefault();
        setBatchNumber(selectedBatch);
        setScanHistory(loadData[selectedBatch.substring(8)]);
    }

    return (
        <Wrapper>
            <Container>
                <Row>
                    <Col className="text-start"><h2>Scan History</h2></Col>
                </Row>
                <Row className="justify-content-center">
                    <Col sm={12} className="text-start p">
                        <Row className="align-items-center pb-2">
                            <Col col={6}>
                                <h3>Filter History by Date</h3>
                                <div className="date-picker">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleDateChange}
                                        placeholderText="Select Date" className="form-control"
                                    />
                                    {" "}
                                    {loading && (
                                        <TailSpin height={25} width={25} />
                                    )}
                                </div>
                            </Col>
                            <Col className="text-end btn-row-r">
                                {(!showScanDetail && planFeatures.manuallyEnter == true) && <Button className="custom-btn btn-3" onClick={handleManuallyEnterItem}>
                                    Manually Enter
                                </Button>}
                                {(!showScanDetail && planFeatures.export_options == true && scanHistory.length != 0) && <Button className="custom-btn btn-3" onClick={handleExportProducts}>
                                    Export Products
                                </Button>}
                                {isAuthenticated && <Button disabled={disableNewBatch} className="custom-btn btn-3" onClick={handleNewBatch}>
                                    New Batch
                                </Button>}
                            </Col>

                        </Row>
                        <div className="batch">
                            <Row className="align-items-center">
                                <Col sm={6}>
                                    <h4>Batch Number</h4>
                                    <div className="number">
                                        <select
                                            className="form-select"
                                            value={batchNumber}
                                            onChange={(e) => handleBatchNumber(e, e.target.value)}
                                        >
                                            {keys.map((item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Col>
                                <Col sm={6} className="text-md-end">
                                    {error && <p className="error-message">{error}</p>}
                                </Col>
                            </Row>
                        </div>
                        <div className="over">
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <th>UPC</th>
                                        <th>Title</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Action</th>
                                    </tr>
                                    {scanHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">No data found</td>
                                        </tr>
                                    ) : (
                                        scanHistory.slice((currentPage - 1) * 10, currentPage * 10).map((record) => (
                                            <tr key={record.scan_id}>
                                                <td>{record.scan_id}</td>
                                                <td>{record.title}</td>
                                                <td>{record.price}</td>
                                                <td>{record.qty}</td>
                                                <td>
                                                    <div className="icon-container">
                                                        <FaPenToSquare
                                                            title="Edit"
                                                            onClick={(e) => handleEditScan(e, record)} // Add the click event handler
                                                            style={{ marginRight: '10px', cursor: 'pointer' }}
                                                        />
                                                        <FaTrash
                                                            title="Delete"
                                                            onClick={(e) => handleDeleteClick(e, record.scan_id)} // Add the click event handler
                                                            style={{ marginRight: '10px', cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <Col></Col>
                            <Col className="text-end w-t"><span className="space2"><strong>Batch Totals</strong></span>{calculateTotalScanPrice()}</Col>
                            <Col className="text-end w-t"><span className="space"><strong>Total Qty</strong></span>{calculateTotalScanQty()}</Col>
                        </div>
                        {showEditScanPopup && <EditScanHistory user={user} startDate={startDate} batchNumber={batchNumber} setIsEdit={setIsEdit} onClose={handleCloseEditPopup} setScanHistory={setScanHistory} record={editRecord} />}
                        {scanHistory.length ?
                            <div className="pagination-data1">
                                <Pagination
                                    key={paginationKey}
                                    className="pagination-data"
                                    pageCount={numPages}
                                    currentPage={currentPage}
                                    activeClassName="activePage"
                                    initialPage={0}
                                    onPageChange={(page) => setCurrentPage(page.selected + 1)}
                                /></div> : ''}
                    </Col>
                </Row>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.section`
.batch {
    margin:10px 0px 20px;
    select{width:150px}
    h4{
        margin:0px;
        padding-right:20px;
        font-weight:normal;
        padding-bottom:4px;
        font-size: 16px;
        font-weight: 500;
    }
    .btn{    border-radius: 0;
        padding: 5px 12px;
        margin-right: 3px;}
         .active-batch {
            background: #E7A83E;
            color: white;
        }
}

@media (max-width: ${({ theme }) => theme.breakpoints.small}) {
     .react-datepicker-wrapper{width:100%;}
`;