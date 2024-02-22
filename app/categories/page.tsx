import Categories from "components/Categories";

export default function Page() {
  return (
    <div className="flex flex-col grow items-center">
      <h1 className="text-lunar-green-300">Categories</h1>
      <Categories />
    </div>
  )
}