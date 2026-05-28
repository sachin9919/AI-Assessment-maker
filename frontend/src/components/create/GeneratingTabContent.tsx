'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function GeneratingTabContent({ id }: { id: string }) {
  const router = useRouter();
  const [status, setStatus] = useState('Starting the AI assistant...');
  const [progress, setProgress] = useState(0);

  // Asymptotic progress bar logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // cap at 95% until completion
        // Gradually slow down as it gets closer to 100
        return prev + (95 - prev) * 0.1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Socket.io logic
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socket = io(backendUrl, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      socket.emit('join_assignment', id);
    });

    socket.on('job:progress', (data: { message: string }) => {
      setStatus(data.message);
    });

    socket.on('job:completed', () => {
      setStatus('Generation complete! Redirecting...');
      setProgress(100);
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
    <div className="bg-white rounded-[20px] p-5 md:p-8 flex flex-col items-center justify-center min-h-[400px] w-full text-center shadow-sm">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <h2 className="text-[1.5rem] font-medium text-[#111] animate-pulse">
          {status}
        </h2>
        
        {/* Progress Bar Container */}
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
