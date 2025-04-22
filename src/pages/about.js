import styles from '@/styles/About.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heroCard}>
        <div className={styles.avatarWrapper}>
          <img
            src="/images/AuthorOm.png"
            alt="Om Choudhary Avatar"
            className={styles.avatar}
          />
        </div>
        <h1 className={styles.name}>
          <span className={styles.animatedUnderline}>Om 🐯 Choudhary 🧘‍♂️</span>
        </h1>
        <h2 className={styles.subtitle}>
          Coffee Maker☕ | Software Architect👾
        </h2>
        <p className={styles.intro}>
          <span className={styles.animatedIntro}>
            I am passionate about AI and maths.
          </span>
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
