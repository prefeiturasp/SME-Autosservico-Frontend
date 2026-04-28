import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function renderTabs(defaultValue = "a") {
  return render(
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Conteúdo A</TabsContent>
      <TabsContent value="b">Conteúdo B</TabsContent>
    </Tabs>
  );
}

describe("<Tabs />", () => {
  it("renderiza o conteúdo da tab default ativa", () => {
    renderTabs("a");
    expect(screen.getByText("Conteúdo A")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo B")).not.toBeInTheDocument();
  });

  it("troca o conteúdo ao clicar em outra tab", async () => {
    renderTabs("a");

    await userEvent.click(screen.getByRole("tab", { name: "Tab B" }));

    expect(screen.queryByText("Conteúdo A")).not.toBeInTheDocument();
    expect(screen.getByText("Conteúdo B")).toBeInTheDocument();
  });

  it("marca aria-selected na tab ativa", async () => {
    renderTabs("a");

    expect(screen.getByRole("tab", { name: "Tab A" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute(
      "aria-selected",
      "false"
    );

    await userEvent.click(screen.getByRole("tab", { name: "Tab B" }));

    expect(screen.getByRole("tab", { name: "Tab B" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  it("respeita value controlado e dispara onValueChange", async () => {
    const handleChange = vi.fn();

    function Controlled() {
      const [value, setValue] = React.useState("a");
      return (
        <Tabs
          defaultValue="a"
          value={value}
          onValueChange={(v) => {
            handleChange(v);
            setValue(v);
          }}
        >
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">A</TabsContent>
          <TabsContent value="b">B</TabsContent>
        </Tabs>
      );
    }

    render(<Controlled />);
    await userEvent.click(screen.getByRole("tab", { name: "B" }));

    expect(handleChange).toHaveBeenCalledWith("b");
  });

  it("lança erro quando trigger é usado fora de Tabs", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TabsTrigger value="x">x</TabsTrigger>)).toThrow(
      /must be used within <Tabs>/
    );
    spy.mockRestore();
  });
});
