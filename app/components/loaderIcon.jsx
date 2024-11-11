export default function Spinner() {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="w-[13px] h-[13px] rounded-full bg-white animate-bounce"></div>
      <div className="w-[13px] h-[13px] rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-[13px] h-[13px] rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
}
