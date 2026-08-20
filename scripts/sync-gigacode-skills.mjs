#!/usr/bin/env node
/**
 * Раскладывает скиллы OpenSpec туда, где их читает расширение GigaCode для VS Code,
 * то есть в .gigacode/skills/<имя-скилла>/SKILL.md.
 *
 * Зачем нужен этот шаг. `openspec init` умеет писать скиллы только в каталоги
 * инструментов, которые знает сам OpenSpec (.claude, .cursor, .agents и другие);
 * GigaCode в этот список пока не входит. Формат файлов при этом у всех одинаковый —
 * папка со SKILL.md и YAML-шапкой, — поэтому скиллы генерируются в нейтральный
 * каталог .agents/skills и переносятся оттуда в .gigacode/skills.
 *
 * Запуск: npm run openspec:skills (из корня репозитория).
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const openspecBin = path.join(rootDir, 'node_modules', '@fission-ai', 'openspec', 'bin', 'openspec.js');

const stagingDir = path.join(rootDir, '.agents');
const stagingSkillsDir = path.join(stagingDir, 'skills');
const gigacodeSkillsDir = path.join(rootDir, '.gigacode', 'skills');

const SKILL_PREFIX = 'openspec-';

if (!fs.existsSync(openspecBin)) {
  console.error('OpenSpec не установлен. Выполни `npm install` в корне репозитория и повтори.');
  process.exit(1);
}

// Шаг 1. Сгенерировать скиллы и структуру openspec/ во временный каталог .agents.
const init = spawnSync(
  process.execPath,
  [openspecBin, 'init', rootDir, '--tools', 'agents', '--language', 'Russian', '--no-animation', '--force'],
  {
    cwd: rootDir,
    stdio: 'inherit',
    // Курсу не нужна анонимная телеметрия OpenSpec — отключаем на время запуска,
    // не трогая глобальные настройки студента.
    env: { ...process.env, OPENSPEC_TELEMETRY: '0' },
  }
);

if (init.status !== 0) {
  console.error('\n`openspec init` завершился с ошибкой — скиллы не обновлены.');
  process.exit(init.status ?? 1);
}

if (!fs.existsSync(stagingSkillsDir)) {
  console.error(`\nOpenSpec не создал ${path.relative(rootDir, stagingSkillsDir)} — переносить нечего.`);
  process.exit(1);
}

// Шаг 2. Перенести скиллы в .gigacode/skills, убрав те, которых больше нет.
fs.mkdirSync(gigacodeSkillsDir, { recursive: true });

const generated = fs
  .readdirSync(stagingSkillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith(SKILL_PREFIX))
  .map((entry) => entry.name)
  .sort();

const obsolete = fs
  .readdirSync(gigacodeSkillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith(SKILL_PREFIX))
  .map((entry) => entry.name)
  .filter((name) => !generated.includes(name));

for (const name of obsolete) {
  fs.rmSync(path.join(gigacodeSkillsDir, name), { recursive: true, force: true });
}

for (const name of generated) {
  const target = path.join(gigacodeSkillsDir, name);
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(path.join(stagingSkillsDir, name), target, { recursive: true });
}

// Шаг 3. Убрать временный каталог: единственный источник скиллов — .gigacode/skills.
fs.rmSync(stagingDir, { recursive: true, force: true });

console.log(`\nСкиллы OpenSpec перенесены в ${path.relative(rootDir, gigacodeSkillsDir)}:`);
for (const name of generated) {
  console.log(`  • ${name}`);
}
for (const name of obsolete) {
  console.log(`  • ${name} — удалён (больше не генерируется)`);
}
console.log('\nПерезапусти VS Code, чтобы GigaCode подхватил скиллы.');
