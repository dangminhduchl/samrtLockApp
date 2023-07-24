import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Switch,
  IconButton,
  Tooltip,
  TextField,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Undo as UndoIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { getAPI, putAPI, deleteAPI, postAPI } from '../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../login.css';
import { useNavigate } from 'react-router-dom';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');
  const [editModeRows, setEditModeRows] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const history = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAPI('/user/users/');
        if (!response || !response.data) {
          throw new Error('No data received from the server');
        }
        setUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        
        setIsLoading(false);
        if (error?.response?.status === 401) {
          // Redirect to login page if unauthorized
          history('/login');
          toast.error('Failed to fetch users, please try again');
        } 
        if (error?.response?.status === 403) {
          toast.error(error?.response?.data?.detail || 'Something went error, please try again later')
          history('/dashboard');
        }
        else {
          toast.error('Something went error, please try again later')
        }
      }
    };

    fetchUsers();
  }, [history]);



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const handleEdit = (id) => {
    setEditModeRows((prevEditModeRows) => ({
      ...prevEditModeRows,
      [id]: true,
    }));
  };

  const handleSave = async (id) => {
    const userToUpdate = users.find((user) => user.id === id);
    try {
      await updateUser(userToUpdate);
      setEditModeRows((prevEditModeRows) => ({
        ...prevEditModeRows,
        [id]: false,
      }));
    } catch (error) {
    }
  };

  const handleCancel = (id) => {
    setEditModeRows((prevEditModeRows) => ({
      ...prevEditModeRows,
      [id]: false,
    }));
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
    } catch (error) {
    }
  };

  const handleEncoding = async (id) => {
    try {
      setIsLoading(true);
      const response = await getAPI(`/user/encoding/${id}`);
      // Refresh the users data after encoding
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, encode: true } : user
      );
      setUsers(updatedUsers);
      toast.success(response.data.message);
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Something went wrong, please try again');
      setIsLoading(false);
    }
  };

  const handleDeleteEncoding = async (id) => {
    try {
      setIsLoading(true);
      const response = await deleteAPI(`/user/encoding/${id}`);
      // Refresh the users data after deleting encoding
      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, encode: false } : user
      );
      setUsers(updatedUsers);
      toast.success(response.data.message);
      setIsLoading(false);
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error(error?.response?.data?.detail || 'Something went error, please try again later')
      }
      else{
      toast.error(error?.response?.data?.error || 'Something went wrong, please try again');
      }
      setIsLoading(false);
    }
  };

  const handleEncodingAll = async () => {
    try {
      setIsLoading(true);
      const response = await postAPI('/user/encodings/');
      // Refresh the users data after encoding all
      const updatedUsers = users.map((user) => ({ ...user, encode: true }));
      setUsers(updatedUsers);
      toast.success(response.data.message);
      setIsLoading(false);
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error(error?.response?.data?.detail || 'Something went error, please try again later')
      }
      else{
      toast.error(error?.response?.data?.error || 'Something went wrong, please try again');
      }
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setIsLoading(true)
      const response = await deleteAPI(`/user/user/${userId}`);
      if (response.status === 204) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error(error?.response?.data?.detail || 'Something went error, please try again later')
      }
      else{
      toast.error(error?.response?.data?.error || 'Something went wrong, please try again');
      }
      setIsLoading(false)
    }
  };

  const updateUser = async (user) => {
    try {
      setIsLoading(true)
      const response = await putAPI(`/user/user/${user.id}/`, user);
      if (response.status === 200) {
        // User updated successfully
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        toast.error(error?.response?.data?.detail || 'Something went error, please try again later')
      }
      else{
      toast.error(error?.response?.data?.error || 'Something went wrong, please try again');
      }
      setIsLoading(false)
    }
  };

  const sortedUsers = users.slice().sort((a, b) => {
    const compareResult = a[orderBy] < b[orderBy] ? -1 : a[orderBy] > b[orderBy] ? 1 : 0;
    return order === 'asc' ? compareResult : -compareResult;
  });

  const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Users Managemet
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active={orderBy === 'id'} direction={order} onClick={() => handleSort('id')}>
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'username'}
                  direction={order}
                  onClick={() => handleSort('username')}
                >
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={orderBy === 'email'} direction={order} onClick={() => handleSort('email')}>
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={orderBy === 'is_staff'} direction={order} onClick={() => handleSort('is_staff')}>
                  Is Staff
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'is_active'}
                  direction={order}
                  onClick={() => handleSort('is_active')}
                >
                  Activate
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {editModeRows[user.id] ? (
                    <TextField
                      value={user.username}
                      onChange={(e) =>
                        setUsers((prevUsers) =>
                          prevUsers.map((prevUser) =>
                            prevUser.id === user.id ? { ...prevUser, username: e.target.value } : prevUser
                          )
                        )
                      }
                    />
                  ) : (
                    user.username
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {editModeRows[user.id] ? (
                    <Switch
                      checked={user.is_staff}
                      onChange={(e) =>
                        setUsers((prevUsers) =>
                          prevUsers.map((prevUser) =>
                            prevUser.id === user.id ? { ...prevUser, is_staff: e.target.checked } : prevUser
                          )
                        )
                      }
                    />
                  ) : (
                    user.is_staff ? 'Yes' : 'No'
                  )}
                </TableCell>
                <TableCell>
                  {editModeRows[user.id] ? (
                    <Switch
                      checked={user.is_active}
                      onChange={(e) =>
                        setUsers((prevUsers) =>
                          prevUsers.map((prevUser) =>
                            prevUser.id === user.id ? { ...prevUser, is_active: e.target.checked } : prevUser
                          )
                        )
                      }
                    />
                  ) : (
                    user.is_active ? 'Yes' : 'No'
                  )}
                </TableCell>
                <TableCell>
                  {user.encode ? (
                    <Tooltip title="Delete Encoding">
                      <IconButton onClick={() => handleDeleteEncoding(user.id)}>
                        <LockIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Encoding">
                      <IconButton onClick={() => handleEncoding(user.id)}>
                        <LockOpenIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {editModeRows[user.id] ? (
                    <div>
                      <IconButton onClick={() => handleSave(user.id)}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={() => handleCancel(user.id)}>
                        <Tooltip title="Undo">
                          <UndoIcon />
                        </Tooltip>
                      </IconButton>
                    </div>
                  ) : (
                    <div>
                      <IconButton onClick={() => handleEdit(user.id)}>
                        <Tooltip title="Edit">
                          <EditIcon />
                        </Tooltip>
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)}>
                        <Tooltip title="Delete">
                          <DeleteIcon />
                        </Tooltip>
                      </IconButton>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Button variant="contained" color="primary" onClick={handleEncodingAll} disabled={isLoading}>
          Encoding All
        </Button>
        {isLoading && <div>Loading...</div>}
        <ToastContainer />
      </Container>
    );
  };
  
  export default UsersManagement;
