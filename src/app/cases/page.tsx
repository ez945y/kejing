"use client"
import type { NextPage } from 'next';
import MainNav from "@/components/mainNav";
import MainFooter from "@/components/mainFooter";
import {AlbumsGrid} from './album_grid';
import { useState, useEffect } from 'react';
import { fetchGalleries } from '@/app/api/manage';

const casePage: NextPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12; 
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const data = await fetchGalleries();
        setAlbums(data);
      };
      fetchData();
    }, []);

    const numPages = Math.ceil(albums.length / perPage);
    const handleChangePage = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
      <div className='wrapper'>
        <MainNav/>
        <div className='flex-1 mt-16'>
                  <h1 className="text-center text-4xl mt-8 mb-8">住宅裝修</h1>
                  <AlbumsGrid albums={albums.slice((currentPage - 1) * perPage, currentPage * perPage)} perPage={perPage} />
                  <div style={{ textAlign: 'center' }}>
                  <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}>
                          &#9664; 
                      </button>
                      {Array.from({ length: numPages }, (_, i) => (
                          <button key={i} onClick={() => handleChangePage(i + 1)} style={{ margin: '5px',
                          color: currentPage === i + 1 ? 'black' : 'grey' }}>
                              {i + 1}
                          </button>
                      ))}
                      <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === numPages}>
                          &#9654;
                      </button>
                  </div>
          </div>
        <MainFooter />
        </div>
    );
};

export default casePage;