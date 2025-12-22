#!/bin/bash

SUPABASE_URL="https://whgptckcuskqggyybruw.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZ3B0Y2tjdXNrcWdneXlicnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzkyOTQsImV4cCI6MjA3ODYxNTI5NH0.tIU3eJMUS0VmisAjE0gKWnMKDTQct5VRxcuPubnQ9uY"
USER_ID="79c087e6-8646-4634-9aab-b2ef1d518c6b"

curl -s "${SUPABASE_URL}/rest/v1/notifications" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{\"user_id\": \"${USER_ID}\", \"type\": \"system\", \"content\": \"テスト通知です！通知機能が正常に動作しています。\"}" | jq .
