import styles from './PageHead.module.css';

export default function PageHead({ title, intro }: { title: string; intro: string }) {
  return (
    <section className={styles.head}>
      <div className={`container ${styles.inner}`}>
        <div data-reveal="up" className={styles.bars} aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <h1 data-reveal="up" className="display h1">
          {title}
        </h1>
        <p data-reveal="up" data-delay="90" className={styles.intro}>
          {intro}
        </p>
      </div>
    </section>
  );
}
