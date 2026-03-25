import { Home, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
  showNav?: boolean;
}

export function Layout({ children, showNav = true }: Props) {
  const { pathname } = useLocation();

  const tabs = [
    { path: "/",         icon: Home,     label: "首页" },
    { path: "/settings", icon: Settings, label: "我的" },
  ];

  return (
    <div className={showNav ? "pb-16" : ""}>
      {children}
      {showNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-16 bg-white border-t border-gray-200 flex z-50">
          {tabs.map(({ path, icon: Icon, label }) => {
            const active = pathname === path;
            return (
              <a
                key={path}
                href={`#${path}`}
                className={`flex flex-col items-center justify-center flex-1 gap-0.5 ${active ? "text-[#22C55E]" : "text-gray-400"}`}
              >
                <Icon size={22} />
                <span className="text-[11px]">{label}</span>
              </a>
            );
          })}
        </nav>
      )}
    </div>
  );
}
