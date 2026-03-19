import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(process.argv[2] ?? path.join(workspaceRoot, '..', 'spring-rs'));
const siteRoot = path.join(workspaceRoot, 'site');
const siteDocsRoot = path.join(sourceRoot, 'docs');
const docsContentRoot = path.join(siteDocsRoot, 'content', 'docs');
const blogContentRoot = path.join(siteDocsRoot, 'content', 'blog');
const publicRoot = path.join(siteRoot, 'public');

const codeFenceLanguageByExtension = {
  '.rs': 'rust',
  '.toml': 'toml',
  '.sh': 'bash',
  '.bash': 'bash',
  '.zsh': 'bash',
  '.js': 'js',
  '.ts': 'ts',
  '.json': 'json',
  '.yml': 'yaml',
  '.yaml': 'yaml',
  '.md': 'md',
};

const localeTerminologyRules = {
  en: [
    {
      from: /After a month of precipitation/g,
      to: 'After a month of iteration',
    },
    {
      from: /a microservice framework similar to spring-boot in rust/g,
      to: 'an application framework in Rust with a design similar to Spring Boot',
    },
  ],
  zh: [
    {
      from: /经过一个月的沉淀/g,
      to: '经过一个月的迭代',
    },
    {
      from: /类似于spring-boot的微服务框架/g,
      to: '设计思路接近 Spring Boot 的应用框架',
    },
    {
      from: /用Rust编写/g,
      to: '用 Rust 编写',
    },
    {
      from: /最简单的web应用的例子/g,
      to: '最简单的 Web 应用例子',
    },
  ],
};
const badgeImageUrlPattern = /https:\/\/(?:img\.shields\.io|docs\.rs)\//i;
const codeFenceDelimiterPattern = /^(```|~~~)/;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function applyReplacements(content, replacements) {
  return replacements.reduce((result, { from, to }) => result.replaceAll(from, to), content);
}

function copyRecursive(from, to) {
  if (!fs.existsSync(from)) {
    return;
  }
  fs.cpSync(from, to, { recursive: true, force: true });
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('+++')) {
    return { frontmatter: '', body: raw };
  }

  const end = raw.indexOf('\n+++', 4);
  if (end === -1) {
    return { frontmatter: '', body: raw };
  }

  const frontmatter = raw.slice(4, end).trim();
  const body = raw.slice(end + 5).replace(/^\n/, '');
  return { frontmatter, body };
}

function parseTomlScalar(lineValue) {
  const value = lineValue.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  return value;
}

function getFrontmatterValue(frontmatter, key) {
  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith(`${key} = `)) {
      return parseTomlScalar(trimmed.slice(key.length + 3));
    }
  }
  return '';
}

function yamlQuote(value) {
  return JSON.stringify(value);
}

function buildFrontmatter(meta) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(meta)) {
    if (!value) {
      continue;
    }
    lines.push(`${key}: ${yamlQuote(value)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

function normalizeIncludePath(relPath, sourcePagePath) {
  const stripped = relPath.replace(/^(\.\.\/)+/, '');

  if (
    sourcePagePath.endsWith(path.join('plugins', 'summer-apalis.zh.md')) &&
    stripped === 'summer-sqlx/README.zh.md'
  ) {
    return 'summer-apalis/README.zh.md';
  }

  return stripped;
}

function placeholderForMissingSource(repoRelativePath, locale) {
  if (locale === 'zh') {
    return [
      `> 原始 Zola 页面引用了 \`${repoRelativePath}\`，但这个文件在 \`spring-rs\` 仓库中不存在。`,
      '> 当前先保留占位页，后续可以补上真实内容。',
    ].join('\n');
  }

  return [
    `> The original Zola page referenced \`${repoRelativePath}\`, but that file is missing in the \`spring-rs\` repository.`,
    '> A placeholder page is generated for now so the route still exists.',
  ].join('\n');
}

function readIncludedContent(repoRelativePath, locale) {
  const absolutePath = path.join(sourceRoot, repoRelativePath);
  if (!fs.existsSync(absolutePath)) {
    return placeholderForMissingSource(repoRelativePath, locale);
  }
  return read(absolutePath);
}

function renderIncludedCode(repoRelativePath, locale) {
  const absolutePath = path.join(sourceRoot, repoRelativePath);
  if (!fs.existsSync(absolutePath)) {
    return placeholderForMissingSource(repoRelativePath, locale);
  }

  const extension = path.extname(absolutePath);
  const language = codeFenceLanguageByExtension[extension] ?? '';
  const code = read(absolutePath).trimEnd();
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

function rewriteRelativeLinks(content) {
  const replacements = {
    '../summer/Plugin.md': '/docs/plugins/plugin-by-self/',
    '../summer/Plugin.zh.md': '/zh/docs/plugins/plugin-by-self/',
    '../summer/DI.md': '/docs/getting-started/di/',
    '../summer/DI.zh.md': '/zh/docs/getting-started/di/',
    '../summer/Config.md': '/docs/getting-started/config/',
    '../summer/Config.zh.md': '/zh/docs/getting-started/config/',
    '../examples/component-macro-example/':
      'https://github.com/summer-rs/summer-rs/tree/main/examples/component-macro-example',
  };

  let out = content;
  for (const [from, to] of Object.entries(replacements)) {
    out = out.replaceAll(`(${from})`, `(${to})`);
    out = out.replaceAll(`href="${from}"`, `href="${to}"`);
  }
  return out;
}

function rewriteHostedLinks(content, locale) {
  let out = content.replace(/\r\n/g, '\n');

  out = out.replaceAll('https://summer-rs.github.io', '');
  out = out.replaceAll(
    'https://raw.githubusercontent.com/summer-rs/summer-rs/refs/heads/master/docs/static/logo-rust.svg',
    '/logo-rust.svg',
  );
  out = out.replaceAll('/zh/docs/plugins/summer-web/#du-qu-pei-zhi', locale === 'zh'
    ? '/zh/docs/plugins/summer-web/#du-qu-pei-zhi'
    : '/docs/plugins/summer-web/#read-configuration');
  out = out.replaceAll('/zh/docs/plugins/summer-grpc/', locale === 'zh'
    ? '/zh/docs/plugins/summer-grpc/'
    : '/docs/plugins/summer-grpc/');

  if (locale === 'zh') {
    out = out.replaceAll('](/docs/', '](/zh/docs/');
    out = out.replaceAll('](/blog/', '](/zh/blog/');
    out = out.replaceAll('href="/docs/', 'href="/zh/docs/');
    out = out.replaceAll('href="/blog/', 'href="/zh/blog/');
    out = out.replaceAll('](/)', '](/zh/)');
    out = out.replaceAll('href="/"', 'href="/zh/"');
    out = out.replaceAll(
      '<a href="/zh/docs/getting-started/introduction/">English</a>',
      '<a href="/docs/getting-started/introduction/">English</a>',
    );
  }

  return out;
}

function normalizeCodeFenceInfo(content) {
  const knownMeta = new Set(['ignore', 'no_run', 'linenos', 'linenumbers']);

  return content.replace(/^```([^\n`]+)$/gm, (_, info) => {
    if (!info.includes(',')) {
      return `\`\`\`${info}`;
    }

    const parts = info
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

    if (!parts.length) {
      return '```';
    }

    const languageIndex = parts.findIndex((part) => {
      return /^[A-Za-z0-9_+-]+$/.test(part) && !knownMeta.has(part) && !part.includes('=');
    });

    if (languageIndex > 0) {
      const [language] = parts.splice(languageIndex, 1);
      parts.unshift(language);
    }

    return `\`\`\`${parts.join(' ')}`;
  });
}

function rewriteTerminology(content, locale) {
  const replacements = locale ? localeTerminologyRules[locale] ?? [] : [];
  return applyReplacements(content, replacements);
}

function isBadgeImageUrl(url) {
  return badgeImageUrlPattern.test(url);
}

function normalizeBadgeHtmlParagraphs(content) {
  const badgeItemPattern = '(?:<a\\b[^>]*>\\s*<img\\b[^>]*\\/?>\\s*<\\/a>|<img\\b[^>]*\\/?>)';
  const badgeParagraphPattern = new RegExp(
    `<p>\\s*(${badgeItemPattern}(?:\\s+${badgeItemPattern})*)\\s*<\\/p>`,
    'gi',
  );

  return content.replace(badgeParagraphPattern, (match, inner) => {
    if (!badgeImageUrlPattern.test(inner)) {
      return match;
    }

    return `<div class="doc-badge-row">\n${inner.trim()}\n</div>`;
  });
}

function renderBadgeMarkdownToken(token) {
  const linkedImageMatch = token.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
  if (linkedImageMatch && isBadgeImageUrl(linkedImageMatch[2])) {
    const [, alt, imageUrl, href] = linkedImageMatch;
    return `<a href="${href}"><img src="${imageUrl}" alt="${alt}"/></a>`;
  }

  const imageMatch = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (imageMatch && isBadgeImageUrl(imageMatch[2])) {
    const [, alt, imageUrl] = imageMatch;
    return `<img src="${imageUrl}" alt="${alt}"/>`;
  }

  return null;
}

function normalizeBadgeMarkdownParagraph(block) {
  const tokenPattern = /\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)|!\[[^\]]*\]\([^)]+\)/g;
  const tokens = block.match(tokenPattern);

  if (!tokens?.length) {
    return block;
  }

  const remainder = block.replace(tokenPattern, '').trim();
  if (remainder) {
    return block;
  }

  const renderedTokens = tokens.map(renderBadgeMarkdownToken);
  if (renderedTokens.some((token) => !token)) {
    return block;
  }

  return `<div class="doc-badge-row">\n${renderedTokens.join('\n')}\n</div>`;
}

function normalizeBadgeMarkdownParagraphs(content) {
  const lines = content.split('\n');
  const output = [];
  let paragraph = [];
  let inCodeFence = false;

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }

    output.push(normalizeBadgeMarkdownParagraph(paragraph.join('\n')));
    paragraph = [];
  };

  for (const line of lines) {
    if (codeFenceDelimiterPattern.test(line.trim())) {
      flushParagraph();
      output.push(line);
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) {
      output.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      output.push(line);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();

  return output.join('\n');
}

function normalizeBadgeRows(content) {
  return normalizeBadgeMarkdownParagraphs(normalizeBadgeHtmlParagraphs(content));
}

function rewriteMarkdown(content, locale) {
  return rewriteTerminology(
    normalizeBadgeRows(
      normalizeCodeFenceInfo(rewriteHostedLinks(rewriteRelativeLinks(content), locale)),
    ),
    locale,
  );
}

function renderBody(sourcePagePath, body, locale) {
  let rendered = body;

  rendered = rendered.replace(
    /\{\{\s*include\(path="([^"]+)"\)\s*\}\}/g,
    (_, relPath) => {
      const repoRelativePath = normalizeIncludePath(relPath, sourcePagePath);
      return rewriteMarkdown(readIncludedContent(repoRelativePath, locale), locale);
    },
  );

  rendered = rendered.replace(
    /\{\{\s*include_code\(path="([^"]+)"\)\s*\}\}/g,
    (_, relPath) => {
      const repoRelativePath = normalizeIncludePath(relPath, sourcePagePath);
      return renderIncludedCode(repoRelativePath, locale);
    },
  );

  return rewriteMarkdown(rendered.trim(), locale);
}

function localeAndSlugFromFilename(filename) {
  if (filename.endsWith('.zh.md')) {
    return { locale: 'zh', slug: filename.slice(0, -6) };
  }
  return { locale: 'en', slug: filename.slice(0, -3) };
}

function migratePages(sourceDir, outputSubdir) {
  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    if (entry.isDirectory()) {
      migratePages(sourcePath, path.join(outputSubdir, entry.name));
      continue;
    }

    if (!entry.name.endsWith('.md') || entry.name.startsWith('_index')) {
      continue;
    }

    const { locale, slug } = localeAndSlugFromFilename(entry.name);
    const raw = read(sourcePath);
    const { frontmatter, body } = parseFrontmatter(raw);
    const title = getFrontmatterValue(frontmatter, 'title');
    const description = rewriteTerminology(getFrontmatterValue(frontmatter, 'description'), locale);
    const lead = rewriteTerminology(getFrontmatterValue(frontmatter, 'lead'), locale);
    const date = getFrontmatterValue(frontmatter, 'date');
    const updated = getFrontmatterValue(frontmatter, 'updated');
    const parts = [buildFrontmatter({ title, description })];

    if (date) {
      const publishLabel = locale === 'zh' ? '发布时间' : 'Published';
      const updateLabel = locale === 'zh' ? '更新时间' : 'Updated';
      const metaLines = [`> ${publishLabel}: ${date.slice(0, 10)}`];
      if (updated && updated !== date) {
        metaLines.push(`> ${updateLabel}: ${updated.slice(0, 10)}`);
      }
      parts.push(metaLines.join('\n'));
    }

    if (lead && lead !== "''") {
      parts.push(lead);
    }

    parts.push(rewriteTerminology(renderBody(sourcePath, body, locale), locale));

    const outputPath = path.join(siteRoot, locale, outputSubdir, `${slug}.md`);
    write(outputPath, `${parts.filter(Boolean).join('\n\n').trim()}\n`);
    console.log(`generated ${path.relative(workspaceRoot, outputPath)}`);
  }
}

function main() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`spring-rs repo not found: ${sourceRoot}`);
  }

  ensureDir(siteRoot);
  migratePages(docsContentRoot, 'docs');
  migratePages(blogContentRoot, 'blog');
  copyRecursive(path.join(siteDocsRoot, 'static'), publicRoot);

  const configSchemaPath = path.join(sourceRoot, 'target', 'config-schema.json');
  if (fs.existsSync(configSchemaPath)) {
    ensureDir(publicRoot);
    fs.copyFileSync(configSchemaPath, path.join(publicRoot, 'config-schema.json'));
  }
}

main();
