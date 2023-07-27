import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress } from '@mui/material';
import { getAPI } from '../utils/axios';

const DeviceHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = () => {
    setLoading(true); // Set loading to true before making the API call

    // Call the API to fetch the data with updated pagination parameters
    getAPI(`/device/history/?page=${page + 1}&rowsPerPage=${rowsPerPage}`)
      .then(response => {
        // Assuming the API response is an object containing 'results' property with an array of data objects
        if (Array.isArray(response.data.results)) {
          setHistoryData(response.data.results);
        } else {
          setHistoryData([]); // Set an empty array if the response data is not an array
        }

        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false in case of an error
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to format the date as "dd/mm/yyyy h:m:s"
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString('en-GB');
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Request Lock</TableCell>
              <TableCell>Request Door</TableCell>
              <TableCell>Action Lock</TableCell>
              <TableCell>Action Door</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? ( // Show loading indicator if data is still loading
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(historyData) && historyData.length > 0 ? (
                historyData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.request.lock.toString()}</TableCell>
                    <TableCell>{item.request.door.toString()}</TableCell>
                    <TableCell>{item.action.lock.toString()}</TableCell>
                    <TableCell>{item.action.door.toString()}</TableCell>
                    <TableCell>{item.user_name}</TableCell> {/* Display user_name */}
                    <TableCell>{formatDate(item.created_at)}</TableCell> {/* Format date */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>No data available</TableCell>
                </TableRow>
              )
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
