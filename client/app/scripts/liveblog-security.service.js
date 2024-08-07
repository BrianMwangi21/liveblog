angular.module('liveblog.security', ['liveblog.features'])
    .service('blogSecurityService',
        [
            '$q',
            '$rootScope',
            '$route',
            'blogService',
            '$location',
            'privileges',
            'api',
            'featuresService',
            function(
                $q,
                $rootScope,
                $route,
                blogService,
                $location,
                privileges,
                api,
                featuresService
            ) {
                function canPublishAPost() {
                    return privileges.userHasPrivileges({publish_post: 1});
                }
                function canCreateABlog() {
                    return privileges.userHasPrivileges({blogs: 1});
                }
                function isMemberOfBlog(blog) {
                    // add the owner
                    const ids = blog.original_creator ? [blog.original_creator._id] : [];

                    // add the members
                    if (blog.members) {
                        ids.push(...blog.members.map((member) => member.user));
                    }
                    return ids.indexOf($rootScope.currentUser._id) > -1;
                }
                function showUpgradeModal() {
                    const criteria = {
                        source: {
                            query: {filtered: {filter: {term: {blog_status: 'open'}}}},
                        },
                    };

                    return api.blogs
                        .query(criteria)
                        .then((blogs) => featuresService.isLimitReached('blogs', blogs._items.length));
                }
                function canAccessBlog(blog) {
                    return isAdmin() || isMemberOfBlog(blog);
                }
                function isAdmin() {
                    return $rootScope.currentUser.user_type === 'administrator';
                }
                function isUserOwnerOrAdmin(archive) {
                    return $rootScope.currentUser._id === archive.original_creator || isAdmin();
                }
                function isUserOwnerOrCanPublishAPost(archive) {
                    return $rootScope.currentUser._id === archive.original_creator || canPublishAPost();
                }
                function canAccessSettings(archive) {
                    return canCreateABlog() && (isUserOwnerOrAdmin(archive) || isMemberOfBlog(archive));
                }
                function canAccessblogCheckbox(blog) {
                    const userType = $rootScope.currentUser.user_type;

                    if (userType === 'user') {
                        return canCreateABlog() && isMemberOfBlog(blog);
                    } else if (userType === 'administrator') {
                        return isAdmin();
                    }
                }
                function goToSettings() {
                    const def = $q.defer();

                    blogService.get($route.current.params._id)
                        .then((response) => {
                            if (canAccessSettings(response)) {
                                def.resolve();
                            } else {
                                def.reject();
                                $location.path('/liveblog/edit/' + $route.current.params._id);
                            }
                        }, () => {
                            $location.path('/liveblog');
                            def.reject('You do not have permission to change the settings of this blog');
                        });
                    return def.promise;
                }
                return {
                    goToSettings: goToSettings,
                    showUpgradeModal: showUpgradeModal,
                    isAdmin: isAdmin,
                    isUserOwnerOrAdmin: isUserOwnerOrAdmin,
                    isUserOwnerOrCanPublishAPost: isUserOwnerOrCanPublishAPost,
                    canAccessSettings: canAccessSettings,
                    canPublishAPost: canPublishAPost,
                    canCreateABlog: canCreateABlog,
                    canAccessBlog: canAccessBlog,
                    canAccessblogCheckbox: canAccessblogCheckbox,
                };
            },
        ]);
