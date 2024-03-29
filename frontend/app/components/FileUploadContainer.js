'use client'
import React, { useState, useContext, useRef } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import "./FileUploadContainer.css";
import PeerContext from '@/app/components/PeerContext';

export default function FileUploadContainer() {
    const { generateTorrent } = useContext(PeerContext);
    const [files, setFiles] = useState(null); // Use this for both single and multiple files
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [torrentId, setTorrentId] = useState(""); // To store the torrent ID after upload
    const directoryInputRef = useRef(); // Reference for directory input
    const fileInputRef = useRef(); // Reference for single file input

    const handleUpload = () => {
        // Assuming generateTorrent can handle both single and multiple files the same way
        generateTorrent(title, description, files, setTorrentId);
    };

    return (
        <Card sx={{ minWidth: 275, width: "70%"}}>
            <CardContent>
                <div className='textinput-container'>
                    <TextField 
                        id="file-name" 
                        label="Title" 
                        variant="standard" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} />
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
                {/* Single file upload input */}
                <input 
                    name="file" 
                    type="file" 
                    className='file' 
                    id="file-input" 
                    onChange={(e) => setFiles(e.target.files)} // Adapted for single or multiple files
                    hidden
                    ref={fileInputRef}
                />
                <Button size="small" onClick={() => fileInputRef.current.click()}>Select File</Button>
                {/* Directory upload input */}
                <input 
                    name="directory" 
                    type="file" 
                    className='file' 
                    id="directory-input" 
                    onChange={(e) => setFiles(e.target.files)}
                    hidden
                    webkitdirectory="true"
                    multiple // Allows multiple file selection
                    ref={directoryInputRef}
                />
                <Button size="small" onClick={() => directoryInputRef.current.click()}>Select Directory</Button>
                {files && files.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Selected Files:</Typography>
                        {Array.from(files).map((file, i) => (
                            <Typography key={i}>{file.name}</Typography>
                        ))}
                    </Box>
                )}
            </CardContent>
            <CardActions>
                <Button 
                    size="small" 
                    disabled={!files || files.length === 0 || !title} 
                    onClick={handleUpload}
                >
                    Upload
                </Button>
            </CardActions>
            {torrentId && (
                <CardContent>
                    <Typography>Torrent ID: {torrentId}</Typography>
                </CardContent>
            )}
        </Card>
    );
}