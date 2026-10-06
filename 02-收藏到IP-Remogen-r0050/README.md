# 收藏到 IP · Remogen r0050

这是一套完全由 Remotion 的 React/SVG/CSS 生成视觉的工程，对应 `RemogenReplica`：736×414、30fps、419 帧。生产组合只读取 `public/reference-audio.m4a`；不读取、播放或采样参考视频。本文件夹不包含你之前提供的完整参考视频。`src/lib/gemini.ts` 只是可选的 Gemini 分析辅助代码，纯渲染不需要 API Key。

## 复现

```powershell
npm ci
npm run render:r0050
```

输出：`out/Remogen-r0050.mp4`。如果机器找不到浏览器，可先设置 `BROWSER_EXECUTABLE`。也可以运行 `npm run dev` 预览。原 `npm run build` 指向历史的 `CandlestickSurge` 组合，保留用于追溯；本包新增的 `scripts/render-portable.mjs` 才是 r0050 的明确入口。

本文件夹内的 `给智能体的复现指令.txt` 是可直接复制给其他智能体的独立指令。如需使用 Gemini 辅助函数，另行设置 `GEMINI_API_KEY`；不要把 key 写进源码、README 或提交文件。

## 选择依据与边界

独立 Codex fresh2 评审记录 8.4/10，Gemini 复核记录 6.7/10，均保留在 `evidence/` 中；两个分数都不能当作 1:1 验收结论。源码、锁文件和音频哈希见 `SHA256SUMS.txt`。
