import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import tokens from '@machikore/design-tokens/storybook';

const colorTokens = tokens.color as Record<string, Record<string, string>>;

/**
 * ボタンコンポーネント（Storybook見本）
 *
 * React Native実装の参照用
 * 実装: apps/mobile/src/shared/ui/button/button.tsx
 */

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'default' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
}

const getVariantStyles = (variant: ButtonVariant, disabled: boolean): React.CSSProperties => {
  const primary = colorTokens.brand?.primary || '#1A8CFF';
  const danger = colorTokens.semantic?.danger || '#EF4444';

  if (disabled) {
    return {
      backgroundColor: '#D1D5DB',
      color: '#9CA3AF',
      border: 'none',
      cursor: 'not-allowed',
    };
  }

  switch (variant) {
    case 'primary':
      return {
        backgroundColor: primary,
        color: '#FFFFFF',
        border: 'none',
        boxShadow: `0 4px 8px ${primary}4D`,
      };
    case 'secondary':
      return {
        backgroundColor: 'transparent',
        color: primary,
        border: `2px solid ${primary}`,
      };
    case 'destructive':
      return {
        backgroundColor: danger,
        color: '#FFFFFF',
        border: 'none',
        boxShadow: `0 4px 8px ${danger}4D`,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: '#1F2937',
        border: '1px solid #E5E7EB',
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: '#1F2937',
        border: 'none',
      };
    default:
      return {};
  }
};

const getSizeStyles = (size: ButtonSize): React.CSSProperties => {
  switch (size) {
    case 'sm':
      return { padding: '8px 16px', fontSize: '14px' };
    case 'default':
      return { padding: '16px 24px', fontSize: '16px' };
    case 'lg':
      return { padding: '20px 32px', fontSize: '18px' };
  }
};

const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  disabled = false,
  onClick,
}: ButtonProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isHovered && !disabled ? 0.9 : 1,
        ...getVariantStyles(variant, disabled),
        ...getSizeStyles(size),
      }}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost'],
      description: 'ボタンのバリエーション',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'ボタンのサイズ',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'プライマリボタン',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'セカンダリボタン',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '削除する',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'アウトライン',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'ゴースト',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: '無効状態',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#6B7280' }}>通常状態</h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#6B7280' }}>無効状態</h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="destructive" disabled>Destructive</Button>
        </div>
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#6B7280' }}>サイズ</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
    </div>
  ),
};
