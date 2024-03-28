'use client'
import { useState, useEffect } from "react"
import TorrentList from "../components/TorrentList"
import "./page.css"
import { getAllDirectory } from "../utils/api"

export default function Home() {
    const [fileInfos, setFileInfos] = useState([]);
    useEffect(() => {
        getAllDirectory().then((res) => {
            setFileInfos(res);
        });
    }, [])

  return (
    <>
    <div className="hashlinkTable">
      <TorrentList
          FileInfos={fileInfos}
      />
    </div>
    </>
  )
}
