import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const outDir = resolve(process.env.OUT_DIR || 'out');
mkdirSync(outDir, {recursive: true});
const silent = resolve(outDir, 'Remogen-r0050-silent.mp4');
const final = resolve(outDir, 'Remogen-r0050.mp4');
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const extra = process.env.BROWSER_EXECUTABLE ? ['--browser-executable', process.env.BROWSER_EXECUTABLE] : [];
function run(file, args) {
  const r = spawnSync(file, args, {stdio: 'inherit', shell: process.platform === 'win32'});
  if (r.error) throw r.error;
  if (r.status !== 0) process.exit(r.status ?? 1);
}
run(npx, ['remotion', 'render', 'src/index.ts', 'RemogenReplica', silent, '--codec=h264', '--crf=18', '--muted', '--concurrency=4', ...extra]);
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
run(ffmpeg, ['-y', '-i', silent, '-i', 'public/reference-audio.m4a', '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'copy', '-movflags', '+faststart', final]);
console.log(`Wrote ${final}`);
