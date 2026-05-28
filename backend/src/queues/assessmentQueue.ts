import { Queue } from 'bullmq';
import { getRedisClient } from '../config/redis';

let assessmentQueue: Queue | null = null;

const getAssessmentQueue = (): Queue => {
  if (assessmentQueue) return assessmentQueue;

  // Lazily initialize queue so the server can boot in local auth-only mode
  // even when Redis is not configured yet.
  assessmentQueue = new Queue('assessment-queue', {
    connection: getRedisClient() as any,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

  return assessmentQueue;
};

export const addAssessmentJob = async (assignmentId: string, payload: any) => {
  return getAssessmentQueue().add('generate-assessment', {
    assignmentId,
    payload,
  });
};
