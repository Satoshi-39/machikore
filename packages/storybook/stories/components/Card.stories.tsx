import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

/**
 * カードコンポーネント（Storybook見本）
 *
 * React Native実装の参照用
 * 実装: apps/mobile/src/shared/ui/card/card.tsx
 */

interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => (
  <div
    style={{
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      backgroundColor: '#FFFFFF',
    }}
  >
    {children}
  </div>
);

const CardHeader = ({ children }: CardProps) => (
  <div style={{ padding: '16px' }}>{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3
    style={{
      fontSize: '18px',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#1F2937',
      margin: 0,
    }}
  >
    {children}
  </h3>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontSize: '14px',
      color: '#6B7280',
      margin: '4px 0 0 0',
    }}
  >
    {children}
  </p>
);

const CardContent = ({ children }: CardProps) => (
  <div style={{ padding: '0 16px 16px 16px' }}>{children}</div>
);

const CardFooter = ({ children }: CardProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px 16px 16px',
      gap: '8px',
    }}
  >
    {children}
  </div>
);

const SampleButton = ({
  children,
  variant = 'primary',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
}) => (
  <button
    style={{
      padding: '8px 16px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      ...(variant === 'primary'
        ? { backgroundColor: '#0787E1', color: '#FFFFFF', border: 'none' }
        : { backgroundColor: 'transparent', color: '#1F2937', border: '1px solid #E5E7EB' }),
    }}
  >
    {children}
  </button>
);

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>カードタイトル</CardTitle>
        <CardDescription>カードの説明文がここに入ります</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: '#374151' }}>
          カードのコンテンツエリアです。任意のコンテンツを配置できます。
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>アクション付きカード</CardTitle>
        <CardDescription>フッターにボタンを配置した例</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: '#374151' }}>
          このカードにはフッターにアクションボタンがあります。
        </p>
      </CardContent>
      <CardFooter>
        <SampleButton variant="outline">キャンセル</SampleButton>
        <SampleButton variant="primary">保存</SampleButton>
      </CardFooter>
    </Card>
  ),
};

export const SpotCard: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Card>
        <div
          style={{
            width: '100%',
            height: '180px',
            backgroundColor: '#F3F4F6',
            borderRadius: '12px 12px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9CA3AF',
            fontSize: '32px',
          }}
        >
          📍
        </div>
        <CardHeader>
          <CardTitle>東京タワー</CardTitle>
          <CardDescription>港区芝公園</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span
              style={{
                padding: '4px 8px',
                backgroundColor: '#DBEAFE',
                color: '#1D4ED8',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              観光
            </span>
            <span
              style={{
                padding: '4px 8px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              ランドマーク
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

export const MapCard: Story = {
  render: () => (
    <div style={{ width: '280px' }}>
      <Card>
        <div
          style={{
            width: '100%',
            height: '140px',
            backgroundColor: '#E0F2FE',
            borderRadius: '12px 12px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0284C7',
            fontSize: '32px',
          }}
        >
          🗺️
        </div>
        <CardHeader>
          <CardTitle>東京カフェ巡り</CardTitle>
          <CardDescription>12 スポット・公開中</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#E5E7EB',
              }}
            />
            <span style={{ fontSize: '14px', color: '#6B7280' }}>@username</span>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
