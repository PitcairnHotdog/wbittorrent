/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { useEffect, useContext  } from "react"
import PeerContext from '@/app/components/PeerContext';

export default function seedDetail( {params} ){
    const { downloadTorrent } = useContext(PeerContext);

    useEffect(() => {
        downloadTorrent(params.SeedId);
    }, [downloadTorrent, params.SeedId]);

    return <h1>{params.SeedId}</h1>;
}