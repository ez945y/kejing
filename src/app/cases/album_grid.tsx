// components/AlbumGrid.tsx
"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import {Albums, Album, AlbumDetail, Images} from './album';
import { fetchAlbum } from '@/app/api/manage';

interface AlbumsGridProps {
    albums: Albums;
    perPage: number;
}

interface AlbumGridProps {
    title: string;
}

const AlbumsGrid = ({ albums, perPage }: AlbumsGridProps) => {
    return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {albums.slice(0, perPage).map((album, index) => (
                    <Album key={index} src={album.src} title={album.title}></Album>
                ))}
            </div> 
    );
};

const AlbumGrid = ({ title }: AlbumGridProps) => {
    const [album, setAlbum] = useState<Images>([]);
    useEffect(() => {
    const fetchAlbums = async () => {
      const data = await fetchAlbum(title);
      setAlbum(data);
    };
    fetchAlbums();
  }, []);
  console.log(album.toString());
    return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {album.map((photo) => (
                    <AlbumDetail src={photo.src}></AlbumDetail>
                ))}
            </div> 
    );
};

export {AlbumGrid, AlbumsGrid};


