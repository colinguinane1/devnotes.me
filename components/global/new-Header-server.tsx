import UserIcon from "../buttons/UserIcon";

export default async function HeaderServerSide() {
  return (
    <div className="fixed top-[8px] left-14 z-50 scale-75">
      <UserIcon />
    </div>
  );
}
