import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// The root route redirects to the main dashboard view.
export default async function RootPage() {
  const token = (await cookies()).get('token')?.value;
  redirect(token ? '/assignments' : '/login');
}
