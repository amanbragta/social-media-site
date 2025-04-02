import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useState } from "react";

export default function SavedPosts() {
  const supabase = createClient();
  const [saved, setSaved] = useState([]);
  const [gotRemoved, setGotRemoved] = useState(false);
  const [session, setSession] = useState();
  useEffect(() => {
    supabase.auth.getSession().then((result) => {
      const session = result.data?.session?.user?.id;
      setSession(session);
      supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", session)
        .then((result) => {
          const postId = result.data?.map((res) => res.post_id);
          supabase
            .from("posts")
            .select("*,profiles(*)")
            .in("id", postId)
            .then((result) => setSaved(result.data));
        });
    });
  }, [gotRemoved]);
  return (
    <Layout>
      <h1 className="text-6xl text-gray-300 mb-4">Saved posts</h1>
      {!session ? (
        <p>Login to save posts</p>
      ) : (
        <>
          {saved?.length > 0 &&
            saved.map((save) => (
              <div key={save.id}>
                <PostCard
                  {...save}
                  gotRemoved={setGotRemoved}
                  profile={session}
                  session={session}
                />
              </div>
            ))}
        </>
      )}
    </Layout>
  );
}
