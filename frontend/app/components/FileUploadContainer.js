'use client'
import React, { useState, useContext, useRef } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import "./FileUploadContainer.css";
import PeerContext from '@/app/components/PeerContext';

export default function FileUploadContainer() {
    const { generateTorrent } = useContext(PeerContext);
    const [files, setFiles] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [torrentId, setTorrentId] = useState("");
    const directoryInputRef = useRef();
    const fileInputRef = useRef();

    const handleUpload = () => {
        generateTorrent(title, description, files, isPrivate, setTorrentId);
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
                <input 
                    name="file" 
                    type="file" 
                    className='file' 
                    id="file-input" 
                    onChange={(e) => setFiles(e.target.files)}
                    hidden
                    ref={fileInputRef}
                />
                <Button size="small" onClick={() => fileInputRef.current.click()}>Select File</Button>
                <input 
                    name="directory" 
                    type="file" 
                    className='file' 
                    id="directory-input" 
                    onChange={(e) => setFiles(e.target.files)}
                    hidden
                    webkitdirectory="true"
                    multiple
                    ref={directoryInputRef}
                />
                <Button size="small" onClick={() => directoryInputRef.current.click()}>Select Directory</Button>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
                    <FormControlLabel
                        control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />}
                        label="Share Privately"
                    />
                </Box>
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
                    <Typography>Shared successfully! Torrent ID: {torrentId}</Typography>
                </CardContent>
            )}
        </Card>
    );
}