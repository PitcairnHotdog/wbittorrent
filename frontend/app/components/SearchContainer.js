'use client'
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Link from 'next/link';
import { getDirectory } from '@/app/utils/api';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const FavBtn = () => {
  const [fav, setFav] = useState(false);

  return (
    <IconButton variant="contained" disabled={fav ? true : false} onClick={() => setFav(!fav)}>
      <FavoriteBorder />
    </IconButton>
  );
};

export default function SearchContainer({ onSearch }) {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSearch = async () => {
    const result = await getDirectory(query);
    setSearchResult(result);
  };

  return (
    <Card sx={{ minWidth: 275, width: "70%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <CardContent sx={{ width: "90%" }}>
        <Typography variant="h5" component="div">
          Search
        </Typography>
        <TextField 
          id="standard-basic" 
          label="Search with hashlink" 
          variant="standard" 
          sx={{ width: "100%", marginY: 2 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button size="small" onClick={handleSearch}>Search</Button>
        {searchResult && (
          <>
            <Box sx={{ marginY: 2 }}>
              <Link href={"/Downloads/" + searchResult._id}>
                <Typography variant="h6" component="div" sx={{ cursor: 'pointer' }}>{searchResult.title}</Typography>
              </Link>
              <FavBtn />
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="body1" gutterBottom>
                    {searchResult.description}
                  </Typography>
                  <Typography variant="body2">{searchResult._id}</Typography>
                </Box>
              </Collapse>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}