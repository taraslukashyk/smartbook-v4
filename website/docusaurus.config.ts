import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Smartbook Documentation',
  tagline: 'Корпоративна база знань та стандарти',
  favicon: 'img/favicon.ico',

  // GitHub Pages deployment config
  organizationName: 'taraslukashyk',
  projectName: 'smartbook-v4',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://taraslukashyk.github.io',
  baseUrl: '/smartbook-v4/', // Базовий шлях має збігатися з назвою репозиторію

  onBrokenLinks: 'warn',
  markdown: {
    format: 'mdx',
    mermaid: true,
    preprocessor: ({ filePath, fileContent }) => {
      return fileContent;
    },
    mdx1Compat: {
      comments: true,
      admonitions: true,
      headingIds: true,
    },
  },

  i18n: {
    defaultLocale: 'uk',
    locales: ['uk'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs', // Revert to default
          // Remove this to remove the "edit this page" links.
          // editUrl: '...',
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  /*
  plugins: [
    [
      require.resolve("docusaurus-plugin-search-local"),
      {
        hashed: true,
        docsRouteBasePath: "docs",
        highlightSearchTermsOnTargetPage: true,
        translations: {
          search_placeholder: "Пошук",
          see_all_results: "Всі результати",
          no_results: "Нічого не знайдено",
          search_results_for: 'Результати пошуку для "{{ keyword }}"',
          search_the_documentation: "Пошук по документації",
          count_documents_found_plural: "Знайдено {{ count }} документів",
          count_documents_found: "Знайдено {{ count }} документ",
          no_documents_were_found: "Документів не знайдено",
        }
      },
    ],
  ],
  */

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Smartbook v4',
      logo: {
        alt: 'Smartbook Logo',
        src: 'img/logo.jpg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Методичка',
        },
        {
          to: '/docs/ВСТУП/', // Slugs usually strip the numbering prefix
          label: 'Стандарти',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Розділи',
          items: [
            {
              label: 'Вступ',
              to: '/docs/ВСТУП/',
            },
            {
              label: 'Організація',
              to: '/docs/ОРГАНІЗАЦІЯ ПРОЄКТНОГО СЕРЕДОВИЩА ТА ПІДГОТОВЧИЙ ЕТАП/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Smartbook Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
