import NavigationCard from "./NavigationCard";

export default function Layout({ children, flag, profile }) {
  return (
    <div className="md:flex max-w-4xl mx-auto gap-6 mt-4 mb-24 md:mb-0">
      <div className="md:w-1/4 md:static fixed bottom-0 w-full -mb-5">
        <NavigationCard flag={flag} profile={profile} />
      </div>
      <div className="mx-4 md:mx-0 md:w-3/4">{children}</div>
    </div>
  );
}
