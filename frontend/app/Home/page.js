'use client'
import { useState, useEffect } from "react"
import TorrentList from "../components/TorrentList"
import "./page.css"
import { getAllDirectory } from "../utils/api"

export default function Home() {
  const [fileInfos, setFileInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
      getAllDirectory(page, rowsPerPage).then(({ data, totalCount }) => {
          setFileInfos(data);
          setTotalCount(totalCount);
      });
  }, [page, rowsPerPage]);

  return (
    <div className="hashlinkTable">
        <TorrentList
            FileInfos={fileInfos}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            totalCount={totalCount}
        />
    </div>
);
}
