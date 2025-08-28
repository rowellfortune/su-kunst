import { useAppContext } from '@/lib/contextLib';
import { BellRing } from 'lucide-react';

export default function Notifications() {
   const {isAuthenticated} = useAppContext();

  return (
    <div className='px-4'>
      {isAuthenticated ? <BellRing /> : null}
    </div>
  );
}
