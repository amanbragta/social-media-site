import Card from "./Card";
import FriendInfo from "./FriendInfo";
import { createClient } from "@/utils/supabase/component";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";

export default function ProfileContent({ activeTab, userId, avatarStatus }) {
  const supabase = createClient();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState([]);
  const [about, setAbout] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!userId) return;
    if (activeTab === "posts") {
      loadPosts().then(() => {});
    }
    if (activeTab === "about") {
      supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        .then((result) => setProfile(result.data?.[0]));
    }
  }, [userId, avatarStatus, activeTab]);
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

  function saveAbout() {
    supabase
      .from("profiles")
      .update({
        about,
      })
      .eq("id", profile?.id)
      .then(() => {
        setProfile({ ...profile, about });
        setIsEditMode(false);
      });
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
            <div className="flex justify-between">
              <h2 className="text-3xl mb-2">About me</h2>
              <div>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="bg-white shadow-sm shadow-gray-500 rounded-md px-3 py-1 cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            {isEditMode && (
              <div>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full p-3 h-32 resize-none border border-gray-300 rounded-md"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={saveAbout}
                    className="bg-white shadow-sm shadow-gray-500 rounded-md px-3 py-1 mr-2 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="bg-white shadow-sm shadow-gray-500 rounded-md px-3 py-1 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {!isEditMode && <p className="text-sm">{profile.about}</p>}
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
