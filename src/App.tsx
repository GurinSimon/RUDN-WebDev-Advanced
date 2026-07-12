import { BoardHeader } from "./components/BoardHeader/BoardHeader";
import { BoardColumn } from "./components/BoardColumn/BoardColumn";
import { NewCardForm } from "./components/NewCardForm/NewCardForm";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <BoardHeader />
      <main className={styles.board}>
        <NewCardForm />
        <div className={styles.columns}>
          <BoardColumn />
        </div>
      </main>
    </div>
  );
}

export default App;
