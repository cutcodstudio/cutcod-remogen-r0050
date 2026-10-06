# CutCod 投稿信息｜收藏到 IP · Remogen r0050

- 分组：视频源代码
- 分类：产品动画
- 预览视频：`preview.mp4`
- 源码附件：当前目录中的 `src`、`public`、`scripts`、`package.json` 和 `package-lock.json`
- 技术规格：736×414，30fps，419 帧，画面约 13.97 秒，含音频流

## 推荐简介

这是一个以 Remogen 为主题的产品界面动效复现工程。源码使用 React、SVG 和 CSS 组织场景，保留多个历史场景版本、便携渲染脚本、参考音频及来源说明，方便继续调整镜头、颜色和节奏。

## 可直接复制的内容

```text
请在此工程中复现 Remogen r0050。先执行 npm ci，再运行 npm run render:r0050；以 src/index.ts 注册的 RemogenReplica 为入口，由 React/SVG/CSS 生成画面，只使用 public/reference-audio.m4a 音频，输出 out/Remogen-r0050.mp4，并用 ffprobe 核验 736×414、30fps、419 帧及音频流。
```

## 使用提示

先阅读 `README.md`、`README.source.md` 和 `给智能体的复现指令.txt`。`src/lib/gemini.ts` 是可选辅助模块，当前便携渲染流程不要求 API Key；源码目录不含 `node_modules`、`out` 和历史日志。
