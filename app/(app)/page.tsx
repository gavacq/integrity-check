import type { Metadata } from "next";
import Ratings from "components/Ratings";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <Ratings />
  );
}
