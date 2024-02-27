// TODO: just go straight to google signin ui from get started button
import LoginButton from "../welcome/LoginButton";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center grow">
      <LoginButton />
    </div>
  );
}