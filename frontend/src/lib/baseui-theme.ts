import { createDarkTheme, createLightTheme } from "baseui";

export type ThemeMode = "dark" | "light";

export const lightTheme = createLightTheme({
	colors: {
		accent: "#2f6fbe",
		backgroundPrimary: "#fbf8ef",
		backgroundSecondary: "#ffffff",
		backgroundTertiary: "#f0ece1",
		borderOpaque: "#d9d1bf",
		borderSelected: "#16836f",
		buttonPrimaryFill: "#16836f",
		buttonPrimaryHover: "#116b5b",
		buttonPrimaryText: "#ffffff",
		contentInverseSecondary: "#ffffff",
		contentPrimary: "#20302f",
		contentSecondary: "#546865",
		contentTertiary: "#6f7f7b",
		inputBorder: "#d9d1bf",
		inputFill: "#ffffff",
		inputFillActive: "#ffffff",
		inputTextDisabled: "#6f7f7b",
		negative: "#c7352d",
		positive: "#16836f",
		warning: "#b06f00",
	},
});

export const darkTheme = createDarkTheme({
	colors: {
		accent: "#8db7ff",
		backgroundPrimary: "#112224",
		backgroundSecondary: "#182c2e",
		backgroundTertiary: "#21383a",
		borderOpaque: "#31484a",
		borderSelected: "#63c8ac",
		buttonPrimaryFill: "#63c8ac",
		buttonPrimaryHover: "#49ad93",
		buttonPrimaryText: "#102222",
		contentInverseSecondary: "#102222",
		contentPrimary: "#f2eee1",
		contentSecondary: "#b7c5c0",
		contentTertiary: "#d4ddd8",
		inputBorder: "#31484a",
		inputFill: "#102022",
		inputFillActive: "#102022",
		inputTextDisabled: "#b7c5c0",
		negative: "#ef6b60",
		positive: "#63c8ac",
		warning: "#e0a740",
	},
});

export function getAppTheme(mode: ThemeMode) {
	return mode === "dark" ? darkTheme : lightTheme;
}
