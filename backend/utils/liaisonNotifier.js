import LiaisonNotification from "../models/LiaisonNotification.js";

export async function notifyLiaison(payload) {
  try {
    return await LiaisonNotification.create({
      title:    payload.title,
      message:  payload.message,
      category: payload.category || "industry-mou-other",
      type:     payload.type || "info",
      link:     payload.link,
      sourceId: payload.sourceId,
      industry: payload.industry,
    });
  } catch (err) {
    console.warn("notifyLiaison failed:", err.message);
    return null;
  }
}

const STAMP_KEY = (s) => (s ? `${s.by || ""}|${s.type || ""}|${s.date || ""}` : "");

export function diffMouForIndustryActions(prev, next) {
  const events = [];
  if (!prev || !next) return events;

  const title    = next.title || "MOU";
  const industry = next.industry || prev.industry || "Industry";
  const link     = "/mou-management";
  const sourceId = String(next._id || prev._id || "");

  const prevStampKey = STAMP_KEY(prev.industryStamp);
  const nextStampKey = STAMP_KEY(next.industryStamp);
  if (nextStampKey && prevStampKey !== nextStampKey) {
    const isApprove = next.industryStamp?.type === "approve";
    events.push({
      title:   isApprove ? "Industry Approved MOU" : "Industry Rejected MOU",
      message: `${industry} ${isApprove ? "approved" : "rejected"} the MOU "${title}".`,
      category: isApprove ? "industry-mou-approved" : "industry-mou-rejected",
      type:    isApprove ? "success" : "urgent",
      link, sourceId, industry,
    });
  }

  const prevChanges = Array.isArray(prev.proposedChanges) ? prev.proposedChanges.length : 0;
  const nextChanges = Array.isArray(next.proposedChanges) ? next.proposedChanges.length : 0;
  if (nextChanges > prevChanges) {
    const added = nextChanges - prevChanges;
    events.push({
      title:   "Industry Proposed Changes",
      message: `${industry} proposed ${added} change${added === 1 ? "" : "s"} on MOU "${title}".`,
      category: "industry-mou-proposed-changes",
      type:    "warning",
      link, sourceId, industry,
    });
  }

  if (next.industryPdfSentAt && prev.industryPdfSentAt !== next.industryPdfSentAt) {
    events.push({
      title:   "Industry Sent PDF",
      message: `${industry} returned an updated MOU PDF for "${title}".`,
      category: "industry-mou-response",
      type:    "info",
      link, sourceId, industry,
    });
  }

  if (!prev.industryResponseAt && next.industryResponseAt) {
    events.push({
      title:   "Industry Responded",
      message: `${industry} responded on MOU "${title}".`,
      category: "industry-mou-response",
      type:    "info",
      link, sourceId, industry,
    });
  }

  const prevSig = prev.industrySignature;
  const nextSig = next.industrySignature;
  if (nextSig?.signedAt && prevSig?.signedAt !== nextSig.signedAt) {
    events.push({
      title:   "Industry Digitally Signed",
      message: `${industry} digitally signed MOU "${title}".`,
      category: "industry-mou-approved",
      type:    "success",
      link, sourceId, industry,
    });
  }

  if (next.status === "Mutually Approved" && prev.status !== "Mutually Approved") {
    events.push({
      title:   "MOU Mutually Approved",
      message: `MOU "${title}" with ${industry} is now mutually approved.`,
      category: "industry-mou-mutual",
      type:    "success",
      link, sourceId, industry,
    });
  }

  const prevSlot = prev.scheduledMeeting?.industryProposedSlot;
  const nextSlot = next.scheduledMeeting?.industryProposedSlot;
  const slotChanged = JSON.stringify(prevSlot || null) !== JSON.stringify(nextSlot || null);
  if (nextSlot && nextSlot.date && slotChanged) {
    events.push({
      title:   "Industry Proposed Meeting Slot",
      message: `${industry} proposed meeting on ${nextSlot.date}${nextSlot.time ? ` at ${nextSlot.time}` : ""} for "${title}".`,
      category: "industry-mou-meeting",
      type:    "info",
      link, sourceId, industry,
    });
  }

  return events;
}
