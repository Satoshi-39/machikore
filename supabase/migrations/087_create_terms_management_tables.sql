-- 利用規約・プライバシーポリシーの管理テーブル
-- 法的な証跡として、規約のバージョン履歴と同意履歴を完全に記録

-- ===============================
-- 1. terms_versions テーブル（規約バージョン管理）
-- ===============================
-- 利用規約とプライバシーポリシーの全バージョンを保持
CREATE TABLE IF NOT EXISTS public.terms_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('terms_of_service', 'privacy_policy')),
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT, -- 変更概要（ユーザーへの通知用）
  effective_at TIMESTAMPTZ NOT NULL, -- 施行日
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id), -- 作成者（管理者）

  -- 同じタイプ・バージョンの重複を防ぐ
  UNIQUE (type, version)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_terms_versions_type ON public.terms_versions (type);
CREATE INDEX IF NOT EXISTS idx_terms_versions_effective_at ON public.terms_versions (effective_at DESC);
CREATE INDEX IF NOT EXISTS idx_terms_versions_type_effective ON public.terms_versions (type, effective_at DESC);

-- コメント
COMMENT ON TABLE public.terms_versions IS '利用規約・プライバシーポリシーのバージョン管理';
COMMENT ON COLUMN public.terms_versions.type IS '文書タイプ: terms_of_service（利用規約）, privacy_policy（プライバシーポリシー）';
COMMENT ON COLUMN public.terms_versions.version IS 'バージョン番号（例: 1.0.0）';
COMMENT ON COLUMN public.terms_versions.content IS '規約本文（マークダウン形式）';
COMMENT ON COLUMN public.terms_versions.summary IS '変更概要（更新時のユーザー通知用）';
COMMENT ON COLUMN public.terms_versions.effective_at IS '施行日時';

-- ===============================
-- 2. terms_agreements テーブル（同意履歴）
-- ===============================
-- ユーザーの同意履歴を全て記録（上書きしない）
CREATE TABLE IF NOT EXISTS public.terms_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  terms_version_id UUID NOT NULL REFERENCES public.terms_versions(id),
  privacy_version_id UUID NOT NULL REFERENCES public.terms_versions(id),
  agreed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET, -- 同意時のIPアドレス（法的証跡）
  user_agent TEXT, -- 同意時のユーザーエージェント（法的証跡）

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_terms_agreements_user_id ON public.terms_agreements (user_id);
CREATE INDEX IF NOT EXISTS idx_terms_agreements_agreed_at ON public.terms_agreements (agreed_at DESC);
CREATE INDEX IF NOT EXISTS idx_terms_agreements_user_agreed ON public.terms_agreements (user_id, agreed_at DESC);

-- コメント
COMMENT ON TABLE public.terms_agreements IS 'ユーザーの利用規約・プライバシーポリシー同意履歴';
COMMENT ON COLUMN public.terms_agreements.user_id IS '同意したユーザーID';
COMMENT ON COLUMN public.terms_agreements.terms_version_id IS '同意した利用規約のバージョンID';
COMMENT ON COLUMN public.terms_agreements.privacy_version_id IS '同意したプライバシーポリシーのバージョンID';
COMMENT ON COLUMN public.terms_agreements.agreed_at IS '同意日時';
COMMENT ON COLUMN public.terms_agreements.ip_address IS '同意時のIPアドレス（法的証跡）';
COMMENT ON COLUMN public.terms_agreements.user_agent IS '同意時のユーザーエージェント（法的証跡）';

-- ===============================
-- 3. RLS（Row Level Security）ポリシー
-- ===============================

-- terms_versions: 全員が読み取り可能、書き込みは管理者のみ
ALTER TABLE public.terms_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "terms_versions_select_policy" ON public.terms_versions
  FOR SELECT USING (true);

-- 管理者のみ挿入・更新可能（将来的に管理画面から操作する場合）
-- 現時点ではマイグレーションで直接挿入するため、サービスロールを使用

-- terms_agreements: 自分の同意履歴のみ読み取り可能、挿入は認証ユーザーのみ
ALTER TABLE public.terms_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "terms_agreements_select_own_policy" ON public.terms_agreements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "terms_agreements_insert_own_policy" ON public.terms_agreements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ===============================
-- 4. 便利な関数・ビュー
-- ===============================

-- 最新の有効な規約バージョンを取得するビュー
CREATE OR REPLACE VIEW public.current_terms_versions AS
SELECT DISTINCT ON (type)
  id,
  type,
  version,
  content,
  summary,
  effective_at,
  created_at
FROM public.terms_versions
WHERE effective_at <= NOW()
ORDER BY type, effective_at DESC;

COMMENT ON VIEW public.current_terms_versions IS '現在有効な利用規約・プライバシーポリシーの最新バージョン';

-- ユーザーの最新の同意情報を取得するビュー
CREATE OR REPLACE VIEW public.user_latest_agreements AS
SELECT DISTINCT ON (user_id)
  ta.id,
  ta.user_id,
  ta.terms_version_id,
  ta.privacy_version_id,
  ta.agreed_at,
  tv_terms.version AS terms_version,
  tv_privacy.version AS privacy_version
FROM public.terms_agreements ta
JOIN public.terms_versions tv_terms ON ta.terms_version_id = tv_terms.id
JOIN public.terms_versions tv_privacy ON ta.privacy_version_id = tv_privacy.id
ORDER BY user_id, agreed_at DESC;

COMMENT ON VIEW public.user_latest_agreements IS 'ユーザーの最新の同意情報';

-- ===============================
-- 5. 初期データ挿入（v1.0.0）
-- ===============================
-- 注意: このマイグレーション実行時に初期バージョンを挿入
-- content は後でアプリから取得した内容に置き換えてください

INSERT INTO public.terms_versions (type, version, content, summary, effective_at)
VALUES
  (
    'terms_of_service',
    '1.0.0',
    '# 街コレ 利用規約

本利用規約（以下「本規約」）は、河﨑圭司（以下「運営者」）が提供する「街コレ」（以下「本サービス」）の利用条件を定めるものです。

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
本規約は日本法に準拠し、本サービスに関する紛争は、運営者の所在地を管轄する裁判所を専属的合意管轄とします。

---

制定日: 2025年1月1日
最終更新日: 2025年1月1日
運営者: 河﨑圭司',
    '初版リリース',
    '2025-01-01 00:00:00+09'
  ),
  (
    'privacy_policy',
    '1.0.0',
    '# 街コレ プライバシーポリシー

河﨑圭司（以下「運営者」）は、「街コレ」（以下「本サービス」）における個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。

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
運営者: 河﨑圭司

お問い合わせ: アプリ内のお問い合わせフォームよりご連絡ください。',
    '初版リリース',
    '2025-01-01 00:00:00+09'
  );
