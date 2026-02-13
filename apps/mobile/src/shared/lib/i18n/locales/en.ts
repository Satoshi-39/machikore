/**
 * English translation file
 */

export default {
  // Common
  common: {
    save: 'Save',
    saved: 'Saved',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    loading: 'Loading...',
    notFound: 'Data not found',
    error: 'Error',
    success: 'Success',
    retry: 'Retry',
    search: 'Search',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    all: 'All',
    none: 'None',
    more: 'More',
    less: 'Less',
    comment: 'Comment',
    like: 'Like',
    share: 'Share',
    directions: 'Directions',
    details: 'Details',
    google: 'Google',
    post: 'Post',
    user: 'User',
    skip: 'Skip',
    select: 'Select',
    report: 'Report',
    change: 'Change',
  },

  // Tabs
  tabs: {
    home: 'Home',
    discover: 'Discover',
    map: 'Map',
    profile: 'Profile',
  },

  // Authentication
  auth: {
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign Up',
    or: 'or',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUpLink: 'Sign Up',
    signInLink: 'Sign In',
    createAccountTitle: 'Create Account',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    loginRequired: 'Login Required',
    loginRequiredMessage: 'Please log in to use this feature',
    continueWithApple: 'Continue with Apple',
    continueWithGoogle: 'Continue with Google',
    // OTP Auth (Sign In)
    continueWithEmail: 'Continue with Email',
    sendCode: 'Send Code',
    codeSentTo: 'We sent a 6-digit code to\n%{email}',
    authCode: 'Verification Code (6 digits)',
    verify: 'Verify',
    useAnotherEmail: 'Use a different email',
    resendCode: 'Resend Code',
    invalidCode: 'Invalid verification code',
    resendFailed: 'Failed to resend code',
    // OTP Auth (Sign Up)
    signUpWithEmail: 'Sign up with Email',
    sendSignUpCode: 'Send Sign Up Code',
    signUpCodeSentTo: 'We sent a sign up code to %{email}',
    createAccount: 'Create Account',
    emailAlreadyRegistered: 'This email is already registered',
    emailNotRegistered: 'This email is not registered',
    emailPendingDeletion: 'This email is pending deletion and cannot be registered',
    accountPendingDeletion: 'This account is pending deletion and cannot sign in',
    sendCodeFailed: 'Failed to send code',
    rateLimited: 'Please wait a moment and try again',
  },

  // Onboarding
  onboarding: {
    steps: {
      profile: 'Profile Setup',
      demographics: 'About You',
      categories: 'Categories',
    },
    profile: {
      title: 'Profile Setup',
      description: 'Set up your profile',
      username: 'Username',
      usernamePlaceholder: 'user_name',
      usernameHint: 'Only letters, numbers, and underscores allowed',
      displayName: 'Display Name',
      displayNamePlaceholder: 'Your nickname',
      displayNameHint: 'Enter your name or nickname',
      continue: 'Continue',
      usernameRequired: 'Username is required',
      usernameInvalid: 'Username can only contain letters, numbers, and underscores',
      usernameTooShort: 'Username must be at least 3 characters',
      usernameTooLong: 'Username must be 20 characters or less',
      usernameTaken: 'This username is already taken',
      usernameReserved: 'This username is reserved and cannot be used',
      displayNameRequired: 'Display name is required',
    },
    demographics: {
      title: 'About You',
      description: 'Tell us a bit about yourself to help us personalize your experience (optional)',
      gender: 'Gender',
      ageGroup: 'Age Group',
      country: 'Country',
      prefecture: 'Prefecture',
      region: 'State / Region',
      continue: 'Continue',
    },
    categories: {
      title: 'Favorite Categories',
      description: 'Select the categories you are interested in (optional)',
      maxSelection: 'You can select up to {{max}}',
    },
    completion: {
      title: 'All Set!',
      start: 'Get Started',
    },
    terms: {
      appTagline: 'Collect and share your favorite places',
      agreeAndStart: 'Agree & Get Started',
      processing: 'Processing...',
      consentMessage: 'By tapping "Agree & Get Started", you agree to our ',
      termsOfService: 'Terms of Service',
      and: ' and ',
      privacyPolicy: 'Privacy Policy',
      consentSuffix: '.',
      loadingError: 'Failed to load. Please check your internet connection.',
    },
  },

  // Maps
  map: {
    addMap: 'Add Map',
    createMap: 'Create Map',
    editMap: 'Edit Map',
    deleteMap: 'Delete Map',
    mapName: 'Map Name',
    mapDescription: 'Description',
    mapCategory: 'Category',
    mapTags: 'Tags',
    publicMap: 'Public',
    privateMap: 'Private',
    defaultMap: 'Default Map',
    deleteMapConfirm: 'Delete this map?',
    noMaps: 'No maps',
    createFirstMap: 'Create your first map',
    // Create map form
    mapNameRequired: 'Map Name',
    mapNamePlaceholder: 'e.g. Tokyo Cafe Tour',
    descriptionRequired: 'Description',
    descriptionPlaceholder: 'Enter a description for this map',
    categoryRequired: 'Category',
    tags: 'Tags',
    tagsPlaceholder: 'Enter tag and press Enter',
    thumbnail: 'Thumbnail',
    publicDescription: 'When public, other users can view this map',
    creating: 'Creating...',
    // Map selection
    targetMap: 'Add to Map',
    belongingMap: 'Belonging Map',
    noMapSelected: 'No map selected',
    userNotFound: 'User info not available',
    noMapSelectedAlert: 'No map selected',
    createFailed: 'Failed to create map',
    createComplete: 'Created',
    createSuccess: 'Map created',
    mapIdNotFound: 'Map ID not found',
    thumbnailUploadFailed: 'Failed to upload thumbnail',
    updateComplete: 'Updated',
    updateSuccess: 'Map updated',
    updateFailed: 'Failed to update map',
  },

  // Labels
  label: {
    noLabel: 'No Label',
    noLabels: 'No labels available',
    addFromMapSettings: 'Add labels from map settings',
    selectLabel: 'Select label (optional)',
  },

  // Spots
  spot: {
    addSpot: 'Add Spot',
    createSpot: 'Create Spot',
    editSpot: 'Edit Spot',
    deleteSpot: 'Delete Spot',
    spotName: 'Spot Name',
    spotNamePlaceholder: 'e.g., My favorite cafe',
    spotNameHint: 'Enter a name for this spot',
    spotNameRequired: 'Please enter a spot name',
    spotMemo: 'Memo',
    visitDate: 'Visit Date',
    visited: 'Visited',
    notVisited: 'Not Visited',
    deleteSpotConfirm: 'Delete this spot? This cannot be undone.',
    noSpots: 'No spots',
    unknownSpot: 'Unknown Spot',
    noArticle: 'No article yet',
    // Create spot form
    registerSpot: 'Register Spot',
    googlePlacesInfo: 'Info from Google Places',
    currentLocationInfo: 'Register from current location',
    mapPinInfo: 'Selected location on map',
    originalSpotName: 'Original Spot Name',
    oneWord: 'Spot Description',
    oneWordRequired: 'Briefly describe this spot',
    oneWordPlaceholder: 'e.g. Best ramen shop',
    spotSummary: 'Spot Summary',
    summaryPlaceholder: 'Brief description of this spot',
    article: 'Article',
    articleEmpty: 'Create Article',
    articleEntered: 'Article has been entered',
    articleHint: 'This content will be displayed on the article page',
    articleEdit: 'Edit Article',
    articleWrite: 'Write Article',
    articleWriteHint: 'Write more about this spot',
    label: 'Label',
    spotColor: 'Spot Color',
    labelColorNotice: '*Label color takes priority when a label is set',
    visibilitySettings: 'Visibility',
    visibilityDescription: 'When set to private, other users cannot see this spot',
    photos: 'Photos',
    thumbnail: 'Thumbnail',
    thumbnailAdd: 'Add Thumbnail',
    thumbnailNone: 'None',
    thumbnailSelect: 'Select Thumbnail Image',
    thumbnailSelected: 'Selected',
    thumbnailEdit: 'Edit',
    thumbnailNoImages: 'No images',
    thumbnailNoImagesHint: 'Add photos to set a thumbnail',
    thumbnailSelectHint: 'Tap an image below to select',
    thumbnailCurrent: 'Current Thumbnail',
    thumbnailUploaded: 'Uploaded Images',
    registering: 'Registering...',
    registerSpotButton: 'Register Spot',
    // Edit spot
    spotInfo: 'Spot Info',
    existingPhotos: 'Existing Photos',
    newPhotos: 'New Photos to Add',
    totalPhotos: 'Total %{current}/%{max}',
    updating: 'Updating...',
    saveChanges: 'Save Changes',
    spotNotFound: 'Spot not found',
    // Loading
    creatingSpot: 'Creating spot...',
    uploadingImages: 'Uploading images... (%{current}/%{total})',
    processingComplete: 'Processing...',
    updatingSpot: 'Updating spot...',
    deletingImages: 'Deleting images...',
    // Publish/Unpublish
    publish: 'Publish',
    unpublish: 'Unpublish',
    publishing: 'Publishing...',
    unpublishing: 'Unpublishing...',
    publishSuccess: 'Spot published',
    unpublishSuccess: 'Spot unpublished',
    publishError: 'Failed to publish',
    articleRequiredToPublish: 'Write an article to make it public',
    publishNoticeTitle: 'The map will also be published',
    unpublishNoticeTitle: 'The map will also be unpublished',
    draft: 'Draft',
    published: 'Published',
    // Discard draft confirmation
    discardDraftTitle: 'Discard draft?',
    discardDraftMessage: 'Your input and photos will be deleted',
    discardDraft: 'Discard',
    // Unsaved changes
    unsavedChanges: 'Unsaved changes',
    saveBeforeEditingArticle: 'Please save your changes before editing the article',
    discardChangesMessage: 'You have unsaved changes. Discard them?',
    discardChanges: 'Discard',
    // Write article prompt dialog
    writeArticlePromptTitle: 'Write an article?',
    writeArticlePromptMessage: 'Spot registered. Write an article to make it public.',
    writeArticleNow: 'Write',
    writeArticleLater: 'Later',
    // Spot create/edit alerts
    spotUserNotFound: 'User info not available',
    spotCreateFailed: 'Failed to create spot',
    spotIdNotFound: 'Spot ID not found',
    partialUploadWarning: 'Some images failed to upload, but other changes were saved',
    spotUpdateComplete: 'Updated',
    spotUpdateSuccess: 'Spot updated',
    spotUpdateFailed: 'Failed to update spot',
    processingError: 'An error occurred during processing',
  },

  // Favorites & Likes
  favorite: {
    favorite: 'Favorite',
    favorites: 'Favorites',
    addFavorite: 'Add to Favorites',
    removeFavorite: 'Remove from Favorites',
    like: 'Like',
    likes: 'Likes',
    liked: 'Liked',
    likedItems: 'Liked',
    noLikes: 'No liked items',
    spot: 'Spots',
    map: 'Maps',
    noLikedSpots: 'No liked spots',
    noLikedMaps: 'No liked maps',
    unknownSpot: 'Unknown Spot',
    userPost: 'Post by %{name}',
    spotsCount: '%{count} Spots',
    spots: 'Spots',
    maps: 'Maps',
  },

  // Collections
  collection: {
    collection: 'Collection',
    collections: 'Collection List',
    createNew: 'New',
    noCollections: 'No collections',
    // Create collection
    newCollection: 'New Collection',
    collectionName: 'Collection Name',
    collectionNamePlaceholder: 'e.g. Tokyo Cafe Collection',
    descriptionOptional: 'Description',
    descriptionPlaceholder: 'Enter a description...',
    thumbnail: 'Thumbnail',
    publicDescription: 'When enabled, other users can view this collection',
    createHint: 'After creating the collection, you can add maps',
    creating: 'Creating...',
    create: 'Create',
    // Edit collection
    editCollection: 'Edit Collection',
    collectionNotFound: 'Collection not found',
    manageMaps: 'Manage Maps',
    itemsCount: '%{count}',
    // Collection detail
    mapsCount: '%{count} Maps',
    private: 'Private',
    mapList: 'Map List',
    noMaps: 'No maps yet',
    edit: 'Edit',
    anonymous: 'Anonymous',
    notFound: 'Collection not found',
    // Delete collection
    deleteTitle: 'Delete Collection',
    deleteMessage: 'Delete this collection?',
    // Empty state
    emptyTitle: 'Collections',
    emptyDescriptionOwner: 'Organize maps by theme',
    emptyDescriptionOther: 'No collections created',
    loadingMessage: 'Loading collections...',
  },

  // Bookmarks
  bookmark: {
    bookmark: 'Bookmark',
    bookmarks: 'Bookmarks',
    loginRequired: 'Please log in',
    noBookmarks: 'No bookmarks',
    noSpotBookmarks: 'No spot bookmarks',
    noMapBookmarks: 'No map bookmarks',
    spots: 'Spots',
    maps: 'Maps',
    createFolder: 'Create new folder',
    watchLater: 'Watch Later',
    itemCount: '%{count}',
    deleteFolder: 'Delete Folder',
    deleteFolderMessage: 'Delete "%{name}"?\nBookmarks in this folder will be moved to "Watch Later".',
    editFolderName: 'Edit folder name',
    folderName: 'Folder name',
    // Create folder modal
    newFolder: 'New Folder',
    folderNamePlaceholder: 'Folder name',
    create: 'Create',
    folder: 'Folder',
    // Select folder modal
    selectSpotFolder: 'Select destination for spot',
    selectMapFolder: 'Select destination for map',
    added: 'Added',
    add: 'Add',
    createNewFolder: 'Create new folder',
    save: 'Save',
    saved: 'Saved',
  },

  // Comments
  comment: {
    comment: 'Comment',
    comments: 'Comments',
    addComment: 'Add Comment',
    addPlaceholder: 'Add a comment...',
    writeComment: 'Write a comment...',
    deleteComment: 'Delete Comment',
    noComments: 'No comments yet',
    deleteConfirmTitle: 'Delete Comment',
    deleteConfirmMessage: 'Delete this comment?',
    edit: 'Edit',
    delete: 'Delete',
    reply: 'Reply',
    showReplies: 'Show %{count} replies',
    hideReplies: 'Hide replies',
    backToComments: 'Back to comments',
    defaultUser: 'User',
    enterComment: 'Enter comment...',
    enterReply: 'Enter reply...',
    replyToUser: 'Reply to %{name}...',
    replyingTo: 'Replying to %{name}',
    composingReply: 'Composing reply',
    editComment: 'Edit comment',
    viewAllComments: 'View all %{count} comments',
    loginRequired: 'Log in to comment...',
  },

  // View History
  viewHistory: {
    title: 'Recently Viewed Maps',
    loginRequired: 'Log in to see your viewing history',
    empty: 'No viewing history yet',
  },

  // Profile
  profile: {
    profile: 'Profile',
    editProfile: 'Edit Profile',
    username: 'Username',
    usernameCannotChange: 'Username cannot be changed',
    displayName: 'Display Name',
    displayNamePlaceholder: 'Enter display name',
    bio: 'Bio',
    bioPlaceholder: 'Enter your bio',
    tapToChangePhoto: 'Tap to change photo',
    followers: 'Followers',
    following: 'Following',
    follow: 'Follow',
    unfollow: 'Unfollow',
    posts: 'Posts',
    maps: 'Maps',
    bookmarks: 'Bookmarks',
    photoPermissionRequired: 'Permission Required',
    photoPermissionMessage: 'Please allow access to your photo library to select an image.',
    profileSaved: 'Saved',
    profileSavedMessage: 'Your profile has been updated.',
    profileSaveError: 'Failed to save profile.',
    usernamePlaceholder: 'Enter username',
    usernameHint: 'Only letters, numbers and underscores (_) allowed',
    usernameRequired: 'Please enter a username',
    usernameTooShort: 'Username must be at least 3 characters',
    usernameTooLong: 'Username must be 20 characters or less',
    usernameInvalid: 'Only letters, numbers and underscores (_) allowed',
    usernameTaken: 'This username is already taken',
    usernameReserved: 'This username is reserved and cannot be used',
    basicInfo: 'Basic Info',
    demographicInfo: 'Demographics',
    gender: 'Gender',
    ageGroup: 'Age Group',
    country: 'Country',
    prefecture: 'Prefecture',
    region: 'Region',
    interests: 'Interests',
    interestsDescription: 'Select up to {{max}} categories you are interested in',
    usernameChangeWarning: '*Changing your username will invalidate shared links',
  },

  // Settings
  settings: {
    settings: 'Settings',
    account: 'Account',
    editProfile: 'Edit Profile',
    changeEmail: 'Change Email',
    changePassword: 'Change Password',
    premium: 'Premium',
    premiumPlan: 'Premium Plan',
    subscribed: 'Subscribed',
    notifications: 'Notifications',
    notificationSettings: 'Notification Settings',
    privacy: 'Privacy',
    publicScope: 'Public Scope',
    blockedUsers: 'Blocked Users',
    language: 'Language',
    darkMode: 'Dark Mode',
    appearance: 'Appearance',
    theme: 'Theme',
    lightMode: 'Light Mode',
    systemDefault: 'Use Device Setting',
    other: 'Other',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    help: 'Help',
    support: 'Contact Us',
    about: 'About',
    version: 'Version',
    accountActions: 'Account Actions',
    signOut: 'Sign Out',
    signOutConfirm: 'Are you sure you want to sign out?',
    deleteAccount: 'Delete Account',
    // Account Settings
    accountSettings: 'Account Settings',
    socialConnections: 'Social Connections',
    notConnected: 'Not connected',
    accountInfo: 'Account Info',
    email: 'Email',
    username: 'Username',
    usernameSaved: 'Username saved',
    accountManagement: 'Account Management',
    deleteAccountProcedure: 'Delete Account',
    deleteAccountPage: {
      title: 'Delete Account',
      description: 'Deleting your account will permanently remove all your data. This action cannot be undone.',
      whatWillBeDeleted: 'All of the following data will be deleted',
      item1: 'Profile information',
      item2: 'Maps and spots you created',
      item3: 'Likes, comments, and bookmarks',
      item4: 'Followers and following',
      reasonLabel: 'Reason for leaving (optional)',
      reasonPlaceholder: 'Please tell us why you are leaving',
      confirmTitle: 'Confirm Account Deletion',
      confirmMessage: 'Are you sure you want to delete your account?\nAll data will be permanently deleted.',
      confirm: 'Delete Account',
    },
    comingSoon: 'Coming Soon',
    comingSoonMessage: 'This feature is coming soon.',
    effectiveDate: 'Effective %{date}',
    termsLoadError: 'Failed to load.\nPlease check your internet connection.',
    termsNotFound: 'Document not found',
    // Legal
    legal: 'Legal',
    dataSources: 'Data Sources',
    openSourceLicenses: 'Open Source Licenses',
    searchLicenses: 'Search libraries',
    openSourceLicensesDescription: 'This app uses the following open source software. Tap to open the repository.',
    // Attributions
    attributions: 'Data Sources',
    attributionsDescription: 'This service uses the following data sources. Tap each item to view more details.',
    mapData: 'Map Data',
    statisticalData: 'Statistical Data',
    externalApi: 'External APIs',
    // Cache
    clearCache: 'Clear Cache',
    clearCacheConfirm: 'Clear cache?',
    clearCacheDescription: 'This will delete temporarily stored data. Data will be fetched again after clearing.',
    clearCacheSuccess: 'Cache cleared',
    // Developer menu
    devMenu: 'Developer Menu',
    resetOnboarding: 'Reset Onboarding',
    resetOnboardingDescription:
      'This will reset terms consent and sign out. The onboarding screen will appear after restart.',
    reset: 'Reset',
    resetComplete: 'Done',
    resetCompleteMessage: 'Please restart the app',
    // Language settings
    displayLanguage: 'Display Language',
    displayLanguageDescription: 'Change in device settings',
    displayLanguageHint: 'You can change the display language in your device settings.',
    contentLanguage: 'Content Language',
    contentLanguageHint: 'Only content in the selected languages will be shown.',
    addOtherLanguages: 'Add other languages',
    hideOtherLanguages: 'Hide other languages',
    contentLanguageHintAll: 'No languages selected, so all content will be shown.',
    loginRequiredForContentLanguage: 'Please log in to save content language settings.',
    openSettingsErrorIOS: 'Could not open Settings. Please go to Settings > Apps > Machikore > Language manually.',
    openSettingsErrorAndroid: 'Could not open Settings. Please go to Settings > Apps > Machikore > Language manually.',
  },

  // Search
  search: {
    search: 'Search',
    searchPlaces: 'Search places',
    searchUsers: 'Search users',
    searchMaps: 'Search maps',
    recentSearches: 'Recent searches',
    noResults: 'No results found',
    noSearchHistory: 'No search history',
    clearAll: 'Clear all',
    showMore: 'Show more',
    searchAndRegister: 'Search and register',
    registerCurrentLocation: 'Register current location',
    pinOnMap: 'Pin on map',
    searching: 'Searching...',
    loadingDetails: 'Loading place details...',
    searchFailed: 'Search failed. Please try again.',
    noResultsFor: 'No results found for "%{query}"',
    resultsFor: 'Results for "%{query}" (%{count})',
    locationUnavailable: 'Location unavailable',
    checkLocationPermission: 'Please check your location permissions',
    noUsersFound: 'No users found',
  },

  // Filters
  filter: {
    filter: 'Filter',
    sortBy: 'Sort by',
    newest: 'Newest',
    popular: 'Popular',
    nearby: 'Nearby',
    category: 'Category',
    region: 'Region',
    prefecture: 'Prefecture',
    reset: 'Reset',
    city: 'City',
    period: 'Period',
    apply: 'Apply',
    selectPrefecture: 'Select Prefecture',
    selectCity: 'Select City',
    selectPeriod: 'Select Period',
    allPrefectures: 'All Prefectures',
    allCities: 'All Cities',
    allOption: 'All',
    allPeriods: 'All Periods',
    within24h: 'Within 24 hours',
    within1Week: 'Within 1 week',
    within1Month: 'Within 1 month',
    byLikes: 'Most Liked',
  },

  // Categories
  category: {
    gourmet: 'Gourmet',
    shopping: 'Shopping',
    tourism: 'Tourism',
    culture: 'Culture / History',
    entertainment: 'Entertainment',
    activity: 'Activity / Experience',
    lifestyle: 'Lifestyle / Local',
    learning: 'Learning / Education',
    other: 'Other',
  },

  // Error (ErrorBoundary, initialization, etc.)
  error: {
    unexpectedError: 'An unexpected error occurred',
    pleaseReopen: 'Please try reopening the app after a while.',
    initError: 'Initialization Error',
  },

  // Error messages
  errors: {
    networkError: 'Network error occurred',
    unknownError: 'An unexpected error occurred',
    loadFailed: 'Failed to load data',
    saveFailed: 'Failed to save',
    deleteFailed: 'Failed to delete',
    permissionDenied: 'Permission denied',
    notFound: 'Not found',
  },

  // Success messages
  success: {
    saved: 'Saved',
    deleted: 'Deleted',
    copied: 'Copied',
    posted: 'Posted',
  },

  // Confirmation dialogs
  confirm: {
    deleteTitle: 'Confirm Delete',
    deleteMessage: 'Are you sure you want to delete? This cannot be undone.',
    logoutTitle: 'Logout',
    logoutMessage: 'Are you sure you want to logout?',
    unsavedChanges: 'Unsaved Changes',
    unsavedChangesMessage: 'Close without saving?',
  },

  // Location
  location: {
    currentLocation: 'Current Location',
    getLocation: 'Get Location',
    locationPermission: 'Location Permission',
    locationPermissionMessage: 'Location permission is required for this feature',
    directions: 'Directions',
    openInMaps: 'Open in Maps',
    earth: 'Earth',
  },

  // Images
  image: {
    addPhoto: 'Add Photo',
    takePhoto: 'Take Photo',
    chooseFromLibrary: 'Choose from Library',
    deletePhoto: 'Delete Photo',
  },

  // Empty states
  empty: {
    noData: 'No data',
    noContent: 'No content',
    noMaps: 'No maps',
    noSpots: 'No spots',
    noFollowers: 'No followers yet',
    noFollowing: 'Not following anyone yet',
    noNotifications: 'No notifications',
    noAnnouncements: 'No announcements',
    noMapsYet: 'No maps created yet',
    noFollowingUsers: 'Not following anyone',
    noFollowingMaps: 'No maps from followed users',
  },

  // Feed
  feed: {
    tabs: {
      recommended: 'Recommended',
      following: 'Following',
    },
    sections: {
      spot: 'Spots',
      short: 'Shorts',
    },
  },

  // Notifications
  notification: {
    notifications: 'Notifications',
    announcements: 'Announcements',
    markAllRead: 'Mark all as read',
    likedYourSpot: '%{name} liked your spot "%{target}"',
    likedYourMap: '%{name} liked your map "%{target}"',
    commentedOnYourSpot: '%{name} commented on your spot "%{target}"',
    commentedOnYourMap: '%{name} commented on your map "%{target}"',
    repliedOnYourSpot: '%{name} replied to you on spot "%{target}"',
    repliedOnYourMap: '%{name} replied to you on map "%{target}"',
    followedYou: '%{name} followed you',
    newNotification: 'You have a new notification',
    like: 'Like',
    comment: 'Comment',
    reply: 'Reply',
    follow: 'Follow',
    system: 'Announcement',
    // Notification settings
    notificationSettings: 'Notification Settings',
    pushNotification: 'Push Notifications',
    emailNotification: 'Email Notifications',
    receivePushNotifications: 'Receive push notifications',
    receiveEmailNotifications: 'Receive email notifications',
    pushDisabledDescription: 'When off, you will not receive any push notifications',
    emailDisabledDescription: 'When off, you will not receive any email notifications',
    notificationTypes: 'Notification Types',
    pushDisabledNotice: 'Cannot change while push notifications are off',
    emailDisabledNotice: 'Cannot change while email notifications are off',
    likeNotification: 'Likes',
    likeNotificationDescription: 'When someone likes your post',
    commentNotification: 'Comments',
    commentNotificationDescription: 'When someone comments on your post',
    followNotification: 'Follows',
    followNotificationDescription: 'When someone follows you',
    systemNotification: 'Announcements',
    systemNotificationDescription: 'Announcements from the team',
    loadError: 'Failed to load settings',
    // OS permission required
    permissionRequired: 'Turn on notifications?',
    permissionRequiredDescription: 'To receive notifications, please allow notifications in iOS Settings. We\'ll notify you about likes, comments, follows and more.',
    openSettings: 'Open Settings',
  },

  // Relative time
  time: {
    justNow: 'Just now',
    minutesAgo: '%{count}m ago',
    hoursAgo: '%{count}h ago',
    daysAgo: '%{count}d ago',
    weeksAgo: '%{count}w ago',
    monthsAgo: '%{count}mo ago',
    yearsAgo: '%{count}y ago',
  },

  // Discover
  discover: {
    searchPlaceholder: 'Search spots, maps, users',
    searchFor: 'Search for "%{query}"',
    users: 'Users',
    latest: 'Latest',
    trending: 'Trending',
    spots: 'Spots',
    maps: 'Maps',
    noTrendingPosts: 'No trending posts',
    noSpotsFound: 'No spots found',
    noMapsFound: 'No maps found',
    noUsersFound: 'No users found',
    noSearchResults: 'No search results',
    recommended: 'Recommended',
  },

  // Sections
  section: {
    todaysPicks: "Today's Picks",
    popularRanking: 'Popular Map Ranking',
    latestInCategory: 'Latest in %{category}',
    popularInCategory: 'Popular in %{category}',
    featuredInCategory: 'Featured in %{category}',
    recentlyViewed: 'Recently Viewed',
    searchByArea: 'Browse by Area',
    searchOverseas: 'Browse Overseas',
    searchByTag: 'Search by Tag',
    searchByPrefecture: 'Browse by Prefecture',
    noTodayPicks: "No today's picks",
    noPopularMaps: 'No popular maps',
    noPrefectureData: 'No prefecture data',
    noCountryData: 'No country data',
  },

  // My Page
  mypage: {
    myPage: 'My Page',
    editProfile: 'Edit Profile',
    loadingMaps: 'Loading maps...',
    deleteMapConfirmDetail: 'Delete this map? All related spots will also be deleted. This cannot be undone.',
    report: 'Report',
    defaultUser: 'User',
  },

  // Create menu
  create: {
    map: 'Map',
    spot: 'Spot',
    collection: 'Collection',
  },

  // Areas
  area: {
    tokyo: 'Tokyo',
    osaka: 'Osaka',
    kyoto: 'Kyoto',
    kanagawa: 'Kanagawa',
    aichi: 'Aichi',
    fukuoka: 'Fukuoka',
    hokkaido: 'Hokkaido',
    hyogo: 'Hyogo',
  },

  // Edit Map
  editMap: {
    title: 'Edit Map',
    notFound: 'Map not found',
    mapInfo: 'Map Info',
    spots: 'Spots',
    likes: 'Likes',
    createdAt: 'Created',
    mapNameLabel: 'Map Name',
    mapNamePlaceholder: 'e.g. Tokyo Cafe Tour',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Enter a description for this map',
    categoryLabel: 'Category',
    labelLabel: 'Labels',
    showLabelChips: 'Show Label Chips',
    showLabelChipsDescription: 'Display labels at the top of the map for filtering spots',
    showLabelChipsNoLabels: 'Add labels to enable this feature',
    tagsLabel: 'Tags',
    tagsPlaceholder: 'Enter tag and press Enter',
    thumbnailLabel: 'Thumbnail',
    publicDescription: 'Anyone can view this map',
    privateDescription: 'Only you can view this map',
    publicSpotsRequiredToPublish: 'Publish at least one spot to make this map public',
    updating: 'Updating...',
    saveChanges: 'Save Changes',
    required: '*',
  },

  // Article
  article: {
    article: 'Article',
    notFound: 'Article not found',
    private: 'This article is private',
    viewMap: 'View Map',
    editArticle: 'Edit Article',
    editMap: 'Edit Map',
    // Article page additions
    tableOfContents: 'Table of Contents',
    intro: 'Introduction',
    outro: 'Closing',
    noDescription: 'No article yet',
    spotsCount: '%{count} Spots',
    noSpots: 'No spots yet',
    createSpot: 'Create Spot',
    unknownSpot: 'Unknown Spot',
    authorOtherMaps: 'Other Maps by This Author',
    comment: 'Comments',
    addComment: 'Add a comment...',
    noComments: 'No comments yet',
    viewAllComments: 'View all %{count} comments',
    likesCount: '%{count} likes',
    loadError: 'Failed to load',
    searchByTag: 'Search by Tag',
    featuredInCategory: 'Featured in %{category}',
    latestInCategory: 'Latest in %{category}',
    editSpot: 'Edit Spot',
    editSpotArticle: 'Edit Article',
  },

  // Menu (three-dot menu)
  menu: {
    edit: 'Edit',
    delete: 'Delete',
    share: 'Share',
    report: 'Report',
    viewMap: 'View Map',
    viewArticle: 'View Article',
    copyLink: 'Copy Link',
    blockUser: 'Block',
    unblockUser: 'Unblock',
  },

  // Auth required
  authRequired: {
    loginRequiredAction: 'Please log in to %{action}',
  },

  // Schedule
  schedule: {
    title: 'Schedule',
    dateSchedule: 'Schedule for %{month}/%{day}',
    noSchedule: 'No scheduled plans',
    comingSoon: 'Schedule feature coming soon',
    newSchedule: 'New Schedule',
    create: 'Create',
    titleLabel: 'Title',
    titlePlaceholder: 'e.g. Lunch in Shinjuku',
    scheduledDate: 'Scheduled Date',
    dateFormat: 'Format: YYYY-MM-DD (e.g. 2024-12-31)',
    memoOptional: 'Memo (optional)',
    memoPlaceholder: 'Enter details or notes...',
    machiSelected: 'Town selected',
    selectMachi: 'Select town (optional)',
  },

  // Post
  post: {
    newPost: 'New Post',
    placeholder: 'Where did you go today?',
    remainingChars: '%{count} characters remaining',
    machiSelected: 'Town selected',
    selectMachi: 'Select town (optional)',
  },

  // Map Card
  mapCard: {
    deleteTitle: 'Delete Map',
    deleteMessage: 'Delete this map and all its spots? This cannot be undone.',
    defaultUser: 'User',
    viewMap: 'View map',
    comments: '{{count}} comments',
    share: 'Share',
  },

  // Spot Card
  spotCard: {
    deleteTitle: 'Delete Spot',
    deleteMessage: 'Delete this spot? This cannot be undone.',
    unknownSpot: 'Unknown Spot',
    defaultUser: 'User',
    article: 'Article',
    viewOnMap: 'View on map',
    comments: '{{count}} comments',
    share: 'Share',
  },

  // Public/Private Toggle
  publicToggle: {
    public: 'Public',
    private: 'Private',
    publicStatus: 'Public',
    privateStatus: 'Private',
  },

  // Category Page
  categoryPage: {
    tagsTitle: '%{category} Tags',
    noTags: 'No tags',
    noMapsForTag: 'No maps for #%{tag}',
    selectTag: 'Select a tag',
  },

  // Add Maps to Collection
  addMapsToCollection: {
    title: 'Manage Maps',
    addTo: 'Add to:',
    tapToToggle: 'Tap to add/remove maps',
    spotsCount: '%{count} spots',
    noMaps: 'No maps\nPlease create a map first',
    createMap: 'Create Map',
  },

  // Prefecture Spots List
  prefectureSpots: {
    spotList: 'Spot List',
    missingParams: 'Missing parameters',
    prefectureSpotsTitle: 'Spots in %{prefecture}',
    noPrefectureSpots: 'No spots in %{prefecture} yet',
    noCategoryPrefectureSpots: 'No %{category} spots in %{prefecture} yet',
    loadError: 'Failed to load',
  },

  // User Map
  userMap: {
    usersMap: "%{name}'s Map",
    selectMap: 'Select Map',
    mapInfo: 'Map Info',
    spotList: 'Spots',
    noSpots: 'No spots yet',
  },

  // Edit Article
  editArticle: {
    title: 'Edit Article',
    notFound: 'Article not found',
    noPermission: 'No edit permission',
    publicToggleError: 'Failed to change publish setting',
    intro: 'Introduction',
    writeIntro: 'Tap to write introduction',
    editIntro: 'Edit Introduction',
    outro: 'Conclusion',
    writeOutro: 'Tap to write conclusion',
    editOutro: 'Edit Conclusion',
    noSpots: 'No spots yet',
    writeDescription: 'Tap to write description',
    charCount: '%{count} chars',
    saved: 'Saved',
    saveError: 'Failed to save',
    discardTitle: 'Discard changes?',
    discardMessage: 'You have unsaved changes.',
    discard: 'Discard',
    spotNotFound: 'Spot not found',
    mapNotFound: 'Map not found',
    descriptionPlaceholder: 'Describe this spot in one line...',
  },

  // Create Spot Method
  createSpotMethod: {
    title: 'Add Spot',
    selectMap: 'Target Map',
    selectMapPlaceholder: 'Select a map',
    createNewMap: 'Create new map',
    createNewMapHint: 'Please create a new map',
    searchMethod: 'Search and register',
    searchMethodDesc: 'Search by place name or address',
    currentLocationMethod: 'Register current location',
    currentLocationMethodDesc: 'Add your current location as a spot',
    pinDropMethod: 'Drop a pin on the map',
    pinDropMethodDesc: 'Choose a location on the map',
    fetchingLocation: 'Getting current location...',
    locationError: 'Failed to get current location',
    selectMapFirst: 'Please select a map first',
  },

  // Permissions
  permissions: {
    pushNotification: {
      title: 'Enable Notifications?',
      message: "We'll notify you when someone likes or comments on your posts.",
      accept: 'Allow',
      later: 'Later',
    },
  },

  // Spot colors
  spotColor: {
    pink: 'Pink',
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    blue: 'Blue',
    purple: 'Purple',
    gray: 'Gray',
    white: 'White',
  },

  // Location types
  locationType: {
    country: 'Country',
    region: 'Region',
    prefecture: 'Prefecture',
    city: 'City',
    machi: 'Town',
    spot: 'Spot',
  },

  // Pin drop
  pinDrop: {
    dragToAdjust: 'Drag the map to adjust pin position',
    registerHere: 'Register at this location',
  },

  // Default map search
  defaultMapSearch: {
    placeholder: 'Search towns & spots',
    title: 'Search towns & spots',
    description: 'Search for registered towns and spots posted by users',
  },

  // Content language names
  contentLanguageName: {
    ja: 'Japanese',
    en: 'English',
    zh: 'Chinese',
    ko: 'Korean',
  },

  // Gender
  gender: {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  },

  // Age group
  ageGroup: {
    '10s': 'Teens',
    '20s': '20s',
    '30s': '30s',
    '40s': '40s',
    '50s': '50s',
    '60s+': '60+',
  },

  // Map categories
  mapCategory: {
    travel: 'Travel',
    gourmet: 'Gourmet',
    tourism: 'Tourism',
    shopping: 'Shopping',
    activity: 'Activity',
    other: 'Other',
  },

  // Action sheet
  actionSheet: {
    menu: 'Menu',
  },

  // Image picker
  imagePicker: {
    permissionRequired: 'Permission Required',
    cameraPermission: 'Please allow camera access in Settings to use the camera.',
    libraryPermission: 'Please allow photo library access in Settings to select photos.',
    openSettings: 'Open Settings',
    addImage: 'Add Image',
    takePhoto: 'Take Photo',
    chooseFromLibrary: 'Choose from Library',
    limitReached: 'Limit Reached',
    limitMessage: 'You can add up to %{max} photos per spot',
    uploadError: 'Failed to upload image',
    processError: 'Failed to process image',
    spotNotFound: 'Spot info not available',
    selectionError: 'Failed to select image',
    conversionError: 'Image Conversion Error',
    conversionErrorMessage:
      'Failed to process %{count} image(s). Please select different images.',
    cameraNotAvailable: 'Camera Not Available',
    cameraNotAvailableMessage:
      'Camera is not available on the simulator. Please choose from the library.',
    photoLimitReached: 'Photo Limit Reached',
    photoLimitUpgradeMessage:
      'Your current plan allows up to %{freeLimit} photos.\nUpgrade to Premium for up to %{premiumLimit} photos.',
    upgradeToPremium: 'Upgrade to Premium',
    maxPhotos: 'Max %{max}',
    addPhoto: 'Add Photo',
    photoCount: '%{current}/%{max}',
    addThumbnail: 'Add Thumbnail',
    imageLoadError: 'Failed to load image',
  },

  // Video picker
  videoPicker: {
    libraryPermission:
      'Please allow photo library access in Settings to select videos.',
    selectionError: 'Failed to select video',
    tooLong: 'Video Too Long',
    tooLongMessage:
      'Please select a video under %{max} seconds.\nSelected video: %{duration} seconds',
    addVideo: 'Add Video',
    addShortVideo: 'Add Short Video',
    maxVideos: 'Max %{max}',
    videoCount: '%{current}/%{max} (max %{maxDuration}s)',
  },

  // Block
  block: {
    action: 'Block',
    noBlockedUsers: 'No blocked users',
    confirmTitle: 'Confirm Block',
    confirmMessage: 'Block this user?\n\nBlocking will hide their content from your feed and comments. Mutual follows will be removed.',
    blockButton: 'Block',
    blocked: 'Blocked',
    blockFailed: 'Failed to block',
    unblocked: 'Unblocked',
    unblockFailed: 'Failed to unblock',
  },

  // Usage limits
  usageLimit: {
    spotLimitTitle: 'Spot Limit Reached',
    spotLimitMessage: 'You can add up to %{limit} spots per map.\nPlease delete existing spots or add to a new map.',
    spotLimitUpgradeMessage: 'You can add up to %{limit} spots per map.\nUpgrade to Premium for up to %{premiumLimit} spots.',
    bookmarkLimitTitle: 'Bookmark Limit Reached',
    bookmarkUncategorizedMessage: 'You can save up to %{limit} items in "Watch Later".\nPlease organize your existing bookmarks.',
    bookmarkUncategorizedUpgradeMessage: 'You can save up to %{limit} items in "Watch Later".\nUpgrade to Premium for up to %{premiumLimit} items.',
    bookmarkPerFolderMessage: 'You can save up to %{limit} items per folder.\nPlease organize your bookmarks or add to another folder.',
    bookmarkPerFolderUpgradeMessage: 'You can save up to %{limit} items per folder.\nUpgrade to Premium for up to %{premiumLimit} items.',
    folderLimitTitle: 'Folder Limit Reached',
    folderLimitMessage: 'You can create up to %{limit} folders.\nPlease delete existing folders.',
    folderLimitUpgradeMessage: 'You can create up to %{limit} folders.\nUpgrade to Premium for up to %{premiumLimit} folders.',
    collectionLimitTitle: 'Collection Limit Reached',
    collectionLimitMessage: 'You can create up to %{limit} collections.\nPlease delete existing collections.',
    collectionLimitUpgradeMessage: 'You can create up to %{limit} collections.\nUpgrade to Premium for up to %{premiumLimit} collections.',
    cannotDeleteFolder: 'Cannot Delete Folder',
    cannotDeleteFolderMessage: '"Watch Later" would exceed the limit (%{limit}).\nPlease organize your bookmarks first.',
    cannotDeleteFolderUpgradeMessage: '"Watch Later" would exceed the limit (%{limit}).\nUpgrade to Premium for up to %{premiumLimit} items to enable deletion.',
    close: 'Close',
    upgrade: 'Upgrade',
  },

  // Toast notifications
  toast: {
    followed: 'Followed',
    followFailed: 'Failed to follow',
    unfollowed: 'Unfollowed',
    unfollowFailed: 'Failed to unfollow',
    bookmarkSaved: 'Saved',
    bookmarkRemoved: 'Removed from saved',
    bookmarkRemoveFailed: 'Failed to remove bookmark',
    commentPosted: 'Comment posted',
    commentPostFailed: 'Failed to post comment',
    commentEdited: 'Comment edited',
    commentEditFailed: 'Failed to edit comment',
    commentDeleted: 'Comment deleted',
    commentDeleteFailed: 'Failed to delete comment',
    replyPosted: 'Reply posted',
    replyPostFailed: 'Failed to post reply',
    collectionCreated: 'Collection created',
    collectionCreateFailed: 'Failed to create collection',
    collectionUpdated: 'Collection updated',
    collectionUpdateFailed: 'Failed to update collection',
    collectionDeleted: 'Collection deleted',
    collectionDeleteFailed: 'Failed to delete collection',
    collectionAdded: 'Added to collection',
    collectionAddFailed: 'Failed to add to collection',
    collectionRemoved: 'Removed from collection',
    collectionRemoveFailed: 'Failed to remove from collection',
    likeFailed: 'Failed to like',
    visitUpdateFailed: 'Failed to update visit status',
    visitAdded: 'Marked as visited',
    visitRemoved: 'Marked as not visited',
    favoriteAdded: 'Added to favorites',
    favoriteAddFailed: 'Failed to add to favorites',
    favoriteRemoved: 'Removed from favorites',
    favoriteRemoveFailed: 'Failed to remove from favorites',
    bookmarkSaveFailed: 'Failed to save',
    bookmarkLimitReached: 'Bookmark limit reached',
  },

  // Edit article alert
  editArticleAlert: {
    saveFailed: 'Failed to save',
  },

  // Visit
  visit: {
    visited: 'Visited',
    markVisited: 'Mark as Visited',
    undo: 'Undo',
    notVisitedYet: 'Not visited yet',
    visitMachi: 'Visit',
  },

  // Machi detail
  machi: {
    detail: 'Town Detail',
    detailComingSoon: 'Town detail information coming soon',
    popularSpots: 'Popular Spots',
    noSpotsInMachi: 'No spots registered in this town yet',
    loadingInfo: 'Loading info...',
    exploreArea: 'Explore the town of %{name}.',
    wikipedia: 'Wikipedia',
  },

  // Region detail
  region: {
    prefectureList: 'Prefectures',
    noPrefectures: 'No prefectures registered in this region',
    exploreArea: 'Select a prefecture in %{name} to explore cities and towns.',
  },

  // Prefecture detail
  prefecture: {
    cityList: 'Cities',
    noCities: 'No cities registered in this prefecture',
    exploreCities: 'Select a city in %{name} to explore towns.',
  },

  // Country detail
  country: {
    regionList: 'Regions',
    exploreRegions: 'Select a region to explore prefectures.',
  },

  // City detail
  city: {
    machiList: 'Towns in this city',
    noMachis: 'No towns registered in this city',
    exploreMachis: 'Explore the towns of %{name}.',
  },

  // Master spot detail
  masterSpot: {
    post: 'Post',
    favorite: 'Favorite',
    userPostsCount: 'User Posts (%{count})',
    noPostsYet: 'No posts yet',
  },

  // Alert dialogs
  alert: {
    alreadyRegistered: 'Already Registered',
    alreadyRegisteredMessage: 'This spot is already registered in this map. Would you like to edit it?',
    editButton: 'Edit',
    fetchDetailsFailed: 'Failed to load place details',
  },

  // Hierarchy
  hierarchy: {
    home: 'Home',
    loadingData: 'Loading data...',
    noData: 'No data',
    searchSpots: 'Search spots',
    itemCount: '%{count}',
  },

  // Default map
  defaultMap: {
    appName: 'Machikore',
  },

  // Calendar
  calendar: {
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    yearMonth: '%{month} %{year}',
  },

  // Spot feed
  spotFeed: {
    noSpotsYet: 'No spots yet',
  },

  // User map list
  userMapList: {
    searchAndRegister: 'Search and register',
    listView: 'List view (coming soon)',
  },

  // Other map search
  otherMapSearch: {
    searchMapSpots: 'Search spots in this map',
  },

  // Map label management
  mapLabel: {
    heading: 'Labels',
    add: 'Add',
    badgeNew: '(New)',
    badgeModified: '(Modified)',
    empty: 'No labels',
    newLabel: 'New Label',
    editLabel: 'Edit Label',
    labelName: 'Label Name',
    labelNamePlaceholder: 'Label name',
    color: 'Color',
    duplicateError: 'A label with this name already exists',
    emptyNameError: 'Please enter a label name',
  },

  // Quick search filters
  quickSearch: {
    visited: 'Visited',
    notVisited: 'Not Visited',
    favorite: 'Favorite',
    tourism: 'Tourism',
    shopping: 'Shopping',
    station: 'Station',
  },

  // Filter buttons (map & machi shared)
  filterButton: {
    nearby: 'Nearby',
    visited: 'Visited',
    favorite: 'Favorite',
    recommended: 'Recommended',
  },

  // Edit profile
  editProfile: {
    imageLoadError: 'Failed to load image',
  },

  // Edit article (insert menu)
  insertMenu: {
    insert: 'Insert',
    insertImage: 'Insert Image',
    addPhoto: 'Add Photo',
    embed: 'Embed',
    uploadedImages: 'Uploaded Images',
    noImages: 'No images',
    noImagesHint: 'Add images from the spot edit page',
    enterEmbedUrl: 'Enter the URL to embed',
    supportedServices: 'Supported: YouTube, X(Twitter), Instagram, and other URLs',
    embedButton: 'Embed',
    invalidUrl: 'Invalid URL',
    invalidUrlMessage: 'Please enter a valid URL',
    insertMap: 'Insert Map',
    insertMapDescription: 'Insert your map as a card',
    insertSpot: 'Insert Spot',
    insertSpotDescription: 'Insert your spot as a card',
    selectMap: 'Select Map',
    selectSpot: 'Select Spot',
    noMaps: 'No maps',
    noMapsHint: 'Create a map from your profile',
    noSpots: 'No spots',
    noSpotsHint: 'Add spots to this map',
    spotCount: '%{count} spots',
  },

  // Paywall
  paywall: {
    // Table headers
    tableFeature: 'Feature',
    tableFree: 'Free',
    tablePremium: 'Premium',
    // Table labels
    adDisplay: 'Ads',
    spotCreation: 'Spot Creation',
    imageInsertion: 'Image Upload',
    folderCreation: 'Folder Creation',
    bookmarks: 'Bookmarks',
    bookmarksByCategory: 'Bookmarks\n(by folder)',
    collectionCreation: 'Collection Creation',
    // Table values
    valueYes: 'Yes',
    valueNo: 'No',
    // Table units
    perMap: 'per map',
    perSpot: 'per spot',
    perFolder: '*per folder',
    // Plan comparison
    planComparison: 'Plan Comparison',
    // Error
    planFetchError: 'Failed to load plans',
    // Restore
    restoreComplete: 'Restore Complete',
    restoreCompleteMessage: 'Your purchase has been restored.',
    // Purchase complete
    purchaseCompleteMessage: 'Your Premium subscription is now active.',
    // Premium member page
    premiumMember: 'Premium Member',
    freeTrial: 'Free Trial',
    premiumBenefits: 'Premium Benefits',
    subscriptionInfo: 'Subscription Info',
    nextRenewalDate: 'Next renewal: %{date}',
    cancelledExpiry: 'Cancelled - Expires: %{date}',
    manageSubscription: 'Manage Subscription',
    // Premium benefits list
    benefitNoAds: 'No Ads',
    benefitSpots: 'Create %{limit} spots/map',
    benefitImages: 'Upload %{limit} images/spot',
    benefitFolders: 'Create %{limit} folders',
    benefitBookmarks: '%{limit} bookmarks',
    benefitBookmarksPerFolder: '%{limit} bookmarks/folder',
    benefitCollections: 'Create %{limit} collections',
    // Coming soon
    premiumTitle: 'Machikore Premium',
    premiumSubtitle: 'Register more spots and\ncreate your own maps',
    comingSoon: 'Coming Soon',
    comingSoonMessage: 'Premium features are coming soon.\nPlease stay tuned.',
    // Plan selection
    annualPremium: 'Annual Premium',
    monthlyPremium: 'Monthly Premium',
    perMonth: '/mo',
    perYear: '/yr',
    trialDays: '%{count}-day free trial',
    trialMonths: '%{count}-month free trial',
    // Footer
    subscribeToPremium: 'Subscribe to Premium',
    restorePurchase: 'Restore Purchase',
    cancelAnytime: 'You can cancel your subscription at any time',
    // Legal (iOS)
    subscriptionPaymentIos: 'Payment will be charged to your Apple ID (iTunes) account.',
    subscriptionAutoRenewIos: 'Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.',
    subscriptionRenewalChargeIos: 'Your account will be charged for renewal within 24 hours prior to the end of the current period.',
    trialTermsIos: 'Any unused portion of a free trial period will be forfeited when you purchase a subscription. You will be automatically charged unless you cancel at least 24 hours before the trial ends.',
    // Legal (Android)
    subscriptionPaymentAndroid: 'Payment will be charged to your Google Play account.',
    subscriptionAutoRenewAndroid: 'Subscriptions automatically renew unless auto-renew is turned off before the end of the current period.',
    trialTermsAndroid: 'Any unused portion of a free trial period will be forfeited when you purchase a subscription. You will be automatically charged unless you cancel before the trial ends.',
    // Legal (common)
    subscriptionManage: 'You can manage and cancel subscriptions in your device settings.',
    priceChangeNotice: 'If prices change, you will be notified and asked for consent in accordance with the store\'s policies.',
    noRefund: 'Due to the nature of digital content, refunds are not available after purchase.',
    taxIncluded: 'All prices include tax.',
    minorNotice: 'Minors must obtain parental consent before purchasing.',
    tokushoho: 'Specified Commercial Transactions Act',
  },

  // Report
  report: {
    reportTarget: 'Report %{target}',
    submit: 'Submit',
    description: 'If there is a problem with this %{target}, please select a reason and report it. Our team will review the report.',
    reasonLabel: 'Report Reason',
    detailLabel: 'Details (optional)',
    detailPlaceholder: 'Describe the issue in detail',
    warning: 'Repeatedly filing false reports may result in account restrictions.',
    // Report reasons
    spam: 'Spam',
    spamDescription: 'Promotional or irrelevant content',
    inappropriate: 'Inappropriate Content',
    inappropriateDescription: 'Violent, sexual, or offensive content',
    harassment: 'Harassment',
    harassmentDescription: 'Personal attacks or harassment',
    misinformation: 'Misinformation',
    misinformationDescription: 'False or misleading information',
    copyright: 'Copyright Infringement',
    copyrightDescription: 'Unauthorized use of copyrighted material',
    other: 'Other',
    otherDescription: 'Issues not covered above',
    invalidParams: 'Invalid parameters',
    // Target labels
    targetMap: 'map',
    targetSpot: 'spot',
    targetUser: 'user',
    targetComment: 'comment',
    // Alerts
    alreadyReported: 'Already Reported',
    alreadyReportedMessage: 'You have already reported this. Please wait for our team to review it.',
    reportComplete: 'Report Submitted',
    reportCompleteMessage: 'Thank you for your report. We will review it.',
    reportFailed: 'Failed to submit report. Please try again.',
    loginRequired: 'Login required',
    selectReason: 'Please select a report reason',
    confirmTitle: 'Confirm Report',
    confirmMessage: 'Report this %{target} as "%{reason}"?',
    reportButton: 'Report',
  },

  // Terms update
  termsUpdate: {
    title: 'Terms Updated',
    description: 'To continue using the app,\nyou must agree to the updated terms',
    agreeCheckbox: 'I agree to the updated Terms of Service and Privacy Policy',
    processing: 'Processing...',
    continue: 'Continue',
    loadError: 'Failed to load terms. Please check your internet connection.',
    notFound: 'Terms not found',
  },

  // Ads
  ad: {
    label: 'Ad',
    sponsor: 'Sponsor',
    viewDetails: 'Learn More',
  },

  // Embeds
  embed: {
    viewInstagram: 'View Instagram content',
    loadingTweet: 'Loading tweet...',
    viewX: 'View X content',
  },

  // Tutorial
  tutorial: {
    homeTab: 'Browse maps and spots shared by others',
    discoverTab: 'Search and discover maps and spots',
    createTab: 'Create new maps and spots',
    mypageTab: 'Manage your profile and maps',
    next: 'Next',
    finish: "Let's go!",
    usageGuide: 'Usage Guide',
    restartTutorial: 'Restart Tutorial',
  },

  // Usage Guide
  guide: {
    title: 'Usage Guide',
    mapBrowsing: 'Browse Maps',
    mapBrowsingDesc: 'Browse maps and spots created by others on the Home tab. Tap on a map to see its details.',
    mapCreation: 'Create Maps',
    mapCreationDesc: 'Create your own map using the "+" button. Choose a theme and add your favorite places.',
    spotRegistration: 'Register Spots',
    spotRegistrationDesc: 'Add spots to your map with location info, photos, and reviews.',
    bookmarkCollection: 'Bookmarks & Collections',
    bookmarkCollectionDesc: 'Bookmark maps and spots you like to revisit later. Organize them into collections.',
    searchFilter: 'Search & Filter',
    searchFilterDesc: 'Use keyword search and filters on the Discover tab to find the perfect maps and spots for you.',
  },

  // Magazine
  magazine: {
    mapCount: '%{count} maps',
    noMaps: 'No maps',
    section: 'Section',
    sectionNotFound: 'Section not found',
  },
};
