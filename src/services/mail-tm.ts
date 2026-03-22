import type { MailTmAccount, MailTmDomain, MailTmMessage, MailTmMessageFull } from "@/types"

const BASE_URL = "https://api.mail.tm"

class MailTmService {
  private token: string | null = null

  async getDomains(): Promise<MailTmDomain[]> {
    const res = await fetch(`${BASE_URL}/domains`)
    const data = await res.json()
    return data["hydra:member"] || data
  }

  async createAccount(address: string, password: string): Promise<MailTmAccount> {
    const res = await fetch(`${BASE_URL}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password }),
    })
    if (!res.ok) throw new Error("Failed to create account")
    const account = await res.json()

    // Login to get token
    const tokenRes = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password }),
    })
    if (!tokenRes.ok) throw new Error("Failed to get token")
    const tokenData = await tokenRes.json()
    this.token = tokenData.token

    return { ...account, password, token: tokenData.token }
  }

  async login(address: string, password: string): Promise<string> {
    const res = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, password }),
    })
    if (!res.ok) throw new Error("Failed to login")
    const data = await res.json()
    this.token = data.token
    return data.token
  }

  async getMessages(token?: string): Promise<MailTmMessage[]> {
    const authToken = token || this.token
    if (!authToken) throw new Error("Not authenticated")
    const res = await fetch(`${BASE_URL}/messages`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (!res.ok) throw new Error("Failed to get messages")
    const data = await res.json()
    return data["hydra:member"] || data
  }

  async getMessage(id: string, token?: string): Promise<MailTmMessageFull> {
    const authToken = token || this.token
    if (!authToken) throw new Error("Not authenticated")
    const res = await fetch(`${BASE_URL}/messages/${id}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (!res.ok) throw new Error("Failed to get message")
    return res.json()
  }

  async deleteMessage(id: string, token?: string): Promise<void> {
    const authToken = token || this.token
    if (!authToken) throw new Error("Not authenticated")
    await fetch(`${BASE_URL}/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    })
  }

  async deleteAccount(id: string, token?: string): Promise<void> {
    const authToken = token || this.token
    if (!authToken) throw new Error("Not authenticated")
    await fetch(`${BASE_URL}/accounts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    })
  }

  setToken(token: string) {
    this.token = token
  }

  getToken(): string | null {
    return this.token
  }
}

export const mailTmService = new MailTmService()
export default mailTmService
