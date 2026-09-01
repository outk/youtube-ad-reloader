# YouTube Ad Auto Reloader & Live Sync

A Chrome Extension that automatically reloads the page when an ad is detected on YouTube. During live streams, it automatically jumps to the live edge after reloading, and for standard videos, it restores your playback position.

YouTubeで広告が流れた際に自動的にページをリロードし、ライブ配信の場合は最新の時刻へ追いつき、通常動画の場合はリロード前の再生位置から自動的に再開するChromeブラウザ拡張機能です。

## Features / 特長

- **Auto-Reload on Ads**: Reloads the page instantly when a video ad starts.
- **Live Stream Sync**: Automatically jumps to the current live edge after reloading live streams.
- **Video Progress Retention**: Restores the video playback time after reloading standard videos.
- **Lightweight**: Zero external dependencies, pure JavaScript.

## Installation / インストール方法

1. Download or clone this repository:
   ```bash
   git clone [https://github.com/your-username/youtube-ad-reloader.git](https://github.com/your-username/youtube-ad-reloader.git)
   ```
2. Open Chrome and navigate to chrome://extensions/.
3. Enable Developer mode in the top right corner.
4. Click Load unpacked and select the extension folder.

## Usage / 使用方法
Once installed, the extension works automatically in the background on YouTube (https://www.youtube.com/*).

Standard Videos: When an ad begins, the page reloads automatically and resumes playback from the timestamp right before the ad appeared.

Live Streams: When an ad begins, the page reloads and automatically syncs to the latest live edge.

インストール後、YouTubeを開くだけでバックグラウンドで自動的に動作します。

通常の動画: 広告が流れるとページをリロードし、広告が表示される直前の再生時間から動画を再開します。

ライブ配信: 広告が流れるとページをリロードし、自動的に最新の配信時刻（ライブ位置）へ追いつきます。
