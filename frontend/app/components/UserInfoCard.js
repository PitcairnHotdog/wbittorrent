'use client'
import * as React from 'react';
import { useState, useRef } from "react"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./FileUploadContainer.css"
import TextField from '@mui/material/TextField';

export default function UserInfoCard(props) {
    const [file, setFile] = useState(null);
    const inputRef = useRef();
    const { userInfo } = props

    const handleDragOver = (e) =>{
        e.preventDefault();
    }
    const handleDrop = (e) =>{
        e.preventDefault();
        console.log(e);
        setFile(e.dataTransfer.files[0]);
        console.log(e.dataTransfer.files[0]);
    }
  return (
    <Card sx={{ 
        minWidth: 275, 
        width: "70%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",  
        flexDirection: "column"
        }}>
      <CardContent sx={{width: "90%"}}>
        <h3>Username</h3>
      </CardContent>
      <CardActions>
        <Button size="small">Sign out</Button>
      </CardActions>
    </Card>
  );
}