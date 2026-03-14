import Layout from "./Layout";
import AITutor from "@/pages/AITutor";
import Analytics from "@/pages/Analytics";
import Dashboard from "@/pages/Dashboard";
import Flashcards from "@/pages/Flashcards";
import MockExams from "@/pages/MockExams";
import Practice from "@/pages/Practice";
import Pricing from "@/pages/Pricing";
import Profile from "@/pages/Profile";

export const pagesConfig = {
  Layout,
  mainPage: "Dashboard",
  Pages: {
    Dashboard,
    Practice,
    Flashcards,
    MockExams,
    AITutor,
    Analytics,
    Pricing,
    Profile,
  },
};

export default pagesConfig;
