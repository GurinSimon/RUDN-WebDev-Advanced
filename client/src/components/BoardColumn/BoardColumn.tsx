import { BoardCard } from "../BoardCard/BoardCard";
import styles from "./BoardColumn.module.css";

export function BoardColumn() {
  return (
    <section className={styles.column}>
      <h2 className={styles.title}>К выполнению</h2>
      <div className={styles.cards}>
        <BoardCard title="Изучить материалы Темы 1" />
        <BoardCard title="Выполнить задания семинара" />
      </div>
    </section>
  );
}
