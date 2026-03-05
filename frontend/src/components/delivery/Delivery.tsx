import styles from "./delivery.module.css";

{/* Страница доставки */}
export default function Delivery() {
  return (
    <div className={styles.wrapper}>

      <div className={styles.header}>
        <h1>ДОСТАВКА</h1>
        <p>
          ДОСТАВКА ДО АДРЕСА ПО МОСКВЕ, МОСКОВСКОЙ ОБЛАСТИ И РЕГИОНАМ РОССИИ
        </p>
      </div>

      <div className={styles.content}>

        <div className={styles.column}>
          <p>
            Доставка по Москве и области осуществляется бесплатно
            <br />
            от <b>20 000 ₽</b>
          </p>

          <p>
            Стоимость доставки для заказов менее
            <br />
            <b>20 000 ₽</b> рассчитывается индивидуально
          </p>

          <div className={styles.icons}>
            <img src="/delivery_icons/delovie-linii.png" />
            <img src="/delivery_icons/baikal.png" />
          </div>
        </div>

        <div className={styles.column}>
          <p>
            Заказ и его доставка считаются принятыми
            <br />
            после согласования с менеджером.
          </p>

          <p>
            Доставка в регионы России осуществляется
            <br />
            транспортными компаниями
          </p>

          <div className={styles.boxIcon}>
            <img src="/delivery_icons/box.png" />
          </div>
        </div>

      </div>

    </div>
  );
}