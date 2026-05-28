import type { Metadata } from 'next';
import AssignmentCreateForm from '@/components/create/AssignmentCreateForm';

export const metadata: Metadata = {
  title: 'Create Assignment — VedaAI',
  description: 'Set up a new AI-powered assignment for your students.',
};

export default function CreateAssignmentPage() {
  return <AssignmentCreateForm />;
}
