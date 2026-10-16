export default function SidebarEmforpef(
    props: Readonly<React.SVGProps<SVGSVGElement>>
) {
    return (
        <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={props.className}
            data-testid="sidebar-emforpef-icon"
            fill="none"
            version="1.1"
        >
            <path
                d="M12 3L1 9L12 15L23 9L12 3Z"
                style={{
                    fill: "none",
                    strokeWidth: "1.8",
                    stroke: "rgb(255, 255, 255)",
                    strokeOpacity: "1",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                }}
            />
            <path
                d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"
                style={{
                    fill: "none",
                    strokeWidth: "1.8",
                    stroke: "rgb(255, 255, 255)",
                    strokeOpacity: "1",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                }}
            />
            <path
                d="M23 9V15"
                style={{
                    fill: "none",
                    strokeWidth: "1.8",
                    stroke: "rgb(255, 255, 255)",
                    strokeOpacity: "1",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                }}
            />
        </svg>
    );
}
