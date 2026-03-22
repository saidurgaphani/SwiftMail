import { Badge } from "@/components/ui/badge"

export default function TermsPage() {
  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p className="text-lg">Last updated: March 2026</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
          <p>By using SwiftMail, you agree to these terms. If you do not agree, please do not use our service.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">2. Service Description</h2>
          <p>SwiftMail provides temporary, disposable email addresses for privacy protection. Emails are ephemeral and may be deleted at any time.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">3. Acceptable Use</h2>
          <p>You agree not to use SwiftMail for illegal activities, spam, harassment, or any activity that violates applicable laws.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">4. No Warranty</h2>
          <p>SwiftMail is provided &ldquo;as is&rdquo; without warranties. We do not guarantee continuous availability or message delivery.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">5. Limitation of Liability</h2>
          <p>SwiftMail is not liable for any damages resulting from the use or inability to use our service.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">6. Changes</h2>
          <p>We may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
        </div>
      </div>
    </div>
  )
}
