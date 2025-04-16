"use client"
import { useEffect, useState } from 'react';
import { Albums, AlbumProps, Images, ImageProps} from '@/app/cases/album';
import {Button} from "@/components/ui/button";
import React, { useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { fetchGalleries, uploadFiles, deleteAlbum, fetchAlbum , deletePhoto, addPhoto} from '@/app/api/manage';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Checkbox } from "@/components/ui/checkbox"

const Page = () => {
  const [message, setMessage] = useState<string>('');
  const [albums, setAlbums] = useState<Albums>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    setLoading(true); 
    const data = await fetchGalleries();
    setAlbums(data);
    setLoading(false); 
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAlbum = async (album:AlbumProps) => {
    const success = await deleteAlbum(album.title);
    if (success) {
      setMessage("Album deleted successfully");
      setAlbums(albums.filter(item => item.title !== album.title));
    } else {
      setMessage("Failed to delete album");
    }
  };

  const handleEditClick = (album:AlbumProps) => {
        setCurrentAlbum(album);
        setShowEditModal(true);
    };

  return (
    <div className="upload-container ">
      {message && <p className="message">{message}</p>}
      <Card  className="mt-6">
        <CardHeader>
        <div className="flex items-center justify-center" >
          <CardTitle> 相簿 </CardTitle>
          <Button onClick={() => setShowUpload(true)} className="ml-24">上傳相簿</Button>
          </div>
        </CardHeader>
        <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : (
              <div>
              {albums.map((album, index) => (
                <div className="mt-6 flex" >
                    <Menubar className="w-full justify-between">
                    <MenubarMenu >
                        <MenubarTrigger> {index+1}. {album.title} </MenubarTrigger>
                        </MenubarMenu>
                      <MenubarMenu>
                        <MenubarTrigger onClick={() => handleEditClick(album)}>編輯相簿</MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                        <MenubarTrigger onClick={() => handleDeleteAlbum(album)}>刪除相簿</MenubarTrigger>
                        </MenubarMenu>
                      </Menubar>
                </div>
            ))}
            {showUpload && (
                <UploadModal fetchData={fetchData} setMessage={setMessage} onClose={() => setShowUpload(false)} />
            )}
            {showEditModal && currentAlbum && (
                <EditModal album={currentAlbum} onClose={() => setShowEditModal(false)} />
            )}
            </div>
              )}
        </CardContent>
      </Card>
      <div>
            
        </div>
    </div>
  );
};

export default Page;

const UploadModal = ({fetchData, setMessage, onClose}: {fetchData: () => void, setMessage:(msg: string) => void, onClose: () => void }) => {
  const [galleryName, setGalleryName] = useState('');
  const [count, setCount] = useState('選取文件');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = event.target.files; // 
      setFiles(Array.from(fileList));
      setCount(`已選取(${fileList.length})`)
    }
  };

  const handleSubmit = async (event:any) => {
    event.preventDefault();
    setUploading(true);
    try {
      const data = await uploadFiles(galleryName, files);
      setMessage('上傳成功');
      fetchData();
      onClose();
      console.log(data);
    } catch (error) {
      setMessage('上傳失敗');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
    };
    const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='overlay'>
    <Card className="card-container">
      <CardHeader>
        <CardTitle>上傳相簿</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <input type="text" value={galleryName} onChange={(e) => setGalleryName(e.target.value)} placeholder="請輸入相簿名稱" />
          <input type="file" multiple onChange={handleFileChange}  ref={fileInputRef} className="input" />
          <Button className="ml-6" type="button" onClick={handleButtonClick}> {count} </Button>
          <Button className="ml-6" type="submit" disabled={uploading}>
            {uploading ? '上傳中...' : '上傳'}
          </Button>
          <Button onClick={onClose} className='ml-6'>
            關閉視窗
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
      
  )
}

const EditModal = ({ album, onClose }: { album: any; onClose: () => void }) => {
  const [photos, setPhotos] = useState<Images>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const fetchData = async () => {
    const data = await fetchAlbum(album.title);
    setPhotos(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPhoto = async(event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileList = Array.from(event.target.files); 
      await uploadFiles(album.title, fileList);
      fetchData();
    }
  };

  const handleSelect = (id: number) => {
    if (id == -1){
      setSelected([]);
      return;
    }else if (id == -2) {
      setSelected([...Array(photos.length).keys()]);
    }else if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
    console.log(selected);
  };

  const handleDeletePhoto = async () => {
    const response = await deletePhoto(album.title, selected);
    console.log(response);
    fetchData();
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
      fileInputRef.current.click();
  };

  return (
    <div className='overlay'>
  <Card className="card-container">
    <CardHeader>
      <CardTitle>編輯: {album.title}</CardTitle>
    </CardHeader>
    <CardContent>
          <div>
          <DataTable columns={getColumns(handleSelect)} data={photos} />
        </div>
    </CardContent>
    <CardFooter>
    <Menubar>
        <MenubarMenu>
          <input type="file" multiple onChange={handleAddPhoto}  ref={fileInputRef} className="input" />
          <MenubarTrigger type="button" onClick={handleButtonClick}>新增</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
          <MenubarTrigger onClick={handleDeletePhoto}>刪除</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
          <MenubarTrigger onClick={onClose}>關閉</MenubarTrigger>
          </MenubarMenu>
          </Menubar>
    </CardFooter>
  </Card>
  </div>
  );
};

export const getColumns = (setSelected:(id:number) => void) : ColumnDef<ImageProps>[] =>{
  const onClick = (row, value) =>{
    row.toggleSelected(!!value);
    setSelected(row.id);
  }

  const onClickAll = (table, value) =>{
    table.toggleAllPageRowsSelected(!!value);
    if(value){
      setSelected(-2);
    }else{
      setSelected(-1);
    }
  }

  return [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => onClickAll(table, value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => onClick(row, value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "src",
    header: "SRC",
  },
]
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
 
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}