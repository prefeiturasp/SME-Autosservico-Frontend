import Image from "next/image";
import BackgroundFormImage from "@/assets/images/background_forms.webp";
import LogoDevops from "@/assets/images/logo_devops.webp";

export default function BackgroundForm() {
    return (
        <>
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                // Necessário pois, o Tailwind não permite misturar linear-gradient com uma imagem externa diretamente via classes
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(59, 130, 246, 0.85), rgba(0, 50, 130, 0.74)), url(${BackgroundFormImage.src})`,
                }}
            ></div>
            {/* Logo */}
            <div className="absolute top-8 right-8 md:top-20 md:right-20 z-10">
                <Image
                    src={LogoDevops}
                    alt="Logo AutoServiço"
                    sizes="(min-width: 880px) 134w, 108w"
                    className="w-[108px] md:w-[134px]"
                    loading="lazy"
                    fetchPriority="low"
                    width={LogoDevops.width}
                    height={LogoDevops.height}
                />
            </div>
        </>
    );
}
