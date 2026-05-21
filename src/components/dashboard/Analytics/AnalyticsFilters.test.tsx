// @vitest-environment jsdom
import useDashboardStore from "@/states/dashboard";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AnalyticsFilters from "./AnalyticsFilters";

vi.mock("./AnalyticsAutoRefreshIndicator", () => ({
    default: () => <div data-testid="auto-refresh-indicator" />,
}));

describe("AnalyticsFilters", () => {
    beforeEach(() => {
        useDashboardStore.setState({
            activeTab: "operacional",
            activePeriod: "hoje",
        });
    });

    it("não renderiza nada quando activeTab não é analytics", () => {
        useDashboardStore.setState({ activeTab: "operacional" });
        const { container } = render(<AnalyticsFilters />);

        expect(container).toBeEmptyDOMElement();
    });

    it("não renderiza nada quando activeTab é saude-deploy", () => {
        useDashboardStore.setState({ activeTab: "saude-deploy" });
        const { container } = render(<AnalyticsFilters />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renderiza o seletor de período quando activeTab é analytics", () => {
        useDashboardStore.setState({
            activeTab: "analytics",
            activePeriod: "7-dias",
        });
        render(<AnalyticsFilters />);

        expect(screen.getByRole("radio", { name: "7 dias" })).toBeChecked();
    });

    it("exibe o indicador de atualização automática quando período é hoje", () => {
        useDashboardStore.setState({
            activeTab: "analytics",
            activePeriod: "hoje",
        });
        render(<AnalyticsFilters />);

        expect(
            screen.getByTestId("auto-refresh-indicator"),
        ).toBeInTheDocument();
    });

    it("não exibe o indicador de atualização automática quando período não é hoje", () => {
        useDashboardStore.setState({
            activeTab: "analytics",
            activePeriod: "7-dias",
        });
        render(<AnalyticsFilters />);

        expect(
            screen.queryByTestId("auto-refresh-indicator"),
        ).not.toBeInTheDocument();
    });

    it("atualiza o período ao selecionar uma nova opção", async () => {
        useDashboardStore.setState({
            activeTab: "analytics",
            activePeriod: "hoje",
        });
        render(<AnalyticsFilters />);

        await userEvent
            .setup()
            .click(screen.getByRole("radio", { name: "30 dias" }));

        expect(useDashboardStore.getState().activePeriod).toBe("30-dias");
    });
});
