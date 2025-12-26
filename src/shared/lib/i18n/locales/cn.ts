/**
 * 简体中文翻译文件
 */

export default {
  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    close: '关闭',
    confirm: '确认',
    ok: '确定',
    yes: '是',
    no: '否',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    retry: '重试',
    search: '搜索',
    back: '返回',
    next: '下一步',
    done: '完成',
    all: '全部',
    none: '无',
    more: '更多',
    less: '收起',
    comment: '评论',
    like: '点赞',
    share: '分享',
    post: '发布',
    user: '用户',
  },

  // 标签栏
  tabs: {
    home: '首页',
    discover: '发现',
    map: '地图',
    profile: '我的',
  },

  // 认证
  auth: {
    login: '登录',
    logout: '退出登录',
    signup: '注册',
    email: '邮箱',
    password: '密码',
    forgotPassword: '忘记密码？',
    loginRequired: '需要登录',
    loginRequiredMessage: '请登录后使用此功能',
    continueWithApple: '通过Apple登录',
    continueWithGoogle: '通过Google登录',
  },

  // 地图
  map: {
    addMap: '添加地图',
    createMap: '创建地图',
    editMap: '编辑地图',
    deleteMap: '删除地图',
    mapName: '地图名称',
    mapDescription: '描述',
    mapCategory: '分类',
    mapTags: '标签',
    publicMap: '公开',
    privateMap: '私密',
    defaultMap: '默认地图',
    deleteMapConfirm: '确定要删除这个地图吗？',
    noMaps: '暂无地图',
    createFirstMap: '创建您的第一个地图',
    // 创建地图表单
    mapNameRequired: '地图名称',
    mapNamePlaceholder: '例：东京咖啡馆巡礼',
    descriptionRequired: '描述',
    descriptionPlaceholder: '请输入地图描述',
    categoryRequired: '分类',
    tags: '标签',
    tagsPlaceholder: '输入标签后按回车',
    thumbnail: '缩略图',
    publicDescription: '公开后其他用户也可以查看此地图',
    creating: '创建中...',
    // 地图选择
    targetMap: '添加到地图',
    belongingMap: '所属地图',
    noMapSelected: '未选择地图',
  },

  // 地点
  spot: {
    addSpot: '添加地点',
    createSpot: '创建地点',
    editSpot: '编辑地点',
    deleteSpot: '删除地点',
    spotName: '地点名称',
    spotMemo: '备注',
    visitDate: '访问日期',
    visited: '已访问',
    notVisited: '未访问',
    deleteSpotConfirm: '确定要删除这个地点吗？此操作无法撤销。',
    noSpots: '暂无地点',
    unknownSpot: '未知地点',
    noArticle: '暂无文章',
    // 创建地点表单
    registerSpot: '注册地点',
    googlePlacesInfo: '来自Google Places的信息',
    currentLocationInfo: '从当前位置注册',
    mapPinInfo: '在地图上选择的位置',
    originalSpotName: '原地点名称',
    oneWordRequired: '用一句话描述这个地点！',
    oneWordPlaceholder: '例：最棒的拉面店',
    spotSummary: '地点概要',
    summaryPlaceholder: '简要描述这个地点的魅力',
    article: '文章',
    articleEmpty: '详细介绍这个地点',
    articleEntered: '已输入文章',
    articleHint: '此内容将显示在文章页面',
    articleEdit: '编辑文章',
    articleWrite: '撰写文章',
    articleWriteHint: '详细介绍这个地点',
    label: '标签',
    spotColor: '地点颜色',
    labelColorNotice: '※设置标签后，标签颜色优先',
    photos: '照片',
    registering: '注册中...',
    registerSpotButton: '注册地点',
    // 编辑地点
    spotInfo: '地点信息',
    existingPhotos: '已注册的照片',
    newPhotos: '新增照片',
    totalPhotos: '共 %{current}/%{max}张',
    updating: '更新中...',
    saveChanges: '保存更改',
    spotNotFound: '未找到地点',
    // 加载中
    creatingSpot: '正在创建地点...',
    uploadingImages: '正在上传图片... (%{current}/%{total})',
    processingComplete: '处理中...',
    updatingSpot: '正在更新地点...',
    deletingImages: '正在删除图片...',
  },

  // 收藏和点赞
  favorite: {
    favorite: '收藏',
    favorites: '收藏',
    addFavorite: '添加收藏',
    removeFavorite: '取消收藏',
    like: '点赞',
    likes: '点赞',
    liked: '已点赞',
    likedItems: '点赞',
    noLikes: '没有点赞',
    spot: '地点',
    map: '地图',
    noLikedSpots: '没有点赞的地点',
    noLikedMaps: '没有点赞的地图',
    unknownSpot: '未知地点',
    userPost: '%{name}的帖子',
    spotsCount: '%{count}个地点',
    spots: '地点',
    maps: '地图',
  },

  // 合集
  collection: {
    collection: '合集',
    collections: '合集',
    createNew: '新建',
    noCollections: '没有合集',
    // 创建合集
    newCollection: '新建合集',
    collectionName: '合集名称',
    collectionNamePlaceholder: '例：东京咖啡馆合集',
    descriptionOptional: '描述（可选）',
    descriptionPlaceholder: '输入描述...',
    thumbnail: '缩略图',
    publicDescription: '开启后，其他用户可以查看此合集',
    createHint: '创建合集后，您可以添加地图',
    creating: '创建中...',
    create: '创建',
    // 编辑合集
    editCollection: '编辑合集',
    collectionNotFound: '未找到合集',
    manageMaps: '管理地图',
    itemsCount: '%{count}个',
    // 合集详情
    mapsCount: '%{count}个地图',
    private: '私密',
    mapList: '地图列表',
    noMaps: '暂无地图',
    edit: '编辑',
    anonymous: '匿名用户',
    notFound: '未找到合集',
    // 删除合集
    deleteTitle: '删除合集',
    deleteMessage: '确定删除此合集吗？',
    // 空状态
    emptyTitle: '合集',
    emptyDescriptionOwner: '按主题整理地图',
    emptyDescriptionOther: '尚未创建合集',
    loadingMessage: '加载合集中...',
  },

  // 书签
  bookmark: {
    bookmark: '书签',
    bookmarks: '书签',
    loginRequired: '请登录',
    noBookmarks: '没有书签',
    spots: '地点',
    maps: '地图',
    createFolder: '创建新文件夹',
    watchLater: '稍后查看',
    itemCount: '%{count}个',
    deleteFolder: '删除文件夹',
    deleteFolderMessage: '删除「%{name}」？\n文件夹内的书签将移动到「稍后查看」。',
    editFolderName: '编辑文件夹名称',
    folderName: '文件夹名称',
    // 创建文件夹模态框
    newFolder: '新建文件夹',
    folderNamePlaceholder: '文件夹名称',
    create: '创建',
    folder: '文件夹',
    // 选择文件夹模态框
    selectSpotFolder: '选择地点保存位置',
    selectMapFolder: '选择地图保存位置',
    added: '已添加',
    add: '添加',
    createNewFolder: '新建文件夹',
    save: '收藏',
    saved: '已收藏',
  },

  // 评论
  comment: {
    comment: '评论',
    comments: '评论',
    addComment: '添加评论',
    addPlaceholder: '添加评论...',
    writeComment: '写评论...',
    deleteComment: '删除评论',
    noComments: '暂无评论',
    edit: '编辑',
    delete: '删除',
    reply: '回复',
    showReplies: '显示%{count}条回复',
    hideReplies: '隐藏回复',
    defaultUser: '用户',
    enterComment: '输入评论...',
    enterReply: '输入回复...',
    replyToUser: '回复%{name}...',
    replyingTo: '回复%{name}',
    composingReply: '正在撰写回复',
    editComment: '编辑评论',
  },

  // 浏览历史
  viewHistory: {
    title: '最近浏览的地图',
    loginRequired: '登录后可查看浏览历史',
    empty: '暂无浏览历史',
  },

  // 个人资料
  profile: {
    profile: '个人资料',
    editProfile: '编辑资料',
    username: '用户名',
    usernameCannotChange: '用户名无法更改',
    displayName: '显示名称',
    displayNamePlaceholder: '输入显示名称',
    bio: '简介',
    bioPlaceholder: '输入简介',
    tapToChangePhoto: '点击更换照片',
    followers: '粉丝',
    following: '关注',
    follow: '关注',
    unfollow: '取消关注',
    posts: '帖子',
    maps: '地图',
    bookmarks: '书签',
    photoPermissionRequired: '需要权限',
    photoPermissionMessage: '请允许访问您的照片库以选择图片。',
    profileSaved: '已保存',
    profileSavedMessage: '您的个人资料已更新。',
    profileSaveError: '保存个人资料失败。',
  },

  // 设置
  settings: {
    settings: '设置',
    account: '账户',
    editProfile: '编辑个人资料',
    changeEmail: '更改邮箱',
    changePassword: '更改密码',
    premium: '高级版',
    premiumPlan: '高级版方案',
    subscribed: '已订阅',
    notifications: '通知',
    notificationSettings: '通知设置',
    privacy: '隐私',
    publicScope: '公开范围',
    blockedUsers: '已屏蔽用户',
    language: '语言',
    darkMode: '深色模式',
    other: '其他',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    help: '帮助',
    about: '关于',
    version: '版本',
    accountActions: '账户操作',
    signOut: '退出登录',
    signOutConfirm: '确定要退出登录吗？',
    deleteAccount: '删除账户',
    comingSoon: '即将推出',
    comingSoonMessage: '此功能即将推出。',
    effectiveDate: '%{date} 生效',
    termsLoadError: '加载文档失败。请检查网络连接。',
    termsNotFound: '未找到文档',
    // 语言设置
    displayLanguage: '显示语言',
    displayLanguageDescription: '在设备设置中更改',
    displayLanguageHint: '显示语言可在设备设置中更改。',
    contentLanguage: '内容语言',
    contentLanguageHint: '只显示所选语言的内容。',
    addOtherLanguages: '添加其他语言',
    hideOtherLanguages: '隐藏其他语言',
    contentLanguageHintAll: '未选择语言，将显示所有语言的内容。',
    loginRequiredForContentLanguage: '请登录以保存内容语言设置。',
    openSettingsErrorIOS: '无法打开设置。请手动前往 设置 > 应用 > 街コレ > 语言。',
    openSettingsErrorAndroid: '无法打开设置。请手动前往 设置 > 应用 > 街コレ > 语言。',
  },

  // 搜索
  search: {
    search: '搜索',
    searchPlaces: '搜索地点',
    searchUsers: '搜索用户',
    searchMaps: '搜索地图',
    recentSearches: '最近搜索',
    noResults: '未找到结果',
    noSearchHistory: '没有搜索历史',
    clearAll: '全部删除',
    showMore: '查看更多',
    searchAndRegister: '搜索并注册',
    registerCurrentLocation: '注册当前位置',
    pinOnMap: '在地图上标记',
    searching: '搜索中...',
    searchFailed: '搜索失败，请重试。',
    noResultsFor: '未找到「%{query}」的搜索结果',
    resultsFor: '「%{query}」的搜索结果（%{count}条）',
    locationUnavailable: '无法获取位置信息',
    checkLocationPermission: '请检查位置权限设置',
  },

  // 筛选
  filter: {
    filter: '筛选',
    sortBy: '排序',
    newest: '最新',
    popular: '热门',
    nearby: '附近',
    category: '分类',
    region: '地区',
    prefecture: '都道府县',
  },

  // 分类
  category: {
    gourmet: '美食',
    shopping: '购物',
    tourism: '旅游',
    culture: '文化/历史',
    entertainment: '娱乐',
    activity: '活动/体验',
    lifestyle: '生活/地区',
    learning: '学习/教育',
    other: '其他',
  },

  // 错误消息
  errors: {
    networkError: '网络错误',
    unknownError: '发生未知错误',
    loadFailed: '加载失败',
    saveFailed: '保存失败',
    deleteFailed: '删除失败',
    permissionDenied: '没有权限',
    notFound: '未找到',
  },

  // 成功消息
  success: {
    saved: '已保存',
    deleted: '已删除',
    copied: '已复制',
    posted: '已发布',
  },

  // 确认对话框
  confirm: {
    deleteTitle: '确认删除',
    deleteMessage: '确定要删除吗？此操作无法撤销。',
    logoutTitle: '退出登录',
    logoutMessage: '确定要退出登录吗？',
    unsavedChanges: '未保存的更改',
    unsavedChangesMessage: '不保存就关闭吗？',
  },

  // 位置
  location: {
    currentLocation: '当前位置',
    getLocation: '获取位置',
    locationPermission: '位置权限',
    locationPermissionMessage: '此功能需要位置权限',
    directions: '导航',
    openInMaps: '在地图中打开',
    earth: '地球',
  },

  // 图片
  image: {
    addPhoto: '添加照片',
    takePhoto: '拍照',
    chooseFromLibrary: '从相册选择',
    deletePhoto: '删除照片',
  },

  // 空状态
  empty: {
    noData: '暂无数据',
    noMaps: '暂无地图',
    noSpots: '暂无地点',
    noFollowers: '还没有粉丝',
    noFollowing: '还没有关注任何人',
    noNotifications: '暂无通知',
    noAnnouncements: '暂无公告',
    noMapsYet: '还没有创建地图',
    noFollowingUsers: '暂未关注任何人',
    noFollowingMaps: '关注的用户暂无地图',
  },

  // 动态
  feed: {
    recommended: '推荐',
    following: '关注',
  },

  // 通知
  notification: {
    notifications: '通知',
    announcements: '公告',
    markAllRead: '全部标为已读',
    likedYourSpot: '%{name}赞了你的地点「%{target}」',
    likedYourMap: '%{name}赞了你的地图「%{target}」',
    commentedOnYourSpot: '%{name}评论了你的地点「%{target}」',
    commentedOnYourMap: '%{name}评论了你的地图「%{target}」',
    followedYou: '%{name}关注了你',
    newNotification: '你有新通知',
    like: '点赞',
    comment: '评论',
    follow: '关注',
    system: '公告',
    // 通知设置
    notificationSettings: '通知设置',
    pushNotification: '推送通知',
    emailNotification: '邮件通知',
    receivePushNotifications: '接收推送通知',
    receiveEmailNotifications: '接收邮件通知',
    pushDisabledDescription: '关闭后将不会收到任何推送通知',
    emailDisabledDescription: '关闭后将不会收到任何邮件通知',
    notificationTypes: '通知类型',
    pushDisabledNotice: '推送通知已关闭，无法修改',
    emailDisabledNotice: '邮件通知已关闭，无法修改',
    likeNotification: '点赞',
    likeNotificationDescription: '有人给你的内容点赞时',
    commentNotification: '评论',
    commentNotificationDescription: '有人评论你的内容时',
    followNotification: '关注',
    followNotificationDescription: '有新的关注者时',
    systemNotification: '公告',
    systemNotificationDescription: '来自运营团队的公告',
    loadError: '加载设置失败',
  },

  // 相对时间
  time: {
    justNow: '刚刚',
    minutesAgo: '%{count}分钟前',
    hoursAgo: '%{count}小时前',
    daysAgo: '%{count}天前',
    weeksAgo: '%{count}周前',
    monthsAgo: '%{count}个月前',
    yearsAgo: '%{count}年前',
  },

  // 发现
  discover: {
    searchPlaceholder: '搜索地点、地图、用户',
    searchFor: '搜索"%{query}"',
    users: '用户',
    latest: '最新',
    trending: '热门',
    spots: '地点',
    maps: '地图',
    noTrendingPosts: '暂无热门内容',
    noSpotsFound: '未找到地点',
    noMapsFound: '未找到地图',
    noUsersFound: '未找到用户',
    noSearchResults: '没有搜索结果',
  },

  // 板块
  section: {
    todaysPicks: '今日精选',
    popularRanking: '热门地图排行',
    latestInCategory: '%{category}最新',
    popularInCategory: '%{category}热门',
    featuredInCategory: '%{category}推荐',
    recentlyViewed: '最近浏览',
    searchByArea: '按区域浏览',
    searchOverseas: '浏览海外',
    searchByTag: '按标签搜索',
    searchByPrefecture: '按都道府县浏览',
    noTodayPicks: '没有今日精选',
    noPopularMaps: '没有热门地图',
    noPrefectureData: '没有都道府县数据',
    noCountryData: '没有国家数据',
  },

  // 我的页面
  mypage: {
    myPage: '我的',
    editProfile: '编辑资料',
    loadingMaps: '加载地图中...',
    deleteMapConfirmDetail: '删除此地图？所有相关地点也将被删除。此操作无法撤销。',
    report: '举报',
    defaultUser: '用户',
  },

  // 创建菜单
  create: {
    map: '地图',
    spot: '地点',
    blog: '博客',
  },

  // 地区
  area: {
    tokyo: '东京',
    osaka: '大阪',
    kyoto: '京都',
    kanagawa: '神奈川',
    aichi: '爱知',
    fukuoka: '福冈',
    hokkaido: '北海道',
    hyogo: '兵库',
  },

  // 编辑地图
  editMap: {
    title: '编辑地图',
    notFound: '未找到地图',
    mapInfo: '地图信息',
    spots: '地点',
    likes: '点赞',
    createdAt: '创建日期',
    mapNameLabel: '地图名称',
    mapNamePlaceholder: '例：东京咖啡馆巡礼',
    descriptionLabel: '描述',
    descriptionPlaceholder: '请输入地图描述',
    categoryLabel: '分类',
    labelLabel: '标签',
    showLabelChips: '显示标签芯片',
    showLabelChipsDescription: '在地图顶部显示标签，点击可筛选地点',
    tagsLabel: '标签',
    tagsPlaceholder: '输入标签后按回车',
    thumbnailLabel: '缩略图',
    publicDescription: '任何人都可以查看此地图',
    privateDescription: '只有您可以查看此地图',
    updating: '更新中...',
    saveChanges: '保存更改',
    required: '*',
  },

  // 文章
  article: {
    article: '文章',
    notFound: '未找到文章',
    private: '此文章为私密',
    viewMap: '查看地图',
    editArticle: '编辑文章',
    editMap: '编辑地图',
    // 文章页面追加
    tableOfContents: '目录',
    spotsCount: '%{count}个地点',
    noSpots: '暂无地点',
    unknownSpot: '未知地点',
    authorOtherMaps: '该作者的其他地图',
    comment: '评论',
    addComment: '添加评论...',
    noComments: '暂无评论',
    viewAllComments: '查看全部%{count}条评论',
    loadError: '加载失败',
    searchByTag: '按标签搜索',
    featuredInCategory: '%{category}推荐',
    latestInCategory: '%{category}最新地图',
  },

  // 菜单（三点菜单）
  menu: {
    edit: '编辑',
    delete: '删除',
    share: '分享',
    report: '举报',
    viewMap: '查看地图',
    viewArticle: '查看文章',
    copyLink: '复制链接',
  },

  // 需要登录
  authRequired: {
    loginRequiredAction: '请登录以%{action}',
  },

  // 日程
  schedule: {
    title: '日程',
    dateSchedule: '%{month}月%{day}日的日程',
    noSchedule: '没有计划',
    comingSoon: '日程功能即将推出',
  },

  // 地图卡片
  mapCard: {
    deleteTitle: '删除地图',
    deleteMessage: '删除此地图及其所有地点？此操作无法撤销。',
    defaultUser: '用户',
  },

  // 地点卡片
  spotCard: {
    deleteTitle: '删除地点',
    deleteMessage: '删除此地点？此操作无法撤销。',
    unknownSpot: '未知地点',
    defaultUser: '用户',
  },

  // 公开/私密切换
  publicToggle: {
    public: '公开',
    private: '私密',
    publicStatus: '公开中',
    privateStatus: '私密',
  },

  // 分类页面
  categoryPage: {
    tagsTitle: '%{category}标签',
    noTags: '没有标签',
    noMapsForTag: '没有#%{tag}的地图',
    selectTag: '请选择标签',
  },

  // 添加地图到收藏夹
  addMapsToCollection: {
    title: '添加地图',
    addTo: '添加到:',
    tapToToggle: '点击添加/移除地图',
    spotsCount: '%{count}个地点',
  },

  // 都道府县地点列表
  prefectureSpots: {
    spotList: '地点列表',
    missingParams: '缺少参数',
    prefectureSpotsTitle: '%{prefecture}的地点',
    noPrefectureSpots: '%{prefecture}暂无地点',
    noCategoryPrefectureSpots: '%{prefecture}暂无%{category}地点',
    loadError: '加载失败',
  },

  // 用户地图
  userMap: {
    usersMap: '%{name}的地图',
    selectMap: '选择地图',
  },

  // 编辑文章
  editArticle: {
    title: '编辑文章',
    notFound: '未找到文章',
    noPermission: '没有编辑权限',
    publicToggleError: '更改发布设置失败',
    intro: '前言',
    writeIntro: '点击写前言',
    editIntro: '编辑前言',
    outro: '后记',
    writeOutro: '点击写后记',
    editOutro: '编辑后记',
    noSpots: '还没有地点',
    writeDescription: '点击写介绍',
    charCount: '%{count}字',
    saved: '已保存',
    saveError: '保存失败',
    discardTitle: '放弃更改？',
    discardMessage: '您有未保存的更改。',
    discard: '放弃',
    spotNotFound: '未找到地点',
    mapNotFound: '未找到地图',
  },
};
