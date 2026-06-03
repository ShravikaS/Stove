(function () {
  const ENABLED_KEY = 'stoveMusicEnabled';
  const TIME_PREFIX = 'stoveMusicTime:';
  const AUDIO_ID = 'bg-music';

  function getConfiguredSource() {
    return window.STOVE_MUSIC_SRC || document.documentElement.dataset.musicSrc || document.body?.dataset.musicSrc || 'music.mp3';
  }

  function ensureAudio() {
    let audio = document.getElementById(AUDIO_ID);

    if (!audio) {
      audio = document.createElement('audio');
      audio.id = AUDIO_ID;
      audio.preload = 'auto';
      audio.loop = true;
      audio.hidden = true;
      audio.setAttribute('aria-hidden', 'true');
      (document.body || document.documentElement).appendChild(audio);
    }

    audio.preload = 'auto';
    audio.loop = true;
    audio.hidden = true;
    audio.setAttribute('aria-hidden', 'true');

    return audio;
  }

  function getTimeKey(source) {
    return `${TIME_PREFIX}${source}`;
  }

  function restorePosition(audio, source) {
    const savedTime = Number(localStorage.getItem(getTimeKey(source)));

    if (!Number.isFinite(savedTime) || savedTime <= 0) {
      return;
    }

    const applyTime = () =>{
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = savedTime % audio.duration;
      }
    };

    if (audio.readyState >= 1) {
      applyTime();
    } else {
      audio.addEventListener('loadedmetadata', applyTime, { once: true });
    }
  }

  function persistPosition(audio, source) {
    if (!source || audio.paused) {
      return;
    }

    localStorage.setItem(getTimeKey(source), String(audio.currentTime));
  }

  function tryPlay(audio) {
    localStorage.setItem(ENABLED_KEY, 'true');
    const playPromise = audio.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  function setSource(source, options = {}) {
    if (!source) {
      return null;
    }

    const audio = ensureAudio();
    const nextSource = String(source);
    const shouldAutoplay = options.autoplay !== false;
    const shouldRestore = options.restore !== false;

    if (audio.dataset.currentSource !== nextSource || !audio.getAttribute('src')) {
      audio.dataset.currentSource = nextSource;
      audio.src = nextSource;

      if (shouldRestore) {
        restorePosition(audio, nextSource);
      }
    }

    audio.volume = Number.isFinite(options.volume) ? options.volume : 0.35;

    if (!audio.dataset.timeUpdateListener) {
      audio.addEventListener('timeupdate', () => {
        persistPosition(audio, audio.dataset.currentSource);
      });
      audio.dataset.timeUpdateListener = 'true';
    }

    if (shouldAutoplay) {
      tryPlay(audio);
    }

    return audio;
  }

  function init() {
    const source = getConfiguredSource();

    if (source) {
      setSource(source);
    }

    const unlockMusic = () => {
      const audio = document.getElementById(AUDIO_ID);

      if (audio) {
        tryPlay(audio);
      }
    };

    ['pointerdown', 'keydown', 'touchstart', 'click'].forEach((eventName) => {
      document.addEventListener(eventName, unlockMusic, { once: true, passive: true });
    });
  }

  window.setStoveMusicSource = (source, options = {}) => setSource(source, options);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();