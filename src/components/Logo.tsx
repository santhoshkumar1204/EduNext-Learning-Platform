export default function Logo({
  className = "",
  dark = false,
  size = 28,
}: {
  className?: string;
  dark?: boolean;
  size?: number;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="EduNext logo"
        width={size}
        height={size}
        className="shrink-0 object-contain rounded-full"
      />
      <span className={`font-bold text-xl font-display ${dark ? "text-white" : "text-[#0F2B5B]"}`}>EduNext</span>
    </div>
  );
}
