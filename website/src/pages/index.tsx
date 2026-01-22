import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero noise-bg', styles.heroBanner)} style={{ padding: '10rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px', zIndex: 1 }}>
        <Heading as="h1" className="hero__title" style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle" style={{ fontSize: '1.4rem', color: 'var(--ifm-font-color-base)', marginBottom: '3rem', fontWeight: 300 }}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            className="button button--dark button--lg"
            style={{ padding: '0.8rem 1.5rem', borderRadius: '4px' }}
            to="/docs/ВСТУП/">
            Get Started <span style={{ marginLeft: '0.5rem' }}>→</span>
          </Link>
          <Link
            className="button button--dark button--lg"
            style={{ padding: '0.8rem 1.5rem', borderRadius: '4px' }}
            to="/docs/ВСТУП/">
            Learn Standards <span style={{ marginLeft: '0.5rem' }}>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function CategorySection({ title, items }: { title: string, items: any[] }) {
  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '1100px' }}>
      <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--ifm-heading-font-family)' }}>
        {title}
      </h2>
      <div className="row">
        {items.map((item, idx) => (
          <div key={idx} className="col col--4" style={{ marginBottom: '2rem' }}>
            <Link to={item.to} className="wiki-card">
              <h3>{item.title} <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>→</span></h3>
              <p>{item.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  const exploreItems = [
    { title: 'Вступ', description: 'Основні поняття, мета та структура методичних вказівок.', to: '/docs/ВСТУП/' },
    { title: 'Організація', description: 'Підготовка проєктного середовища та етапи розробки.', to: '/docs/ОРГАНІЗАЦІЯ ПРОЄКТНОГО СЕРЕДОВИЩА ТА ПІДГОТОВЧИЙ ЕТАП/' },
    { title: 'Стандарти BIM', description: 'Вимоги до інформаційного моделювання та координації.', to: '/docs/СТВОРЕННЯ ІНФОРМАЦІЙНОЇ МОДЕЛІ ТРАНСПОРТНОЇ СПОРУДИ/' },
  ];

  const learnItems = [
    { title: 'Проєктування', description: 'Детальні гайди по кожному розділу проєкту.', to: '/docs/СТВОРЕННЯ ІНФОРМАЦІЙНОЇ МОДЕЛІ ТРАНСПОРТНОЇ СПОРУДИ/' },
    { title: 'Перевірка', description: 'Процедури контролю якості та інструменти перевірки.', to: '/docs/ВИЛУЧЕННЯ ІНФОРМАЦІЇ ТА ФОРМУВАННЯ ВІДОМОСТЕЙ/' },
    { title: 'Аналітика', description: 'Моніторинг прогресу та звітність за стандартами.', to: '/docs/РОЗВИТОК, СТАНДАРТИЗАЦІЯ ТА ОПТИМІЗАЦІЯ ПРОЦЕСІВ/' },
  ];

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Smartbook v4 - Корпоративна база знань">
      <HomepageHeader />
      <main>
        <CategorySection title="Explore Smartbook" items={exploreItems} />
        <CategorySection title="Learn About Standards" items={learnItems} />
      </main>
    </Layout>
  );
}
