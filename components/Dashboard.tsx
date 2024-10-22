'use client';
import React, { useEffect, useState } from 'react';
import UploadButton from './UploadButton';
import Skeleton from 'react-loading-skeleton';
import { Ghost, CircleX, Plus, MessageSquare, Trash } from 'lucide-react';
import axios from 'axios';
import { FileArray } from '@/lib/types';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from './ui/button';

const Dashboard = () => {
  const [files, setFiles] = useState<FileArray>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

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
          <div>all files</div>
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
