import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import tokens from '@machikore/design-tokens/storybook';

/**
 * カラースウォッチコンポーネント
 */
const ColorSwatch = ({
  name,
  value,
  isDark = false,
}: {
  name: string;
  value: string;
  isDark?: boolean;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: isDark ? '#374151' : '#f9fafb',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        backgroundColor: value,
        border: value === '#FFFFFF' ? '1px solid #e5e7eb' : 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    />
    <div>
      <div style={{ fontWeight: 600, fontSize: '14px', color: isDark ? '#f9fafb' : '#111827' }}>
        {name}
      </div>
      <div
        style={{
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

/**
 * カラースケールセクション
 */
const ColorScaleSection = ({
  title,
  colors,
  description,
}: {
  title: string;
  colors: Record<string, string>;
  description?: string;
}) => (
  <div style={{ marginBottom: '32px' }}>
    <h3
      style={{
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '8px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      {title}
    </h3>
    {description && (
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>{description}</p>
    )}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
      }}
    >
      {Object.entries(colors).map(([name, value]) => {
        if (typeof value === 'string') {
          return <ColorSwatch key={name} name={name} value={value} />;
        }
        return null;
      })}
    </div>
  </div>
);

/**
 * Material Design 3 パターンでセマンティックカラーをグループ化
 */
const groupSemanticColors = (colors: Record<string, string>) => {
  const groups: Record<string, Record<string, string>> = {
    'Surface': {},
    'Primary': {},
    'Secondary': {},
    'Error': {},
    'Success': {},
    'Warning': {},
    'Info': {},
    'Outline': {},
    'Other': {},
  };

  for (const [key, value] of Object.entries(colors)) {
    if (key.startsWith('surface') || key.startsWith('on-surface')) {
      groups['Surface'][key] = value;
    } else if (key.startsWith('primary') || key.startsWith('on-primary')) {
      groups['Primary'][key] = value;
    } else if (key.startsWith('secondary') || key.startsWith('on-secondary')) {
      groups['Secondary'][key] = value;
    } else if (key.startsWith('error') || key.startsWith('on-error')) {
      groups['Error'][key] = value;
    } else if (key.startsWith('success') || key.startsWith('on-success')) {
      groups['Success'][key] = value;
    } else if (key.startsWith('warning') || key.startsWith('on-warning')) {
      groups['Warning'][key] = value;
    } else if (key.startsWith('info') || key.startsWith('on-info')) {
      groups['Info'][key] = value;
    } else if (key.startsWith('outline')) {
      groups['Outline'][key] = value;
    } else {
      groups['Other'][key] = value;
    }
  }

  // 空のグループを削除
  return Object.fromEntries(
    Object.entries(groups).filter(([, colors]) => Object.keys(colors).length > 0)
  );
};

/**
 * セマンティックカラーセクション（Material Design 3 パターン）
 */
const SemanticColorSection = ({
  title,
  colors,
  isDark = false,
}: {
  title: string;
  colors: Record<string, string>;
  isDark?: boolean;
}) => {
  const groupedColors = groupSemanticColors(colors);

  return (
    <div
      style={{
        marginBottom: '32px',
        padding: '24px',
        borderRadius: '12px',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        border: '1px solid #e5e7eb',
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          marginBottom: '16px',
          color: isDark ? '#f9fafb' : '#111827',
        }}
      >
        {title}
      </h3>
      {Object.entries(groupedColors).map(([category, categoryColors]) => (
        <div key={category} style={{ marginBottom: '24px' }}>
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '12px',
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            {category}
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '8px',
            }}
          >
            {Object.entries(categoryColors).map(([name, value]) => (
              <ColorSwatch key={name} name={name} value={value} isDark={isDark} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * カラーパレット全体
 */
const ColorPalette = () => {
  const colorTokens = tokens.color as {
    primitive: Record<string, Record<string, string>>;
    semantic: {
      light: Record<string, string>;
      dark: Record<string, string>;
    };
    spot: Record<string, string>;
    transport: Record<string, string>;
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '1400px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
        Machikore カラーパレット
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        Material Design 3 パターンで整理されたデザイントークン
      </p>

      {/* Primitive Colors */}
      <section style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '24px',
            paddingBottom: '8px',
            borderBottom: '2px solid #1A8CFF',
          }}
        >
          Primitive Colors
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          基本カラー。直接使用せず、Semanticトークン経由で使用することを推奨。
        </p>

        <ColorScaleSection
          title="Brand"
          colors={colorTokens.primitive.brand}
          description="Machikore Blue (#1A8CFF) を中心としたブランドカラースケール"
        />
        <ColorScaleSection
          title="Gray"
          colors={colorTokens.primitive.gray}
          description="UI全体で使用するグレースケール"
        />
        <ColorScaleSection title="Red" colors={colorTokens.primitive.red} />
        <ColorScaleSection title="Green" colors={colorTokens.primitive.green} />
        <ColorScaleSection title="Yellow" colors={colorTokens.primitive.yellow} />
        <ColorScaleSection title="Base" colors={colorTokens.primitive.base} />
      </section>

      {/* Semantic Colors */}
      <section style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '24px',
            paddingBottom: '8px',
            borderBottom: '2px solid #1A8CFF',
          }}
        >
          Semantic Colors (Material Design 3)
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
          用途別のカラー。コード内ではこれらを使用する。
          <br />
          <code
            style={{
              fontSize: '12px',
              backgroundColor: '#f3f4f6',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            bg-surface
          </code>{' '}
          <code
            style={{
              fontSize: '12px',
              backgroundColor: '#f3f4f6',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            text-on-surface
          </code>{' '}
          <code
            style={{
              fontSize: '12px',
              backgroundColor: '#f3f4f6',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            bg-primary
          </code>{' '}
          <code
            style={{
              fontSize: '12px',
              backgroundColor: '#f3f4f6',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            text-on-primary
          </code>
          {' のように使用'}
        </p>

        <SemanticColorSection title="Light Theme" colors={colorTokens.semantic.light} />
        <SemanticColorSection title="Dark Theme" colors={colorTokens.semantic.dark} isDark />
      </section>

      {/* Special Colors */}
      <section>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '24px',
            paddingBottom: '8px',
            borderBottom: '2px solid #1A8CFF',
          }}
        >
          Special Colors
        </h2>

        <ColorScaleSection
          title="Spot Colors"
          colors={colorTokens.spot}
          description="マップピンやタグに使用する9色"
        />
        <ColorScaleSection
          title="Transport Colors"
          colors={colorTokens.transport}
          description="交通機関を表すカラー"
        />
      </section>
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
