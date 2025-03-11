import Avatar from "./Avatar";

export default function FriendInfo({ profile }) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar url={profile?.avatar} />
      <div>
        <h3 className="font-bold text-xl">{profile?.name}</h3>
        {/* <div className="text-sm leading-3">3 mutual friends</div> */}
      </div>
    </div>
  );
}
