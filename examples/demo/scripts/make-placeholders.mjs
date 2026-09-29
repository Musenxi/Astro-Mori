// 生成示例站的占位图：几层山脊剪影 + 淡天空。全部是程序画的，没有版权问题。
// 用法：node scripts/make-placeholders.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../src/assets/', import.meta.url));
mkdirSync(out, { recursive: true });

// 伪随机（固定种子，每次生成的图一样）
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);

function ridge(w, y0, amp, seed, rough) {
  const r = rng(seed), ph = [r() * 6, r() * 6, r() * 6];
  const pts = [];
  for (let x = 0; x <= w; x += 8) {
    const t = x / w;
    const y = y0 + amp * (Math.sin(t * 5 + ph[0]) * 0.5 + Math.sin(t * 13 + ph[1]) * 0.28 + Math.sin(t * 31 + ph[2]) * rough * 0.5);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return pts;
}

function scene({ name, w = 2000, h = 1400, sky, ridges, ground }) {
  const [a, b] = sky;
  const layers = ridges.map(([color, y0, amp, seed, rough], i) => {
    const pts = ridge(w, h * y0, h * amp, seed, rough);
    return `<polygon fill="${color}" points="0,${h} ${pts.join(' ')} ${w},${h}"/>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .07 0"/></filter></defs>
    <rect width="100%" height="100%" fill="url(#s)"/>${layers.join('')}
    <rect y="${h * ground[1]}" width="100%" height="${h * (1 - ground[1])}" fill="${ground[0]}"/>
    <rect width="100%" height="100%" filter="url(#n)"/></svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(out + name);
}

await Promise.all([
  // 冰岛：冷灰蓝，远山淡、近山深，上半留白给引文
  scene({ name: 'iceland.jpg', sky: ['#dfe4e6', '#eef0ec'], ground: ['#2f3b45', 0.94], ridges: [['#c5cfd3', 0.5, 0.06, 3, 0.4], ['#a3b1b8', 0.6, 0.07, 11, 0.5], ['#7b8b95', 0.7, 0.07, 23, 0.7], ['#526370', 0.8, 0.06, 37, 0.9]] }),
  // 迁移记录：暖灰，几乎平的地平线
  scene({ name: 'desk.jpg', sky: ['#e6e0d2', '#f1ece0'], ground: ['#5a5346', 0.9], ridges: [['#d5cdbb', 0.62, 0.03, 5, 0.3], ['#b9b09a', 0.72, 0.035, 9, 0.4], ['#8e8571', 0.82, 0.03, 17, 0.5]] }),
  // 大理：绿意，远山之下一片水
  scene({ name: 'dali.jpg', sky: ['#e8e6d8', '#f2f0e4'], ground: ['#6c8577', 0.86], ridges: [['#c2cbb8', 0.42, 0.07, 41, 0.4], ['#9fb098', 0.52, 0.08, 7, 0.6], ['#7a9581', 0.62, 0.07, 19, 0.7], ['#557364', 0.72, 0.06, 29, 0.8]] }),
  // 随笔配图（16:9）：静物式的两道横线
  scene({ name: 'essay.jpg', w: 1600, h: 900, sky: ['#e9e4d9', '#e2dccf'], ground: ['#bdb4a2', 0.72], ridges: [['#d3cbba', 0.66, 0.02, 2, 0.2]] }),
]);
console.log('done →', out);
