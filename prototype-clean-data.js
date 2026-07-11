window.MBPTPrototypeData = {
  beasts: [
    {
      id: "qinglong",
      name: "青龍",
      code: "QL",
      role: "開創與整合者",
      storyMode: "策略引導",
      baseScores: { communication: 72, action: 68, resilience: 60, coordination: 80, insight: 58 },
      tcmFocus: "肝膽與節奏",
      bodyHint: "容易一肩扛起方向與安排，壓力累積時要特別留意節奏失衡與情緒悶住。",
      bodyTag: "木"
    },
    {
      id: "zhuque",
      name: "朱雀",
      code: "ZQ",
      role: "表達與點燃者",
      storyMode: "熱情點燃",
      baseScores: { communication: 88, action: 74, resilience: 54, coordination: 56, insight: 66 },
      tcmFocus: "心火與表達",
      bodyHint: "說話有感染力，但在情緒高張時也容易過熱，需要留意休息與收束。",
      bodyTag: "火"
    },
    {
      id: "gouchen",
      name: "勾陳",
      code: "GC",
      role: "承托與穩定者",
      storyMode: "穩定承托",
      baseScores: { communication: 52, action: 62, resilience: 86, coordination: 74, insight: 60 },
      tcmFocus: "脾胃與承載",
      bodyHint: "面對壓力時常先撐住全局，久了容易累在身體，適合用穩定節律回補能量。",
      bodyTag: "土"
    },
    {
      id: "tengshe",
      name: "螣蛇",
      code: "TS",
      role: "洞察與轉譯者",
      storyMode: "洞察穿透",
      baseScores: { communication: 58, action: 44, resilience: 50, coordination: 62, insight: 90 },
      tcmFocus: "神經與覺察",
      bodyHint: "感受細膩、觀察深入，但也容易想太多，適合以清楚邊界和安定節奏來保護自己。",
      bodyTag: "水"
    },
    {
      id: "baihu",
      name: "白虎",
      code: "BH",
      role: "決斷與推進者",
      storyMode: "行動突破",
      baseScores: { communication: 60, action: 88, resilience: 76, coordination: 42, insight: 56 },
      tcmFocus: "肺氣與執行",
      bodyHint: "行動果斷、反應俐落，壓力大時容易變得太硬，需注意呼吸、放鬆和恢復空間。",
      bodyTag: "金"
    },
    {
      id: "xuanwu",
      name: "玄武",
      code: "XW",
      role: "守護與深思者",
      storyMode: "深層守護",
      baseScores: { communication: 46, action: 50, resilience: 78, coordination: 68, insight: 82 },
      tcmFocus: "腎氣與安全感",
      bodyHint: "習慣先觀察再出手，穩定度高，但長期悶住會消耗元氣，需要安全感與信任感支撐。",
      bodyTag: "水"
    }
  ],

  branches: [
    { id: "zi", name: "子", code: "ZI", organ: "腎", element: "水", delta: { communication: 0, action: 6, resilience: 4, coordination: -2, insight: 8 } },
    { id: "chou", name: "丑", code: "CHOU", organ: "脾", element: "土", delta: { communication: -4, action: -2, resilience: 8, coordination: 8, insight: 4 } },
    { id: "yin", name: "寅", code: "YIN", organ: "肝", element: "木", delta: { communication: 4, action: 8, resilience: 0, coordination: 2, insight: 4 } },
    { id: "mao", name: "卯", code: "MAO", organ: "肝", element: "木", delta: { communication: 8, action: 2, resilience: -2, coordination: 6, insight: 6 } },
    { id: "chen", name: "辰", code: "CHEN", organ: "脾", element: "土", delta: { communication: -2, action: 0, resilience: 8, coordination: 10, insight: 4 } },
    { id: "si", name: "巳", code: "SI", organ: "心", element: "火", delta: { communication: 8, action: 6, resilience: -2, coordination: -2, insight: 2 } },
    { id: "wu", name: "午", code: "WU", organ: "心", element: "火", delta: { communication: 10, action: 8, resilience: -4, coordination: -4, insight: 0 } },
    { id: "wei", name: "未", code: "WEI", organ: "脾", element: "土", delta: { communication: 0, action: -2, resilience: 8, coordination: 8, insight: 4 } },
    { id: "shen", name: "申", code: "SHEN", organ: "肺", element: "金", delta: { communication: 4, action: 4, resilience: 4, coordination: 0, insight: 4 } },
    { id: "you", name: "酉", code: "YOU", organ: "肺", element: "金", delta: { communication: 2, action: 6, resilience: 6, coordination: -2, insight: 2 } },
    { id: "xu", name: "戌", code: "XU", organ: "脾", element: "土", delta: { communication: -2, action: 2, resilience: 8, coordination: 6, insight: 4 } },
    { id: "hai", name: "亥", code: "HAI", organ: "腎", element: "水", delta: { communication: 0, action: -4, resilience: 2, coordination: 2, insight: 10 } }
  ],

  scenarios: {
    partnership: {
      key: "partnership",
      label: "合作夥伴",
      title: "合作夥伴人格配對分析",
      type: "合作夥伴",
      date: "2026-06-18",
      time: "10:30",
      description: "兩位合作對象想確認分工、溝通節奏與彼此的信任建立方式。",
      context: "目前已有初步合作意向，但在執行風格與決策節奏上開始出現落差。",
      defaults: { aBeast: "xuanwu", aBranch: "chou", bBeast: "gouchen", bBranch: "chen" }
    },
    expression: {
      key: "expression",
      label: "表達溝通",
      title: "表達風格與說服節奏分析",
      type: "表達溝通",
      date: "2026-06-18",
      time: "10:30",
      description: "想知道自己怎麼說，對方才願意真正聽進去。",
      context: "重點不是誰對誰錯，而是如何把訊息送到對方能接住的位置。",
      defaults: { aBeast: "zhuque", aBranch: "wu", bBeast: "qinglong", bBranch: "mao" }
    },
    relationship: {
      key: "relationship",
      label: "關係互動",
      title: "關係互動與衝突修復分析",
      type: "關係互動",
      date: "2026-06-18",
      time: "10:30",
      description: "雙方關係中有吸引也有摩擦，想看清楚衝突點與修復路徑。",
      context: "希望從情緒反應、溝通模式與安全感需求三層來理解彼此。",
      defaults: { aBeast: "tengshe", aBranch: "hai", bBeast: "qinglong", bBranch: "mao" }
    },
    sales: {
      key: "sales",
      label: "銷售應用",
      title: "銷售互動與成交節奏分析",
      type: "銷售應用",
      date: "2026-06-18",
      time: "10:30",
      description: "想知道客戶是需要更多安全感、更多故事感，還是更明確的決策推進。",
      context: "這個情境會特別強調信任建立、需求辨識與成交節奏。",
      defaults: { aBeast: "qinglong", aBranch: "chen", bBeast: "xuanwu", bBranch: "you" }
    },
    career: {
      key: "career",
      label: "職涯發展",
      title: "職涯定位與合作風格分析",
      type: "職涯發展",
      date: "2026-06-18",
      time: "10:30",
      description: "想釐清自己適合什麼位置、適合怎樣的合作方式，並找出下一步。",
      context: "不只看能力，還看長期能量消耗點與可持續發揮的工作場景。",
      defaults: { aBeast: "xuanwu", aBranch: "zi", bBeast: "zhuque", bBranch: "wu" }
    }
  },

  reportModes: {
    experience: "體驗版",
    teaching: "教學版",
    consulting: "顧問版"
  },

  storyModes: {
    "策略引導": {
      title: "先看全局，再帶你走到下一步",
      focus: "對方需要先知道方向清楚、結構穩定，才會放心打開。",
      shift: "不要急著說服，先讓對方看到你有完整地圖。",
      work: "適合先整理框架、再帶出分工與決策節奏。"
    },
    "熱情點燃": {
      title: "先被打動，才願意一起前進",
      focus: "對方需要感受到你的真誠與溫度，才會願意靠近。",
      shift: "不是把話說滿，而是把感受說真。",
      work: "適合用故事、情境和共鳴帶出行動動機。"
    },
    "穩定承托": {
      title: "先讓局面穩下來，再談更深的事",
      focus: "對方需要被接住，知道你不會亂來，才願意交出信任。",
      shift: "別急著突破，先讓對方有落地感。",
      work: "適合用耐心、秩序和持續性建立合作關係。"
    },
    "洞察穿透": {
      title: "先看見真相，再決定怎麼說",
      focus: "對方需要被真正理解，而不是被表面安撫。",
      shift: "你最有力的地方，不是反應快，而是看得深。",
      work: "適合拆解情緒、看穿卡點，再用精準語言引導。"
    },
    "行動突破": {
      title: "先動起來，才能把能量帶出來",
      focus: "對方需要明確推進與判斷，才會進入狀態。",
      shift: "當節奏卡住時，清楚的決定比更多討論更有用。",
      work: "適合給出明確選項、界線與下一步。"
    },
    "深層守護": {
      title: "先建立安全感，才能進入真正的合作",
      focus: "對方需要確定你可靠、穩定、不會亂來，才會打開。",
      shift: "你不是慢，你是在確認一段關係值不值得投入。",
      work: "適合用耐心觀察、深度傾聽與長線陪伴建立連結。"
    }
  }
};
