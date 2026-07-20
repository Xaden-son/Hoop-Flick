(function (global) {
  "use strict";

  const SAVE_LIMIT_BYTES = 3 * 1024 * 1024;
  const LOAD_TIMEOUT_MS = 3500;
  const sdk = global.ytgame;
  const inPlayablesEnv = Boolean(sdk && sdk.IN_PLAYABLES_ENV);
  let firstFrameSent = false;
  let gameReadySent = false;
  let loadFinished = false;
  let loadedData = null;
  let audioEnabled = true;
  let initialized = false;

  function report(level, message, error) {
    const detail = error && error.message ? message + ": " + error.message : message;
    const consoleMethod = level === "error" ? "error" : "warn";
    if (global.console && typeof global.console[consoleMethod] === "function") {
      global.console[consoleMethod]("[YouTube Playables] " + detail);
    }
    if (!inPlayablesEnv || !sdk.health) return;
    const healthMethod = level === "error" ? "logError" : "logWarning";
    try {
      if (typeof sdk.health[healthMethod] === "function") sdk.health[healthMethod](detail);
    } catch (_) {
      // Health reporting must never block the game.
    }
  }

  function callSdk(group, method, args) {
    if (!inPlayablesEnv) return undefined;
    const target = sdk && sdk[group];
    if (!target || typeof target[method] !== "function") {
      report("warning", group + "." + method + " is unavailable");
      return undefined;
    }
    try {
      return target[method].apply(target, args || []);
    } catch (error) {
      report("error", group + "." + method + " failed", error);
      return undefined;
    }
  }

  function withTimeout(promise, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timer = global.setTimeout(() => reject(new Error("loadData timed out")), timeoutMs);
      Promise.resolve(promise).then(
        (value) => {
          global.clearTimeout(timer);
          resolve(value);
        },
        (error) => {
          global.clearTimeout(timer);
          reject(error);
        }
      );
    });
  }

  function isValidScore(value) {
    return Number.isInteger(value) && Number.isSafeInteger(value) && value >= 0;
  }

  async function loadData() {
    if (loadFinished) return loadedData;
    if (!inPlayablesEnv) {
      loadFinished = true;
      return null;
    }
    try {
      const result = callSdk("game", "loadData");
      loadedData = await withTimeout(result, LOAD_TIMEOUT_MS);
      if (typeof loadedData !== "string") loadedData = null;
    } catch (error) {
      loadedData = null;
      report("warning", "Cloud save could not be loaded; defaults will be used", error);
    } finally {
      loadFinished = true;
    }
    return loadedData;
  }

  async function saveData(data) {
    if (!loadFinished) {
      report("warning", "saveData was ignored because loadData has not finished");
      return false;
    }
    if (typeof data !== "string") {
      report("warning", "saveData requires a JSON string");
      return false;
    }
    const byteLength = new TextEncoder().encode(data).byteLength;
    if (byteLength >= SAVE_LIMIT_BYTES) {
      report("error", "Cloud save exceeds the 3 MiB limit");
      return false;
    }
    if (!inPlayablesEnv) return true;
    try {
      await Promise.resolve(callSdk("game", "saveData", [data]));
      return true;
    } catch (error) {
      report("error", "Cloud save failed", error);
      return false;
    }
  }

  function isRewardedAdAvailable() {
    return Boolean(inPlayablesEnv && sdk && sdk.ads && typeof sdk.ads.requestRewardedAd === "function");
  }

  async function requestRewardedAd(rewardId) {
    if (!isRewardedAdAvailable() || typeof rewardId !== "string" || !rewardId) return false;
    try {
      const result = callSdk("ads", "requestRewardedAd", [rewardId]);
      return await Promise.resolve(result) === true;
    } catch (error) {
      report("warning", "Rewarded ad request failed", error);
      return false;
    }
  }

  function firstFrameReady() {
    if (firstFrameSent) return;
    firstFrameSent = true;
    callSdk("game", "firstFrameReady");
  }

  function gameReady() {
    if (gameReadySent) return;
    if (!firstFrameSent) firstFrameReady();
    gameReadySent = true;
    callSdk("game", "gameReady");
  }

  function sendScore(value) {
    if (!isValidScore(value)) {
      report("warning", "Invalid score was not sent: " + String(value));
      return false;
    }
    callSdk("engagement", "sendScore", [{ value }]);
    return true;
  }

  function readAudioEnabled() {
    if (!inPlayablesEnv) return true;
    const value = callSdk("system", "isAudioEnabled");
    return typeof value === "boolean" ? value : true;
  }

  function getLanguage() {
    if (!inPlayablesEnv) return null;
    const locale = callSdk("system", "getLanguage");
    return typeof locale === "string" && locale ? locale : null;
  }

  async function initialize(handlers) {
    const callbacks = handlers || {};
    if (!initialized) {
      initialized = true;
      audioEnabled = readAudioEnabled();
      if (inPlayablesEnv) {
        callSdk("system", "onAudioEnabledChange", [
          (enabled) => {
            audioEnabled = Boolean(enabled);
            if (typeof callbacks.onAudioEnabledChange === "function") {
              callbacks.onAudioEnabledChange(audioEnabled);
            }
          }
        ]);
        callSdk("system", "onPause", [() => {
          if (typeof callbacks.onPause === "function") callbacks.onPause();
        }]);
        callSdk("system", "onResume", [() => {
          if (typeof callbacks.onResume === "function") callbacks.onResume();
        }]);
      }
    }
    const data = await loadData();
    return {
      data,
      audioEnabled,
      language: getLanguage(),
      inPlayablesEnv
    };
  }

  global.PlayablesBridge = Object.freeze({
    initialize,
    firstFrameReady,
    gameReady,
    sendScore,
    loadData,
    saveData,
    isRewardedAdAvailable,
    requestRewardedAd,
    isAudioEnabled: () => audioEnabled,
    getLanguage,
    isInPlayablesEnv: () => inPlayablesEnv,
    isLoadFinished: () => loadFinished
  });
})(window);
