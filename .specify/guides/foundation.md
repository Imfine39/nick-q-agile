# Foundation Feature Guide

このガイドは、Foundation（基盤機能）の概念と実装方法を説明します。

---

## 1. Foundation とは

Foundation は、他のすべての Feature が依存する**基盤機能**です。
プロジェクトの最初に実装され、他の Feature の土台となります。

### 1.1 典型的な Foundation 機能

| カテゴリ | 機能例 |
|----------|--------|
| 認証・認可 | ログイン、ログアウト、セッション管理、権限管理 |
| データベース | コアモデル、マイグレーション、シード |
| UI 基盤 | レイアウト、ナビゲーション、共通コンポーネント |
| API 基盤 | エラーハンドリング、認証ミドルウェア、レスポンス形式 |
| 開発環境 | リンター、テスト環境、CI/CD 基盤 |

### 1.2 Foundation の特徴

- **他の Feature が依存**: Foundation なしでは他の機能が動作しない
- **早期確定**: アーキテクチャ決定を早期に確定させる
- **安定性重視**: 頻繁な変更は避けるべき
- **広範な影響**: 変更時は全 Feature への影響を考慮

---

## 2. なぜ Foundation を最初に実装するか

### 2.1 依存関係の解決

```
Foundation (S-FOUNDATION-001)
├── 認証 (S-AUTH-001)
├── ユーザー管理 (S-USER-001)
├── 注文管理 (S-ORDERS-001)
└── ダッシュボード (S-DASHBOARD-001)
```

Foundation が完成していないと、他の Feature は：
- 認証が使えない
- 共通レイアウトが使えない
- API の基本構造が不明

### 2.2 アーキテクチャの早期確定

Foundation で決定する事項：
- 認証方式（JWT、セッション、OAuth）
- API 設計パターン（REST、GraphQL）
- 状態管理（Redux、Context、Zustand）
- エラーハンドリング戦略
- ログ・監視戦略

### 2.3 開発環境の整備

Foundation 完了後に他の開発者が参加しやすくなる：
- プロジェクト構造が確立
- コーディング規約が適用済み
- テスト基盤が整備

---

## 3. Foundation の作成フロー

### 3.1 `/speckit.design` での自動生成

```bash
# 1. /speckit.design を実行
# 2. AI が Feature 候補を提案（Foundation 含む）
# 3. Foundation 候補を選択
# 4. S-FOUNDATION-001 Issue が自動作成される
```

### 3.2 Issue 選択から実装まで

```bash
# 1. /speckit.issue で S-FOUNDATION-001 を選択
# 2. Foundation Feature Spec を作成
# 3. /speckit.clarify で曖昧点を解消
# 4. /speckit.plan → /speckit.tasks → /speckit.implement
# 5. /speckit.pr で PR 作成
```

---

## 4. Foundation Feature Spec の書き方

### 4.1 必須セクション

Foundation Spec では特に以下を詳細に記述：

**Domain Dependencies (Section 2)**
```markdown
### 2.1 Master Data Dependencies

| Master ID | Name | Usage in this Feature |
|-----------|------|----------------------|
| M-USER | ユーザー | 認証・セッション管理の対象 |
| M-ROLE | ロール | 権限管理の基盤 |

### 2.2 API Dependencies

| API ID | Name | Usage |
|--------|------|-------|
| API-AUTH-LOGIN | ログイン | Foundation で実装 |
| API-AUTH-LOGOUT | ログアウト | Foundation で実装 |
| API-AUTH-REFRESH | トークン更新 | Foundation で実装 |
```

**Technology Decisions**
```markdown
## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| 認証方式 | JWT + Refresh Token | ステートレス、スケーラブル |
| セッション | httpOnly Cookie | XSS 対策 |
| パスワード | bcrypt | 業界標準 |
```

### 4.2 Use Case の構成

Foundation の Use Case は基盤的な操作に集中：

```markdown
### UC-FOUNDATION-001: ユーザー認証

**Priority:** P1
**Actor:** 未認証ユーザー

**Main Flow:**
1. ユーザーがログインページにアクセス
2. メールアドレスとパスワードを入力
3. システムが認証を検証
4. 成功時、JWT トークンを発行
5. ダッシュボードにリダイレクト

**Acceptance Criteria:**
- [ ] 正しい認証情報でログイン成功
- [ ] 不正な認証情報でエラー表示
- [ ] トークンが httpOnly Cookie に保存される
- [ ] 5回連続失敗でアカウントロック
```

---

## 5. Foundation 実装時の注意点

### 5.1 過剰な機能を避ける

Foundation に含めるべき**でない**もの：
- 特定ビジネスロジック
- 特定ユーザーフロー
- 後から追加可能な機能

**良い例**: 基本的なログイン/ログアウト
**悪い例**: ソーシャルログイン（後から追加可能）

### 5.2 拡張性を考慮

将来の拡張に備えた設計：
```typescript
// 良い例: 拡張可能な認証インターフェース
interface AuthProvider {
  login(credentials: Credentials): Promise<AuthResult>;
  logout(): Promise<void>;
  refresh(): Promise<AuthResult>;
}

// 悪い例: 具体的な実装に依存
function loginWithPassword(email: string, password: string) { ... }
```

### 5.3 テストの重視

Foundation は特にテストが重要：
- ユニットテスト: 100% に近いカバレッジ
- 統合テスト: 認証フロー全体
- E2E テスト: ログイン〜ログアウト

---

## 6. Foundation 変更時の影響管理

### 6.1 変更が必要な場合

Foundation の変更は `/speckit.change` を使用：

```bash
# 1. 変更が必要な M-*/API-* を特定
# 2. /speckit.change で Domain Spec を更新
# 3. 影響を受ける Feature Spec をレビュー
# 4. Foundation Feature Spec を更新
# 5. 実装・テスト
```

### 6.2 影響分析

変更前に必ず確認：
1. Feature Index で依存している Feature を確認
2. 各 Feature の Domain Dependencies を確認
3. 影響範囲をドキュメント化
4. 関係者に通知

---

## 7. Foundation Checklist

### 7.1 Spec 作成時

- [ ] 認証方式が決定されているか
- [ ] 権限モデルが定義されているか
- [ ] エラーハンドリング戦略があるか
- [ ] ログ・監視要件が定義されているか
- [ ] 必要最小限の機能に絞られているか

### 7.2 実装時

- [ ] テストカバレッジが十分か
- [ ] セキュリティ要件を満たしているか
- [ ] ドキュメントが整備されているか
- [ ] 他の開発者がすぐに使えるか

### 7.3 完了時

- [ ] 全ての Use Case が実装されているか
- [ ] CI/CD が正常に動作しているか
- [ ] 開発環境セットアップ手順があるか
- [ ] README が更新されているか

---

## 8. クイックリファレンス

| 項目 | Foundation の特徴 |
|------|-------------------|
| ID 形式 | `S-FOUNDATION-001` |
| 優先度 | 常に最高（P0） |
| 実装順序 | プロジェクト最初 |
| 変更頻度 | 低く保つべき |
| テスト | 高カバレッジ必須 |
| 依存関係 | 他の Feature が依存 |
