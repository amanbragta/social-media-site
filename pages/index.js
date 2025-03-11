import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import PostFormCard from "@/components/PostFormCard";
import { createClient } from "@/utils/supabase/component";
import LoginPage from "./login";
import { useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";

export default function Home() {
  const supabase = createClient();
  const [flag, setFlag] = useState(false);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    supabase.auth
      .getSession()
      .then((obj) => {
        if (obj.data.session) {
          setFlag(true);
        }
        return supabase
          .from("profiles")
          .select()
          .eq("id", obj.data.session?.user?.id);
      })
      .then((result) => setProfile(result.data?.[0]));
    fetchPosts();
  }, []);

  function fetchPosts() {
    supabase
      .from("posts")
      .select("id,content,created_at,photos, profiles(id,avatar,name)")
      .is("parent", null)
      .order("created_at", { ascending: false })
      .then((result) => setPosts(result.data));
  }

  if (!flag) return <LoginPage flag={setFlag} />;

  return (
    <Layout flag={setFlag} profile={profile}>
      <UserContext.Provider value={profile}>
        <PostFormCard onPost={fetchPosts} />
        {posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            profile={profile}
            onPost={fetchPosts}
          />
        ))}
      </UserContext.Provider>
    </Layout>
  );
}
