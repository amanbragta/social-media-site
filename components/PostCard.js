import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import Card from "./Card";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import { UserContext } from "@/contexts/UserContext";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function PostCard({
  id,
  content,
  created_at,
  photos,
  profiles: authorProfile,
}) {
  const [dropDownOpen, setdropDownOpen] = useState(false);
  const { profile: myProfile } = useContext(UserContext);
  const supabase = useSupabaseClient();
  const [likes, setLikes] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const session = useSession();
  const [isPosted, setIsPosted] = useState(false);

  useEffect(() => {
    fetchLikes();
    fetchComments();
    isPostedByMe();
    if (myProfile?.id) fetchIsSaved();
  }, [myProfile?.id]);

  function isPostedByMe() {
    supabase
      .from("posts")
      .select("author")
      .eq("id", id)
      .then((result) => {
        setIsPosted(result.data[0].author === session?.user?.id);
      });
  }

  function fetchIsSaved() {
    supabase
      .from("saved_posts")
      .select()
      .eq("user_id", myProfile?.id)
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
      .then((result) => {
        setLikes(result.data);
      });
  }

  function fetchComments() {
    supabase
      .from("posts")
      .select("*,profiles(*)")
      .eq("parent", id)
      .then((result) => {
        setComments(result.data);
      });
  }

  const isLikedByMe = !!likes.find((like) => like.user_id === myProfile?.id);

  function toggleLike() {
    if (isLikedByMe) {
      supabase
        .from("likes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", myProfile.id)
        .then((result) => {
          fetchLikes();
        });
      return;
    }
    supabase
      .from("likes")
      .insert({
        post_id: id,
        user_id: myProfile.id,
      })
      .then((result) => {
        fetchLikes();
      });
  }

  function postComment(e) {
    e.preventDefault();
    supabase
      .from("posts")
      .insert({
        content: commentText,
        author: myProfile.id,
        parent: id,
      })
      .then((result) => {
        fetchComments();
        setCommentText("");
      });
  }

  function toggleSave() {
    if (!isSaved) {
      supabase
        .from("saved_posts")
        .insert({
          user_id: myProfile?.id,
          post_id: id,
        })
        .then((result) => {
          setIsSaved(true);
          setdropDownOpen(false);
        });
    }
    if (isSaved) {
      supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", myProfile.id)
        .eq("post_id", id)
        .then((result) => {
          setIsSaved(true);
          setdropDownOpen(false);
        });
    }
  }

  function deletePost() {
    supabase
      .from("likes")
      .delete()
      .eq("post_id", id)
      .then((result) => {});
    supabase
      .from("posts")
      .delete()
      .eq("id", id)
      .then((result) => {
        supabase
          .from("saved_posts")
          .delete()
          .eq("post_id", id)
          .then((result) => {});
      });
  }

  return (
    <Card>
      <div className="flex gap-3">
        <div>
          <Link
            href={"/profile/" + authorProfile?.id}
            className="cursor-pointer"
          >
            <Avatar url={authorProfile?.avatar} />
          </Link>
        </div>
        <div className="grow">
          <p>
            <Link href={"/profile/" + authorProfile?.id}>
              <span className="font-semibold cursor-pointer hover:underline">
                {authorProfile?.name}
              </span>{" "}
            </Link>
            shared a post.
          </p>
          <p className="text-gray-500 text-sm">
            <ReactTimeAgo date={new Date(created_at)} />
          </p>
        </div>
        <div>
          <button
            className="text-gray-400"
            onClick={() => setdropDownOpen(!dropDownOpen)}
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
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
          <div className="relative">
            {dropDownOpen && (
              <div className="absolute -right-6 bg-white shadow-md shadow-gray-300 p-3 rounded-sm w-52 z-20">
                <button className="w-full -my-2" onClick={toggleSave}>
                  <span className="">
                    {!isSaved && (
                      <span className="flex gap-2 py-2 my-2 hover:bg-socialBlue hover:text-white hover:-mx-4 hover:px-10 rounded-md hover:shadow-md shadow-gray-300 transition-all hover:scale-105">
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
                        Save Post
                      </span>
                    )}

                    {isSaved && (
                      <span className="flex gap-2 py-2 my-2 hover:bg-socialBlue hover:text-white hover:-mx-4 hover:px-5 rounded-md hover:shadow-md shadow-gray-300 transition-all hover:scale-105">
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
                            d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
                          />
                        </svg>
                        Remove from saved
                      </span>
                    )}
                  </span>
                </button>

                {isPosted ? (
                  <button onClick={deletePost} className="w-full">
                    <span className="flex gap-2 py-2 my-2 hover:bg-socialBlue hover:text-white hover:-mx-4 hover:px-10 rounded-md hover:shadow-md shadow-gray-300 transition-all hover:scale-105">
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete Post
                    </span>
                  </button>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <p className="my-3 text-sm">{content}</p>
        {photos?.length > 0 && (
          <div className="flex gap-2">
            {photos.map((photo) => (
              <div className="" key={photo}>
                <img src={photo} className="rounded-md" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2 flex gap-6">
        <button onClick={toggleLike} className="flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={"w-6 h-6 " + (isLikedByMe ? "fill-red-500" : "")}
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
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          {comments.length}
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <div>
          <Avatar url={myProfile?.avatar} />
        </div>
        <div className="border grow rounded-full relative">
          <form onSubmit={postComment}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="block rounded-full w-full p-3 px-4 h-12 overflow-hidden"
              placeholder="Leave a comment"
            />
          </form>
        </div>
      </div>
      <div>
        {comments.length > 0 &&
          comments.map((comment) => (
            <div className="mt-2 flex gap-2 items-center" key={comment.author}>
              <Avatar url={comment.profiles.avatar} />
              <div className="bg-gray-200 py-2 px-4 rounded-2xl">
                <div>
                  <Link href={"/profile/" + comment.author}>
                    <span className="hover:underline font-semibold mr-1">
                      {comment.profiles.name}
                    </span>
                  </Link>
                  <span className="text-sm text-gray-500">
                    <ReactTimeAgo
                      date={new Date(comment.created_at)}
                      timeStyle={"twitter"}
                    />
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}
