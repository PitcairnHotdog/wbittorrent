'use client'
import { useState, useEffect, useContext  } from "react"
import React from 'react'
import PeerContext from '@/app/components/PeerContext';
import { getUserProgress } from "@/app/utils/api";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function seedDetail( {params} ){
  const { userId } = useContext(PeerContext);
  const { downloadTorrent } = useContext(PeerContext);

  const [progress, setProgress] = useState({});

  useEffect(() => {
    const fetchProgress = () => {
    getUserProgress(userId)
        .then(progressData => {
        setProgress(progressData);
        })
        .catch(error => {
        console.error("Failed to fetch user progress:", error);
        });
    };

    // Call the function immediately to get the initial progress
    fetchProgress();

    // Set up an interval to fetch the progress every half second
    const intervalId = setInterval(fetchProgress, 500); // 500 milliseconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [userId]); // Re-run the effect if the userId changes




  useEffect(() => {
    downloadTorrent(params.SeedId);
  }, [downloadTorrent, params.SeedId]);

  if (!progress || Object.keys(progress).length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Download Progress</Typography>
        <Typography>No progress data available.</Typography>
      </Box>
    );
  }
  
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Download Progress</Typography>
        {Object.entries(progress).map(([torrentId, fileMap]) => (
          <Card key={torrentId} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Torrent ID: {torrentId}</Typography>
              {(!fileMap || Object.keys(fileMap).length === 0 || (Object.keys(fileMap).length === 1 && fileMap.total !== undefined)) ? (
                <Typography>No file progress data available.</Typography>
              ) : (
                Object.entries(fileMap).map(([fileHash, downloadPercentage]) => (
                  fileHash === "total" ? (
                    <Typography key={fileHash}><strong>Total Progress:</strong> {(downloadPercentage * 100).toFixed(2)}%</Typography>
                  ) : (
                    <Accordion key={fileHash}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>File {fileHash}: {(downloadPercentage * 100).toFixed(2)}%</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CircularProgress variant="determinate" value={downloadPercentage * 100} sx={{ mr: 2 }}/>
                          <Typography>{(downloadPercentage * 100).toFixed(2)}% downloaded</Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    );
}