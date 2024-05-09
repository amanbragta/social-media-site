import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import Cover from "@/components/Cover";
import Layout from "@/components/Layout";
import ProfileContent from "@/components/ProfileContent";
import ProfileTabs from "@/components/ProfileTabs";
import { UserContextProvider } from "@/contexts/UserContext";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProfilePage({ children }) {
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const session = useSession();
  const tab = router?.query?.tab?.[0] || "posts";
  const [isEditmode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const userId = router.query.Id;
  const supabase = useSupabaseClient();
  const isMyUser = userId === session?.user?.id;
  const [addFriend, setAddFriend] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchUser();
  }, [userId]);

  function fetchUser() {
    supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .then((result) => {
        if (result.error) throw result.error;
        if (result.data) setProfile(result.data[0]);
      });
  }

  function fetchFriends() {
    if (!session?.user?.id) return;
    supabase
      .from("friends")
      .select()
      .eq("user_id", session?.user?.id)
      .then((result) => {
        const isFriend = !!result.data.find((val) => val.friend_id === userId);
        setAddFriend(isFriend);
      });
  }

  function addToFriendlist() {
    supabase
      .from("friends")
      .insert({
        user_id: session?.user?.id,
        friend_id: userId,
      })
      .then((result) => {
        setAddFriend(true);
      });
  }

  function deleteFriend() {
    supabase
      .from("friends")
      .delete()
      .eq("friend_id", userId)
      .then((result) => {
        setAddFriend(false);
      });
  }

  function saveProfile() {
    supabase
      .from("profiles")
      .update({
        name,
        place,
      })
      .eq("id", session?.user?.id)
      .then((result) => {
        if (!result.error) {
          setProfile((prev) => ({ ...prev, name, place }));
        }
      });
    setIsEditMode(false);
  }

  return (
    <Layout>
      <UserContextProvider>
        <Card noParam={true}>
          <div className="relative rounded-md overflow-hidden">
            <Cover
              url={profile?.cover}
              editable={isMyUser}
              onChange={fetchUser}
            />
            <div className="absolute top-24 left-4 z-20">
              {profile && (
                <Avatar
                  url={profile?.avatar}
                  size={"lg"}
                  editable={isMyUser}
                  onChange={fetchUser}
                />
              )}
            </div>
            <div className="p-4 pt-1 md:pt-4 pb-0">
              <div className=" ml-24 md:ml-40 flex justify-between">
                <div>
                  {isEditmode && (
                    <div>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="border py-2 px-3 rounded-md"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  )}
                  {!isEditmode && (
                    <h1 className="font-bold text-2xl">{profile?.name}</h1>
                  )}
                  {!isEditmode && (
                    <div className="text-gray-500 leading-4">
                      {profile?.place}
                    </div>
                  )}
                  {isEditmode && (
                    <div>
                      <input
                        type="text"
                        placeholder="Location"
                        className="border py-2 px-3 rounded-md mt-1"
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="grow">
                  <div className="text-right">
                    {isMyUser && !isEditmode && (
                      <button
                        onClick={() => {
                          setIsEditMode(true);
                          setName(profile?.name);
                          setPlace(profile?.place);
                        }}
                        className="inline-flex gap-1 shadow-sm shadow-gray-500 px-2 py-1 rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        Edit profile
                      </button>
                    )}
                    {isMyUser && isEditmode && (
                      <div>
                        <button
                          onClick={saveProfile}
                          className="inline-flex mx-2 gap-1 shadow-sm shadow-gray-500 px-2 py-1 rounded-md"
                        >
                          Save profile
                        </button>
                        <button
                          onClick={() => setIsEditMode(false)}
                          className="inline-flex gap-1 shadow-sm shadow-gray-500 px-2 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {!isMyUser && !addFriend && (
                      <div>
                        <button
                          onClick={addToFriendlist}
                          className="inline-flex mx-2 gap-1 shadow-sm shadow-gray-500 px-2 py-1 rounded-md"
                        >
                          Add friend
                        </button>
                      </div>
                    )}
                    {!isMyUser && addFriend && (
                      <div>
                        <button
                          onClick={deleteFriend}
                          className="inline-flex mx-2 gap-1 px-2 py-1 rounded-md bg-socialBlue text-white"
                        >
                          Remove friend
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ProfileTabs userId={profile?.id} active={tab} />
            </div>
          </div>
        </Card>
        <ProfileContent activeTab={tab} profile={profile} userId={userId} />
      </UserContextProvider>
    </Layout>
  );
}
