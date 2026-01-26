import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

/**
 * アバターコンポーネント（Storybook見本）
 *
 * React Native実装の参照用
 * 実装: apps/mobile/src/shared/ui/avatar/avatar.tsx
 */

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  fallbackText?: string;
}

/**
 * アバターサイズ（業界標準に準拠）
 * @see packages/design-tokens/tokens/primitive/spacing.json
 */
const AVATAR_SIZES: Record<AvatarSize, { width: number; height: number; fontSize: number }> = {
  xs: { width: 16, height: 16, fontSize: 8 },
  sm: { width: 24, height: 24, fontSize: 10 },
  md: { width: 32, height: 32, fontSize: 12 },
  lg: { width: 48, height: 48, fontSize: 16 },
  xl: { width: 64, height: 64, fontSize: 20 },
  '2xl': { width: 96, height: 96, fontSize: 28 },
};

const getSizeStyles = (size: AvatarSize): { width: number; height: number; fontSize: number } => {
  return AVATAR_SIZES[size];
};

const Avatar = ({ src, alt = 'Avatar', size = 'md', fallbackText }: AvatarProps) => {
  const { width, height, fontSize } = getSizeStyles(size);
  const [imageError, setImageError] = React.useState(false);

  const showFallback = !src || imageError;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {showFallback ? (
        fallbackText ? (
          <span style={{ fontSize, fontWeight: 600, color: '#6B7280' }}>{fallbackText}</span>
        ) : (
          <svg
            width={fontSize + 4}
            height={fontSize + 4}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill="#9CA3AF"
            />
          </svg>
        )
      ) : (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt?: string }>;
  max?: number;
  size?: AvatarSize;
}

const AvatarGroup = ({ avatars, max = 4, size = 'md' }: AvatarGroupProps) => {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;
  const { width } = getSizeStyles(size);
  const overlap = width * 0.3;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : -overlap,
            border: '2px solid white',
            borderRadius: '50%',
            zIndex: visibleAvatars.length - index,
          }}
        >
          <Avatar src={avatar.src} alt={avatar.alt} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          style={{
            marginLeft: -overlap,
            border: '2px solid white',
            borderRadius: '50%',
          }}
        >
          <Avatar size={size} fallbackText={`+${remaining}`} />
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'アバターのサイズ',
    },
    src: {
      control: 'text',
      description: '画像URL',
    },
    fallbackText: {
      control: 'text',
      description: 'フォールバックテキスト（イニシャルなど）',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    size: 'md',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    size: 'md',
  },
};

export const WithInitials: Story = {
  args: {
    fallbackText: 'KT',
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar src="https://i.pravatar.cc/150?img=1" size="xs" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>xs (16px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar src="https://i.pravatar.cc/150?img=2" size="sm" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>sm (24px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar src="https://i.pravatar.cc/150?img=3" size="md" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>md (32px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar src="https://i.pravatar.cc/150?img=4" size="lg" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>lg (48px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar src="https://i.pravatar.cc/150?img=5" size="xl" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>xl (64px)</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar src="https://i.pravatar.cc/150?img=6" size="2xl" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>2xl (96px)</div>
      </div>
    </div>
  ),
};

export const Fallbacks: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar size="lg" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>デフォルト</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar size="lg" fallbackText="田" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>イニシャル</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Avatar src="https://invalid-url.com/image.jpg" size="lg" />
        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>エラー時</div>
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>4人以下</div>
        <AvatarGroup
          avatars={[
            { src: 'https://i.pravatar.cc/150?img=1' },
            { src: 'https://i.pravatar.cc/150?img=2' },
            { src: 'https://i.pravatar.cc/150?img=3' },
          ]}
        />
      </div>
      <div>
        <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>4人以上（+2）</div>
        <AvatarGroup
          avatars={[
            { src: 'https://i.pravatar.cc/150?img=1' },
            { src: 'https://i.pravatar.cc/150?img=2' },
            { src: 'https://i.pravatar.cc/150?img=3' },
            { src: 'https://i.pravatar.cc/150?img=4' },
            { src: 'https://i.pravatar.cc/150?img=5' },
            { src: 'https://i.pravatar.cc/150?img=6' },
          ]}
          max={4}
        />
      </div>
    </div>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#F9FAFB',
        borderRadius: '12px',
      }}
    >
      <Avatar src="https://i.pravatar.cc/150?img=5" size="lg" />
      <div>
        <div style={{ fontWeight: 600, fontSize: '16px', color: '#1F2937' }}>田中太郎</div>
        <div style={{ fontSize: '14px', color: '#6B7280' }}>@tanaka_taro</div>
      </div>
    </div>
  ),
};
