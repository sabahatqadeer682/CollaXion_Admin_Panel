// hooks/useStudentApplications.ts
// React Native — Student Side
// Fetches applications + notifications, listens via WebSocket for live updates.

import { useState, useEffect, useCallback, useRef } from "react";
import socket from "../utils/Socket"; // your existing singleton

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface StudentApplication {
  _id: string;
  studentEmail: string;
  studentName: string;
  studentId: string;
  program: string;
  semester?: string;
  cgpa?: string;
  postId: string;
  postTitle: string;
  postType?: string;
  industry?: string;
  domain?: string;
  coverLetter?: string;
  cvUrl?: string;
  inchargeStatus: "Pending" | "Approved" | "Rejected";
  inchargeNote?: string;
  inchargeApprovedOn?: string;
  liaisonStatus: "Pending" | "Forwarded" | "Rejected";
  liaisonNote?: string;
  liaisonActedOn?: string;
  industryStatus?: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
  updatedAt: string;
}

export interface StudentNotification {
  _id: string;
  studentEmail: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedApplicationId?: string;
  relatedPostId?: string;
  createdAt: string;
}

// ─── Submit Application ───────────────────────────────────────────────────────
export const submitApplication = async (payload: {
  studentEmail: string;
  studentName: string;
  studentId: string;
  program: string;
  semester?: string;
  cgpa?: string;
  postId: string;
  postTitle: string;
  postType?: string;
  industry?: string;
  domain?: string;
  coverLetter?: string;
  cvUrl?: string;
}) => {
  const res = await fetch(`${API_BASE}/api/student-applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Submission failed.");
  return data;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useStudentApplications = (studentEmail: string | null) => {
  const [applications,   setApplications]   = useState<StudentApplication[]>([]);
  const [notifications,  setNotifications]  = useState<StudentNotification[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [unreadCount,    setUnreadCount]    = useState(0);

  // ── Fetch all apps for this student ────────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    if (!studentEmail) return;
    try {
      const res  = await fetch(`${API_BASE}/api/student-applications/my?email=${encodeURIComponent(studentEmail)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setApplications(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, [studentEmail]);

  // ── Fetch notifications ────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!studentEmail) return;
    try {
      const res  = await fetch(`${API_BASE}/api/student-notifications?email=${encodeURIComponent(studentEmail)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNotifications(data);
      setUnreadCount(data.filter((n: StudentNotification) => !n.isRead).length);
    } catch (err: any) {
      console.error("fetchNotifications:", err.message);
    }
  }, [studentEmail]);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!studentEmail) return;
    setLoading(true);
    Promise.all([fetchApplications(), fetchNotifications()]).finally(() => setLoading(false));
  }, [studentEmail, fetchApplications, fetchNotifications]);

  // ── WebSocket listeners ───────────────────────────────────────────────────
  useEffect(() => {
    if (!studentEmail) return;

    // New notification pushed by server
    const onNewNotification = (notif: StudentNotification) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    // Application status changed (liaison forwarded/rejected)
    const onApplicationUpdated = (update: { applicationId: string; liaisonStatus?: string; inchargeStatus?: string }) => {
      setApplications(prev =>
        prev.map(app =>
          app._id === update.applicationId
            ? {
                ...app,
                ...(update.liaisonStatus  ? { liaisonStatus:  update.liaisonStatus  as any } : {}),
                ...(update.inchargeStatus ? { inchargeStatus: update.inchargeStatus as any } : {}),
              }
            : app
        )
      );
    };

    socket.on("new_notification",    onNewNotification);
    socket.on("application_updated", onApplicationUpdated);

    return () => {
      socket.off("new_notification",    onNewNotification);
      socket.off("application_updated", onApplicationUpdated);
    };
  }, [studentEmail]);

  // ── Mark a notification as read ───────────────────────────────────────────
  const markNotificationRead = useCallback(async (notifId: string) => {
    try {
      await fetch(`${API_BASE}/api/student-notifications/${notifId}/read`, { method: "PATCH" });
      setNotifications(prev =>
        prev.map(n => n._id === notifId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("markNotificationRead:", err);
    }
  }, []);

  // ── Mark all as read ──────────────────────────────────────────────────────
  const markAllRead = useCallback(async () => {
    if (!studentEmail) return;
    try {
      await fetch(`${API_BASE}/api/student-notifications/read-all`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentEmail }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("markAllRead:", err);
    }
  }, [studentEmail]);

  return {
    applications,
    notifications,
    loading,
    error,
    unreadCount,
    refresh: () => Promise.all([fetchApplications(), fetchNotifications()]),
    markNotificationRead,
    markAllRead,
  };
};