-- ============================================================
-- Migration: 003_remove_is_default_from_maps.sql
-- Description: mapsテーブルから未使用のis_defaultカラムを削除
-- Created: 2025-12-23
-- ============================================================

-- is_defaultカラムを削除
ALTER TABLE maps DROP COLUMN IF EXISTS is_default;
