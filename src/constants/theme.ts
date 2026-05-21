export const lightColors = {
  primary: "#C9A24D",
  primaryLight: "#DFC27A",
  secondary: "#2D79D5",
  secondaryLight: "#6EB1FF",
  background: "#F2F6FF",
  surface: "#FFFFFF",
  text: "#0B1F47",
  textSecondary: "#415781",
  border: "#C9D6F0",
  divider: "#D7E0F5",
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
  info: "#3FA3F1",
} as const;

export const darkColors = {
  primary: "#D4B56A",
  primaryLight: "#E3CA8E",
  secondary: "#4A99F5",
  secondaryLight: "#81C0FF",
  background: "#071A3A",
  surface: "#0D2B59",
  text: "#EAF2FF",
  textSecondary: "#AFC1E8",
  border: "#23457D",
  divider: "#1B3A6B",
  error: "#FF453A",
  success: "#30D158",
  warning: "#FF9F0A",
  info: "#58B8FF",
} as const;

export type ThemeColors = {
  readonly [K in keyof typeof lightColors]: string;
};

export const categoryTabs = [
  { id: "Videos", name: "Videos", icon: "🎬" },
  { id: "Animations", name: "Animated", icon: "🎞️" },
  { id: "Textbooks", name: "Textbooks", icon: "📚" },
  { id: "Notes", name: "Notes", icon: "📓" },
  { id: "Assessments", name: "Assessments", icon: "📝" },
  { id: "Quiz", name: "Quiz", icon: "❓" },
  { id: "Activities", name: "Activities", icon: "🎯" },
] as const;
