import PrivacyPolicy from "@/components/pages/Privacy";
import ScrollToTopButton from "@/components/icons/ScrollToTopButton";


export default function PrivacyPage() {
  return (
    <main>
      <div id="personal-data-container" style={{ backgroundColor: "#F2F3F4", position: "relative" }}>
        <PrivacyPolicy/>
        <ScrollToTopButton containerId="personal-data-container" />
      </div>
    </main>

  );
}