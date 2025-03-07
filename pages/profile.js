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
  useEffect(() => {
    if (!userId) return;
    fetchUser();
    supabase.auth.getSession().then((obj) => {
      setIsMyUser(obj.data.session.user.id === userId);
    });
  }, [userId]);

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

  function updateProfile() {
    supabase
      .from("profiles")
      .update({
        name,
        place,
      })
      .eq("id", userId)
      .then((result) => {
        console.log(result);
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
                />
              )}
            </div>

            <div className="p-4 pb-0 pt-0 md:pt-4">
              <div className="ml-24 md:ml-40 flex justify-between">
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
                    <h1 className="text-3xl font-bold">{profile?.name}</h1>
                    <div className="text-gray-500 leading-4">
                      {profile?.place || "internet"}
                    </div>
                  </div>
                )}

                <div>
                  {isMyUser && !isEditMode && (
                    <button
                      onClick={(e) => {
                        setIsEditMode(true);
                        setName(profile.name);
                        setPlace(profile.place);
                      }}
                      className="flex gap-1 items-center bg-white shadow-sm shadow-gray-500 rounded-md py-1 px-2"
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
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
        <ProfileContent activeTab={active} userId={userId} />
      </UserContextProvider>
    </Layout>
  );
}
