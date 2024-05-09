import { useEffect, useState } from "react";
import Card from "./Card";
import FriendsInfo from "./FriendsInfo";
import PostCard from "./PostCard";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ProfileContent({ activeTab, profile, userId }) {
  const [posts, setPosts] = useState([]);
  const supabase = useSupabaseClient();
  const [photos, setPhotos] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("posts")
      .select("id,created_at,content,author,photos")
      .is("parent", null)
      .order("created_at", { ascending: false })
      .eq("author", userId)
      .then(({ data, error }) => {
        if (error) throw error;
        else {
          setPosts(data);
        }
      });

    supabase
      .from("friends")
      .select()
      .eq("friend_id", userId)
      .then((result1) => {
        supabase
          .from("profiles")
          .select()
          .then((result2) => {
            const arr = result1.data.map((res1) =>
              result2.data.find((res2) => res1.user_id === res2.id)
            );

            setFriends(arr);
          });
      });
  }, [userId, friends]);

  return (
    <div>
      {activeTab === "posts" && (
        <div>
          {posts.length > 0 &&
            posts.map((post) => (
              <PostCard key={post.id} {...post} profiles={profile} />
            ))}
        </div>
      )}
      {activeTab === "about" && (
        <div>
          <Card>
            <h2 className="text-2xl mb-2">About me</h2>
            <p className="mb-2 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="mb-2 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Card>
        </div>
      )}
      {activeTab === "friends" && (
        <div>
          <Card>
            {friends.map((friend) => (
              <div
                className="border-b border-b-gray-100 p-4 -mx-4"
                key={friend.created_at}
              >
                <FriendsInfo {...friend} />
              </div>
            ))}
          </Card>
        </div>
      )}
      {activeTab === "media" && (
        <div>
          <Card>
            {posts.map((post) => (
              <div className="grid md:grid-cols-1" key={post}>
                {post.photos.map((pic) => (
                  <div
                    key={pic}
                    className="rounded-md overflow-hidden h-48 flex items-center mt-2"
                  >
                    <img src={`${pic}`} />
                  </div>
                ))}
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
