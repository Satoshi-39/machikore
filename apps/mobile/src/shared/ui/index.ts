/**
 * Shared UI コンポーネント エクスポート
 */

export { Loading } from './Loading';
export { ErrorView } from './ErrorView';
export { EmptyState } from './EmptyState';
// Skeleton (react-native-reusables pattern)
export { Skeleton, ProfileSkeleton, type SkeletonProps } from './skeleton';
export {
  MapCardSkeleton,
  SpotCardSkeleton,
  MapListCardSkeleton,
  SpotListCardSkeleton,
  RepeatSkeleton,
  MixedFeedSkeleton,
} from './skeleton';

// Progress (react-native-reusables pattern)
export { Progress, type ProgressProps } from './progress';

// Avatar (react-native-reusables pattern)
export {
  Avatar,
  AvatarFallback,
  AvatarIcon,
  AvatarImage,
  UserAvatar,
} from './avatar';
export { AsyncBoundary } from './AsyncBoundary';
export { ErrorBoundary } from './ErrorBoundary';
export { SingleDataBoundary } from './SingleDataBoundary';
export { FAB } from './FAB';
export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbItem } from './Breadcrumb';
export { SearchBar } from './SearchBar';
export { PopupMenu } from './PopupMenu';
export type { PopupMenuItem } from './PopupMenu';
export { ModalPopupMenu } from './ModalPopupMenu';
export type { ModalPopupMenuItem } from './ModalPopupMenu';
export { PageHeader } from './PageHeader';
export { ImageViewerModal, useImageViewer } from './image-viewer';
export { CommentInput, type CommentInputRef, CommentInputModal } from './comment-input';
export { SwipeableRow } from './SwipeableRow';
export { StyledTextInput, type StyledTextInputProps } from './styled-text-input';

// Input (react-native-reusables pattern)
export { Input, type InputProps } from './input';

// Switch (react-native-reusables pattern)
export { Switch, type SwitchProps } from './switch';

// Separator (react-native-reusables pattern)
export { Separator, type SeparatorProps } from './separator';

// Card (react-native-reusables pattern)
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

// AlertDialog (react-native-reusables pattern)
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

// Select (react-native-reusables pattern)
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type Option as SelectOption,
} from './select';
export { TagInput } from './TagInput';
export { TagChip } from './TagChip';
export { LocationPinIcon, AddressPinIcon } from './icons';
export { UserLocationPuck } from './UserLocationPuck';
export { MapThumbnail } from './MapThumbnail';
export { SpotThumbnail } from './SpotThumbnail';
export { CroppedThumbnail } from './CroppedThumbnail';
export { OptimizedImage } from './OptimizedImage';

// マップレイヤー
export { TransportHubLabels } from './map-layers';

// Toast
export { AppToast } from './AppToast';

// リッチテキストエディタ
export { RichTextEditor } from './rich-text-editor';

// リッチテキストレンダラー（ProseMirror JSONの表示用）
export { RichTextRenderer } from './rich-text-renderer';

// 公開/非公開トグル
export { PublicToggle } from './PublicToggle';

// 非公開バッジ
export { PrivateBadge } from './PrivateBadge';

// スポットカラーピッカー
export { SpotColorPicker } from './SpotColorPicker';

// ラベルピッカー
export { LabelPicker } from './LabelPicker';

// オンボーディング進捗
export { OnboardingProgress, type OnboardingStep } from './OnboardingProgress';

// ボタン
export {
  Button,
  buttonVariants,
  buttonTextVariants,
  LocationButton,
  FitAllButton,
  SelectedLocationButton,
} from './buttons';
export type { ButtonProps, ButtonVariant, ButtonSize } from './buttons';

// テキスト
export { Text } from './text';
export type { TextProps } from './text';

// シート
export {
  ActionSheet,
  type ActionSheetItem,
  PickerSheet,
  type PickerOption,
  SelectField,
} from './sheets';

// ドロップダウン
export { DropdownField, type DropdownOption } from './DropdownField';

// 利用規約・プライバシーポリシー用マークダウンレンダラー
export { TermsMarkdownRenderer } from './TermsMarkdownRenderer';

// 広告
export { AdBanner, MapNativeAdCard, SpotNativeAdCard, ArticleNativeAdCard } from './ad';

// 動画プレーヤー
export { VideoPlayer } from './VideoPlayer';

// アクションボタン（いいね・ブックマークはfeatures層で提供）
export { ExternalMapButton, ShareButton } from './action-buttons';

// 写真グリッド
export { PhotoGrid } from './PhotoGrid';

// 記事編集FAB
export { ArticleFab } from './article-fab';

// チュートリアルツールチップ
export { TutorialTooltip } from './TutorialTooltip';
