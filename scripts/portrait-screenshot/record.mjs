// Records the animated portrait at the top of the WeClone README (see README.md here). The web UI is built with
// screenshot.patch in a temporary worktree of a WeClone checkout and served there with the synthetic demo
// portrait, so the checkout itself stays untouched. Its `?screenshot` page is stepped frame by frame through one
// wave cycle into an animated WebP that loops without a seam, or with --still into a PNG.
//
//   node scripts/portrait-screenshot/record.mjs ~/WeClone docs/public/img/screenshots/atlas-light-en.webp
//
// --locale (en, zh-CN) picks the language of the names on the map, --theme (light, dark) the colours, --size and
// --scale the picture: the README shows the default 1280x840 at 880 wide. The map is laid out in English from the
// demo portrait at the WeClone revision --layout and framed as in the first published picture, so every language
// shows the same picture and it keeps its look while the demo changes. Its nodes are then drawn with the names of
// the checkout's demo in --locale as it is on disk, each dimension's children rank for rank by their number of
// facts, or with --names showcase with those of the screenshot-only portrait of showcase.py. --labels draws the
// labels that many times their size without moving anything, so neighbouring labels may overlap. --showcase instead
// lays the map out from the showcase portrait, with many more sections.
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

/** Time between frames in ms: about 29 frames a second keep the wave smooth. */
const FRAME_MS = 35;
const PATCH = fileURLToPath(new URL('./screenshot.patch', import.meta.url));
const SHOWCASE = fileURLToPath(new URL('./showcase.py', import.meta.url));
/** The demo portrait of each language, as weclone/server/app.py serves them. */
const DEMOS = {
  zh: 'tests/tests_data/profile_hierarchy.demo.json',
  en: 'tests/tests_data/profile_hierarchy.demo.en.json',
};
/** The first published picture drew the root 55.9 px wide, 0.502 of the way across and 0.516 down. */
const CAMERA = [55.92, 0.50224, 0.51635];
/** The showcase map is larger and is drawn smaller, centred. */
const SHOWCASE_CAMERA = [36, 0.5, 0.5];
/** Han characters fill their em box, unlike Latin letters, so Chinese labels drawn this much smaller look as large. */
const HAN_LABELS = 0.9;

const { values: options, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    locale: { type: 'string', default: 'en' },
    theme: { type: 'string', default: 'light' },
    size: { type: 'string', default: '1280x840' },
    scale: { type: 'string', default: '1.5' },
    // The demo before 819648b regenerated it, which the first published picture was laid out from.
    layout: { type: 'string', default: '819648b^' },
    // Section labels come out about 17 px on the picture.
    labels: { type: 'string', default: '1.28' },
    // demo or showcase: the portrait whose names are drawn.
    names: { type: 'string', default: 'demo' },
    still: { type: 'boolean', default: false },
    showcase: { type: 'boolean', default: false },
  },
});
const [checkout, output] = positionals;
const [width, height] = options.size.split('x').map(Number);
if (!checkout || !output || !width || !height) {
  console.error(
    'Usage: node scripts/portrait-screenshot/record.mjs <WeClone checkout> <output.webp|.png>' +
      ' [--locale en] [--theme light] [--size 1280x840] [--scale 1.5] [--layout 819648b^] [--labels 1.28]' +
      ' [--names demo] [--still] [--showcase]',
  );
  process.exit(2);
}

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const names = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome-headless-shell'];
  const dirs = (process.env.PATH ?? '').split(delimiter).filter(Boolean);
  return names.flatMap((name) => dirs.map((dir) => join(dir, name))).find((path) => existsSync(path));
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed:\n${result.stderr || result.error?.message}`.trim());
  }
}

function freePort() {
  return new Promise((done, fail) => {
    const probe = createServer()
      .once('error', fail)
      .listen(0, '127.0.0.1', () => {
        const { port } = probe.address();
        probe.close(() => done(port));
      });
  });
}

/** The children of each dimension in a demo portrait with their places in it, those with the most facts first. */
function ranked(profile) {
  const facts = (item) =>
    (item.fact_indices?.length ?? 0) + (item.items ?? []).reduce((sum, child) => sum + facts(child), 0);
  return new Map(
    profile.dimensions.map((dimension) => [
      dimension.dim,
      dimension.groups
        .map((group, index) => ({ name: group.name, index, facts: facts(group) }))
        .sort((a, b) => b.facts - a.facts || a.name.localeCompare(b.name)),
    ]),
  );
}

/**
 * What relabel() draws over the map of the `layout` demo: the root and the dimensions with the `to` page's names for
 * them, and each dimension's children with the names in the `drawn` demo of the children ranked the same in the
 * `english` one, which lists the same children in the same order. A child ranked past the last keeps its own name.
 */
function relabelling(layout, english, drawn, from, to) {
  const now = ranked(english);
  const children = new Map(drawn.dimensions.map((dimension) => [dimension.dim, dimension.groups]));
  const names = {
    '': { [from.root]: to.root },
    root: Object.fromEntries(Object.entries(from.dimensions).map(([dim, name]) => [name, to.dimensions[dim]])),
  };
  for (const [dim, before] of ranked(layout)) {
    const order = now.get(dim) ?? [];
    if (order.length !== (children.get(dim) ?? []).length) {
      throw new Error(`The ${options.locale} demo does not list the English demo's children of dimension ${dim}.`);
    }
    names[`dimension:${dim}`] = Object.fromEntries(
      before.slice(0, order.length).map((child, i) => [child.name, children.get(dim)[order[i].index].name]),
    );
  }
  return names;
}

/**
 * The WeClone checkout's HEAD with the patch and the --layout English demo, or with --showcase the showcase portrait,
 * built, in `tree`; returns relabelling().
 */
function prepare(repo, tree, cleanups) {
  const modules = join(repo, 'web', 'node_modules');
  if (!existsSync(modules)) throw new Error(`Run pnpm --dir web install in ${repo} first.`);
  run('git', ['-C', repo, 'worktree', 'add', '--detach', tree, 'HEAD']);
  cleanups.push(() => run('git', ['-C', repo, 'worktree', 'remove', '--force', tree]));
  try {
    run('git', ['-C', tree, 'apply', '--3way', PATCH]);
  } catch (error) {
    throw new Error(`screenshot.patch no longer applies to ${repo}: update it as README.md says.\n${error.message}`);
  }
  const read = (root, path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
  const model = (locale) => read(repo, `web/src/i18n/locales/${locale}/translation.json`).model;
  // The names come from the screenshot-only portrait, written over the worktree's demo, or else from the checkout's
  // demo as it is on disk, committed or not.
  let names = repo;
  if (options.showcase || options.names === 'showcase') {
    run(process.env.PYTHON ?? 'python3', [SHOWCASE, repo, join(tree, DEMOS.zh), join(tree, DEMOS.en)]);
    names = tree;
  }
  const english = read(names, DEMOS.en);
  const drawn = read(names, DEMOS[options.locale.split('-')[0]]);
  // The showcase map is laid out as it is.
  if (!options.showcase) run('git', ['-C', tree, 'checkout', options.layout, '--', DEMOS.en]);
  build(modules, tree, cleanups);
  return relabelling(read(tree, DEMOS.en), english, drawn, model('en'), model(options.locale));
}

/** The web UI in `tree`, built with the checkout's dependencies, linked rather than installed again. */
function build(modules, tree, cleanups) {
  const link = join(tree, 'web', 'node_modules');
  symlinkSync(modules, link);
  cleanups.push(() => unlinkSync(link));
  run(join(modules, '.bin', 'vite'), ['build', '--logLevel', 'error'], join(tree, 'web'));
}

/** The English demo server of the WeClone package in `tree`, which serves the patched build. */
async function serve(tree, cleanups) {
  const port = await freePort();
  // Run from the worktree, Python imports its weclone package rather than the installed one.
  const python = process.env.PYTHON ?? 'python3';
  const server = spawn(python, ['-m', 'weclone.cli', 'server', '--demo', 'en', '--port', String(port)], {
    cwd: tree,
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  let log = '';
  server.stderr.on('data', (chunk) => (log = (log + chunk).slice(-4000)));
  cleanups.push(async () => {
    if (server.exitCode !== null) return;
    server.kill();
    await once(server, 'exit');
  });
  const origin = `http://127.0.0.1:${port}`;
  for (let i = 0; ; i++) {
    if (server.exitCode !== null || i > 600) throw new Error(`The demo server did not start:\n${log}`);
    try {
      if ((await fetch(`${origin}/api/auth/status`)).ok) return origin;
    } catch {
      // Not listening yet.
    }
    await sleep(100);
  }
}

/** A DevTools connection to the first page of a headless Chrome. */
async function connect(profile, cleanups) {
  const chromePath = findChrome();
  if (!chromePath) throw new Error('No Chrome found: set CHROME to a Chrome or chrome-headless-shell binary.');
  const flags = '--headless --remote-debugging-port=0 --hide-scrollbars --no-first-run --no-default-browser-check';
  const chrome = spawn(chromePath, [...flags.split(' '), `--user-data-dir=${profile}`, 'about:blank'], {
    stdio: 'ignore',
  });
  cleanups.push(async () => {
    if (chrome.exitCode !== null) return;
    chrome.kill();
    await once(chrome, 'exit');
  });
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i = 0; !existsSync(portFile); i++) {
    if (chrome.exitCode !== null || i > 150) throw new Error('Chrome did not start.');
    await sleep(100);
  }
  const port = readFileSync(portFile, 'utf8').split('\n')[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const socket = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((done, fail) => {
    socket.onopen = done;
    socket.onerror = () => fail(new Error('Could not connect to Chrome.'));
  });
  cleanups.push(() => socket.close());
  const calls = new Map();
  const waits = new Map();
  let lastId = 0;
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) calls.get(message.id)?.(message);
    else waits.get(message.method)?.(message.params);
  };
  const send = (method, params = {}) =>
    new Promise((done, fail) => {
      const id = ++lastId;
      calls.set(id, ({ result, error }) => {
        calls.delete(id);
        if (error) fail(new Error(`${method}: ${error.message}`));
        else done(result);
      });
      socket.send(JSON.stringify({ id, method, params }));
    });
  const event = (method) =>
    new Promise((done) =>
      waits.set(method, (params) => {
        waits.delete(method);
        done(params);
      }),
    );
  return {
    send,
    async goto(url) {
      const loaded = event('Page.loadEventFired');
      await send('Page.navigate', { url });
      await loaded;
    },
    async evaluate(expression) {
      const { result, exceptionDetails } = await send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
      return result.value;
    },
    async screenshot() {
      const { data } = await send('Page.captureScreenshot', { format: 'png', optimizeForSpeed: true });
      return Buffer.from(data, 'base64');
    },
  };
}

async function record(page, origin, names) {
  const labels = Number(options.labels) * (options.locale.startsWith('zh') ? HAN_LABELS : 1);
  const url = `${origin}/?screenshot&labels=${labels}`;
  await page.send('Page.enable');
  await page.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: Number(options.scale),
    mobile: false,
  });
  const saved = {
    // Laid out in English; relabel() then draws it in --locale.
    'weclone.locale': 'en',
    'weclone.theme': options.theme,
    'weclone.profile.grouping': 'dimension',
  };
  await page.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `for (const [key, value] of Object.entries(${JSON.stringify(saved)})) localStorage.setItem(key, value);`,
  });
  await page.goto(url);
  // The demo's fixed password.
  const status = await page.evaluate(
    `fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-WeClone-Request': '1' },
      body: '{"password":"demo"}' }).then((response) => response.status)`,
  );
  if (status !== 200) throw new Error(`Signing in to the demo failed with HTTP ${status}.`);
  await page.goto(url);
  const ready = await page.evaluate(`new Promise((resolve) => {
    const start = performance.now();
    const check = () => window.atlasCapture?.ready() ? resolve(true)
      : performance.now() - start > 30000 ? resolve(false) : setTimeout(check, 100);
    check();
  })`);
  if (!ready) throw new Error(`The map did not show at ${url}.`);
  // step(0) stops the page's own frame loop, so that only the steps move the map from here on.
  const { frames, step } = await page.evaluate(`(() => {
    const capture = window.atlasCapture;
    capture.step(0);
    capture.closeUp(${(options.showcase ? SHOWCASE_CAMERA : CAMERA).join(', ')});
    capture.relabel(${JSON.stringify(names)});
    for (let left = capture.warmUp(); left > 0; left -= ${FRAME_MS}) capture.step(Math.min(${FRAME_MS}, left));
    const frames = Math.round(capture.period() / ${FRAME_MS});
    return { frames, step: capture.period() / frames };
  })()`);
  if (options.still) {
    writeFileSync(output, await page.screenshot());
    return;
  }
  const input = `-v error -y -f image2pipe -c:v png -framerate ${1000 / step} -i -`;
  // Below quality 95 the pale halos round the dimensions break up into blocks.
  const encoding = '-c:v libwebp_anim -pix_fmt yuv420p -quality 95 -loop 0';
  const ffmpeg = spawn('ffmpeg', [...`${input} ${encoding}`.split(' '), output], {
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  const encoded = once(ffmpeg, 'exit');
  // A failed ffmpeg reports its own error and exit code.
  ffmpeg.stdin.on('error', () => {});
  // The frame after the last is the first again.
  for (let i = 0; i < frames && ffmpeg.exitCode === null; i++) {
    if (i) await page.evaluate(`window.atlasCapture.step(${step})`);
    if (!ffmpeg.stdin.write(await page.screenshot())) await Promise.race([once(ffmpeg.stdin, 'drain'), encoded]);
  }
  ffmpeg.stdin.end();
  const [code] = await encoded;
  if (code !== 0) throw new Error(`ffmpeg exited with ${code}.`);
}

if (!options.still && spawnSync('ffmpeg', ['-hide_banner', '-h', 'encoder=libwebp_anim']).status !== 0) {
  console.error('Recording a WebP needs ffmpeg with libwebp, or pass --still for a PNG.');
  process.exit(1);
}
const work = mkdtempSync(join(tmpdir(), 'weclone-screenshot-'));
const cleanups = [];
const cleanUp = async () => {
  for (const cleanup of cleanups.splice(0).reverse()) {
    try {
      await cleanup();
    } catch (error) {
      console.error(error.message);
    }
  }
  rmSync(work, { recursive: true, force: true });
};
process.once('SIGINT', () => cleanUp().then(() => process.exit(130)));
try {
  const tree = join(work, 'weclone');
  const names = prepare(resolve(checkout), tree, cleanups);
  const origin = await serve(tree, cleanups);
  await record(await connect(join(work, 'chrome'), cleanups), origin, names);
  console.log(`Wrote ${output}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await cleanUp();
}
