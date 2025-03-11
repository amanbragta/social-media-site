import { useRouter } from "next/router";
import Card from "./Card";
import Link from "next/link";
import { createClient } from "@/utils/supabase/component";
import { useEffect, useState } from "react";

export default function NavigationCard({ flag, profile }) {
  const router = useRouter();
  const { pathname } = router;
  const [session, setSession] = useState();
  const activeClasses =
    "text-sm md:text-md flex gap-1 md:gap-3 py-3 bg-socialBlue text-white md:-mx-8 md:px-8 px-6 rounded-md shadow-md shadow-gray-300";
  const nonActiveClasses =
    "text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-200 -mx-4 px-6 md:px-5 md:-mx-5 rounded-md transition-all hover:scale-110";
  const supabase = createClient();
  function logout() {
    supabase.auth.signOut().then(() => window.location.reload());
  }
  useEffect(() => {
    supabase.auth
      .getSession()
      .then((result) => setSession(result.data?.session?.user?.id));
  }, []);
  return (
    <Card noPadding={true}>
      <div className="px-6 py-2 flex md:block justify-between shadow-md shadow-gray-500 md:shadow-none">
        <h2 className="text-gray-400 mb-3 hidden md:block text-center">
          Navigation
        </h2>
        <Link
          href="/"
          className={pathname === "/" ? activeClasses : nonActiveClasses}
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
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span className="hidden md:block">Home</span>
        </Link>
        {/* <Link
          href="/profile/friends"
          className={
            pathname === "/profile/friends" ? activeClasses : nonActiveClasses
          }
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
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
          <span className="hidden md:block">Friends</span>
        </Link> */}
        <Link
          href="/saved"
          className={pathname === "/saved" ? activeClasses : nonActiveClasses}
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
          <span className="hidden md:block">Saved posts</span>
        </Link>
        <Link
          href={"/profile/" + session}
          className={
            pathname.includes(`profile/${session}`)
              ? activeClasses
              : nonActiveClasses
          }
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
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>

          <span className="hidden md:block">Profile</span>
        </Link>
        <Link href={"/"}>
          <button onClick={logout} className="w-full -my-2">
            <span className={nonActiveClasses}>
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
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
              <span className="hidden md:block">Logout</span>
            </span>
          </button>
        </Link>
      </div>
    </Card>
  );
}
