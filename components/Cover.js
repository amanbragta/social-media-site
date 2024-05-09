import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import PreLoader from "./PreLoader";
import { uploadUserProfileImage } from "@/helpers/user";

export default function Cover({ url, editable, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const supabase = useSupabaseClient();
  const session = useSession();

  async function updateCover(e) {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await uploadUserProfileImage(
        supabase,
        session?.user?.id,
        file,
        "covers",
        "cover"
      );
      if (onChange) onChange();
      setIsUploading(false);
    }
  }

  return (
    <div className="h-36 overflow-hidden flex items-center justify-center relative">
      <div>
        <img src={url} />
      </div>
      {isUploading && (
        <div className="absolute bg-white bg-opacity-80 inset-0 flex items-center justify-center z-10">
          <div className="">
            <PreLoader />
          </div>
        </div>
      )}
      {editable && (
        <div className="absolute right-0 bottom-0 m-2">
          <label className="bg-white flex gap-1 items-center px-2 py-1 rounded-md shadow-md shadow-black cursor-pointer">
            <input type="file" className="hidden" onChange={updateCover} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
            Change cover image
          </label>
        </div>
      )}
    </div>
  );
}
