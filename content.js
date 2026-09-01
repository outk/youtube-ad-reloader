// 広告リロード用の目印キー
const RELOAD_FLAG_KEY = 'yt_ad_reloaded_flag';

// 1. 広告を検知してリロードする処理
function checkAdAndReload() {
  const player = document.querySelector('.html5-video-player');
  if (!player) return;

  // 広告が表示されているか判定
  const isAdShowing = player.classList.contains('ad-showing') || 
                      player.classList.contains('ad-interrupting');

  if (isAdShowing) {
    console.log('広告を検知しました。リロードを実行します。');
    // リロード直前にセッションストレージにフラグを保存
    sessionStorage.setItem(RELOAD_FLAG_KEY, 'true');
    // ページを再読み込み
    location.reload();
  }
}

// 2. リロード後に動画が止まっていたら強制的に再開する処理
function forceResumeVideo() {
  // リロード直後かどうかを判定
  if (sessionStorage.getItem(RELOAD_FLAG_KEY) === 'true') {
    // 処理開始時にフラグを消去（無限ループ防止）
    sessionStorage.removeItem(RELOAD_FLAG_KEY);
    
    let attempts = 0;
    
    // 0.5秒ごとに動画の状態を監視し、止まっていれば動かす
    const resumeInterval = setInterval(() => {
      attempts++;
      const video = document.querySelector('video');
      const playButton = document.querySelector('.ytp-play-button');

      if (video && video.readyState >= 2) { 
        if (video.paused) {
          // パターンA: プログラムから直接再生を命令
          video.play().then(() => {
            console.log('動画の自動再開に成功しました。');
            clearInterval(resumeInterval);
          }).catch((error) => {
            console.log('Chromeの自動再生ブロックが働きました。ボタンクリックを試行します。', error);
            // パターンB: ブロックされた場合は、画面上の「再生ボタン」を強制クリック
            if (playButton) {
              playButton.click();
            }
          });
        } else {
          // すでに再生状態になっていれば監視を終了
          console.log('動画の再生を確認しました。');
          clearInterval(resumeInterval);
        }
      }

      // 10秒（20回）試してもダメなら、エラーを防ぐため監視を諦める
      if (attempts >= 20) {
        clearInterval(resumeInterval);
      }
    }, 500);
  }
}

// === 拡張機能の実行開始 ===

// ページ読み込み時に「リロード後の再開処理」を起動
forceResumeVideo();

// 通常の広告監視ループ（0.5秒間隔）
setInterval(checkAdAndReload, 500);