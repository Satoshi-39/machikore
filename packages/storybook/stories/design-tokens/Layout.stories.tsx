import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import tokens from '@machikore/design-tokens/storybook';

/**
 * レイアウト関連トークン一覧
 */

const spacingTokens = tokens.spacing as Record<string, string>;
const radiusTokens = tokens.radius as Record<string, string>;

const LayoutDisplay = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
        Machikore レイアウト
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        余白（margin, padding）、ボーダーラディウスなどレイアウト関連のデザイントークン
      </p>

      {/* スペーシング */}
      <section style={{ marginBottom: '48px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          Spacing Scale
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          Tailwindの p-*, m-*, gap-* などで使用される値
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(spacingTokens || {})
            .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
            .map(([name, value]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '8px 12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {name}
                </div>
                <div
                  style={{
                    width: '60px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#6b7280',
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    height: '24px',
                    width: value,
                    backgroundColor: '#1A8CFF',
                    borderRadius: '4px',
                    minWidth: '2px',
                  }}
                />
                <div
                  style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                  }}
                >
                  p-{name}, m-{name}, gap-{name}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ボーダーラディウス */}
      <section>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          Border Radius
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          角丸のサイズ（rounded-*）
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
          }}
        >
          {Object.entries(radiusTokens || {}).map(([name, value]) => (
            <div
              key={name}
              style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#1A8CFF',
                  borderRadius: value,
                  margin: '0 auto 12px',
                }}
              />
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#374151' }}>
                {name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#6b7280',
                  marginTop: '4px',
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  marginTop: '4px',
                }}
              >
                rounded-{name === 'default' ? '' : name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 使用例 */}
      <section style={{ marginTop: '48px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          使用例
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {/* カード例 */}
          <div
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h4 style={{ margin: '0 0 8px', fontWeight: 600 }}>カードコンポーネント</h4>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>
              padding: spacing-6 (24px)
              <br />
              border-radius: radius-lg (12px)
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                gap-2
              </span>
              <span
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              >
                p-6
              </span>
            </div>
          </div>

          {/* ボタン例 */}
          <div
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h4 style={{ margin: '0 0 8px', fontWeight: 600 }}>ボタンコンポーネント</h4>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>
              padding: spacing-4 x spacing-6
              <br />
              border-radius: radius-full
            </p>
            <button
              style={{
                padding: '16px 24px',
                backgroundColor: '#1A8CFF',
                color: '#ffffff',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ボタン
            </button>
          </div>

          {/* 入力フィールド例 */}
          <div
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h4 style={{ margin: '0 0 8px', fontWeight: 600 }}>入力フィールド</h4>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>
              padding: spacing-3 (12px)
              <br />
              border-radius: radius-md (8px)
            </p>
            <input
              type="text"
              placeholder="テキストを入力..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof LayoutDisplay> = {
  title: 'Design Tokens/Layout',
  component: LayoutDisplay,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof LayoutDisplay>;

export const Default: Story = {};
