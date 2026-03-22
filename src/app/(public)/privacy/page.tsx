import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">Last updated: March 2026</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
          <p>SwiftMail is designed to protect your privacy. When using our temporary email service without an account, we collect no personal information whatsoever. If you create an account, we collect only your email address and display name.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">2. How We Use Information</h2>
          <p>Account information is used solely for authentication and providing our service. We do not sell, share, or monetize your data in any way.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">3. Temporary Emails</h2>
          <p>Temporary email addresses and their messages are ephemeral. They are automatically deleted and are not stored permanently on our servers.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">4. Cookies</h2>
          <p>We use essential cookies only for authentication and theme preferences. No tracking or advertising cookies are used.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your information. All data transmission is encrypted using TLS.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">6. Contact</h2>
          <p>For privacy-related questions, contact us at privacy@swiftmail.dev.</p>
        </div>
      </div>
    </div>
  )
}
