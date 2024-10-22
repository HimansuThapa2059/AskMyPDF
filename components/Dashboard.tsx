'use client';
import React, { useEffect, useState } from 'react';
import UploadButton from './UploadButton';
import Skeleton from 'react-loading-skeleton';
import {
  Ghost,
  CircleX,
  Plus,
  MessageSquare,
  Trash,
  Loader2,
} from 'lucide-react';
import axios from 'axios';
import { FileArray } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from './ui/button';

const Dashboard = () => {
  const [files, setFiles] = useState<FileArray>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setError(null);
        const response = await axios.get('/api/files');
        const files: FileArray = response.data;

        setFiles(files);
      } catch (err) {
        setError('Something went wrong!');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleDelete = async (fileId: string) => {
    try {
      setCurrentlyDeletingFile(fileId);
      setError(null);
      await axios.delete(`/api/files/${fileId}`);
      setFiles(files.filter((file) => file.id !== fileId)); // Remove deleted file from state
    } catch (err) {
      setError('Something went wrong during deletion!');
    } finally {
      setCurrentlyDeletingFile(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto md:p-10 ">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadButton />
      </div>

      {isLoading && (
        <div className="mt-4 text-gray-500">
          <Skeleton height={100} className="my-2" count={3} />
        </div>
      )}
      {error && (
        <div className="mt-16 flex flex-col items-center gap-2">
          <CircleX className="h-8 w-8 text-zinc-800" stroke="red" />
          <h3 className="font-semibold text-xl lg:text-2xl">{error}</h3>
          <p>try again later</p>
        </div>
      )}

      {/* Only render files if not loading, no error, and files exist */}
      {!isLoading && !error ? (
        files.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            {files
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((file) => (
                <li
                  key={file.id}
                  className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
                >
                  <Link
                    href={`/dashboard/${file.id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="pt-6 px-6 w-full flex items-center justify-between space-x-6">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3">
                          <h3 className="truncate text-lg font-medium text-zinc-900">
                            {file.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>
                        {format(new Date(file.createdAt), 'dd MMM yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>mocked</span>
                    </div>

                    <Button
                      onClick={() => handleDelete(file.id)}
                      variant="destructive"
                      size="sm"
                      className="w-full text-zinc-500 bg-transparent hover:bg-rose-100 border border-rose-300"
                    >
                      {currentlyDeletingFile === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" stroke="red" />
                      )}{' '}
                      <span>Delete</span>
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">Pretty empty around here</h3>
            <p>let&apos;s upload your first pdf</p>
          </div>
        )
      ) : null}
    </main>
  );
};

export default Dashboard;
