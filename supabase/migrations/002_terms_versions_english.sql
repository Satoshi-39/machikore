-- 英語版の利用規約・プライバシーポリシーを挿入

INSERT INTO public.terms_versions (type, version, content, summary, effective_at, locale)
VALUES
  (
    'terms_of_service',
    '1.0.0',
    '# Machikore Terms of Service

These Terms of Service (hereinafter referred to as "Terms") set forth the conditions for using "Machikore" (hereinafter referred to as "Service") provided by Keiji Kawasaki (hereinafter referred to as "Operator").

## Article 1 (Application)
These Terms apply to all relationships between users and the Operator regarding the use of this Service.

## Article 2 (Eligibility)
This Service is available to users aged 13 and over. Users under 13 years of age must obtain parental consent before using this Service.

## Article 3 (Account)
1. Users shall register true and accurate information when using this Service.
2. Users are responsible for properly managing their account information.
3. Transfer, lending, or sharing of accounts is prohibited.

## Article 4 (Prohibited Activities)
Users shall not engage in the following activities:
- Activities that violate laws or public order and morals
- Activities related to criminal acts
- Activities that infringe on the rights of other users or third parties
- Registering or posting false information
- Activities that interfere with the operation of this Service
- Unauthorized access or attempts thereof
- Collecting personal information of other users
- Unauthorized commercial use
- Other activities deemed inappropriate by the Operator

## Article 5 (Content Rights)
1. Copyright of content posted by users (spot information, images, comments, etc.) belongs to the users.
2. Users grant the Operator a non-exclusive right to use posted content for the provision, improvement, and promotion of this Service.
3. The Operator may use user-posted content in this Service and related services (including metaverse business).

## Article 6 (Handling of Location Information)
1. This Service uses location information for registering and displaying spots.
2. Collected location information is properly managed in accordance with our Privacy Policy.

## Article 7 (Service Changes and Suspension)
The Operator may change or suspend the Service without prior notice.

## Article 8 (Disclaimer)
1. The Operator does not guarantee that this Service is free from defects in fact or law.
2. The Operator shall not be liable for damages arising from the use of this Service, except in cases of intentional or gross negligence.
3. The Operator assumes no responsibility for disputes between users.

## Article 9 (Usage Restrictions and Account Deletion)
The Operator may restrict or delete user accounts in the following cases:
- Violation of these Terms
- False registration information
- Other cases deemed inappropriate by the Operator

## Article 10 (Withdrawal)
Users may withdraw from this Service at any time by following the withdrawal procedure in the app settings.

## Article 11 (Changes to Terms)
The Operator may change these Terms as necessary. Changed Terms shall take effect upon notification within this Service.

## Article 12 (Handling of Personal Information)
User personal information is handled appropriately in accordance with our Privacy Policy.

## Article 13 (Expansion to Metaverse Business)
1. The Operator may expand into metaverse business in the future.
2. Spot information and coordinate data registered by users may be used for building and operating metaverse spaces.
3. In such cases, information that can identify individuals will be appropriately protected.

## Article 14 (Notifications)
Notifications from the Operator to users will be made via in-app notifications, push notifications, or email to the registered email address.

## Article 15 (Prohibition of Transfer of Rights and Obligations)
Users may not transfer rights or obligations under these Terms to third parties without prior written consent from the Operator.

## Article 16 (Severability)
Even if part of these Terms is deemed invalid or unenforceable, the remaining provisions shall remain in effect.

## Article 17 (Governing Law and Jurisdiction)
These Terms shall be governed by Japanese law, and disputes concerning this Service shall be subject to the exclusive jurisdiction of the court having jurisdiction over the location of the Operator.

---

Established: January 1, 2025
Last Updated: January 1, 2025
Operator: Keiji Kawasaki',
    'Initial release',
    '2025-01-01 00:00:00+09',
    'en'
  ),
  (
    'privacy_policy',
    '1.0.0',
    '# Machikore Privacy Policy

Keiji Kawasaki (hereinafter referred to as "Operator") establishes this Privacy Policy regarding the handling of personal information in "Machikore" (hereinafter referred to as "Service").

## 1. Information We Collect

This Service collects the following information:

**Account Information**
- Email address
- Username and display name
- Profile picture
- Social login information (Google, Apple accounts)

**Location Information**
- Location information when registering spots
- Current location for map display

**Usage Information**
- App usage history
- Favorites and bookmarks
- Follow and follower information
- Comment and like history

**Device Information**
- Device identifier
- OS version
- App version
- Push notification token

## 2. Purpose of Use

Collected information is used for the following purposes:

- Provision and operation of this Service
- User authentication and account management
- Display and search of spot information
- Sending push notifications
- User support
- Service improvement and new feature development
- Usage analysis and statistics
- Prevention of fraudulent use
- Expansion to metaverse business (future)

## 3. Information Sharing and Third-Party Disclosure

We do not provide personal information to third parties except in the following cases:

- When user consent is obtained
- When required by law
- When necessary to protect life, body, or property
- When providing to contractors necessary for service provision

**External Services Used**
- Supabase (Database and Authentication)
- Google Cloud Platform (Map Services)
- Expo (Push Notifications)
- RevenueCat (Subscription Management)

## 4. About Location Information

**When Collected**
- When registering spots (by user action)
- When displaying maps (if current location display is permitted)

**Purpose of Use**
- Saving and displaying spot location information
- Searching and displaying nearby spots
- Displaying current location on maps

Location information is collected only when explicitly permitted by users. It can be disabled at any time in settings.

## 5. About Images

Images uploaded by users are stored on our servers:
- Profile pictures
- Spot images

These images may be used for display within this Service and for future metaverse business.

## 6. Cookies and Similar Technologies

This Service uses Secure Storage for maintaining authentication information.

## 7. Data Storage and Security

- Data is transmitted and received via encrypted communication (HTTPS)
- Passwords are stored in hashed form
- Authentication information is stored in the device''s Secure Storage
- Regular security audits are conducted

## 8. Expansion to Metaverse Business

The Operator may expand into metaverse business in the future.

**Information Used**
- Spot location information (coordinates)
- Spot names and category information
- Publicly set spot images

**Protected Information**
- Personally identifiable information (email addresses, usernames, etc.) will be used in a non-identifiable form in metaverse business

## 9. User Rights

Users have the following rights:

- **Right of Access**: Right to request disclosure of their personal information
- **Right of Rectification**: Right to request correction of inaccurate information
- **Right of Deletion**: Right to request deletion of personal information (by withdrawal)
- **Right to Withdraw Consent**: Right to withdraw consent to information collection

To exercise these rights, please contact us through the app settings or inquiry form.

## 10. Users Under 13 Years of Age

This Service is intended for users aged 13 and over. Users under 13 must obtain parental consent.

## 11. Changes to Privacy Policy

This Policy may be changed without notice due to changes in laws or service changes. We will notify you within the app of any significant changes.

---

Established: January 1, 2025
Last Updated: January 1, 2025
Operator: Keiji Kawasaki

Contact: Please contact us through the inquiry form in the app.',
    'Initial release',
    '2025-01-01 00:00:00+09',
    'en'
  );
