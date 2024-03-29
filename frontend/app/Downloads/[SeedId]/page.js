'use client'
import React, { useState, useEffect, useContext } from 'react';
import PeerContext from '@/app/components/PeerContext';
import { getUserProgress } from "@/app/utils/api";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SeedDetail({ params }) {
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

    fetchProgress();
    const intervalId = setInterval(fetchProgress, 500); // Update progress every 500ms
    return () => clearInterval(intervalId);
  }, [userId]);

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
      {Object.entries(progress).map(([torrentId, torrentProgress]) => (
        <Accordion key={torrentId} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>Torrent ID: {torrentId}</Typography>
              <CircularProgress variant="determinate" value={torrentProgress.total * 100} size={30} />
              <Typography sx={{ ml: 2 }}>{(torrentProgress.total * 100).toFixed(2)}%</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {Object.entries(torrentProgress).filter(([key]) => key !== "total").map(([fileHash, fileInfo]) => (
              <Box key={fileHash} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ flexGrow: 1 }}>File {fileInfo.name}</Typography>
                <CircularProgress variant="determinate" value={fileInfo.progress * 100} size={20} />
                <Typography sx={{ ml: 2 }}>{(fileInfo.progress * 100).toFixed(2)}%</Typography>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
