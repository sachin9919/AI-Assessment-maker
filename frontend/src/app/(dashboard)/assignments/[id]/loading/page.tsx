'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function AssignmentLoadingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [status, setStatus] = useState('Starting the AI assistant...');

  useEffect(() => {
    // Connect to Socket.io server
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socket = io(backendUrl, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      // Join the assignment-specific room
      socket.emit('join_assignment', id);
    });

    socket.on('job:progress', (data: { message: string }) => {
      setStatus(data.message);
    });

    socket.on('job:completed', () => {
      setStatus('Generation complete! Redirecting...');
      setTimeout(() => {
        router.push(`/assignments/${id}/result`);
      }, 1000);
    });

    socket.on('job:failed', (data: unknown) => {
      const error =
        data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
          ? data.error
          : 'Unknown error';
      setStatus(`Failed to generate assessment: ${error}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center fade-up">
      <div className="w-16 h-16 border-4 border-[#eee] border-t-black rounded-full animate-spin mb-6" />
      <h1 className="text-xl font-semibold text-[#111] mb-2">Generating Assessment</h1>
      <p className="text-[#666]">{status}</p>
    </div>
  );
}
