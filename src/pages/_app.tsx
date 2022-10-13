import { supabase } from "@/lib/client";
import "@/styles/style.scss";
import { useRouter } from "next/router";
import { useEffect } from "react";

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      router.push("/");
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return <Component {...pageProps} />;
};

export default App;
