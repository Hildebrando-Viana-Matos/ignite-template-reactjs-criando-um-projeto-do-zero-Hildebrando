import Link from "next/link";
import styles from "./header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <div className={styles.container}>
            <img src="/images/logo.svg" alt="logo" />
          </div>
        </a>
      </Link>
    </header>
  );
}
