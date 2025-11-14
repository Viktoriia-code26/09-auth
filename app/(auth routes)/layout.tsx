"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import css from "@/components/Loader/Loader.module.css";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.refresh();

    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <div className={css.text}>
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
