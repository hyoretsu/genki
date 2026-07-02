import { createFileRoute } from "@tanstack/react-router";
import { GenkiApp } from "./components/app/GenkiApp";

export const Route = createFileRoute("/")({
	component: GenkiApp,
});
