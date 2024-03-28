'use client'
import * as React from 'react';
import { useState, useContext, useRef } from "react"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import "./FileUploadContainer.css"
import PeerContext from '@/app/components/PeerContext';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', 
          mx: '2px', 
          transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function FileUploadContainer() {
    const { generateTorrent } = useContext(PeerContext);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const inputRef = useRef();
    const multiInputRef = useRef();
    const handleDragOver = (e) =>{
        e.preventDefault();
    }
    const handleDrop = (e) =>{
        e.preventDefault();
        setFile(e.dataTransfer.files[0]);
    }
  return (
    <Card sx={{ minWidth: 275, width: "70%"}}>
      <CardContent>
      <div className='textinput-container'>
            <TextField id="file-name" label="Title" variant="standard" value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField
            id="file-description"
            label="Description"
            multiline
            rows={4}
            variant="filled"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </div>
        <input 
            name="file" 
            type="file" 
            className='file' 
            id="file-input" 
            onChange={(e) => setFile(e.target.files)}
            hidden
            webkitdirectory="true"
            ref={inputRef}
        />
        <h3>Upload File</h3>
        <input 
            name="file" 
            type="file" 
            id="filepicker" 
            webkitdirectory multiple
            onChange={(e) => setFile(e.target.files)}
            hidden
            ref={multiInputRef}
        />
        <Button size="small" onClick={ () => multiInputRef.current.click()}>Select File</Button>
        <h3>Upload Folder</h3>
        <Button onClick={ () => inputRef.current.click()}>Select Folder</Button>
        {file && file.length > 0 && Array.from(file).map((file, i) => (
          <p key={i}>{file.name}</p>
        ))}
        {!file || file.length === 0 && (<p>no file selected</p>)}
      </CardContent>
        
      <CardActions>
        <Button size="small" disabled={!file || file.length === 0 || !title} onClick={() => generateTorrent(title, description, file)}>Upload</Button>
      </CardActions>
    </Card>
  );
}