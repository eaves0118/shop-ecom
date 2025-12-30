import { Button } from "../ui/button";
import { Search } from "lucide-react";

export function HeaderSearch() {
  return (
    <div
      className="
    flex items-center flex-1
    rounded-md border border-input
    bg-background
    focus-within:ring-1 focus-within:ring-ring
  "
    >
      <input
        className="
      w-full p-2 bg-transparent text-sm
      outline-none
    "
        type="text"
        placeholder="Tìm kiếm sản phẩm"
      />

      <Button variant="destructive" className="w-[40px] md:w-[60px]">
        <Search />
      </Button>
    </div>
  );
}
