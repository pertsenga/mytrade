import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'MyTrade',
  description: 'Modern Securities Trading Journal',
};

export default function Page() {
  return redirect('/dashboard');
}
