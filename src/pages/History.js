import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControlLabel, Switch, TablePagination, TableSortLabel } from '@mui/material';
import { getAPI } from '../utils/axios';

const DeviceHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = () => {
    // Call the API to fetch the data with updated pagination parameters
    getAPI(`/device/history/?page=${page}&rowsPerPage=${rowsPerPage}`)
      .then(response => {
        // Assuming the API response is an object containing 'data' property with an array of data objects
        if (Array.isArray(response.data)) {
          setHistoryData(response.data);
        } else {
          setHistoryData([]); // Set an empty array if the response data is not an array
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Lock</TableCell>
              <TableCell>Door</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(historyData) ? (
              historyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.request.lock.toString()}</TableCell>
                  <TableCell>{item.request.door.toString()}</TableCell>
                  <TableCell>{item.created_at}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={historyData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default DeviceHistory;
