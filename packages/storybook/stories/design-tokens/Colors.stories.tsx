import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// トークンJSONをパッケージ経由でインポート
import tokens from '@machikore/design-tokens/storybook';

/**
 * カラースウォッチコンポーネント
 */
const ColorSwatch = ({
  name,
  value,
}: {
  name: string;
  value: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        backgroundColor: value,
        border: value === '#ffffff' || value === '#FFFFFF' ? '1px solid #e5e7eb' : 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    />
    <div>
      <div style={{ fontWeight: 600, fontSize: '14px' }}>{name}</div>
      <div style={{ color: '#6b7280', fontSize: '12px', fontFamily: 'monospace' }}>
        {value}
      </div>
    </div>
  </div>
);

/**
 * カラーパレットセクション
 */
const ColorSection = ({
  title,
  colors,
}: {
  title: string;
  colors: Record<string, string>;
}) => (
  <div style={{ marginBottom: '32px' }}>
    <h3
      style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      {title}
    </h3>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '12px',
      }}
    >
      {Object.entries(colors).map(([name, value]) => {
        // 文字列（カラーコード）のみ表示
        if (typeof value === 'string' && value.startsWith('#')) {
          return <ColorSwatch key={name} name={name} value={value} />;
        }
        return null;
      })}
    </div>
  </div>
);

/**
 * ネストされたカラーセクション（light/darkなど）
 */
const NestedColorSection = ({
  title,
  colorGroup,
}: {
  title: string;
  colorGroup: Record<string, Record<string, string>>;
}) => (
  <div style={{ marginBottom: '32px' }}>
    <h3
      style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      {title}
    </h3>
    {Object.entries(colorGroup).map(([subTitle, colors]) => (
      <div key={subTitle} style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: '#6b7280' }}>
          {subTitle}
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
          }}
        >
          {Object.entries(colors).map(([name, value]) => {
            if (typeof value === 'string' && value.startsWith('#')) {
              return <ColorSwatch key={name} name={name} value={value} />;
            }
            return null;
          })}
        </div>
      </div>
    ))}
  </div>
);

/**
 * カラーパレット全体
 */
const ColorPalette = () => {
  const colorTokens = tokens.color as Record<string, unknown>;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '1200px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
        Machikore カラーパレット
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Style Dictionary で自動生成されたデザイントークン
      </p>

      {/* ブランドカラー */}
      <ColorSection title="Brand Colors" colors={colorTokens.brand as Record<string, string>} />

      {/* セマンティックカラー */}
      <ColorSection title="Semantic Colors" colors={colorTokens.semantic as Record<string, string>} />

      {/* グレースケール */}
      <ColorSection title="Gray Scale" colors={colorTokens.gray as Record<string, string>} />

      {/* ランキングカラー */}
      <ColorSection title="Ranking Colors" colors={colorTokens.ranking as Record<string, string>} />

      {/* アクションカラー */}
      <ColorSection title="Action Colors" colors={colorTokens.action as Record<string, string>} />

      {/* ライトテーマ */}
      <ColorSection title="Light Theme" colors={colorTokens.light as Record<string, string>} />

      {/* ダークテーマ */}
      <ColorSection title="Dark Theme" colors={colorTokens.dark as Record<string, string>} />

      {/* スポットカラー */}
      <ColorSection title="Spot Colors" colors={colorTokens.spot as Record<string, string>} />

      {/* スポットタイプカラー */}
      <ColorSection title="Spot Type Colors" colors={colorTokens['spot-type'] as Record<string, string>} />

      {/* 交通機関カラー */}
      <NestedColorSection
        title="Transport Colors"
        colorGroup={colorTokens.transport as Record<string, Record<string, string>>}
      />

      {/* 地名ラベルカラー */}
      <NestedColorSection
        title="Location Label Colors"
        colorGroup={colorTokens['location-label'] as Record<string, Record<string, string>>}
      />
    </div>
  );
};

const meta: Meta<typeof ColorPalette> = {
  title: 'Design Tokens/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ColorPalette>;

export const Default: Story = {};
