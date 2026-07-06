---
title: Suno AI 音乐从歌词到上线：完整 9 步工作流
date: 2026-07-02
summary: 从歌词创作到网站部署的完整 Suno 音乐创作流程，含声线控制、LRC 清洗和自动降级策略。
tags: [Suno, 音乐, 工作流]
---

## 背景

我用 Suno.cn 的 API 给网站做了 8 首歌（专辑《半生桃花》），加上后来重制的《两张脸 v2》，前后跑了 40 多次生成。这篇文章把整个流程固化下来，以后每次做歌照着走就行。

## 9 步流程

### 1. 歌词创作

输入是故事或主题，输出是完整的歌词方案文档。需要包含歌曲结构（Intro/Verse/Chorus/Bridge/Outro）、完整歌词文本、风格标签、目标时长。

字符数和时长的关系（v5.5 实测数据）：

| 目标时长 | 建议字符数 |
|----------|-----------|
| 1-2 分钟 | 200-400 |
| 2-3 分钟 | 400-600 |
| 3-4 分钟 | 600-1000 |
| 4-5 分钟 | 1000-1500 |

### 2. 声线建议（必做）

每次生成前，根据歌词内容和曲风推荐声线方向。五个方向：

- **高亢清亮**（张信哲/林志炫）：`clean tenor, smooth male vocals, lyrical`
- **胸腔爆发**（赵传/伍佰）：`powerful male vocals, belting, rock vocals`
- **温暖中低音**（谭咏麟/费玉清）：`warm baritone, smooth male vocals, mellow`
- **沧桑叙事**（姜育恒/李宗盛）：`raspy male vocals, storytelling, folk`
- **干净少年**（朴树/许巍）：`soft male vocals, gentle, indie folk`

去烟嗓最有效的标签：`clean tenor` > `smooth male vocals` > `lyrical`。

### 3. 用户确认

等用户确认声线建议后才提交。这一步不能省。

### 4. API 提交

用 CLI 工具提交：

```bash
export SUNO_CN_API_KEY=sk-xxx
python3 suno_generate.py \
  --lyrics-file 歌词.txt \
  --title "歌曲名" \
  --tags "Chinese rock, spoken word, clean tenor"
```

### 5. 轮询结果

CLI 工具自动轮询，首次等待 45 秒，之后 20 秒间隔。完成后输出任务 ID、时长、播放链接。

### 6. 听感评估

用户听生成结果，评估声线、烟嗓程度、歌词忠实度。不满意就调标签重新生成。

### 7. LRC 清洗

Suno 生成的 LRC 有三个问题：中文逐字空格、结构标签混入、发音替代字。清洗脚本处理前两个，发音替代字需要手动替换回正本（比如 Suno 用"遥"确保发音，但网站要显示"垚"）。

### 8. 网站部署

备份旧文件 → 复制新 MP3 和 LRC → git commit → push → 等 Actions 部署。

### 9. 记录声线效果

每次生成后记录标签组合、实际效果、烟嗓程度，逐步积累调教数据库。

## 降级策略

v5.5（chirp-fenix）音质好但不稳定。v5.0（chirp-crow）稳定 100% 但时长短 40%。

策略：v5.5 提交 → 失败等 10 秒重试 → 仍失败切 v5.0 同歌词直投。

## 踩过的坑

- **502 错误**：内联大段中文 JSON 会触发 502，必须写成文件再 `curl -d @file`
- **连续提交限速**：两次提交间隔必须 ≥ 35 秒
- **儿化音**：AI 不能稳定处理，歌词里一律不用
- **多音字"系"**：AI 默认读 xì，"系围巾"应读 jì，用"绑""扣"替代
