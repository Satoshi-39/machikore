import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "プライバシーポリシー - 街コレ",
  description:
    "街コレのプライバシーポリシーです。利用者情報の取扱いについて定めています。",
};

function InfoTable({
  rows,
}: {
  rows: { label: string; value: string | React.ReactNode }[];
}) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border border-gray-300">
              <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-medium text-gray-700 w-2/5">
                {row.label}
              </th>
              <td className="border border-gray-300 px-4 py-2 text-gray-700">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/images/machikore7.png"
              alt="街コレ"
              width={64}
              height={64}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl"
            />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            プライバシーポリシー
          </h1>
        </div>

        {/* 本文 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            街コレ（以下「当社」といいます。）は、当社の提供するサービス（以下「本サービス」といいます。）における、ユーザーについての個人情報を含む利用者情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
          </p>
          <p className="text-gray-700 leading-relaxed mb-8">
            本サービスは、日本を含む特定の地域のユーザーを対象として提供されており、法令上の要請等により、一部の地域では提供されない場合があります。
          </p>

          {/* 1. 収集する利用者情報及び収集方法 */}
          <section className="mb-8">
            <h2 className="font-bold text-lg mb-4">
              1. 収集する利用者情報及び収集方法
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              本ポリシーにおいて、「利用者情報」とは、ユーザーの識別に係る情報、通信サービス上の行動履歴、その他ユーザーまたはユーザーの端末に関連して生成または蓄積された情報であって、本ポリシーに基づき当社が収集するものを意味するものとします。本サービスにおいて当社が収集する利用者情報は、その収集方法に応じて、以下のようなものとなります。
            </p>

            <div className="pl-4 space-y-4 text-gray-700 leading-relaxed">
              <div>
                <p className="font-medium mb-2">
                  （1）外部サービス認証により自動取得する情報
                </p>
                <p className="pl-4 mb-2">
                  本サービスでは、Google または Apple
                  アカウントによるプロバイダ認証を利用しており、認証時に以下の情報を自動的に取得します。
                </p>
                <ul className="pl-8 list-disc space-y-1">
                  <li>メールアドレス</li>
                  <li>氏名</li>
                  <li>プロフィール画像URL（Googleアカウントの場合のみ）</li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">
                  （2）ユーザーからご提供いただく情報
                </p>
                <p className="pl-4 mb-2">
                  本サービスを利用するために、または本サービスの利用を通じてユーザーからご提供いただく情報は以下のとおりです。
                </p>
                <ul className="pl-8 list-disc space-y-1">
                  <li>
                    ユーザー名、表示名、年齢層、性別、年齢層、興味・関心等プロフィールに関する情報
                  </li>
                  <li>自己紹介文</li>
                  <li>コメント等のアクション情報</li>
                  <li>静止画情報、動画情報</li>
                  <li>
                    入力フォームその他当社が定める方法を通じてユーザーが入力または送信する情報
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">
                  （3）ユーザーが本サービスの利用において、他のサービスと連携を許可することにより、当該他のサービスからご提供いただく情報
                </p>
                <p className="pl-4 mb-2">
                  ユーザーが、本サービスを利用するにあたり、ソーシャルネットワーキングサービス等の他のサービスとの連携を許可した場合には、その許可の際にご同意いただいた内容に基づき、以下の情報を当該外部サービスから収集します。
                </p>
                <ul className="pl-8 list-disc space-y-1">
                  <li>当該外部サービスでユーザーが利用するID</li>
                  <li>
                    その他当該外部サービスのプライバシー設定によりユーザーが連携先に開示を認めた情報
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">
                  （4）ユーザーが本サービスを利用するにあたって、当社が収集する情報
                </p>
                <p className="pl-4 mb-2">
                  当社は、本サービスへのアクセス状況やそのご利用方法に関する情報を収集することがあります。これには以下の情報が含まれます。
                </p>
                <ul className="pl-8 list-disc space-y-1">
                  <li>リファラ</li>
                  <li>IPアドレス</li>
                  <li>サーバーアクセスログに関する情報</li>
                  <li>
                    Cookie、ADID、IDFAその他の識別子（以下「Cookie等」といいます。）
                  </li>
                </ul>
                <p className="pl-4 mt-2">
                  なお、第三者のウェブサイトに埋め込まれた本サービスのコンテンツ（マップ、スポット情報等）が閲覧された場合も、上記の情報を同様に収集することがあります。
                </p>
              </div>

              <div>
                <p className="font-medium mb-2">
                  （5）ユーザーが本サービスを利用するにあたって、当社がユーザーの個別同意に基づいて収集する情報
                </p>
                <p className="pl-4 mb-2">
                  当社は、ユーザーが個別に同意した場合、以下の情報を利用中の端末から収集します。
                </p>
                <ul className="pl-8 list-disc space-y-1">
                  <li>閲覧履歴（マップ・スポットの閲覧記録）</li>
                  <li>検索履歴（検索キーワード等）</li>
                  <li>位置情報（ユーザーの許可を得た場合のみ）</li>
                  <li>プッシュ通知用トークン</li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">（6）決済情報について</p>
                <p className="pl-4 mb-2">
                  本サービスの有料機能（プレミアム会員等）のご利用にあたり、決済処理は以下の外部サービスを通じて行われます。
                </p>
                <ul className="pl-8 list-disc space-y-1">
                  <li>モバイルアプリ：Apple App Store / Google Play Store</li>
                  <li>Webサービス：Stripe</li>
                </ul>
                <p className="pl-4 mt-2">
                  クレジットカード番号等の決済情報は、上記の決済サービス提供者が直接取得・管理しており、当社はこれらの情報を取得・保存しません。各決済サービスにおける個人情報の取り扱いについては、各社のプライバシーポリシーをご確認ください。
                </p>
              </div>
            </div>
          </section>

          {/* 2. 利用目的 */}
          <section className="mb-8">
            <h2 className="font-bold text-lg mb-4">2. 利用目的</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              本サービスのサービス提供にかかわる利用者情報の具体的な利用目的は以下のとおりです。
            </p>
            <div className="pl-4 space-y-2 text-gray-700 leading-relaxed">
              <p>
                （1）本サービスに関する登録の受付、本人確認、ユーザー認証、ユーザー設定の記録、利用料金の決済計算等本サービスの提供、維持、保護及び改善のため
              </p>
              <p>（2）ユーザーのトラフィック測定及び行動測定のため</p>
              <p>（3）広告の配信、表示及び効果測定のため</p>
              <p>
                （4）本サービスに関するご案内、お問い合わせ等への対応のため
              </p>
              <p>
                （5）本サービスに関する当社の規約、ポリシー等（以下「規約等」といいます。）に違反する行為に対する対応のため
              </p>
              <p>
                （6）本サービスに関する規約等の変更などを通知するため
              </p>
              <p>（7）埋め込みコンテンツの利用状況の把握及び改善のため</p>
              <p>（8）パーソナライズされたコンテンツの提供のため</p>
              <p>（9）ダイレクトメールの送付のため</p>
              <p>
                （10）利用状況の分析及び個人を特定できない形での統計情報の作成・公開のため
              </p>
              <p>
                （11）位置情報を利用した現在地表示、周辺スポットの検索機能提供のため
              </p>
            </div>
          </section>

          {/* 3. 提携先及び情報収集モジュール提供者への提供 */}
          <section className="mb-8">
            <h2 className="font-bold text-lg mb-4">
              3. 提携先及び情報収集モジュール提供者への提供
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4">
              3-1
              本サービスでは、以下の提携先が、Cookie等を利用して利用者情報を蓄積及び利用している場合があります。
            </p>

            <h3 className="font-bold text-base mt-6 mb-2">Google Analytics</h3>
            <InfoTable
              rows={[
                { label: "提携先", value: "Google LLC" },
                {
                  label: "蓄積及び利用される利用者情報の項目",
                  value: "アクセスログ、行動データ、Cookie",
                },
                { label: "当社の利用目的", value: "トラフィック分析、サービス改善" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://policies.google.com/privacy
                    </a>
                  ),
                },
                {
                  label: "オプトアウトURL",
                  value: (
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://tools.google.com/dlpage/gaoptout
                    </a>
                  ),
                },
              ]}
            />

            <h3 className="font-bold text-base mt-6 mb-2">
              Google Search Console
            </h3>
            <InfoTable
              rows={[
                { label: "提携先", value: "Google LLC" },
                {
                  label: "蓄積及び利用される利用者情報の項目",
                  value: "検索クエリ、表示回数、クリック数",
                },
                { label: "当社の利用目的", value: "検索パフォーマンス分析" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://policies.google.com/privacy
                    </a>
                  ),
                },
              ]}
            />

            <h3 className="font-bold text-base mt-6 mb-2">Google AdMob</h3>
            <InfoTable
              rows={[
                { label: "提携先", value: "Google LLC" },
                {
                  label: "蓄積及び利用される利用者情報の項目",
                  value: "IDFA/GAID、広告表示データ、行動データ",
                },
                { label: "当社の利用目的", value: "広告配信、効果測定" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://policies.google.com/privacy
                    </a>
                  ),
                },
                {
                  label: "オプトアウト",
                  value:
                    "端末の設定から広告トラッキングを制限できます",
                },
              ]}
            />

            <p className="text-gray-700 leading-relaxed mt-6 mb-4">
              3-2
              本サービスには以下の情報収集モジュールが組み込まれています。これに伴い、以下のとおり情報収集モジュール提供者への利用者情報の提供を行います。
            </p>

            <h3 className="font-bold text-base mt-6 mb-2">PostHog</h3>
            <InfoTable
              rows={[
                { label: "情報収集モジュールの名称", value: "PostHog" },
                {
                  label: "情報収集モジュール提供者",
                  value: "PostHog, Inc.",
                },
                {
                  label: "提供される利用者情報の項目",
                  value: "行動データ、イベント情報、デバイス情報",
                },
                {
                  label: "提供の手段・方法",
                  value: "SDK経由での自動送信",
                },
                {
                  label: "利用目的",
                  value: "プロダクト分析、ユーザー行動の把握",
                },
                { label: "第三者提供の有無", value: "なし" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://posthog.com/privacy"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://posthog.com/privacy
                    </a>
                  ),
                },
              ]}
            />

            <h3 className="font-bold text-base mt-6 mb-2">Sentry</h3>
            <InfoTable
              rows={[
                { label: "情報収集モジュールの名称", value: "Sentry" },
                {
                  label: "情報収集モジュール提供者",
                  value: "Functional Software, Inc.",
                },
                {
                  label: "提供される利用者情報の項目",
                  value: "クラッシュログ、エラー情報、デバイス情報",
                },
                {
                  label: "提供の手段・方法",
                  value: "SDK経由での自動送信",
                },
                {
                  label: "利用目的",
                  value: "エラー監視、サービス品質向上",
                },
                { label: "第三者提供の有無", value: "なし" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://sentry.io/privacy/"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://sentry.io/privacy/
                    </a>
                  ),
                },
              ]}
            />

            <h3 className="font-bold text-base mt-6 mb-2">
              Expo Push Notifications
            </h3>
            <InfoTable
              rows={[
                {
                  label: "情報収集モジュールの名称",
                  value: "Expo Push Notifications",
                },
                {
                  label: "情報収集モジュール提供者",
                  value: "Expo",
                },
                {
                  label: "提供される利用者情報の項目",
                  value: "プッシュトークン",
                },
                {
                  label: "提供の手段・方法",
                  value: "SDK経由での送信",
                },
                {
                  label: "利用目的",
                  value: "プッシュ通知の配信",
                },
                { label: "第三者提供の有無", value: "なし" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://expo.dev/privacy"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://expo.dev/privacy
                    </a>
                  ),
                },
              ]}
            />

            <h3 className="font-bold text-base mt-6 mb-2">Mapbox</h3>
            <InfoTable
              rows={[
                {
                  label: "情報収集モジュールの名称",
                  value: "Mapbox Maps SDK",
                },
                {
                  label: "情報収集モジュール提供者",
                  value: "Mapbox, Inc.",
                },
                {
                  label: "提供される利用者情報の項目",
                  value: "位置情報、地図操作データ",
                },
                {
                  label: "提供の手段・方法",
                  value: "SDK経由での自動送信",
                },
                {
                  label: "利用目的",
                  value: "地図表示、位置情報サービスの提供",
                },
                { label: "第三者提供の有無", value: "なし" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://www.mapbox.com/legal/privacy"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.mapbox.com/legal/privacy
                    </a>
                  ),
                },
              ]}
            />

            <h3 className="font-bold text-base mt-6 mb-2">Supabase</h3>
            <InfoTable
              rows={[
                {
                  label: "情報収集モジュールの名称",
                  value: "Supabase",
                },
                {
                  label: "情報収集モジュール提供者",
                  value: "Supabase, Inc.",
                },
                {
                  label: "提供される利用者情報の項目",
                  value: "アカウント情報、ユーザー投稿データ",
                },
                {
                  label: "提供の手段・方法",
                  value: "API経由での送信",
                },
                {
                  label: "利用目的",
                  value: "データベース管理、ユーザー認証",
                },
                { label: "第三者提供の有無", value: "なし" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://supabase.com/privacy"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://supabase.com/privacy
                    </a>
                  ),
                },
              ]}
            />

            <h3 className="font-bold text-base mt-6 mb-2">RevenueCat</h3>
            <InfoTable
              rows={[
                {
                  label: "情報収集モジュールの名称",
                  value: "RevenueCat",
                },
                {
                  label: "情報収集モジュール提供者",
                  value: "RevenueCat, Inc.",
                },
                {
                  label: "提供される利用者情報の項目",
                  value:
                    "ユーザーID、購入履歴、サブスクリプション状態",
                },
                {
                  label: "提供の手段・方法",
                  value: "SDK経由での自動送信",
                },
                {
                  label: "利用目的",
                  value: "サブスクリプション管理、課金処理",
                },
                { label: "第三者提供の有無", value: "なし" },
                {
                  label: "プライバシーポリシーURL",
                  value: (
                    <a
                      href="https://www.revenuecat.com/privacy"
                      className="text-blue-600 hover:underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.revenuecat.com/privacy
                    </a>
                  ),
                },
              ]}
            />
          </section>

          {/* 4. 第三者提供 */}
          <section className="mb-8">
            <h2 className="font-bold text-lg mb-4">4. 第三者提供</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              4-1
              当社は、利用者情報のうち、個人情報については、あらかじめユーザーの同意を得ないで、第三者に提供しません。但し、次に掲げる必要があり第三者に提供する場合はこの限りではありません。
            </p>
            <div className="pl-4 space-y-2 text-gray-700 leading-relaxed mb-4">
              <p>
                （1）当社が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
              </p>
              <p>
                （2）合併その他の事由による事業の承継に伴って個人情報が提供される場合
              </p>
              <p>
                （3）第3項の定めに従って、提携先または情報収集モジュール提供者へ個人情報が提供される場合
              </p>
              <p>
                （4）その他、個人情報の保護に関する法律（以下「個人情報保護法」といいます。）その他の法令で認められる場合
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              4-2
              当社は、個人情報を第三者に提供したときは、記録の作成及び保存を行います。
            </p>
            <p className="text-gray-700 leading-relaxed">
              4-3
              当社は、第三者から個人情報の提供を受けるに際しては、必要な確認を行い、当該確認にかかる記録の作成及び保存を行うものとします。
            </p>
          </section>

          {/* 5. 安全管理措置 */}
          <section className="mb-8">
            <h2 className="font-bold text-lg mb-4">5. 安全管理措置</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              5-1
              当社は、利用者情報の漏えい、滅失または毀損の防止その他の利用者情報の安全管理のために、必要かつ適切な措置を講じています。
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              5-2
              当社は、利用者情報のうち個人情報の取扱いを第三者に委託する場合には、当社が定める委託先選定基準を満たす事業者を選定し、委託契約を締結した上で定期的に報告を受ける等の方法により、委託先事業者による個人情報の取扱いについて把握しています。
            </p>
            <p className="text-gray-700 leading-relaxed">
              5-3
              当社が講じる安全管理措置の具体的な内容については、本プライバシーポリシーに記載の当社のお問合せ窓口にお問い合わせください。
            </p>
          </section>

          {/* 6. 個人情報の開示等の請求 */}
          <section className="mb-8">
            <h2 className="font-bold text-lg mb-4">
              6. 個人情報の開示等の請求
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              6-1
              当社は、ユーザーから、個人情報保護法の定めに基づき保有個人データの利用目的の通知、保有個人データ又は第三者提供の記録の開示、保有個人データの内容の訂正・追加・削除、保有個人データの利用の停止・消去・第三者提供の停止のご請求（あわせて以下「個人情報の開示等の請求」といいます。）があった場合は、ユーザーご本人からのご請求であることを確認した上で、当社所定の手続きに従い、遅滞なくこれらに対応いたします。
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              6-2
              利用目的の通知、保有個人データ又は第三者提供の記録の開示につきましては、手数料としてご請求1件につき1,000円（消費税別）をお支払いいただきます。
            </p>
            <p className="text-gray-700 leading-relaxed">
              6-3
              個人情報の開示等の請求の具体的な方法については、本プライバシーポリシーに記載の当社のお問い合わせ窓口にお問い合わせください。
            </p>
          </section>

          {/* 7. お問い合わせ窓口 */}
          <section className="mb-8">
            <h2 className="font-bold text-lg mb-4">7. お問い合わせ窓口</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              本サービスに対するご意見、ご質問、苦情のお申出その他利用者情報の取扱いに関するお問い合わせは、下記の窓口までお願いいたします。
            </p>
            <p className="text-gray-700 leading-relaxed">
              連絡先：
              <a
                href="mailto:support@machikore.io"
                className="text-blue-600 hover:underline"
              >
                support@machikore.io
              </a>
            </p>
          </section>

          {/* 8. プライバシーポリシーの変更手続 */}
          <section className="mb-8">
            <h2 className="font-bold text-lg mb-4">
              8. プライバシーポリシーの変更手続
            </h2>
            <p className="text-gray-700 leading-relaxed">
              当社は、必要に応じて、本ポリシーを変更します。但し、法令上ユーザーの同意が必要となるような本ポリシーの変更を行う場合、変更後の本ポリシーは、当社所定の方法で変更に同意したユーザーに対してのみ適用されるものとします。なお、当社は、本ポリシーを変更する場合には、変更後の本ポリシーの施行時期及び内容を当社のウェブサイト上での表示その他の適切な方法により周知し、またはユーザーに通知します。
            </p>
          </section>

          {/* 制定日 */}
          <p className="text-gray-700 text-right mt-8">2025年1月27日制定</p>
        </div>
      </div>
    </main>
  );
}
