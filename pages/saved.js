import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";

export default function SavedPosts() {
  return (
    <Layout>
      <h1 className="text-6xl text-gray-300 mb-4">Saved posts</h1>
      <PostCard />
      <PostCard />
    </Layout>
  );
}
