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

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState();
  const userId = router.query.id;
  const { asPath: pathname } = router;
  const isPosts = pathname.includes("posts") || pathname === "/profile";
  const isAbout = pathname.includes("about");
  const isFriends = pathname.includes("friends");
  const isPhotos = pathname.includes("photos");
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
  const tabClasses =
    "flex py-1 px-4 border-b-4 border-white gap-1 items-center";
  const activeTabClasses =
    "px-4 flex py-1 gap-1 items-center border-socialBlue border-b-4 text-socialBlue";
  return (
    <Layout>
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
            <div className="ml-24 md:ml-40">
              <h1 className="text-3xl font-bold">{profile?.name}</h1>
              <div className="text-gray-500 leading-4">{profile?.place}</div>
            </div>
            <div className="mt-4 md:mt-10 flex">
              <Link
                href={"/profile/posts"}
                className={isPosts ? activeTabClasses : tabClasses}
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
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <span className="hidden sm:block">Posts</span>
              </Link>
              <Link
                href={"/profile/about"}
                className={isAbout ? activeTabClasses : tabClasses}
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
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
                <span className="hidden sm:block">About</span>
              </Link>
              <Link
                href={"/profile/friends"}
                className={isFriends ? activeTabClasses : tabClasses}
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
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
                <span className="hidden sm:block">Friends</span>
              </Link>
              <Link
                href={"/profile/photos"}
                className={isPhotos ? activeTabClasses : tabClasses}
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
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                <span className="hidden sm:block">Photos</span>
              </Link>
            </div>
          </div>
        </div>
      </Card>
      {isPosts && <PostCard />}
      {isAbout && (
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
      {isFriends && (
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
      {isPhotos && (
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
    </Layout>
  );
}
