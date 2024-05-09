export default function Card({ children, noParam }) {
  let classes = "bg-white shadow-md rounded-md mb-4";
  if (!noParam) {
    classes += " p-4";
  }
  return <div className={classes}>{children}</div>;
}
