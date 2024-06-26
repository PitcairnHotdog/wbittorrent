'use client'
import * as React from 'react';
import Link from 'next/link'
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const FavBtn =() =>{
  const [fav, setFav] = React.useState(false);

  return(
    <>
    <IconButton variant="contained" disabled={fav? true : false} onClick={() => setFav(!fav)}>
    <FavoriteBorder /> 
    </IconButton>
    </>
    
  )
  
}

const FileRow = (props) => {
    const { FileInfo } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow>
              <TableCell sx={{width:"10px"}}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                <Link href={"/Downloads/" + FileInfo._id}>
                  <h3>{FileInfo.title}</h3>
                </Link>
              </TableCell>
              <TableCell style={{ width: 100 }} align="right">
                <FavBtn/>
              </TableCell>
            </TableRow>
            <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    {FileInfo.description}
                  </Typography>
                  <p>{FileInfo._id}</p>
                </Box>
              </Collapse>
            </TableCell>
            </TableRow>
        </>
    )
}

export default function TorrentList(props) {
  const { page, setPage, rowsPerPage, setRowsPerPage, totalCount } = props;
  const FileInfos = props.FileInfos || [];

  const handleChangePage = (event, newPage) => {
      setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(1);
  };

  return (
    <TableContainer component={Paper} 
    sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "90%",
        flexDirection: "column"
    }}>
      <h2>Public Hashlink</h2>
      <Table sx={{ maxWidth: "80%" }} aria-label="custom pagination table">
                <TableBody>
                    {FileInfos.map((FileInfo, index) => (
                        <FileRow key={index} FileInfo={FileInfo} />
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page - 1} // Adjust for zero-based indexing expected by TablePagination
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
    </TableContainer>
  );
}