# TanStack Query 楽観的更新 ベストプラクティス

## 公式推奨パターン

TanStack Query公式ドキュメント（optimistic-updates.md）に基づく。

```typescript
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // 1. 進行中のリフェッチをキャンセル（楽観的更新を上書きさせない）
    await queryClient.cancelQueries({ queryKey: ['todos'] })

    // 2. 以前の値をスナップショット（ロールバック用）
    const previousTodos = queryClient.getQueryData(['todos'])

    // 3. 楽観的にキャッシュを更新（即座にUIに反映）
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo])

    // 4. スナップショットを返す
    return { previousTodos }
  },
  onError: (err, newTodo, context) => {
    // 失敗時はスナップショットでロールバック
    queryClient.setQueryData(['todos'], context.previousTodos)
  },
  // 成功・失敗どちらでもリフェッチして整合性を保証
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## 各コールバックの役割

| コールバック | タイミング | 役割 |
|---|---|---|
| `onMutate` | mutate()呼び出し直後 | cancelQueries + 楽観的更新 + スナップショット |
| `onError` | サーバーエラー時 | スナップショットでロールバック |
| `onSuccess` | サーバー成功時 | （オプション）サーバー返却値でキャッシュ微調整 |
| `onSettled` | 成功・失敗どちらでも | invalidateQueriesで最新データを再取得 |

## なぜ cancelQueries が必要か

```
1. ユーザーがいいねを押す
2. onMutate: is_liked = true, likes_count = 6 にキャッシュ更新
3. 同時にTanStack Queryが別の理由でリフェッチ実行中だった
   （画面フォーカス復帰、staleTime切れ、他のinvalidateQueriesの波及など）
4. リフェッチが完了し、サーバーからまだ古いデータ (is_liked = false, count = 5) が返る
5. キャッシュが古い値で上書きされる → UIがチラつく/固まる
```

`cancelQueries` でステップ3の進行中リフェッチを止め、この競合を防ぐ。

## invalidateQueries の挙動

- **アクティブなクエリ**（マウント中のコンポーネント）→ 即座にリフェッチ
- **非アクティブなクエリ**（キャッシュのみ）→ 「stale」マークされるだけ。次にアクセスされた時にリフェッチ
- ネットワークコストは「今表示中の画面」分だけ

## onMutate で更新する範囲

- 「今ユーザーが見ている画面」のキャッシュだけを更新すればよい
- 他のキャッシュは `onSettled` の `invalidateQueries` で最新化される
- 広範な `setQueriesData` で全キャッシュを手動更新するのは不要でバグの温床

## アンチパターン

### NG: invalidateQueries だけ（楽観的更新なし）

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['todos'] })
}
```

サーバー応答まで UI が変わらない → UX が悪い。

### NG: 楽観的更新だけ（invalidateQueries なし）

```typescript
onMutate: () => {
  queryClient.setQueriesData(...)  // 複数箇所を手動更新...
}
```

サーバーとの整合性が保証されない。手動で全キャッシュを更新する必要があり、コードが複雑化・バグの温床になる。

### NG: cancelQueries なし

```typescript
onMutate: () => {
  queryClient.setQueryData(...)
}
```

リフェッチが楽観的更新を上書きする可能性がある。
