enum InstagramPermission {
  BASIC = 'instagram_basic',
  CONTENT_PUBLISH = 'instagram_content_publish',
  MANAGE_COMMENTS = 'instagram_manage_comments',
  MANAGE_INSIGHTS = 'instagram_manage_insights',
}

enum FacebookPagePermission {
  SHOW_LIST = 'pages_show_list',
  READ_ENGAGEMENT = 'pages_read_engagement',
}

export const permissionIgVerifyScope = {
  instagram: [
    InstagramPermission.BASIC,
    InstagramPermission.CONTENT_PUBLISH,
    InstagramPermission.MANAGE_COMMENTS,
    InstagramPermission.MANAGE_INSIGHTS,
  ],
  pages: [FacebookPagePermission.SHOW_LIST, FacebookPagePermission.READ_ENGAGEMENT],
};