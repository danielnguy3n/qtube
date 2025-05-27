export default function Privacy() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Privacy policy</h1>
            <p className="text-muted-foreground mb-4">
                QTube (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our
                application.
            </p>

            <ol className="flex flex-col gap-6">
                <li>
                    <strong>Information We Collect</strong>
                    <ul className="text-muted-foreground">
                        <li>
                            <strong>Google Account Information:</strong> Name, email address, and profile picture collected upon Google sign-in.
                        </li>
                        <li>
                            <strong>OAuth 2.0 Access Token:</strong> Used to authorize YouTube API requests.
                        </li>
                        <li>
                            <strong>Search Queries:</strong> Temporarily stored to fetch YouTube results.
                        </li>
                    </ul>
                </li>

                <li>
                    <strong>How We Use Your Information</strong>
                    <ul className="text-muted-foreground">
                        <li>To authenticate your identity via Google OAuth.</li>
                        <li>To perform YouTube API requests on your behalf.</li>
                        <li>To enhance and improve the app experience.</li>
                    </ul>
                </li>

                <li>
                    <strong>How We Protect Your Data</strong>
                    <ul className="text-muted-foreground">
                        <li>Access tokens and personal data are not stored unless necessary and secured.</li>
                        <li>Temporary data is encrypted using industry standards.</li>
                    </ul>
                </li>

                <li>
                    <strong>Sharing Your Data</strong>
                    <p className="text-muted-foreground">
                        We do <strong>not</strong> share, sell, or rent your personal information to third parties.
                    </p>
                    <p className="text-muted-foreground">We may use third-party services (like Google APIs) solely to perform app functions.</p>
                </li>

                <li>
                    <strong>YouTube API Services Disclosure</strong>
                    <p className="text-muted-foreground">This app uses YouTube API Services. By using our app, you agree to be bound by the following:</p>
                    <ul className="text-muted-foreground">
                        <li>
                            <a
                                href="https://www.youtube.com/t/terms"
                                target="_blank"
                                className="underline underline-offset-1"
                            >
                                YouTube Terms of Service
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                className="underline underline-offset-1"
                            >
                                Google Privacy Policy
                            </a>
                        </li>
                    </ul>
                    <p className="text-muted-foreground">
                        You may revoke access via your{" "}
                        <a
                            href="https://security.google.com/settings/security/permissions"
                            target="_blank"
                            className="underline underline-offset-1"
                        >
                            Google account security settings
                        </a>
                        .
                    </p>
                </li>

                <li>
                    <strong>Changes to This Policy</strong>
                    <p className="text-muted-foreground">We may update this policy and notify users via in-app messaging or email.</p>
                </li>

                <li>
                    <strong>Contact Us</strong>
                    <p className="text-muted-foreground">
                        If you have questions, contact us at:{" "}
                        <a
                            href="mailto:danielnguy3n12@gmail.com"
                            className="underline underline-offset-1"
                        >
                            danielnguy3n12@gmail.com
                        </a>
                    </p>
                </li>
            </ol>
        </div>
    )
}
