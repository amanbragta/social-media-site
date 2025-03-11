import Card from "./Card";
import FriendInfo from "./FriendInfo";
import { createClient } from "@/utils/supabase/component";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";

export default function ProfileContent({
  activeTab,
  userId,
  avatarStatus,
  following,
}) {
  const supabase = createClient();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState([]);
  const [about, setAbout] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!userId) return;
    loadPosts().then(() => {});
  }, [userId, avatarStatus]);
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
      .order("created_at", { ascending: false })
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
            <PostCard
              key={post.created_at}
              {...post}
              profiles={profile}
              profile={profile}
            />
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
          <h2 className="text-3xl mb-2 p-4">Following</h2>
          <div className="grid grid-cols-2">
            {following.map((prof) => (
              <div key={prof.follow} className="border-b border-gray-100 p-4">
                <FriendInfo profile={prof.profiles} />
              </div>
            ))}
          </div>
        </Card>
      )}
      {activeTab === "photos" && (
        <Card>
          <div className="grid md:grid-cols-2 gap-4">
            {posts.map((post) => {
              return post.photos.map((pic) => (
                <div
                  key={pic}
                  className="flex items-center rounded-md overflow-hidden h-48 shadow-md"
                >
                  <img src={pic} alt="" />
                </div>
              ));
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
