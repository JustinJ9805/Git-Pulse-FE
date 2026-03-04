// Normalizes multiple backend response variants into one UI-friendly shape.

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function pickValue(obj, paths, fallback) {
  for (const path of paths) {
    const value = getByPath(obj, path);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

function toSafeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toOptionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toFires(value) {
  if (Array.isArray(value)) return value.filter(Boolean).slice(0, 3);
  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 3);
  }
  return [];
}

export function normalizePayload(payload, repoInput) {
  const repository = pickValue(payload, ["repository", "repo"], repoInput);
  const analyzedAt = pickValue(payload, ["analyzedAt"], null);
  const repositoryStats = pickValue(payload, ["repositoryStats", "repoStats", "stats"], {});
  const healthSignals = pickValue(payload, ["healthSignals"], {});
  const securityCompliance = pickValue(payload, ["securityCompliance"], {});
  const inputStats = pickValue(payload, ["inputStats"], {});
  const analysis = pickValue(payload, ["analysis"], {});
  const confidence = toOptionalNumber(pickValue(analysis, ["confidence"], null));
  const normalizedConfidence = confidence !== null && confidence <= 1 ? Math.round(confidence * 100) : confidence;
  const productionDecision = pickValue(analysis, ["productionDecision"], {});
  const clarityNote = pickValue(
    analysis,
    ["clarity.note", "complexityClarity.note", "documentation.note", "technicalClarity", "summary.clarity"],
    "No clarity summary returned by backend."
  );
  const inferredVerdict =
    typeof clarityNote === "string" && /excellent|clear|well[-\s]?documented/i.test(clarityNote)
      ? "well-documented"
      : "needs-review";

  return {
    apiVersion: pickValue(payload, ["apiVersion"], "N/A"),
    modelVersion: pickValue(payload, ["modelVersion"], "N/A"),
    rulesVersion: pickValue(payload, ["rulesVersion"], "N/A"),
    repository,
    analyzedAt,
    inputStats,
    stars: toOptionalNumber(
      pickValue(payload, ["repositoryStats.stars", "repoStats.stars", "stats.stars"], pickValue(repositoryStats, ["stars"], null)) ??
        pickValue(analysis, ["stars", "repoStats.stars", "stats.stars"], null)
    ),
    forks: toOptionalNumber(
      pickValue(payload, ["repositoryStats.forks", "repoStats.forks", "stats.forks"], pickValue(repositoryStats, ["forks"], null)) ??
        pickValue(analysis, ["forks", "repoStats.forks", "stats.forks"], null)
    ),
    openIssues: toOptionalNumber(
      pickValue(
        payload,
        ["repositoryStats.openIssues", "repositoryStats.open_issues", "repoStats.openIssues", "stats.openIssues"],
        pickValue(repositoryStats, ["openIssues", "open_issues"], null)
      ) ?? pickValue(analysis, ["openIssues", "open_issues", "repoStats.openIssues", "stats.openIssues"], null)
    ),
    vibe: {
      score: toSafeNumber(
        pickValue(analysis, ["vibe.score", "vibeMeter.score", "sentiment.score", "sentimentScore"], normalizedConfidence ?? 50),
        50
      ),
      note: pickValue(
        analysis,
        ["vibe.note", "vibe.summary", "sentiment.note", "sentiment.summary", "communityVibe", "summary.vibe"],
        "No sentiment summary returned by backend."
      ),
    },
    clarity: {
      score: toSafeNumber(
        pickValue(analysis, ["clarity.score", "complexityClarity.score", "documentation.score"], normalizedConfidence ?? 50),
        50
      ),
      verdict: String(
        pickValue(
          analysis,
          ["clarity.verdict", "complexityClarity.verdict", "documentation.verdict"],
          inferredVerdict
        )
      ),
      note: clarityNote,
    },
    fires: toFires(
      pickValue(analysis, ["fires", "currentFires", "current_fires", "risks", "topRisks", "topThreeConcerns"], [])
    ),
    healthSignals: {
      daysSinceLastRelease: toOptionalNumber(pickValue(healthSignals, ["daysSinceLastRelease"], null)),
      commitsLast30Days: toOptionalNumber(pickValue(healthSignals, ["commitsLast30Days"], null)),
      busFactorEstimate: toOptionalNumber(pickValue(healthSignals, ["busFactorEstimate"], null)),
      medianIssueFirstResponseHours: toOptionalNumber(pickValue(healthSignals, ["medianIssueFirstResponseHours"], null)),
      medianIssueCloseDays: toOptionalNumber(pickValue(healthSignals, ["medianIssueCloseDays"], null)),
      staleIssueCount: toOptionalNumber(pickValue(healthSignals, ["staleIssueCount"], null)),
      openCriticalBugCount: toOptionalNumber(pickValue(healthSignals, ["openCriticalBugCount"], null)),
    },
    securityCompliance: {
      licenseSpdx: pickValue(securityCompliance, ["licenseSpdx"], "N/A"),
      branchProtectionEnabled: pickValue(securityCompliance, ["branchProtectionEnabled"], null),
      requiredStatusChecksEnabled: pickValue(securityCompliance, ["requiredStatusChecksEnabled"], null),
      dependabotOpenAlerts: toOptionalNumber(pickValue(securityCompliance, ["dependabotOpenAlerts"], null)),
      codeScanningOpenAlerts: toOptionalNumber(pickValue(securityCompliance, ["codeScanningOpenAlerts"], null)),
      secretScanningOpenAlerts: toOptionalNumber(pickValue(securityCompliance, ["secretScanningOpenAlerts"], null)),
    },
    productionDecision: {
      decision: String(pickValue(productionDecision, ["decision"], "unknown")),
      riskLevel: String(pickValue(productionDecision, ["riskLevel"], "unknown")),
      blockers: Array.isArray(productionDecision?.blockers) ? productionDecision.blockers : [],
      reasons: Array.isArray(productionDecision?.reasons) ? productionDecision.reasons : [],
      minConfidenceRequired: toOptionalNumber(pickValue(productionDecision, ["minConfidenceRequired"], null)),
      confidence,
    },
  };
}

export function safeNumber(value, fallback = 0) {
  return toSafeNumber(value, fallback);
}
