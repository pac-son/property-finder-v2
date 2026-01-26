import "../global.css"; // <--- Add this line at the top!
import { Slot } from "expo-router";

export default function RootLayout() {
  return <Slot />;
}