const {
  getScenario,
  getScenarioKey,
  setScenarioKey,
  getReportMode,
  setReportMode
} = window.MBPTPrototypeShared;

const data = window.MBPTPrototypeData;
const beasts = data.beasts;
const branches = data.branches;
const storyModes = data.storyModes;

const scoreKeys = ["communication", "action", "resilience", "coordination", "insight"];
const scoreLabels = {
  communication: "溝通表達",
  action: "行動推進",
  resilience: "承壓恢復",
  coordination: "協作整合",
  insight: "洞察理解"
};

let analysisTriggered = false;
let lastAnalysisState = null;

function byId(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const node = byId(id);
  if (node) node.textContent = value;
}

function setValue(id, value) {
  const node = byId(id);
  if (node) node.value = value;
}

function clamp(value) {
  return Math.max(18, Math.min(96, Math.round(value)));
}

function getBeast(id) {
  return beasts.find((item) => item.id === id);
}

function getBranch(id) {
  return branches.find((item) => item.id === id);
}

function populateSelect(selectId, items) {
  const select = byId(selectId);
  if (!select) return;
  select.innerHTML = items
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
}

function currentScenario() {
  return getScenario();
}

function currentReportModeLabel() {
  return data.reportModes[getReportMode()] || data.reportModes.experience;
}

function applyScenarioDefaults() {
  const scenario = currentScenario();
  if (!scenario) return;

  setValue("case-title", scenario.title);
  setValue("case-type", scenario.label);
  setValue("case-date", scenario.date);
  setValue("case-time", scenario.time);
  setValue("case-description", scenario.description);
  setValue("case-context", scenario.context);
  setValue("a-beast", scenario.defaults.aBeast);
  setValue("a-branch", scenario.defaults.aBranch);
  setValue("b-beast", scenario.defaults.bBeast);
  setValue("b-branch", scenario.defaults.bBranch);
}

function collectInputs() {
  return {
    scenario: currentScenario(),
    title: byId("case-title").value.trim(),
    type: byId("case-type").value.trim(),
    date: byId("case-date").value.trim(),
    time: byId("case-time").value.trim(),
    description: byId("case-description").value.trim(),
    context: byId("case-context").value.trim(),
    aBeast: getBeast(byId("a-beast").value),
    aBranch: getBranch(byId("a-branch").value),
    bBeast: getBeast(byId("b-beast").value),
    bBranch: getBranch(byId("b-branch").value),
    reportMode: currentReportModeLabel()
  };
}

function buildTypeName(beast, branch) {
  return `${beast.name}${branch.name}型`;
}

function buildTypeCode(beast, branch) {
  return `${beast.code}-${branch.code}`;
}

function buildScores(beast, branch) {
  const scores = {};
  scoreKeys.forEach((key) => {
    scores[key] = clamp(beast.baseScores[key] + branch.delta[key]);
  });
  return scores;
}

function rankedScores(scores) {
  return [...scoreKeys]
    .map((key) => ({ key, label: scoreLabels[key], value: scores[key] }))
    .sort((a, b) => b.value - a.value);
}

function topKey(scores) {
  return rankedScores(scores)[0].key;
}

function lowKey(scores) {
  const ranked = rankedScores(scores);
  return ranked[ranked.length - 1].key;
}

function buildProfile(beast, branch) {
  return {
    beast,
    branch,
    typeName: buildTypeName(beast, branch),
    typeCode: buildTypeCode(beast, branch),
    scores: buildScores(beast, branch)
  };
}

function getInteractionRisk(aScores, bScores) {
  const communicationGap = Math.abs(aScores.communication - bScores.communication);
  const actionGap = Math.abs(aScores.action - bScores.action);
  const coordinationGap = Math.abs(aScores.coordination - bScores.coordination);
  const insightGap = Math.abs(aScores.insight - bScores.insight);

  if (communicationGap >= 24) {
    return {
      title: "溝通節奏落差大",
      copy: "一方傾向直接表達，另一方則需要更多消化空間。若不先調整節奏，很容易出現你以為說清楚了，對方卻還沒接住的情況。"
    };
  }

  if (actionGap >= 24) {
    return {
      title: "推進速度不同步",
      copy: "一方希望快速決定、快速前進，另一方則習慣先觀察再確認。若沒有共同節奏，容易形成催促與拖延的對立。"
    };
  }

  if (coordinationGap >= 24) {
    return {
      title: "合作方法差異明顯",
      copy: "彼此對分工、流程和協作方式的期待不同。若沒有先把角色與界線談清楚，實作階段會頻繁卡住。"
    };
  }

  if (insightGap >= 24) {
    return {
      title: "理解深度不同",
      copy: "一方習慣看大局與深層動機，另一方則偏向立刻回應眼前問題。若沒有轉譯，就容易出現『你想太多』或『你看太淺』的感受。"
    };
  }

  return {
    title: "結構相容度高",
    copy: "兩邊在核心節奏上並沒有太大的硬碰撞，重點會落在如何把優勢放對位置，讓合作自然展開。"
  };
}

function buildBodyState(profile) {
  const weakest = lowKey(profile.scores);
  const riskMap = {
    communication: "當表達壓力累積時，容易出現說不出口、說了也不被懂的悶感。",
    action: "當行動分數偏弱時，常見的是想很多卻不容易啟動，久了會變成自我消耗。",
    resilience: "承壓恢復偏弱時，外表看起來還撐得住，實際上身心已經很疲乏。",
    coordination: "協作整合偏弱時，常會覺得自己要嘛管太多，要嘛根本接不上別人的節奏。",
    insight: "洞察理解偏弱時，容易只看到表面反應，忽略真正的需求與情緒來源。"
  };

  return {
    title: `${profile.beast.name}${profile.branch.name}的身心提醒`,
    summary: `${profile.branch.organ}與${profile.beast.tcmFocus}是這組型態最需要照顧的地方。${profile.beast.bodyHint}`,
    risk: riskMap[weakest],
    advice: `這類型最有效的修復方式，不是硬撐，而是回到${profile.branch.organ}與日常節律，讓能量重新回到自己身上。`
  };
}

function chooseStoryMode(targetProfile) {
  return targetProfile.beast.storyMode;
}

function buildStory(profile, targetProfile, scenario) {
  const modeName = chooseStoryMode(targetProfile);
  const mode = storyModes[modeName];

  return {
    modeName,
    role: `如果你要和 ${targetProfile.typeName} 對話，最適合用「${modeName}」這種敘事節奏。`,
    title: mode.title,
    opening: `在 ${scenario.label} 這個情境裡，對方不一定要先被說服，而是要先感受到你真的理解他在意什麼。`,
    identity: `${targetProfile.typeName} 的核心角色偏向 ${targetProfile.beast.role}，因此面對互動時會特別在意自己是否被看見、是否被尊重。`,
    bridge: mode.focus,
    template: mode.work,
    action: `下一步建議把 ${scenario.label} 的重點先講清楚，再用 ${modeName} 的方式帶出分工、期待與可執行的下一步。`
  };
}

function buildIcap(profile, scenario) {
  const strongest = topKey(profile.scores);
  const map = {
    communication: {
      name: "溝通引導能力",
      role: "說清楚、帶情境、讓人願意聽",
      bridge: `在 ${scenario.label} 情境中，你最能發揮的是把抽象感受說成對方聽得懂的語言。`,
      roleCopy: "這種能力不是只會聊天，而是能把模糊的需求整理成可交流的內容。",
      action: "先用一句話說清主題，再用一個具體情境幫對方接住你的意思。"
    },
    action: {
      name: "決策推進能力",
      role: "給方向、定節點、推下一步",
      bridge: `在 ${scenario.label} 情境中，你的優勢是讓局面不再空轉，能快速把討論拉回實作。`,
      roleCopy: "這代表你適合在關鍵時刻做判斷，但也要注意給別人理解與回應的空間。",
      action: "把下一步拆成可執行的節點，避免只剩情緒拉扯。"
    },
    resilience: {
      name: "穩定承壓能力",
      role: "接住情緒、穩住節奏、慢慢修復",
      bridge: `在 ${scenario.label} 情境中，你比較能先穩住場面，不會讓事情因一時情緒而失控。`,
      roleCopy: "這份穩定很珍貴，但也要避免自己默默扛太多，變成只有你在撐。",
      action: "把承接變成有邊界的支持，而不是無止盡吸收。"
    },
    coordination: {
      name: "協作整合能力",
      role: "看全局、配資源、協調角色",
      bridge: `在 ${scenario.label} 情境中，你最能看見彼此位置，知道誰該往哪裡站。`,
      roleCopy: "你擅長整合不代表你要做完全部，真正的關鍵是讓每個人各就各位。",
      action: "先分清角色與責任，再開始談默契與效率。"
    },
    insight: {
      name: "洞察辨識能力",
      role: "看動機、抓關鍵、找真正卡點",
      bridge: `在 ${scenario.label} 情境中，你的優勢不是表面反應，而是看出背後真正的需要。`,
      roleCopy: "當你把關鍵說對，很多看似複雜的互動就會突然鬆開。",
      action: "先講出你看到的核心，再提出建議，對方會更容易接受。"
    }
  };

  return map[strongest];
}

function buildEvidence(aProfile, bProfile, scenario, interaction) {
  const aRank = rankedScores(aProfile.scores);
  const bRank = rankedScores(bProfile.scores);

  return [
    `主方類型為 ${aProfile.typeName}（${aProfile.typeCode}），最高分落在 ${aRank[0].label}，最低分落在 ${aRank[aRank.length - 1].label}。`,
    `對方類型為 ${bProfile.typeName}（${bProfile.typeCode}），最高分落在 ${bRank[0].label}，最低分落在 ${bRank[bRank.length - 1].label}。`,
    `${scenario.label} 目前最值得優先處理的互動議題是「${interaction.title}」。`,
    `${aProfile.beast.name} 與 ${bProfile.beast.name} 的組合，代表一邊偏向 ${aProfile.beast.role}，另一邊偏向 ${bProfile.beast.role}。`
  ];
}

function radarPoint(angle, radius) {
  const x = 120 + Math.cos(angle) * radius;
  const y = 120 + Math.sin(angle) * radius;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

function buildRadarPoints(scores) {
  const ordered = [
    scores.communication,
    scores.action,
    scores.resilience,
    scores.coordination,
    scores.insight
  ];

  return ordered
    .map((score, index) => {
      const angle = -Math.PI / 2 + index * ((Math.PI * 2) / ordered.length);
      const radius = 24 + (score / 100) * 78;
      return radarPoint(angle, radius);
    })
    .join(" ");
}

function getLargestGap(aScores, bScores) {
  return scoreKeys
    .map((key) => ({
      key,
      label: scoreLabels[key],
      a: aScores[key],
      b: bScores[key],
      gap: Math.abs(aScores[key] - bScores[key])
    }))
    .sort((left, right) => right.gap - left.gap)[0];
}

function buildSummary(input, aProfile, bProfile, interaction, bodyState, story, icap) {
  return {
    statusDone: `${input.title} 已完成 MBPT 分析，可繼續查看主分析、故事解讀、能力對位與結果報告。`,
    completionTitle: "分析完成，可以直接往下讀結果",
    completionText: "目前的案例結構、互動重點與建議輸出都已建立好，你可以直接往下閱讀完整內容，或切換不同報告模式。",
    reportSummary: `${aProfile.typeName} 在 ${input.scenario.label} 情境中的主要優勢是 ${scoreLabels[topKey(aProfile.scores)]}，與 ${bProfile.typeName} 的互動重點會落在 ${story.modeName}。`,
    reportHighlight: `${interaction.title} 是這次最需要先看見的主題，因為它直接影響這段互動接下來會更順，還是更容易卡住。`,
    reportDuo: `${aProfile.typeName} × ${bProfile.typeName}`,
    reportModeNote:
      input.reportMode === "體驗版"
        ? "這一版會用比較容易吸收的語氣，幫你快速看懂重點。"
        : input.reportMode === "教學版"
          ? "這一版會把分析拆得更清楚，適合拿來教學、討論或一起閱讀。"
          : "這一版會把建議寫得更像顧問摘要，方便帶去討論下一步。",
    sharePreview: `${aProfile.typeName} 與 ${bProfile.typeName} 在 ${input.scenario.label} 情境中的關鍵主題是 ${interaction.title}；目前最適合先做的，是 ${story.action}`,
    reportMatch: `${aProfile.typeName} 比較容易自然展現 ${scoreLabels[topKey(aProfile.scores)]}，而 ${bProfile.typeName} 則更在意 ${bProfile.beast.role} 所帶來的節奏與感受。`,
    reportInteraction: interaction.copy,
    reportStory: `${story.role}${story.title}。重點橋接方式是：${story.bridge}`,
    reportIcap: `${icap.name} 是這次最值得放大的能力軸，適合用 ${icap.role} 來帶動互動。`,
    reportNext: `${story.action} 這也是目前最適合先啟動的一步。`,
    reportCare: `${bodyState.risk} ${bodyState.advice}`,
    caseMeta: `${input.date} ${input.time}｜${input.type}｜${input.reportMode}`
  };
}

function renderPreview(input, aProfile, bProfile, interaction) {
  setText("summary-case-title", input.title || "尚未建立案例");
  setText("summary-line", input.description || "先輸入情境、雙方人格與目前卡點，右側會同步整理案例摘要。");
  setText("summary-main", aProfile ? `${aProfile.typeName} / ${aProfile.typeCode}` : "待選擇");
  setText("summary-secondary", bProfile ? `${bProfile.typeName} / ${bProfile.typeCode}` : "待選擇");
  setText("summary-risk", interaction ? interaction.title : "尚未分析");
  setText("summary-case-type", input.type || "未指定");
}

function renderStatus(summary) {
  if (!analysisTriggered || !summary) {
    setText("analysis-status-title", "等待你開始這次體驗");
    setText("analysis-status-text", "完成情境輸入後，系統會依雙方人格與當前問題，整理出分析、故事解讀與結果報告。");
    setText("completion-title", "現在還在建立案例階段");
    setText("completion-text", "你現在看到的是即時預覽；按下開始分析後，系統就會把這次的結果完整整理出來。");
    ["step-structure", "step-mapping", "step-report"].forEach((id) => byId(id)?.classList.remove("is-done"));
    return;
  }

  setText("analysis-status-title", "分析完成，結果已準備好");
  setText("analysis-status-text", summary.statusDone);
  setText("completion-title", summary.completionTitle);
  setText("completion-text", summary.completionText);
  ["step-structure", "step-mapping", "step-report"].forEach((id) => byId(id)?.classList.add("is-done"));
}

function renderAnalysis(aProfile, bProfile, interaction, bodyState, evidence) {
  const mainTop = rankedScores(aProfile.scores)[0];
  const otherTop = rankedScores(bProfile.scores)[0];
  const biggestGap = getLargestGap(aProfile.scores, bProfile.scores);

  setText("report-main-code", `${aProfile.typeName} / ${aProfile.typeCode}`);
  setText("beast-branch-copy", `${aProfile.beast.name}代表 ${aProfile.beast.role}，配上${aProfile.branch.name}支後，會更明顯展現 ${aProfile.branch.element} 性質的互動節奏。`);

  setText("report-secondary-code", `${bProfile.typeName} / ${bProfile.typeCode}`);
  setText("counterpart-copy", `${bProfile.beast.name}代表 ${bProfile.beast.role}，在互動中更在意的是 ${bProfile.branch.organ} 所象徵的安全感與穩定感。`);

  setText("interaction-risk-title", interaction.title);
  setText("interaction-risk-copy", interaction.copy);

  setText("body-state-title", bodyState.title);
  setText("body-state-summary", bodyState.summary);
  setText("body-state-risk", bodyState.risk);
  setText("body-state-advice", bodyState.advice);

  byId("radar-a").setAttribute("points", buildRadarPoints(aProfile.scores));
  byId("radar-b").setAttribute("points", buildRadarPoints(bProfile.scores));

  setText("radar-main-axis", `你的節奏目前最突出的面向是「${mainTop.label}」；這通常也是你最自然、最容易被看見的優勢。`);
  setText("radar-other-axis", `對方目前最突出的面向是「${otherTop.label}」；理解這一點，會更知道他為什麼這樣反應。`);
  setText("radar-gap-axis", `你們現在差距最大的面向是「${biggestGap.label}」；這往往就是最容易誤會、也最值得先對齊的地方。`);

  byId("evidence-list").innerHTML = evidence.map((item) => `<li>${item}</li>`).join("");
}

function renderStory(story) {
  setText("story-role", story.role);
  setText("story-title", story.title);
  setText("story-opening", story.opening);
  setText("story-identity", story.identity);
  setText("story-bridge", story.bridge);
  setText("story-template", story.template);
  setText("story-action", story.action);
}

function renderIcap(icap) {
  setText("icap-name", icap.name);
  setText("icap-role", icap.role);
  setText("icap-bridge", icap.bridge);
  setText("icap-role-copy", icap.roleCopy);
  setText("icap-action", icap.action);
}

function renderReport(input, aProfile, bProfile, summary) {
  setText("report-title", `${input.title}｜MBPT 結果報告`);
  setText("report-case-meta", summary.caseMeta);
  setText("report-highlight", summary.reportHighlight);
  setText("report-duo", summary.reportDuo);
  setText("report-mode-note", summary.reportModeNote);
  setText("report-share-status", analysisTriggered ? "可以直接複製這段摘要，拿去分享或傳訊息。" : "完成分析後，可以一鍵複製這次的結果摘要。");
  setText("report-share-preview", summary.sharePreview);
  setText("report-summary", `${summary.reportSummary} 主方為 ${aProfile.typeName}，互動對象為 ${bProfile.typeName}。`);
  setText("report-match", summary.reportMatch);
  setText("report-interaction", summary.reportInteraction);
  setText("report-story", summary.reportStory);
  setText("report-icap", summary.reportIcap);
  setText("report-next", summary.reportNext);
  setText("report-care", summary.reportCare);
}

function renderRail(aProfile, story, bodyState) {
  setText("rail-status", analysisTriggered ? "分析完成" : "等待建立");
  setText("rail-main", aProfile ? aProfile.typeName : "尚未建立");
  setText("rail-story", story ? story.modeName : "尚未建立");
  setText("rail-body", bodyState ? bodyState.title : "尚未建立");
}

function renderModeButtons() {
  document.querySelectorAll("[data-report-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.reportMode === getReportMode());
  });
}

function setActivePanel(panelId) {
  document.querySelectorAll(".panel-section").forEach((section) => {
    section.classList.toggle("is-active", section.id === panelId);
  });

  document.querySelectorAll("[data-panel-link]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.panelLink === panelId);
  });

  document.querySelectorAll(".top-nav a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("is-active", href.replace("#", "") === panelId);
  });

  const targetPanel = byId(panelId);
  if (targetPanel) {
    targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function runAnalysis(moveToPanel = false) {
  const input = collectInputs();
  const aProfile = buildProfile(input.aBeast, input.aBranch);
  const bProfile = buildProfile(input.bBeast, input.bBranch);
  const interaction = getInteractionRisk(aProfile.scores, bProfile.scores);
  const bodyState = buildBodyState(aProfile);
  const story = buildStory(aProfile, bProfile, input.scenario);
  const icap = buildIcap(aProfile, input.scenario);
  const evidence = buildEvidence(aProfile, bProfile, input.scenario, interaction);
  const summary = buildSummary(input, aProfile, bProfile, interaction, bodyState, story, icap);
  lastAnalysisState = { input, aProfile, bProfile, interaction, bodyState, story, icap, summary };

  renderPreview(input, aProfile, bProfile, interaction);
  renderStatus(summary);
  renderAnalysis(aProfile, bProfile, interaction, bodyState, evidence);
  renderStory(story);
  renderIcap(icap);
  renderReport(input, aProfile, bProfile, summary);
  renderRail(aProfile, story, bodyState);

  if (moveToPanel) {
    setActivePanel("analysis");
  }
}

function bindScenarioButtons() {
  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      setScenarioKey(button.dataset.scenario);
      document.querySelectorAll("[data-scenario]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      applyScenarioDefaults();
      runAnalysis(false);
    });
  });
}

function bindPanelNavigation() {
  document.querySelectorAll("[data-panel-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const panelId = link.dataset.panelLink;
      setActivePanel(panelId);
      history.replaceState(null, "", `#${panelId}`);
    });
  });

  document.querySelectorAll(".top-nav a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const panelId = link.getAttribute("href").replace("#", "");
      const panel = byId(panelId);
      if (!panel) return;
      event.preventDefault();
      setActivePanel(panelId);
      history.replaceState(null, "", `#${panelId}`);
    });
  });
}

function bindReportModeButtons() {
  document.querySelectorAll("[data-report-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      setReportMode(button.dataset.reportMode);
      renderModeButtons();
      runAnalysis(false);
    });
  });
}

function bindForm() {
  byId("prototype-form").addEventListener("submit", (event) => {
    event.preventDefault();
    analysisTriggered = true;
    runAnalysis(true);
  });

  ["case-title", "case-date", "case-time", "case-description", "case-context", "a-beast", "a-branch", "b-beast", "b-branch"].forEach((id) => {
    byId(id).addEventListener("input", () => runAnalysis(false));
    byId(id).addEventListener("change", () => runAnalysis(false));
  });
}

function buildPrintHtml(mode) {
  const title = mode === "report" ? byId("report-title").textContent : "MBPT 分析工作台";
  const target = mode === "report" ? byId("report-sheet") : byId("analysis");
  return `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: "Noto Serif TC", serif; margin: 32px; color: #201d19; line-height: 1.7; }
      h1, h2, h3, h4 { margin: 0 0 12px; }
      .section { margin-bottom: 24px; }
      .card-tag { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #8a533b; }
      ul { padding-left: 20px; }
      button { display: none; }
      svg { max-width: 420px; display: block; margin: 0 auto; }
    </style>
  </head>
  <body>
    ${target.outerHTML}
  </body>
</html>`;
}

function buildShareText() {
  if (!lastAnalysisState) return "";
  const { input, summary } = lastAnalysisState;
  return `${input.title}｜${summary.reportDuo}\n${summary.sharePreview}\n${summary.reportCare}`;
}

async function copyReportSummary() {
  const text = buildShareText();
  if (!text) {
    setText("report-share-status", "請先完成分析，再複製摘要。");
    return;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const helper = document.createElement("textarea");
      helper.value = text;
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      document.body.removeChild(helper);
    }
    setText("report-share-status", "已複製摘要，可以直接貼到訊息或筆記。");
  } catch (error) {
    setText("report-share-status", "目前無法直接複製，請改用列印或手動複製報告內容。");
  }
}

function resetExperience() {
  analysisTriggered = false;
  lastAnalysisState = null;
  setReportMode("experience");
  renderModeButtons();
  applyScenarioDefaults();
  runAnalysis(false);
  setActivePanel("case-entry");
  history.replaceState(null, "", "#case-entry");
}

function bindExperienceActions() {
  byId("copy-report")?.addEventListener("click", copyReportSummary);
  byId("copy-report-rail")?.addEventListener("click", copyReportSummary);
  byId("reset-prototype")?.addEventListener("click", resetExperience);
}

window.MBPTPrintPage = function MBPTPrintPage(mode) {
  const html = buildPrintHtml(mode);
  const popup = window.open("", "_blank", "width=1080,height=900");

  if (!popup) {
    window.print();
    return;
  }

  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  popup.focus();
  popup.onload = function onload() {
    popup.print();
  };
};

function init() {
  populateSelect("a-beast", beasts);
  populateSelect("b-beast", beasts);
  populateSelect("a-branch", branches);
  populateSelect("b-branch", branches);

  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.scenario === getScenarioKey());
  });

  applyScenarioDefaults();
  renderModeButtons();
  bindScenarioButtons();
  bindPanelNavigation();
  bindReportModeButtons();
  bindForm();
  bindExperienceActions();

  const hash = window.location.hash.replace("#", "");
  if (hash && byId(hash)) {
    setActivePanel(hash);
  } else {
    setActivePanel("overview");
  }

  runAnalysis(false);
}

window.addEventListener("DOMContentLoaded", init);
