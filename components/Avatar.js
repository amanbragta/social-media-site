import { createClient } from "@/utils/supabase/component";
import { useState } from "react";
import PreLoader from "./PreLoader";
export default function Avatar({
  size,
  url,
  editable,
  fetchInfo,
  avatarStatus,
  avatarVal,
}) {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  let dimentions = "w-12 h-12";
  if (size === "lg") {
    dimentions = "w-24 h-24 md:w-36 md:h-36";
  }
  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const newName = Date.now() + file.name;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(newName, file);
      if (error) throw result.error;
      else {
        supabase.auth.getSession().then((result) => {
          const currSession = result.data.session.user.id;
          const url =
            process.env.NEXT_PUBLIC_SUPABASE_URL +
            `/storage/v1/object/public/avatars/` +
            data.path;
          supabase
            .from("profiles")
            .update({
              avatar: url,
            })
            .eq("id", currSession)
            .then((result) => {
              if (result.error) throw result.error;
              else {
                setIsUploading(false);
                fetchInfo();
                avatarStatus(!avatarVal);
              }
            });
        });
      }
    }
  }

  return (
    <div className="relative">
      <img
        className={`${dimentions} object-cover rounded-full overflow-hidden`}
        src={
          url
            ? url
            : "https://i.pinimg.com/474x/07/c4/72/07c4720d19a9e9edad9d0e939eca304a.jpg"
        }
        alt=""
      />
      {isUploading && (
        <div className="absolute inset-0 bg-white opacity-50 rounded-full flex items-center justify-center">
          <PreLoader />
        </div>
      )}
      {editable && (
        <label className="absolute bottom-0 right-0 bg-white shadow-md shadow-gray-500 p-2 rounded-full cursor-pointer">
          <input className="hidden" type="file" onChange={uploadAvatar} />
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
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
            />
          </svg>
        </label>
      )}
    </div>
  );
}
