import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Importação dos ícones
import SidebarAscom from "./SidebarAscom";
import SidebarCodae from "./SidebarCodae";
import SidebarCogep from "./SidebarCogep";
import SidebarCoped from "./SidebarCoped";
import SidebarCoplan from "./SidebarCoplan";
import SidebarCoserv from "./SidebarCoserv";
import SidebarCotic from "./SidebarCotic";
import SidebarEmforpef from "./SidebarEmforpef";
import SidebarGipe from "./SidebarGipe";

// 🔹 Lista genérica de ícones e suas props esperadas
const icons = [
    {
        name: "SidebarAscom",
        component: SidebarAscom,
        width: "20",
        height: "18",
        testId: "sidebar-ascom-icon",
    },
    {
        name: "SidebarCodae",
        component: SidebarCodae,
        width: "24",
        height: "24",
        testId: "sidebar-codae-icon",
    },
    {
        name: "SidebarCoped",
        component: SidebarCoped,
        width: "24",
        height: "24",
        testId: "sidebar-coped-icon",
    },
    {
        name: "SidebarCoplan",
        component: SidebarCoplan,
        width: "24",
        height: "24",
        testId: "sidebar-coplan-icon",
    },
    {
        name: "SidebarCoserv",
        component: SidebarCoserv,
        width: "24",
        height: "24",
        testId: "sidebar-coserv-icon",
    },
    {
        name: "SidebarCotic",
        component: SidebarCotic,
        width: "24",
        height: "24",
        testId: "sidebar-cotic-icon",
    },
    {
        name: "SidebarCogep",
        component: SidebarCogep,
        width: "24",
        height: "24",
        testId: "sidebar-cogep-icon",
    },
    {
        name: "SidebarEmforpef",
        component: SidebarEmforpef,
        width: "24",
        height: "24",
        testId: "sidebar-emforpef-icon",
    },
    {
        name: "SidebarGipe",
        component: SidebarGipe,
        width: "24",
        height: "24",
        testId: "sidebar-gipe-icon",
    },
];

describe.each(icons)(
    "<%s />",
    ({ name, component: Icon, width, height, testId }) => {
        it(`deve renderizar o ícone ${name} corretamente`, () => {
            render(<Icon data-testid={testId} />);
            const svgElement = screen.getByTestId(testId);

            expect(svgElement).toBeInTheDocument();
            expect(svgElement.tagName).toBe("svg");
            expect(svgElement).toHaveAttribute("width", width);
            expect(svgElement).toHaveAttribute("height", height);
            expect(svgElement).toHaveAttribute(
                "xmlns",
                "http://www.w3.org/2000/svg"
            );
        });

        it(`deve aplicar corretamente a className no ícone ${name}`, () => {
            render(<Icon className="text-purple-500" data-testid={testId} />);
            const svgElement = screen.getByTestId(testId);
            expect(svgElement).toHaveClass("text-purple-500");
        });

        it(`deve conter ao menos um elemento <path> no ícone ${name}`, () => {
            render(<Icon data-testid={testId} />);
            const pathElement = screen
                .getByTestId(testId)
                .querySelector("path");
            expect(pathElement).not.toBeNull();
            expect(pathElement).toHaveAttribute("d");
        });
    }
);
