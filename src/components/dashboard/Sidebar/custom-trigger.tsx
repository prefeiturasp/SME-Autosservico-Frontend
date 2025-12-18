import Image from "next/image";

import { useSidebar } from "@/components/ui/sidebar";

import SidebarMenuClose from "@/assets/icons/SidebarMenuClose";
import SidebarMenuOpen from "@/assets/icons/SidebarMenuOpen";
import LogoDevops from "@/assets/images/logo_devops.webp";

export function CustomTrigger() {
    const { toggleSidebar, open } = useSidebar();
    return (
        <div
            className={`${
                open
                    ? "flex items-center justify-between w-full px-4 py-3"
                    : "text-center"
            }`}
        >
            {open ? (
                <>
                    <div className="flex-shrink-0">
                        <Image
                            src={LogoDevops}
                            alt="Logo AutoServiço"
                            sizes="(min-width: 880px) 134w, 108w"
                            className="w-[108px] md:w-[80px]"
                            loading="lazy"
                            fetchPriority="low"
                            width={LogoDevops.width}
                            height={LogoDevops.height}
                        />
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="flex-shrink-0 p-2 rounded-md"
                    >
                        <SidebarMenuClose />
                    </button>
                </>
            ) : (
                <button onClick={toggleSidebar}>
                    <SidebarMenuOpen />
                </button>
            )}
        </div>
    );
}
