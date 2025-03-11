import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Card from "./Card";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import { createClient } from "@/utils/supabase/component";

export default function PostCard({
  id,
  content,
  created_at,
  photos,
  profiles: authorProfile,
  gotRemoved,
  profile,
  onPost,
}) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const supabase = createClient();
  const [likes, setLikes] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const wrRef = useRef(null);
  // const { profile } = useContext(UserContext);
  useEffect(() => {
    fetchLikes();
    fetchComments();
    fetchSaved();
  }, []);

  function fetchSaved() {
    supabase
      .from("saved_posts")
      .select()
      .eq("post_id", id)
      .then((result) => {
        if (result?.data?.length > 0) setIsSaved(true);
        else setIsSaved(false);
      });
  }

  function fetchLikes() {
    supabase
      .from("likes")
      .select()
      .eq("post_id", id)
      .then((result) => setLikes(result.data));
  }

  function fetchComments() {
    supabase
      .from("posts")
      .select("*,profiles(*)")
      .eq("parent", id)
      .then((result) => setComments(result.data));
  }
  const isLikedByMe = !!likes.find((like) => like.user_id === profile?.id);

  function toggleLike() {
    if (isLikedByMe) {
      supabase
        .from("likes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", profile.id)
        .then(() => fetchLikes());
      return;
    }
    supabase
      .from("likes")
      .insert({
        post_id: id,
        user_id: profile.id,
      })
      .then(() => fetchLikes());
  }
  function toggleSaved() {
    if (isSaved) {
      supabase.auth.getSession().then((result) => {
        const sessionId = result.data.session.user.id;
        supabase
          .from("saved_posts")
          .delete()
          .eq("post_id", id)
          .eq("user_id", sessionId)
          .then(() => {
            setDropDownOpen(false);
            setIsSaved(false);
            gotRemoved(true);
          });
      });
    }
    if (!isSaved) {
      supabase
        .from("saved_posts")
        .insert({
          post_id: id,
          user_id: profile.id,
        })
        .then(() => {
          setDropDownOpen(false);
          setIsSaved(true);
        });
    }
  }

  function deletePost() {
    supabase
      .from("saved_posts")
      .delete()
      .eq("post_id", id)
      .then(() => {
        supabase
          .from("posts")
          .delete()
          .eq("id", id)
          .then((result) => {
            if (!result.error) onPost();
          });
      });
  }

  function postComment(e) {
    e.preventDefault();
    supabase
      .from("posts")
      .insert({
        content: commentText,
        author: profile.id,
        parent: id,
      })
      .then(() => {
        setCommentText("");
        fetchComments();
      });
  }
  const classesForMenu =
    "flex gap-3 py-1 my-2 hover:bg-socialBlue hover:text-white px-2 rounded-md transition-all hover:scale-110";
  return (
    <Card>
      <div className="flex gap-3">
        <div>
          <Link href={"/profile/" + authorProfile?.id}>
            <Avatar url={authorProfile?.avatar} />
          </Link>
        </div>
        <div className="grow">
          <p>
            <Link href={"/profile/" + authorProfile?.id}>
              <span className="font-semibold mr-1 hover:underline">
                {authorProfile?.name}
              </span>
            </Link>
            shared a post.
          </p>
          <p className="text-gray-500 text-sm">
            <ReactTimeAgo date={new Date(created_at).getTime()} />
          </p>
        </div>
        <div>
          <div>
            <button onClick={() => setDropDownOpen(!dropDownOpen)}>
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
                  d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                />
              </svg>
            </button>
          </div>
          <div className="relative" ref={wrRef}>
            {dropDownOpen && (
              <div className="absolute -right-6 bg-white shadow-md shadow-gray-300 p-3 rounded-sm border border-gray-100 w-52 z-10">
                <button className="w-full -my-2" onClick={toggleSaved}>
                  <span className={classesForMenu}>
                    {isSaved && (
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
                          d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
                        />
                      </svg>
                    )}
                    {!isSaved && (
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
                    )}

                    {isSaved ? "Unsave" : "Save post"}
                  </span>
                </button>

                {profile?.id == authorProfile.id && (
                  <button className="w-full -my-2" onClick={deletePost}>
                    <span className={classesForMenu}>
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="my-3 text-sm">{content}</p>
        {photos?.length > 0 && (
          <div className="flex gap-4">
            {photos.map((photo, index) => (
              <div key={index}>
                <img src={photo} alt="" className="rounded-md" />
              </div>
            ))}
          </div>
        )}
        {/* <div className="rounded-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2304&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
        </div> */}
      </div>
      <div className="mt-5 flex gap-8">
        <button className="flex gap-2 items-center" onClick={toggleLike}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={"size-6 " + (isLikedByMe ? "fill-red-500" : "")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          {likes?.length}
        </button>
        <button className="flex gap-2 items-center">
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
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          {comments?.length}
        </button>
        <button className="flex gap-2 items-center">
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
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
          </svg>
          4
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        <div>
          <Avatar url={profile?.avatar} />
        </div>
        <div className="grow border rounded-full relative">
          <form onSubmit={postComment}>
            <input
              className="block w-full py-3 px-4 h-12 overflow-hidden rounded-full resize-none"
              placeholder="Leave a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </form>

          <button className="absolute right-3 top-3 text-gray-400">
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
          </button>
        </div>
      </div>
      {comments.length > 0 &&
        comments.map((comment) => (
          <div key={comment.id} className="flex items-center gap-2 mt-2">
            <Avatar url={comment.profiles.avatar} />
            <div className="bg-gray-200 py-2 px-4 rounded-3xl">
              <div className="">
                <Link href={"/profile/" + comment.profiles.id}>
                  <span className="hover:underline font-semibold mr-2">
                    {comment.profiles.name}
                  </span>
                </Link>
                <span className="text-xs text-gray-400">
                  <ReactTimeAgo
                    timeStyle={"twitter"}
                    date={new Date(comment.created_at).getTime()}
                  />
                </span>
              </div>
              <p className="text-sm leading-4">{comment.content}</p>
            </div>
          </div>
        ))}
    </Card>
  );
}
