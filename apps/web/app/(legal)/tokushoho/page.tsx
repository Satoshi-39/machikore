import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - 街コレ",
  description:
    "街コレの特定商取引法に基づく表記です。",
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

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            特定商取引法に基づく表記
          </h1>
        </div>

        {/* 本文 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <InfoTable
            rows={[
              {
                label: "販売事業者",
                value: "河崎圭司",
              },
              {
                label: "メールアドレス",
                value: (
                  <a
                    href="mailto:support@machikore.io"
                    className="text-blue-600 hover:underline"
                  >
                    support@machikore.io
                  </a>
                ),
              },
              {
                label: "サービスの提供期間",
                value: (
                  <>
                    <p>月額プラン：利用期間開始日から1か月間</p>
                    <p>年額プラン：利用期間開始日から1年間</p>
                    <p className="mt-2 text-gray-500 text-xs">
                      いずれのプランも、所定の方法によりご解約いただかない限り、自動更新となります。
                    </p>
                  </>
                ),
              },
              {
                label: "利用料金",
                value:
                  "各プランの申込みページにて記載されている料金（税込み）となります。",
              },
              {
                label: "対価以外に必要となる費用",
                value:
                  "インターネット接続料金その他の電気通信回線の通信に関する費用はお客様にて別途ご用意いただく必要があります（金額は、お客様が契約した各事業者が定める通り）。",
              },
              {
                label: "支払方法",
                value: (
                  <>
                    <p>
                      iOSアプリケーション：App Storeを通じたお支払い
                    </p>
                    <p>
                      Androidアプリケーション：Google Playを通じたお支払い
                    </p>
                  </>
                ),
              },
              {
                label: "支払時期",
                value: (
                  <>
                    <p>
                      サービスのご利用開始時に、お客様が選択された期間分の利用料金を先払いにてお支払いいただきます。
                    </p>
                    <p className="font-medium mt-3">App Store（iOS）の場合</p>
                    <p>
                      ご利用期間終了日の24時間前までに自動更新をオフにしない限り、サブスクリプションは自動更新され、同一期間分の利用料金が請求されます。更新料金は期間終了前24時間以内に課金されます。
                    </p>
                    <p className="font-medium mt-3">Google Play（Android）の場合</p>
                    <p>
                      ご利用期間終了日までに自動更新をオフにしない限り、サブスクリプションは自動更新され、同一期間分の利用料金が請求されます。
                    </p>
                    <p className="mt-3">
                      なお、料金が改定された場合は、各プラットフォームの定めるところに従い、改定内容の通知および同意の手続きが行われます。
                    </p>
                    <p className="font-medium mt-3">無料体験について</p>
                    <p>
                      無料体験期間が設定されているプランの場合、App Storeでは無料体験期間終了の24時間前まで、Google Playでは無料体験期間終了までにご解約いただかない限り、無料体験期間の終了と同時に自動的に利用料金の支払いが発生いたします。
                    </p>
                  </>
                ),
              },
              {
                label: "サービス提供の時期",
                value: "所定の手続き終了後、直ちにご利用いただけます。",
              },
              {
                label: "申込みの撤回・解除",
                value: (
                  <>
                    <p>
                      本サービスで販売するサービスについては、サービスの性質上、購入手続完了後のお申込みの撤回をお受けいたしません。
                    </p>
                    <p className="mt-2">
                      利用期間中の解約のお申し出はいつでも可能ですが、その解約の効力は利用期間満了時に発生します。解約のお申し出後から解約の効力が発生するまでの期間については、返金は致しません。
                    </p>
                  </>
                ),
              },
              {
                label: "返品に関する事項",
                value:
                  "デジタルコンテンツのため、返品はお受けできません。",
              },
              {
                label: "推奨動作環境",
                value: (
                  <>
                    <p className="font-medium">iOS</p>
                    <p>OS：iOS 15.1以降 / iPadOS 15.1以降</p>
                    <p>アプリバージョン：App Storeで提供している最新バージョン</p>
                    <p className="font-medium mt-2">Android</p>
                    <p>OS：Android OS 7.0以降</p>
                    <p>アプリバージョン：Google Playで提供している最新バージョン</p>
                  </>
                ),
              },
              {
                label: "特別条件",
                value:
                  "本サービスは、特定商取引法に規定されるクーリングオフが適用されるサービスではありません。",
              },
            ]}
          />

          <p className="text-xs text-gray-400 mt-8 text-right">
            最終更新日：2025年2月8日
          </p>
        </div>
      </div>
    </main>
  );
}
