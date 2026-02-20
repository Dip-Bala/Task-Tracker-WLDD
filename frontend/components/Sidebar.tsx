"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, Settings } from "lucide-react";
import Image from "next/image";

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tasks",
    href: "/dashboard/tasks",
    icon: ListTodo,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden md:flex w-64 p-6 border-r border-muted-background bg-muted-background text-foreground">
        <nav className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 mb-4">
                      <Image
                          src='/logo.svg'
                          alt='Flowboard'
                          width={30}
                          height={30} 
                          className="fill-foreground text-foreground"
                      />
                      <span className="text-muted-foreground font-bold text-lg">Flowboard</span>
                      </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/dashboard");

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition
                  ${
                    isActive
                      ? "bg-indigo font-semibold"
                      : "text-foreground hover:bg-"
                  }
                `}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t bg-background py-2 md:hidden">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/dashboard");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center text-xs transition ${
                isActive ? "bg-indigo " : "text-foreground"
              }`}
            >
              <item.icon size={22} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
