import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


export interface AlbumProps {
    src: string;
    title: string;
}

export interface ImageProps {
    src: string;
}

export type Albums = AlbumProps[];
export type Images = ImageProps[];



const Album = ({ src, title }: AlbumProps) => {
    return (
        <Link href={`/album-detail?title=${encodeURIComponent(title)}`}>
            <div style={{ margin: '10px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                <Image src={`http://127.0.0.1:5568${src}`} alt={title} width={250} height={250} />
                <h3>{title}</h3>
            </div>
        </Link>
    );
};

const AlbumDetail = ({ src }: ImageProps) => {
    return (
            <div style={{ margin: '10px', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                <Image src={`http://127.0.0.1:5568${src}`} alt="" width={250} height={250} />
                <h3>{src}</h3>
            </div>
    );
};

export {Album, AlbumDetail};