"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HeaderSearch } from "./header-search";

const categories = [
  "PC Gaming- Máy tính chơi game",
  "PC Workstation",
  "Tự Build Cấu Hình PC",
  "PC VĂN PHÒNG",
  "PC AMD GAMING",
  "PC Core Ultra",
  "PC GAMING ĐẸP - CAO CẤP",
  "PC GIẢ LẬP - ẢO HÓA",
  "PC MINI",
  "PC Refubished",
  "Linh kiện máy tính",
];

export function HeaderClient() {
  return (
    <>
      <div className="flex items-center gap-3 justify-between md:px-4 py-3">
        <div className="md:px-4">
          <h1 className="text-2xl font-bold">Computer</h1>
        </div>
        <div className="hidden lg:flex">
          <HeaderSearch />
        </div>

        <div className="flex px-4 hidden lg:flex">
          <Link href="/register" passHref>
            <Button variant="link">Đăng ký</Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="link">Đăng nhập</Button>
          </Link>
        </div>
        <div className="p-2 flex lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu width={26} height={26} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <HeaderSearch />
      </div>
    </>
  );
}
