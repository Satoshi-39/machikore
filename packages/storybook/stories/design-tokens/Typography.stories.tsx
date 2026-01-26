import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import tokens from '@machikore/design-tokens/storybook';

/**
 * タイポグラフィ一覧
 */

const fontTokens = tokens.font as Record<string, Record<string, string>>;

const TypographyDisplay = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
        Machikore タイポグラフィ
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        フォントファミリー、サイズ、ウェイト、行間のデザイントークン
      </p>

      {/* フォントファミリー */}
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
          Font Family
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(fontTokens.family || {}).map(([name, value]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {name}
              </div>
              <div
                style={{
                  width: '120px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#6b7280',
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontFamily: value as string,
                  color: '#1f2937',
                }}
              >
                あいうえお ABCDEFG 123 街コレ
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
          ※ iOS: System = SF Pro + Hiragino Sans、serif = Hiragino Mincho、mono = SF Mono
        </p>
      </section>

      {/* フォントサイズ */}
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
          Font Size
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(fontTokens.size || {}).map(([name, value]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '24px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  width: '80px',
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
              <div style={{ fontSize: value as string, color: '#1f2937' }}>
                あいうえお ABCDEFG 123
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* フォントウェイト */}
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
          Font Weight
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(fontTokens.weight || {}).map(([name, value]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  width: '100px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {name}
              </div>
              <div
                style={{
                  width: '40px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#6b7280',
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: Number(value),
                  color: '#1f2937',
                }}
              >
                The quick brown fox あいうえお
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 行間 */}
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
          Line Height
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {Object.entries(fontTokens.lineHeight || {}).map(([name, value]) => (
            <div
              key={name}
              style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{name}</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#6b7280',
                  }}
                >
                  {value}
                </span>
              </div>
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: value as string,
                  color: '#374151',
                  backgroundColor: '#e5e7eb33',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                これは行間のサンプルテキストです。
                <br />
                複数行で表示して行間を確認できます。
                <br />
                Line height sample text.
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 文字間隔 */}
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
          Letter Spacing
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(fontTokens.letterSpacing || {}).map(([name, value]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {name}
              </div>
              <div
                style={{
                  width: '80px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#6b7280',
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  letterSpacing: value as string,
                  color: '#1f2937',
                }}
              >
                TYPOGRAPHY タイポグラフィ
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof TypographyDisplay> = {
  title: 'Design Tokens/Typography',
  component: TypographyDisplay,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof TypographyDisplay>;

export const Default: Story = {};
