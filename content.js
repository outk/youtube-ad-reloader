const RELOAD_FLAG_KEY = 'yt_ad_reloaded_flag';
let lastNormalTime = 0;
let lastDuration = 0;

// 1. 動画の再生時間を常時記録（広告開始前の正確な時間を把握するため）
setInterval(() => {
  const player = document.querySelector('.html5-video-player');
  const video = document.querySelector('video');

  if (player && video) {
    const isAdShowing = player.classList.contains('ad-showing') || 
                        player.classList.contains('ad-interrupting');
    
    // 広告中でなく、再生中の場合のみ、現在の再生時間と動画全体の長さを記録
    if (!isAdShowing && video.currentTime > 0) {
      lastNormalTime = Math.floor(video.currentTime);
      lastDuration = Math.floor(video.duration || 0);
    }
  }
}, 500);

// 2. 広告を検知してURLの時間を書き換えてからリロードする処理
function checkAdAndReload() {
  const player = document.querySelector('.html5-video-player');
  if (!player) return;

  const isAdShowing = player.classList.contains('ad-showing') || 
                      player.classList.contains('ad-interrupting');

  if (isAdShowing) {
    console.log('広告を検知しました。時間パラメータを更新してリロードします。');
    
    // リロード後の再開用フラグをセット
    sessionStorage.setItem(RELOAD_FLAG_KEY, 'true');

    // 現在のURLを取得
    const url = new URL(window.location.href);
    const liveBadge = document.querySelector('.ytp-live-badge');
    const isLive = liveBadge && !liveBadge.classList.contains('ytp-live-badge-disabled');

    // 動画終了後（最後まで見終わった状態）かどうかの判定（残り1秒以下）
    const isEnded = lastDuration > 0 && (lastDuration - lastNormalTime <= 1);

    if (isLive) {
      // ライブ配信の場合は時間を指定しない
      url.searchParams.delete('t');
    } else if (isEnded) {
      // 動画終了後の広告（ポストロール）の場合、時間を巻き戻さない（パラメータ削除）
      url.searchParams.delete('t');
    } else if (lastNormalTime > 0) {
      // 途中広告（ミッドロール）の場合、直前に記録した経過時間で上書き
      url.searchParams.set('t', `${lastNormalTime}s`);
    }

    // URLを書き換えてページを遷移（履歴に残さないreplaceを使用）
    window.location.replace(url.href);
  }
}

// 3. リロード後に動画が止まっていたら強制的に再開する処理
function forceResumeVideo() {
  if (sessionStorage.getItem(RELOAD_FLAG_KEY) === 'true') {
    sessionStorage.removeItem(RELOAD_FLAG_KEY);
    
    // 動画終了後のリロードだった場合は、YouTubeの自動機能（次の動画へ）に任せて強制再生はしない
    const urlParams = new URLSearchParams(window.location.search);
    const isLive = document.querySelector('.ytp-live-badge');
    if (!urlParams.has('t') && !isLive) {
        return; 
    }

    let attempts = 0;
    const resumeInterval = setInterval(() => {
      attempts++;
      const video = document.querySelector('video');
      const playButton = document.querySelector('.ytp-play-button');

      if (video && video.readyState >= 2) { 
        if (video.paused) {
          video.play().then(() => {
            console.log('動画の自動再開に成功しました。');
            clearInterval(resumeInterval);
          }).catch(() => {
            // Chromeの自動再生ブロックが働いた場合はボタンをクリック
            if (playButton) playButton.click();
          });
        } else {
          console.log('動画の再生を確認しました。');
          clearInterval(resumeInterval);
        }
      }

      // 10秒（20回）試してもダメなら監視終了
      if (attempts >= 20) {
        clearInterval(resumeInterval);
      }
    }, 500);
  }
}

// === 拡張機能の実行開始 ===

// ページ読み込み時に「リロード後の再開処理」を起動
forceResumeVideo();

// 広告監視ループ（0.5秒間隔）
setInterval(checkAdAndReload, 500);