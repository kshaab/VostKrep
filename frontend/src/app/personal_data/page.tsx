import PersonalData from "@/components/pages/PersonalData";
import ScrollToTopButton from "@/components/icons/ScrollToTopButton";

export default function PersonalDataPage() {
  return (
    <main>
      <div id="personal-data-container" style={{ backgroundColor: "#F2F3F4", position: "relative" }}>
        <PersonalData />
        <ScrollToTopButton containerId="personal-data-container" />
      </div>
    </main>
  );
}