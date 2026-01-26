import { Redirect } from "expo-router";

export default function Index() {
  // Temporary: Always go to Welcome screen first
  return <Redirect href="/(auth)/welcome" />;
}