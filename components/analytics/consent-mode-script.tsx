const consentDefault = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`;

export function ConsentModeScript() {
  return (
    <script
      id="google-consent-mode"
      dangerouslySetInnerHTML={{ __html: consentDefault }}
    />
  );
}
