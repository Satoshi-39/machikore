/**
 * Inbucket APIからOTPコードを取得するスクリプト
 *
 * Maestro の runScript から呼び出される
 * 環境変数（runScript の env ブロックからグローバル変数として渡される）:
 *   INBUCKET_URL - Inbucket URL (デフォルト: http://localhost:54324)
 *   TEST_EMAIL - テスト用メールアドレス
 *
 * 出力:
 *   output.otp - 6桁のOTPコード
 */

// Maestro GraalJS: 環境変数はrunScriptのenvブロックからグローバル変数として渡される
if (typeof TEST_EMAIL === 'undefined' || !TEST_EMAIL) {
  throw new Error('TEST_EMAIL environment variable is required');
}
var inbucketUrl = (typeof INBUCKET_URL !== 'undefined' && INBUCKET_URL) ? INBUCKET_URL : 'http://localhost:54324';

// メールアドレスからmailbox名を取得（@より前の部分）
var mailbox = TEST_EMAIL.split('@')[0];

// メール一覧を取得（リトライ付き: メール配信を待つ）
var MAX_RETRIES = 10;
var messages = [];

for (var attempt = 0; attempt < MAX_RETRIES; attempt++) {
  var listResponse = http.get(inbucketUrl + '/api/v1/mailbox/' + mailbox);
  try {
    messages = JSON.parse(listResponse.body);
  } catch (e) {
    throw new Error('Failed to parse Inbucket response (attempt ' + attempt + '): ' + listResponse.body.substring(0, 200));
  }
  if (messages && messages.length > 0) break;
}

if (!messages || messages.length === 0) {
  throw new Error('No messages found for ' + mailbox + ' after ' + MAX_RETRIES + ' retries');
}

// 最新のメールを取得
var latestMessage = messages[messages.length - 1];
var messageId = latestMessage.id;

// メール本文を取得
var messageResponse = http.get(inbucketUrl + '/api/v1/mailbox/' + mailbox + '/' + messageId);
var message = JSON.parse(messageResponse.body);

// OTPコード（6桁の数字）を抽出
var body = message.body.text || message.body.html || '';
var otpMatch = body.match(/\b(\d{6})\b/);

if (!otpMatch) {
  throw new Error('OTP code not found in email body: ' + body.substring(0, 200));
}

var otp = otpMatch[1];
output.otp = otp;
