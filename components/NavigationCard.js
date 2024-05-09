import { useRouter } from "next/router";
import Card from "./Card";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function NavigationCard() {
  const activeElements =
    "text-sm md:text-md flex gap-1 md:gap-2 py-3 bg-socialBlue md:-mx-6 md:px-6 px-6 text-white rounded-md shadow-sm shadow-gray-500";
  const nonActiveElements =
    "text-sm md:text-md flex gap-1 md:gap-2 py-2 my-2 px-6 md:px-0 hover:bg-socialBlue hover:bg-opacity-50 hover:-mx-6 hover:px-10 rounded-md hover:shadow-md shadow-gray-300 transition-all hover:scale-105";
  const { asPath: pathname } = useRouter();
  const supabase = useSupabaseClient();
  const session = useSession();
  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <Card noParam={true}>
      <div className="px-4 py-2 flex justify-between md:block shadow-md shadow-gray-500 md:shadow-none">
        <h2 className="text-gray-400 mb-3 hidden md:block">Navigation</h2>
        <Link
          href="/"
          className={pathname === "/" ? activeElements : nonActiveElements}
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
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <span className="hidden md:block">Home</span>
        </Link>
        <Link
          href={"/profile/" + session?.user?.id}
          className={
            pathname === "/profile/friends" ? activeElements : nonActiveElements
          }
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
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>

          <span className="hidden md:block">Profile</span>
        </Link>
        <Link
          href="/saved"
          className={pathname === "/saved" ? activeElements : nonActiveElements}
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
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
          <span className="hidden md:block">Saved Posts</span>
        </Link>
        <button onClick={logout} className="md:w-full -my-2">
          <span className={nonActiveElements}>
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
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            <span className="hidden md:block"> Logout</span>
          </span>
        </button>
      </div>
    </Card>
  );
}
