let isReloading = false;

// ライブ配信の場合に「ライブ（最新）」ボタンを押して追いつかせる処理
function jumpToLiveEdge() {
  const video = document.querySelector('video');
  const liveBadge = document.querySelector('.ytp-live-badge');

  if (video && liveBadge && !liveBadge.classList.contains('ytp-live-badge-disabled')) {
    liveBadge.click();
  }
}

// ページ読み込み完了後に再生位置を復元（またはライブへ移動）
window.addEventListener('load', () => {
  const liveBadge = document.querySelector('.ytp-live-badge');
  const isLive = liveBadge && !liveBadge.classList.contains('ytp-live-badge-disabled');

  if (isLive) {
    // ライブ配信の場合は最新位置にスクロール
    setTimeout(jumpToLiveEdge, 1500);
  } else {
    // 通常動画の場合は保存しておいた再生時間を復元して再生開始
    const savedTime = sessionStorage.getItem('yt_saved_video_time');
    if (savedTime !== null) {
      const targetTime = parseFloat(savedTime);
      sessionStorage.removeItem('yt_saved_video_time');

      const restoreTimeAndPlay = () => {
        const video = document.querySelector('video');
        if (video && !isNaN(video.duration)) {
          video.currentTime = targetTime;
          // 明示的に再生を開始
          video.play().catch(err => {
            console.log('自動再生がブロックされたため、ユーザー操作が必要です:', err);
          });
        } else {
          setTimeout(restoreTimeAndPlay, 200);
        }
      };
      restoreTimeAndPlay();
    }
  }
});

// 広告要素の検出とリロード処理
function checkForAds() {
  if (isReloading) return;

  const player = document.querySelector('.html5-video-player');
  
  if (player) {
    const isAdShowing = player.classList.contains('ad-showing') || 
                        player.classList.contains('ad-interrupting');

    if (isAdShowing) {
      isReloading = true;

      const video = document.querySelector('video');
      const liveBadge = document.querySelector('.ytp-live-badge');
      const isLive = liveBadge && !liveBadge.classList.contains('ytp-live-badge-disabled');

      // 通常動画の場合は現在の再生時間を一時保存
      if (video && !isLive) {
        sessionStorage.setItem('yt_saved_video_time', video.currentTime.toString());
      }

      console.log('広告を検出しました。ページをリロードします...');
      location.reload();
    }
  }
}

// DOMの変化を継続的に監視
const observer = new MutationObserver(() => {
  checkForAds();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class']
});