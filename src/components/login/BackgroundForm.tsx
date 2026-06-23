import BackgroundFormImage from "@/assets/images/background_forms.png";

export default function BackgroundForm() {
    return (
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url(${BackgroundFormImage.src})`,
            }}
        ></div>
    );
}
