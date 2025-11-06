// app/(public routes)/layout.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // refresh викличе перезавантаження даних
    router.refresh();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [router]);

  return <>{loading ? <div>Loading...</div> : children}</>;
}
