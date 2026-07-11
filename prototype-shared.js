(function () {
  const storageKey = "mbpt-v36-scenario";

  function getData() {
    return window.MBPTPrototypeData || { scenarios: {}, typeProfiles: {} };
  }

  function getScenarioKey() {
    const stored = window.localStorage.getItem(storageKey);
    if (stored && getData().scenarios[stored]) return stored;
    return "partnership";
  }

  function getScenario() {
    return getData().scenarios[getScenarioKey()];
  }

  function getReportMode() {
    return window.localStorage.getItem("mbpt-v36-report-mode") || "experience";
  }

  function setReportMode(mode) {
    window.localStorage.setItem("mbpt-v36-report-mode", mode);
  }

  function setScenarioKey(key) {
    if (!getData().scenarios[key]) return;
    window.localStorage.setItem(storageKey, key);
  }

  function getTypeProfile(code) {
    return getData().typeProfiles[code];
  }

  window.MBPTPrototypeShared = {
    getData,
    getScenarioKey,
    getScenario,
    setScenarioKey,
    getTypeProfile,
    getReportMode,
    setReportMode
  };
})();
