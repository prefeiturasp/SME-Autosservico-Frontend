export default function SidebarCoserv(
    props: Readonly<React.SVGProps<SVGSVGElement>>
) {
    return (
        <svg
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="16 16 24 24"
            className={props.className}
            data-testid="sidebar-coserv-icon"
            fill="none"
            version="1.1"
        >
            <path
                d="M31 18H25C24.4477 18 24 18.4477 24 19V21C24 21.5523 24.4477 22 25 22H31C31.5523 22 32 21.5523 32 21V19C32 18.4477 31.5523 18 31 18Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M32 20H34C34.5304 20 35.0391 20.2107 35.4142 20.5858C35.7893 20.9609 36 21.4696 36 22V36C36 36.5304 35.7893 37.0391 35.4142 37.4142C35.0391 37.7893 34.5304 38 34 38H22C21.4696 38 20.9609 37.7893 20.5858 37.4142C20.2107 37.0391 20 36.5304 20 36V22C20 21.4696 20.2107 20.9609 20.5858 20.5858C20.9609 20.2107 21.4696 20 22 20H24"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M25 30L27 32L31 28"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
