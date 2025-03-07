import Card from "./Card";
import FriendInfo from "./FriendInfo";
import { createClient } from "@/utils/supabase/component";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";

export default function ProfileContent({ activeTab, userId }) {
  const supabase = createClient();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    if (!userId) return;
    if (activeTab === "posts") {
      loadPosts().then(() => {});
    }
  }, [userId]);
  async function loadPosts() {
    const posts = await fetchPosts(userId);
    const profile = await fetchProfile(userId);
    setPosts(posts);
    setProfile(profile);
  }
  async function fetchPosts(userId) {
    const { data } = await supabase
      .from("posts")
      .select()
      .is("parent", null)
      .eq("author", userId);
    return data;
  }

  async function fetchProfile(userId) {
    const { data } = await supabase.from("profiles").select().eq("id", userId);
    return data?.[0];
  }
  return (
    <div>
      {activeTab === "posts" && (
        <div>
          {posts.map((post) => (
            <PostCard key={post.created_at} {...post} profiles={profile} />
          ))}
        </div>
      )}
      {activeTab === "about" && (
        <Card>
          <div>
            <h2 className="text-3xl mb-2">About me</h2>
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </Card>
      )}
      {activeTab === "friends" && (
        <Card noPadding={true}>
          <h2 className="text-3xl mb-2 p-4">Friends</h2>
          <div className="grid grid-cols-2">
            <div className="border-b border-gray-100 p-4">
              <FriendInfo />
            </div>
            <div className="border-b border-gray-100 p-4">
              <FriendInfo />
            </div>
            <div className="border-b border-gray-100 p-4">
              <FriendInfo />
            </div>
            <div className="border-b border-gray-100 p-4">
              <FriendInfo />
            </div>
            <div className="border-b border-gray-100 p-4">
              <FriendInfo />
            </div>
            <div className="border-b border-gray-100 p-4">
              <FriendInfo />
            </div>
            <div className="border-b border-gray-100 p-4">
              <FriendInfo />
            </div>
          </div>
        </Card>
      )}
      {activeTab === "photos" && (
        <Card>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center rounded-md overflow-hidden h-48 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1546213290-e1b492ab3eee?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="flex items-center rounded-md overflow-hidden h-48 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1740978845296-ad92aa72c017?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="flex items-center rounded-md overflow-hidden h-48 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1740767581333-0e83e94c7f6e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
            <div className="flex items-center rounded-md overflow-hidden h-48 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1740905546458-3df27533ddc7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
