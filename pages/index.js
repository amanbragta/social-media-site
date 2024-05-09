import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostFormCard from "@/components/PostFormCard";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import LoginPage from "./login";
import { useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id)
      .then((result) => {
        if (result?.data?.length) {
          setProfile(result.data[0]);
        }
      });
  }, [session]);

  useEffect(() => {
    supabase
      .from("posts")
      .select("id,created_at,content,photos, profiles(id,avatar,name)")
      .is("parent", null)
      .order("created_at", { ascending: false })
      .then((result) => {
        setPosts(result.data);
      });
  }, [posts]);

  if (!session) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <UserContext.Provider value={{ profile }}>
        <PostFormCard />
        {posts?.length > 0 &&
          posts.map((post) => <PostCard key={post.created_at} {...post} />)}
      </UserContext.Provider>
    </Layout>
  );
}
