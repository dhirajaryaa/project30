export function Avatar({
  url,
  username,
  size = 48,
}: {
  url: string;
  username: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`${username}'s avatar`}
      width={size}
      height={size}
      loading="lazy"
      className="rounded-md border border-primary/20 bg-primary/10 object-cover"
    />
  );
}