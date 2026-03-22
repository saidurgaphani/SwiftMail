// Mail.tm API types
export interface MailTmAccount {
  id: string
  address: string
  password: string
  token: string
}

export interface MailTmDomain {
  id: string
  domain: string
  isActive: boolean
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

export interface MailTmMessage {
  id: string
  accountId: string
  msgid: string
  from: {
    address: string
    name: string
  }
  to: {
    address: string
    name: string
  }[]
  subject: string
  intro: string
  seen: boolean
  isDeleted: boolean
  hasAttachments: boolean
  size: number
  downloadUrl: string
  createdAt: string
  updatedAt: string
}

export interface MailTmMessageFull extends MailTmMessage {
  text: string
  html: string[]
  attachments: MailTmAttachment[]
}

export interface MailTmAttachment {
  id: string
  filename: string
  contentType: string
  disposition: string
  transferEncoding: string
  related: boolean
  size: number
  downloadUrl: string
}

// Firebase user
export interface UserProfile {
  id: string
  email: string
  name: string
  photoURL?: string
  createdAt: Date
  plan: "free" | "pro"
}

export interface SavedEmail {
  id: string
  userId: string
  emailAddress: string
  subject: string
  from: string
  body: string
  receivedAt: Date
}

export interface UserSettings {
  userId: string
  theme: "light" | "dark" | "system"
  notifications: boolean
  autoRefresh: boolean
  refreshInterval: number
}
