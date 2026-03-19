import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

const enDocsSidebar = {
  '/docs/': [
    { text: 'Overview', link: '/docs/' },
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/docs/getting-started/introduction/' },
        { text: 'Quick Start', link: '/docs/getting-started/quick-start/' },
        { text: 'Dependency inject', link: '/docs/getting-started/di/' },
        { text: 'Load Configuration', link: '/docs/getting-started/config/' },
        { text: 'Component Macro', link: '/docs/getting-started/component/' },
      ],
    },
    {
      text: 'Plugins',
      items: [
        { text: 'summer-web Plugin', link: '/docs/plugins/summer-web/' },
        { text: 'summer-sqlx Plugin', link: '/docs/plugins/summer-sqlx/' },
        { text: 'summer-postgres Plugin', link: '/docs/plugins/summer-postgres/' },
        { text: 'summer-sea-orm Plugin', link: '/docs/plugins/summer-sea-orm/' },
        { text: 'summer-redis Plugin', link: '/docs/plugins/summer-redis/' },
        { text: 'summer-job Plugin', link: '/docs/plugins/summer-job/' },
        { text: 'summer-apalis Plugin', link: '/docs/plugins/summer-apalis/' },
        { text: 'summer-stream Plugin', link: '/docs/plugins/summer-stream/' },
        { text: 'summer-mail Plugin', link: '/docs/plugins/summer-mail/' },
        { text: 'summer-opendal Plugin', link: '/docs/plugins/summer-opendal/' },
        { text: 'logger Plugin', link: '/docs/plugins/summer-logger/' },
        { text: 'opentelemetry Plugin', link: '/docs/plugins/summer-opentelemetry/' },
        { text: 'summer-grpc Plugin', link: '/docs/plugins/summer-grpc/' },
        { text: 'summer-sa-token Plugin', link: '/docs/plugins/summer-sa-token/' },
        { text: 'Writing your own plugins', link: '/docs/plugins/plugin-by-self/' },
        { text: 'Community contributed plugins', link: '/docs/plugins/contribute-plugins/' },
      ],
    },
    {
      text: 'Help',
      items: [
        { text: 'Auto-Reloading Development Server', link: '/docs/help/auto-reload/' },
        { text: 'FAQ', link: '/docs/help/faq/' },
      ],
    },
  ],
  '/blog/': [
    { text: 'All Posts', link: '/blog/' },
    {
      text: 'Blog',
      items: [
        { text: "Data comparison between rust's summer-rs and java's SpringBoot", link: '/blog/benchmark/' },
        { text: 'summer-stream plugin released', link: '/blog/spring-stream-release/' },
        { text: 'summer-rs initial version released', link: '/blog/spring-rs-initial-version/' },
      ],
    },
  ],
};

const zhDocsSidebar = {
  '/zh/docs/': [
    { text: '概览', link: '/docs/' },
    {
      text: '入门指南',
      items: [
        { text: '介绍', link: '/docs/getting-started/introduction/' },
        { text: '快速上手', link: '/docs/getting-started/quick-start/' },
        { text: '依赖注入', link: '/docs/getting-started/di/' },
        { text: '加载配置', link: '/docs/getting-started/config/' },
        { text: 'Component 宏', link: '/docs/getting-started/component/' },
      ],
    },
    {
      text: '插件',
      items: [
        { text: 'summer-web插件', link: '/docs/plugins/summer-web/' },
        { text: 'summer-sqlx插件', link: '/docs/plugins/summer-sqlx/' },
        { text: 'summer-postgres插件', link: '/docs/plugins/summer-postgres/' },
        { text: 'summer-sea-orm插件', link: '/docs/plugins/summer-sea-orm/' },
        { text: 'summer-redis插件', link: '/docs/plugins/summer-redis/' },
        { text: 'summer-job插件', link: '/docs/plugins/summer-job/' },
        { text: 'summer-apalis插件', link: '/docs/plugins/summer-apalis/' },
        { text: 'summer-stream插件', link: '/docs/plugins/summer-stream/' },
        { text: 'summer-mail插件', link: '/docs/plugins/summer-mail/' },
        { text: 'summer-opendal插件', link: '/docs/plugins/summer-opendal/' },
        { text: 'logger插件', link: '/docs/plugins/summer-logger/' },
        { text: 'opentelemetry插件', link: '/docs/plugins/summer-opentelemetry/' },
        { text: 'summer-grpc插件', link: '/docs/plugins/summer-grpc/' },
        { text: 'summer-sa-token 插件', link: '/docs/plugins/summer-sa-token/' },
        { text: '编写自己的插件', link: '/docs/plugins/plugin-by-self/' },
        { text: '社区贡献的插件', link: '/docs/plugins/contribute-plugins/' },
      ],
    },
    {
      text: '帮助',
      items: [
        { text: '自动热重启', link: '/docs/help/auto-reload/' },
        { text: '常见问题', link: '/docs/help/faq/' },
      ],
    },
  ],
  '/zh/blog/': [
    { text: '全部文章', link: '/blog/' },
    {
      text: '博客',
      items: [
        { text: 'rust的summer-rs和java的SpringBoot数据对比', link: '/blog/benchmark/' },
        { text: 'summer-stream插件发布了', link: '/blog/spring-stream-release/' },
        { text: 'summer-rs初始版本发布', link: '/blog/spring-rs-initial-version/' },
      ],
    },
  ],
};

export default defineConfig({
  root: path.join(__dirname, 'site'),
  lang: 'en',
  title: 'summer-rs',
  description: "summer-rs is an application framework written in Rust, inspired by Java's Spring Boot",
  icon: '/favicon.ico',
  logo: '/logo.svg',
  logoText: 'summer-rs',
  locales: [
    {
      lang: 'en',
      label: 'English',
      title: 'summer-rs',
      description: "summer-rs is an application framework written in Rust, inspired by Java's Spring Boot",
    },
    {
      lang: 'zh',
      label: '简体中文',
      title: 'summer-rs',
      description: 'summer-rs 是一个 Rust 应用框架，设计上受到 Java Spring Boot 的启发',
    },
  ],
  search: {
    mode: 'local',
  },
  markdown: {
    showLineNumbers: true,
    defaultWrapCode: true,
  },
  themeConfig: {
    search: true,
    enableScrollToTop: true,
    lastUpdated: false,
    footer: {
      message: 'Released under the MIT License. Powered by <a href="https://github.com/holmofy">holmofy</a>.',
    },
    locales: [
      {
        lang: 'en',
        label: 'English',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Docs', link: '/docs/getting-started/introduction/', activeMatch: '/docs/' },
          { text: 'Blog', link: '/blog/', activeMatch: '/blog/' },
          { text: 'GitHub', link: 'https://github.com/summer-rs/summer-rs' },
        ],
        sidebar: enDocsSidebar,
      },
      {
        lang: 'zh',
        label: '简体中文',
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '文档', link: '/zh/docs/getting-started/introduction/', activeMatch: '/zh/docs/' },
          { text: '博客', link: '/zh/blog/', activeMatch: '/zh/blog/' },
          { text: 'GitHub', link: 'https://github.com/summer-rs/summer-rs' },
        ],
        sidebar: zhDocsSidebar,
      },
    ],
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/summer-rs/summer-rs',
      },
    ],
  },
});
