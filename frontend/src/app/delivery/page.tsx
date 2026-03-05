import Delivery from "@/components/delivery/Delivery";
import Map from "@/components/delivery/YandexMap";

export default function Page() {
  return (
    <main className="scrollContainer">
      <section className="snapSection">
        <Delivery />
      </section>

      <section className="snapSection">
        <Map />
      </section>
    </main>
  );
}