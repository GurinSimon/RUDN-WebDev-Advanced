import styles from "./BoardCard.module.css";

type BoardCardProps = {
  title: string;
};

export function BoardCard({ title }: BoardCardProps) {
  return <div className={styles.card}>{title}</div>;
}
