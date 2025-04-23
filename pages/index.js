import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/step1"); // replace avoids adding to browser history
  }, [router]);

  return null;
}
