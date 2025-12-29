-- 利用規約・プライバシーポリシーから運営者の個人名を削除
-- 日本語版・英語版の両方を修正

-- ============================================================
-- 日本語版 利用規約の修正
-- ============================================================
UPDATE terms_versions
SET content = '# 街コレ 利用規約

本利用規約（以下「本規約」）は、「街コレ」（以下「本サービス」）の利用条件を定めるものです。

## 第1条（適用）
本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されます。

## 第2条（利用資格）
本サービスは、13歳以上の方がご利用いただけます。13歳未満の方は、保護者の同意を得た上でご利用ください。

## 第3条（アカウント）
1. ユーザーは、本サービスの利用にあたり、真実かつ正確な情報を登録するものとします。
2. ユーザーは、自己のアカウント情報を適切に管理する責任を負います。
3. アカウントの譲渡、貸与、共有は禁止します。

## 第4条（禁止事項）
ユーザーは、以下の行為を行ってはなりません。
- 法令または公序良俗に違反する行為
- 犯罪行為に関連する行為
- 他のユーザーまたは第三者の権利を侵害する行為
- 虚偽の情報を登録・投稿する行為
- 本サービスの運営を妨害する行為
- 不正アクセスまたはこれを試みる行為
- 他のユーザーの個人情報を収集する行為
- 商業目的での無断利用
- その他、運営者が不適切と判断する行為

## 第5条（コンテンツの権利）
1. ユーザーが投稿したコンテンツ（スポット情報、画像、コメント等）の著作権はユーザーに帰属します。
2. ユーザーは、運営者に対し、投稿コンテンツを本サービスの提供・改善・宣伝のために利用する非独占的な権利を許諾します。
3. 運営者は、ユーザーの投稿コンテンツを、本サービスおよび関連サービス（メタバース事業を含む）において利用できるものとします。

## 第6条（位置情報の取り扱い）
1. 本サービスは、スポットの登録・表示のために位置情報を使用します。
2. 収集した位置情報は、プライバシーポリシーに従って適切に管理します。

## 第7条（サービスの変更・停止）
運営者は、事前の通知なく本サービスの内容を変更、または提供を停止することができます。

## 第8条（免責事項）
1. 運営者は、本サービスに事実上または法律上の瑕疵がないことを保証しません。
2. 運営者は、本サービスの利用により生じた損害について、故意または重過失がある場合を除き、責任を負いません。
3. ユーザー間のトラブルについて、運営者は一切の責任を負いません。

## 第9条（利用制限・登録抹消）
運営者は、以下の場合にユーザーの利用を制限または登録を抹消できます。
- 本規約に違反した場合
- 登録情報に虚偽があった場合
- その他、運営者が不適切と判断した場合

## 第10条（退会）
ユーザーは、アプリ内の設定から退会手続きを行うことで、いつでも本サービスから退会できます。

## 第11条（規約の変更）
運営者は、必要に応じて本規約を変更できます。変更後の規約は、本サービス内での通知をもって効力を生じます。

## 第12条（個人情報の取り扱い）
ユーザーの個人情報は、プライバシーポリシーに従って適切に取り扱います。

## 第13条（メタバース事業への展開）
1. 運営者は、将来的にメタバース事業を展開する可能性があります。
2. ユーザーが登録したスポット情報・座標情報は、メタバース空間の構築・運営に活用される場合があります。
3. この場合、ユーザーの個人を特定できる情報は適切に保護されます。

## 第14条（通知）
運営者からユーザーへの通知は、アプリ内通知、プッシュ通知、または登録されたメールアドレスへの送信により行います。

## 第15条（権利義務の譲渡禁止）
ユーザーは、運営者の書面による事前の承諾なく、本規約に基づく権利または義務を第三者に譲渡できません。

## 第16条（分離可能性）
本規約の一部が無効または執行不能と判断された場合でも、その他の規定は有効に存続します。

## 第17条（準拠法・管轄裁判所）
本規約は日本法に準拠し、本サービスに関する紛争は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。

---

制定日: 2025年1月1日
最終更新日: 2025年1月1日'
WHERE type = 'terms_of_service' AND version = '1.0.0' AND locale = 'ja';

-- ============================================================
-- 日本語版 プライバシーポリシーの修正
-- ============================================================
UPDATE terms_versions
SET content = '# 街コレ プライバシーポリシー

本プライバシーポリシーは、「街コレ」（以下「本サービス」）における個人情報の取り扱いについて定めるものです。

## 1. 収集する情報

本サービスでは、以下の情報を収集します。

**アカウント情報**
- メールアドレス
- ユーザー名・表示名
- プロフィール画像
- SNS連携情報（Google、Appleアカウント）

**位置情報**
- スポット登録時の位置情報
- 地図表示のための現在地情報

**利用情報**
- アプリの利用履歴
- お気に入り・ブックマーク情報
- フォロー・フォロワー情報
- コメント・いいね履歴

**デバイス情報**
- デバイス識別子
- OSバージョン
- アプリバージョン
- プッシュ通知トークン

## 2. 情報の利用目的

収集した情報は、以下の目的で利用します。

- 本サービスの提供・運営
- ユーザー認証・アカウント管理
- スポット情報の表示・検索
- プッシュ通知の送信
- ユーザーサポート
- サービスの改善・新機能開発
- 利用状況の分析・統計
- 不正利用の防止
- メタバース事業への展開（将来）

## 3. 情報の共有・第三者提供

以下の場合を除き、個人情報を第三者に提供しません。

- ユーザーの同意がある場合
- 法令に基づく場合
- 人の生命・身体・財産の保護に必要な場合
- サービス提供に必要な業務委託先への提供

**利用している外部サービス**
- Supabase（データベース・認証）
- Google Cloud Platform（地図サービス）
- Expo（プッシュ通知）
- RevenueCat（サブスクリプション管理）

## 4. 位置情報について

**収集のタイミング**
- スポット登録時（ユーザーの操作による）
- 地図表示時（現在地表示を許可した場合）

**利用目的**
- スポットの位置情報として保存・表示
- 周辺スポットの検索・表示
- 地図上での現在地表示

位置情報の収集は、ユーザーが明示的に許可した場合のみ行います。設定からいつでも無効にできます。

## 5. 画像について

ユーザーがアップロードした画像は、本サービスのサーバーに保存されます。
- プロフィール画像
- スポット画像

これらの画像は、本サービス内での表示および将来のメタバース事業に利用される可能性があります。

## 6. Cookie・類似技術

本サービスでは、認証情報の保持にSecure Storageを使用しています。

## 7. データの保存・セキュリティ

- データは暗号化された通信（HTTPS）で送受信されます
- パスワードはハッシュ化して保存されます
- 認証情報はデバイスのSecure Storageに保存されます
- 定期的なセキュリティ監査を実施します

## 8. メタバース事業への展開

運営者は、将来的にメタバース事業を展開する可能性があります。

**利用される情報**
- スポットの位置情報（座標）
- スポット名・カテゴリ情報
- 公開設定されたスポット画像

**保護される情報**
- 個人を特定できる情報（メールアドレス、ユーザー名等）は、メタバース事業において個人を特定できない形で利用されます

## 9. ユーザーの権利

ユーザーは以下の権利を有します。

- **アクセス権**: 自己の個人情報の開示を求める権利
- **訂正権**: 不正確な情報の訂正を求める権利
- **削除権**: 個人情報の削除を求める権利（退会による）
- **同意撤回権**: 情報収集への同意を撤回する権利

これらの権利行使については、アプリ内の設定または問い合わせフォームよりご連絡ください。

## 10. 13歳未満のユーザーについて

本サービスは13歳以上を対象としています。13歳未満の方が利用される場合は、保護者の同意が必要です。

## 11. プライバシーポリシーの変更

本ポリシーは、法令の変更やサービスの変更に伴い、予告なく変更される場合があります。重要な変更がある場合は、アプリ内で通知します。

---

制定日: 2025年1月1日
最終更新日: 2025年1月1日

お問い合わせ: アプリ内のお問い合わせフォームよりご連絡ください。'
WHERE type = 'privacy_policy' AND version = '1.0.0' AND locale = 'ja';

-- ============================================================
-- 英語版 利用規約の修正
-- ============================================================
UPDATE terms_versions
SET content = '# Machikore Terms of Service

These Terms of Service (hereinafter referred to as "Terms") set forth the conditions for using "Machikore" (hereinafter referred to as "Service").

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
These Terms shall be governed by Japanese law, and disputes concerning this Service shall be subject to the exclusive jurisdiction of the Tokyo District Court as the court of first instance.

---

Established: January 1, 2025
Last Updated: January 1, 2025'
WHERE type = 'terms_of_service' AND version = '1.0.0' AND locale = 'en';

-- ============================================================
-- 英語版 プライバシーポリシーの修正
-- ============================================================
UPDATE terms_versions
SET content = '# Machikore Privacy Policy

This Privacy Policy sets forth the handling of personal information in "Machikore" (hereinafter referred to as "Service").

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

Contact: Please contact us through the inquiry form in the app.'
WHERE type = 'privacy_policy' AND version = '1.0.0' AND locale = 'en';
