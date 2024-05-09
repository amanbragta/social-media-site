import Avatar from "./Avatar";

export default function FriendsInfo({ avatar, name }) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar url={avatar} />
      <div>
        <div className="font-semibold">{name}</div>
        {/* <p className="text-gray-500 leading-3">5 mutual friends</p> */}
      </div>
    </div>
  );
}
