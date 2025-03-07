import Avatar from "@/components/Avatar";
import Card from "@/components/Card";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function NotificationPage() {
  return (
    <Layout>
      <h1 className="text-6xl text-gray-300 mb-4">Notifications</h1>
      <Card noPadding={true}>
        <div className="">
          <div className="flex items-center gap-2 border-b border-gray-100 p-4">
            <Avatar />
            <div>
              <Link
                href={"/profile"}
                className="font-semibold mr-1 hover:underline"
              >
                John Doe
              </Link>
              liked your
              <Link href={"/"} className="ml-1 text-socialBlue hover:underline">
                photo
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 border-b border-gray-100 p-4">
            <Avatar />
            <div>
              <Link
                href={"/profile"}
                className="font-semibold mr-1 hover:underline"
              >
                John Doe
              </Link>
              liked your
              <Link href={"/"} className="ml-1 text-socialBlue hover:underline">
                photo
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 border-b border-gray-100 p-4">
            <Avatar />
            <div>
              <Link
                href={"/profile"}
                className="font-semibold mr-1 hover:underline"
              >
                John Doe
              </Link>
              liked your
              <Link href={"/"} className="ml-1 text-socialBlue hover:underline">
                photo
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
