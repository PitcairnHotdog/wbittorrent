'use client'
import "./page.css"
import { useState } from "react"
import SearchContainer from "../components/SearchContainer"
import TorrentList from "../components/TorrentList"
import { getDirectory } from '@/app/utils/api';

export default function Search() {
  const [fileInfo, setFileInfo] = useState([]);

  const getFileInfo = async (query) => {
    try {
      const data = await getDirectory(query);
      setFileInfo(data);
    } catch (error) {
      console.error("Failed to fetch search results", error);
    }
  }

  return (
    <>
    <div className="search-container">
      <SearchContainer onSearch={getFileInfo}/>
    </div>
    </>
  )
}
