import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import FriendInfo from "@/components/FriendInfo";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/component";
import Cover from "@/components/Cover";
import ProfileTabs from "@/components/ProfileTabs";
import ProfileContent from "@/components/ProfileContent";
import { UserContextProvider } from "@/contexts/UserContext";

export default function ProfilePage() {
  const supabase = createClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const router = useRouter();
  const [profile, setProfile] = useState();
  const userId = router.query.id;
  const active = router?.query?.tabs?.[0] || "posts";
  const [isMyUser, setIsMyUser] = useState(false);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [currSession, setCurrSession] = useState();
  const [following, setFollowing] = useState(false);
  const [usersFollowing, setUsersFollowing] = useState([]);
  const [loggedUserFollowing, setLoggedUserFollowing] = useState([]);

  useEffect(() => {
    if (!userId) return;
    fetchUser();
    fetchIsFollowing();
    fetchFollowers();
  }, [userId, following]);

  const isFollowedByMe = !!loggedUserFollowing?.find(
    (prof) => prof.follow === userId
  );

  // useEffect(() => {
  //   if (!userId) return;
  //   fetchUser();
  // }, [userId]);

  function fetchFollowers() {
    supabase
      .from("following")
      .select("*,profiles(*)")
      .eq("user_id", userId)
      .then((result) => {
        setUsersFollowing(result.data);
      });
  }

  function fetchIsFollowing() {
    supabase.auth.getSession().then((obj) => {
      setIsMyUser(obj.data?.session?.user?.id === userId);
      setCurrSession(obj.data?.session?.user?.id);
      supabase
        .from("following")
        .select("*,profiles(*)")
        .eq("user_id", obj.data?.session?.user?.id)
        .then((result) => {
          setLoggedUserFollowing(result.data);
        });
    });
  }

  function fetchUser() {
    supabase
      .from("profiles")
      .select()
      .eq("id", userId)
      .then((result) => {
        if (result.data) setProfile(result.data[0]);
        else {
          throw result.error;
        }
      });
  }

  function toggleFollow() {
    if (isFollowedByMe) {
      supabase
        .from("following")
        .delete()
        .eq("user_id", currSession)
        .eq("follow", userId)
        .then(() => setFollowing(!following));
    } else {
      supabase
        .from("following")
        .insert({
          user_id: currSession,
          follow: userId,
        })
        .then(() => setFollowing(!following));
    }
  }

  function updateProfile() {
    supabase
      .from("profiles")
      .update({
        name,
        place,
      })
      .eq("id", userId)
      .then((result) => {
        setProfile({ ...profile, name, place });
        setIsEditMode(false);
      });
  }

  return (
    <Layout>
      <UserContextProvider>
        <Card noPadding={true}>
          <div className="relative overflow-hidden rounded-md">
            <Cover
              url={profile?.cover}
              editable={isMyUser}
              fetchInfo={fetchUser}
            />
            <div className="absolute top-24 left-4 z-20">
              {profile && (
                <Avatar
                  url={profile.avatar}
                  size="lg"
                  editable={isMyUser}
                  fetchInfo={fetchUser}
                  avatarVal={avatarChanged}
                  avatarStatus={setAvatarChanged}
                />
              )}
            </div>

            <div className="p-4 pb-0 pt-0 md:pt-4">
              <div className="ml-28 md:ml-40 mt-2 md:mt-0 flex justify-between">
                {isEditMode && (
                  <div className="w-50">
                    <input
                      type="text"
                      className="border py-2 px-3 rounded-md border-gray-300"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="border py-2 px-3 rounded-md mt-1 border-gray-300"
                      placeholder="Your location"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                    />
                  </div>
                )}
                {!isEditMode && (
                  <div>
                    <h1 className="md:text-3xl text-2xl font-bold">
                      {profile?.name}
                    </h1>
                    <div className="text-gray-500 leading-4">
                      {profile?.place || "internet"}
                    </div>
                  </div>
                )}

                <div>
                  {!isMyUser && !isFollowedByMe && (
                    <button
                      onClick={toggleFollow}
                      className="flex gap-1 items-center bg-socialBlue text-white cursor-pointer hover:scale-110 transition-all shadow-sm shadow-gray-500 rounded-md py-1 px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                        />
                      </svg>
                      Follow
                    </button>
                  )}
                  {!isMyUser && isFollowedByMe && (
                    <button
                      onClick={toggleFollow}
                      className="flex gap-1 items-center bg-white cursor-pointer hover:scale-110 transition-all shadow-sm shadow-gray-500 rounded-md py-1 px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                        />
                      </svg>
                      Unfollow
                    </button>
                  )}
                  {isMyUser && !isEditMode && (
                    <button
                      onClick={(e) => {
                        setIsEditMode(true);
                        setName(profile.name);
                        setPlace(profile.place);
                      }}
                      className="flex gap-1 items-center bg-white shadow-sm shadow-gray-500 rounded-md py-1 px-2"
                    >
                      <span className="hidden sm:block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                      </span>
                      Edit profile
                    </button>
                  )}
                  {isMyUser && isEditMode && (
                    <div className="inline-flex gap-2">
                      <button
                        onClick={updateProfile}
                        className="bg-white shadow-sm shadow-gray-500 rounded-md py-1 px-2"
                      >
                        Save profile
                      </button>
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="bg-white shadow-sm shadow-gray-500 rounded-md py-1 px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <ProfileTabs userId={userId} active={active} />
            </div>
          </div>
        </Card>
        <ProfileContent
          activeTab={active}
          userId={userId}
          avatarStatus={avatarChanged}
          following={usersFollowing}
        />
      </UserContextProvider>
    </Layout>
  );
}
