/**
 * Supabase Terms API
 * 利用規約・プライバシーポリシーの管理
 */

import { supabase, handleSupabaseError } from './client';

// ===============================
// 型定義
// ===============================

export type TermsType = 'terms_of_service' | 'privacy_policy';

/** 規約バージョン */
export interface TermsVersion {
  id: string;
  type: TermsType;
  version: string;
  content: string;
  summary: string | null;
  effective_at: string;
  created_at: string;
}

/** 同意記録 */
export interface TermsAgreement {
  id: string;
  user_id: string;
  terms_version_id: string;
  privacy_version_id: string;
  agreed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

/** 現在有効な規約 */
export interface CurrentTermsVersions {
  termsOfService: TermsVersion | null;
  privacyPolicy: TermsVersion | null;
}

/** ユーザーの最新同意情報 */
export interface UserLatestAgreement {
  id: string;
  user_id: string;
  terms_version_id: string;
  privacy_version_id: string;
  agreed_at: string;
  terms_version: string;
  privacy_version: string;
}

// ===============================
// 規約バージョン取得
// ===============================

/**
 * 現在有効な利用規約・プライバシーポリシーを取得
 */
export async function getCurrentTermsVersions(): Promise<CurrentTermsVersions> {
  const { data, error } = await supabase
    .from('current_terms_versions')
    .select('*');

  if (error) {
    handleSupabaseError('getCurrentTermsVersions', error);
  }

  const termsOfService = data?.find((v) => v.type === 'terms_of_service') || null;
  const privacyPolicy = data?.find((v) => v.type === 'privacy_policy') || null;

  return {
    termsOfService: termsOfService as TermsVersion | null,
    privacyPolicy: privacyPolicy as TermsVersion | null,
  };
}

/**
 * 特定の規約バージョンを取得
 */
export async function getTermsVersionById(id: string): Promise<TermsVersion | null> {
  const { data, error } = await supabase
    .from('terms_versions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getTermsVersionById', error);
  }

  return data as TermsVersion;
}

/**
 * 規約の全バージョン履歴を取得
 */
export async function getTermsVersionHistory(type: TermsType): Promise<TermsVersion[]> {
  const { data, error } = await supabase
    .from('terms_versions')
    .select('*')
    .eq('type', type)
    .order('effective_at', { ascending: false });

  if (error) {
    handleSupabaseError('getTermsVersionHistory', error);
  }

  return (data || []) as TermsVersion[];
}

// ===============================
// 同意記録
// ===============================

/**
 * 利用規約・プライバシーポリシーへの同意を記録
 */
export async function recordTermsAgreement(
  userId: string,
  termsVersionId: string,
  privacyVersionId: string,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<TermsAgreement> {
  const { data, error } = await supabase
    .from('terms_agreements')
    .insert({
      user_id: userId,
      terms_version_id: termsVersionId,
      privacy_version_id: privacyVersionId,
      ip_address: metadata?.ipAddress || null,
      user_agent: metadata?.userAgent || null,
    })
    .select()
    .single();

  if (error) {
    handleSupabaseError('recordTermsAgreement', error);
  }

  return data as TermsAgreement;
}

/**
 * ユーザーの最新の同意情報を取得
 */
export async function getUserLatestAgreement(userId: string): Promise<UserLatestAgreement | null> {
  const { data, error } = await supabase
    .from('user_latest_agreements')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    handleSupabaseError('getUserLatestAgreement', error);
  }

  return data as UserLatestAgreement;
}

/**
 * ユーザーの同意履歴を全て取得
 */
export async function getUserAgreementHistory(userId: string): Promise<TermsAgreement[]> {
  const { data, error } = await supabase
    .from('terms_agreements')
    .select('*')
    .eq('user_id', userId)
    .order('agreed_at', { ascending: false });

  if (error) {
    handleSupabaseError('getUserAgreementHistory', error);
  }

  return (data || []) as TermsAgreement[];
}

/**
 * ユーザーが最新の規約に同意済みかチェック
 */
export async function hasUserAgreedToLatestTerms(userId: string): Promise<boolean> {
  // 現在有効な規約を取得
  const currentTerms = await getCurrentTermsVersions();

  if (!currentTerms.termsOfService || !currentTerms.privacyPolicy) {
    // 規約が設定されていない場合は同意済みとみなす
    return true;
  }

  // ユーザーの最新の同意情報を取得
  const latestAgreement = await getUserLatestAgreement(userId);

  if (!latestAgreement) {
    return false;
  }

  // 同意した規約のIDが現在有効な規約と一致するかチェック
  return (
    latestAgreement.terms_version_id === currentTerms.termsOfService.id &&
    latestAgreement.privacy_version_id === currentTerms.privacyPolicy.id
  );
}
