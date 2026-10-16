export default function Perfil(
    props: Readonly<React.SVGProps<SVGSVGElement>>
) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <rect x="1" y="1" width="26" height="26" rx="4" ry="4" />
            <circle cx="14" cy="12" r="3" />
            <path d="M8.5 20.5c0-2.2 2.4-3.5 5.5-3.5s5.5 1.3 5.5 3.5" />
        </svg>
    );
}
