"use client"

import { db } from "@/lib/firebase"
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import type { UserProfile, SavedEmail, UserSettings } from "@/types"

// ─── User Profile ───
export async function createUserProfile(uid: string, data: Omit<UserProfile, "id" | "createdAt">) {
  await setDoc(doc(db, "users", uid), {
    id: uid,
    email: data.email,
    name: data.name,
    photoURL: data.photoURL || null,
    plan: data.plan || "free",
    createdAt: serverTimestamp(),
  })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid))
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}

export async function updateUserProfile(uid: string, data: Partial<Pick<UserProfile, "name" | "photoURL" | "plan">>) {
  await updateDoc(doc(db, "users", uid), data)
}

export async function deleteUserProfile(uid: string) {
  await deleteDoc(doc(db, "users", uid))
}

// ─── Saved Emails ───
export async function saveEmail(uid: string, email: Omit<SavedEmail, "id" | "userId">) {
  const ref = doc(collection(db, "savedEmails"))
  await setDoc(ref, {
    userId: uid,
    emailAddress: email.emailAddress,
    subject: email.subject,
    from: email.from,
    body: email.body,
    receivedAt: email.receivedAt instanceof Date ? Timestamp.fromDate(email.receivedAt) : email.receivedAt,
  })
  return ref.id
}

export async function getSavedEmails(uid: string, maxResults = 50): Promise<SavedEmail[]> {
  const q = query(
    collection(db, "savedEmails"),
    where("userId", "==", uid),
    orderBy("receivedAt", "desc"),
    limit(maxResults)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedEmail))
}

export async function deleteSavedEmail(emailId: string) {
  await deleteDoc(doc(db, "savedEmails", emailId))
}

export async function clearAllSavedEmails(uid: string) {
  const q = query(collection(db, "savedEmails"), where("userId", "==", uid))
  const snap = await getDocs(q)
  const deletePromises = snap.docs.map((d) => deleteDoc(d.ref))
  await Promise.all(deletePromises)
}

// ─── User Settings ───
export async function createUserSettings(uid: string, settings?: Partial<UserSettings>) {
  await setDoc(doc(db, "userSettings", uid), {
    userId: uid,
    theme: settings?.theme || "system",
    notifications: settings?.notifications ?? true,
    autoRefresh: settings?.autoRefresh ?? true,
    refreshInterval: settings?.refreshInterval || 5000,
  })
}

export async function getUserSettings(uid: string): Promise<UserSettings | null> {
  const snap = await getDoc(doc(db, "userSettings", uid))
  if (!snap.exists()) return null
  return snap.data() as UserSettings
}

export async function updateUserSettings(uid: string, data: Partial<Omit<UserSettings, "userId">>) {
  await updateDoc(doc(db, "userSettings", uid), data)
}
