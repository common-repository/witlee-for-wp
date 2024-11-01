(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
    for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("aa32f5f3c26dc0294db2b976c518be1f");
var googleTrackingID= "UA-60449307-2";
var _gaq=_gaq||[];
_gaq.push(['_setAccount',googleTrackingID]);
_gaq.push(['_trackPageview']);
(function(){
    var ga=document.createElement('script');
    ga.type='text/javascript';
    ga.async=true;
    ga.src=('https:'==document.location.protocol?'https://ssl':'http://www')+'.google-analytics.com/ga.js';
    var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ga,s);
})();
/**!
 * AngularJS Ladda directive
 * @author Chungsub Kim <subicura@subicura.com>
 */

/* global Ladda */
/* exported Ladda */
(function (root, factory)
{
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['angular', 'ladda'], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        // CommonJS support (for us webpack/browserify/ComponentJS folks)
        module.exports = factory(require('angular'), require('ladda'));
    } else {
        // in the case of no module loading system
        return factory(root.angular, root.Ladda);
    }
}(this, function (angular, Ladda){
    'use strict';

    var moduleName = 'angular-ladda';

    angular.module(moduleName, [])
        .provider('ladda', function () {
            var opts = {
                'style': 'zoom-in'
            };
            return {
                setOption: function (newOpts) {
                    angular.extend(opts, newOpts);
                },
                $get: function () {
                    return opts;
                }
            };
        })
        .directive('ladda', ['ladda', function (laddaOption) {
            return {
                restrict: 'A',
                priority: -1,
                link: function (scope, element, attrs) {
                    element.addClass('ladda-button');
                    if(angular.isUndefined(element.attr('data-style'))) {
                        element.attr('data-style', laddaOption.style || 'zoom-in');
                    }

                    // ladda breaks childNode's event property.
                    // because ladda use innerHTML instead of append node
                    if(!element[0].querySelector('.ladda-label')) {
                        var labelWrapper = document.createElement('span');
                        labelWrapper.className = 'ladda-label';
                        angular.element(labelWrapper).append(element.contents());
                        element.append(labelWrapper);
                    }

                    // create ladda button
                    var ladda = Ladda.create( element[0] );

                    // add watch!
                    scope.$watch(attrs.ladda, function(loading) {
                        if(!loading && !angular.isNumber(loading)) {
                            ladda.stop();
                            // When the button also have the ng-disabled directive it needs to be
                            // re-evaluated since the disabled attribute is removed by the 'stop' method.
                            if (attrs.ngDisabled) {
                                element.attr('disabled', scope.$eval(attrs.ngDisabled));
                            }
                            return;
                        }
                        if(!ladda.isLoading()) {
                            ladda.start();
                        }
                        if(angular.isNumber(loading)) {
                            ladda.setProgress(loading);
                        }
                    });
                }
            };
        }]);

    return moduleName;
}));
(function() {
    'use strict';

    angular
        .module('angular-click-outside', [])
        .directive('clickOutside', ['$document', '$parse', clickOutside]);

    function clickOutside($document, $parse) {
        return {
            restrict: 'A',
            link: function($scope, elem, attr) {
                var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [],
                    fn = $parse(attr['clickOutside']);

                // add the elements id so it is not counted in the click listening
                if (attr.id !== undefined) {
                    classList.push(attr.id);
                }

                var eventHandler = function(e) {

                    //check if our element already hiden
                    if(angular.element(elem).hasClass("ng-hide")){
                        return;
                    }

                    var i = 0,
                        element;

                    // if there is no click target, no point going on
                    if (!e || !e.target) {
                        return;
                    }

                    // loop through the available elements, looking for classes in the class list that might match and so will eat
                    for (element = e.target; element; element = element.parentNode) {
                        var id = element.id,
                            classNames = element.className,
                            l = classList.length;

                        // Unwrap SVGAnimatedString
                        if (classNames && classNames.baseVal !== undefined) {
                            classNames = classNames.baseVal;
                        }

                        // loop through the elements id's and classnames looking for exceptions
                        for (i = 0; i < l; i++) {
                            // check for id's or classes, but only if they exist in the first place
                            if ((id !== undefined && id.indexOf(classList[i]) > -1) || (classNames && classNames.indexOf(classList[i]) > -1)) {
                                // now let's exit out as it is an element that has been defined as being ignored for clicking outside
                                return;
                            }
                        }
                    }

                    // if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
                    return $scope.$apply(function () {
                        return fn($scope);
                    });
                };

                // assign the document click handler to a variable so we can un-register it when the directive is destroyed
                $document.on('click', eventHandler);

                // when the scope is destroyed, clean up the documents click handler as we don't want it hanging around
                $scope.$on('$destroy', function() {
                    $document.off('click', eventHandler);
                });
            }
        };
    }
})();
'use strict';

angular.module('Witlee', [
    'Witlee.main'
]);
'use strict';

angular.module('Witlee.main', [
    'ngAnimate',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'infinite-scroll',
    'Witlee.common',
    'Witlee.models',
    'Witlee.store',
    'ng-optimizely'
]);
(function(){

    'use strict';

    angular.module('Witlee.main')
        .value('THROTTLE_MILLISECONDS', 1000);

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .run(function (
            $rootScope,
            $location,
            $window,
            $state,
            searchFilter,
            $timeout,
            optimizely,
            wProfile,
            $stateParams
        ) {

            $rootScope.state = {};

            /**
             * change page listener, when user navigate this listener will fire the events inside
             */
            $rootScope.$on('$stateChangeSuccess', function() {
                if(!$stateParams.session){
                    if(localStorage.getItem('xsession')){
                        wProfile.checkSession().then(function(){});
                    }
                }

                $timeout(function(){
                    optimizely.loadProject(4487742407);
                }, 100);
                if ($state.current.name !== 'search'){
                    $rootScope.$broadcast('user:clearsearchtem', {});
                    searchFilter.clearFilters();
                }
                if(window.allow_ga_mp){
                    if ($window._gaq)
                        _gaq.push(['_trackPageview', $location.path()]);
                    if ($window.ga) {
                        $window.ga('send', 'pageview', $location.path())
                    }
                }else{
                }
                jQuery(window).scrollTop(0);
            });

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main').config(function (
        $stateProvider,
        $urlRouterProvider,
        $locationProvider,
        laddaProvider
    ) {

        laddaProvider.setOption({
            style: 'expand-left'
        });

        $stateProvider.state('main', {
            abstract: true,
            template: '<ui-view class="main"></ui-view>',
            controller: 'baseCtrl'
        }).state('home', {
            url: '/?{session}{emi}',
            parent: 'main',
            controller: 'HomeCtrl',
            controllerAs: 'home',
            templateUrl: 'modules/main/views/home.html'
        }).state('product', {
            url: '/product?{session}{emi}',
            abstract: true,
            parent: 'main',
            controller: 'SearchCtrl',
            controllerAs: 'search',
            templateUrl: 'modules/main/views/search.html'
        }).state('product.results', {
            url: '/{id}?{seedId}{session}{emi}',
            resolve: {
                current: function ($stateParams, wCard, Page) {
                    return wCard.getCurrent($stateParams.id).then(function(data){
                        var name = data.publisher.name;
                        var brands = '';
                        for (var i = 0; i < data.seeds.length; i++) {
                            if (i === 0) {
                                brands += (data.seeds[i].brand);
                            } else if (i < 2) {
                                brands += ' and ' + data.seeds[i].brand;
                            } else {
                                break;
                            }
                        }
                        Page.setDescription('Shop the latest fashions from ' + name + '.  Featuring products like ' + brands);
                        Page.setTitle('Shop ' + brands + ' outfits by ' + name);
                    });
                }
            },
            views: {
                profile: {
                    controller: 'SearchProfileCtrl',
                    controllerAs: 'profile',
                    templateUrl: 'modules/main/views/searchProfile.html'
                },
                results: {
                    controller: 'SearchResultsCtrl',
                    controllerAs: 'results',
                    templateUrl: 'modules/main/views/searchResults.html'
                }
            }
        }).state('store', {
            url: '/store/:handle?{session}{tt}{emi}',
            parent: 'main',
            controller: 'StoreMainCtrl',
            controllerAs: 'Store',
            templateUrl: 'modules/store/views/mainView.html'
        }).state('search', {
            url: '/browse?{session}{emi}{influencer}{sort}{term}',
            parent: 'main',
            controller: 'FilterCtrl',
            controllerAs: 'filter',
            templateUrl: 'modules/main/views/searchResultsView.html'
        }).state('tagging', {
            url: '/tagging',
            parent: 'main',
            controller: 'TaggingToolCtrl',
            controllerAs: 'taggingtool',
            templateUrl: 'modules/main/views/taggingTool.html'
        }).state('notifications', {
            url: '/notifications',
            parent: 'main',
            controller: 'NotificationsCtrl',
            controllerAs: 'notifications',
            templateUrl: 'modules/main/views/notifications.html'
        }).state('about-witlee', {
            url: '/about-witlee',
            parent: 'main',
            templateUrl: 'modules/main/views/about-witlee.html'
        }).state('privacy-policy', {
            url: '/privacy-policy',
            parent: 'main',
            templateUrl: 'modules/main/views/privacy-policy.html'
        }).state('contact', {
            url: '/contact',
            parent: 'main',
            templateUrl: 'modules/main/views/contact.html'
        }).state('term-of-use', {
            url: '/term-of-use',
            parent: 'main',
            templateUrl: 'modules/main/views/term-of-use.html'
        });

        $urlRouterProvider.otherwise('/');
        if(!window.wp_witlee_embed){
            $locationProvider.html5Mode(true);
        }

    });

}());

(function(){

    'use strict';
    angular.module('Witlee.main')
        .controller('baseCtrl', function (
            $scope,
            Page
        ) {

            $scope.Page = Page;

        });

}());

(function(){

    'use strict';
    angular.module('Witlee.main')
        .controller('productItemCtrl', function (
            $scope,
            wMixPanel,
            wCard,
            $modal,
            wProduct,
            $rootScope,
            wUser,
            $stateParams,
            $window
        ) {

            $scope.toProductPage= function(seed, prod){
                /*var modalInstance = $modal.open({
                 animation: true,
                 windowClass: 'witlee-modal product-more-info',
                 controller: 'productDetailsCtrl',
                 controllerAs: 'productDetails',
                 templateUrl: 'modules/main/views/wProductDetails.html',
                 size: 'lg',
                 resolve: {
                 currentProduct: function () {
                 return wProduct.productDetails(prod).then(function(response){
                 return response;
                 });
                 },
                 currentSeed: function(){
                 return seed;
                 }
                 }
                 });*/
                var currentSeed =  seed;
                var product = prod;
                var seed_id= currentSeed.id;
                var product_id= product.id;
                var storeLink= wProduct.getStoreLink(seed_id, product_id);
                $window.open(storeLink, '_blank');
            };

            /**
             * exclude seed funcionality, this will hide the current seed
             */
            $scope.excludeSeed = function(image, product, seed){
                var obj= {
                    product_id: product.id
                };
                var seed_id = seed.id;
                wProduct.excluseImagetileSeed(image, seed_id, obj).then(function(){
                    $rootScope.$broadcast('user:excludeproduct', {index:$scope.index, seed:$scope.seed.id});
                });
            };

            /**
             * verify if the current use is allowed to show that info
             */
            $scope.isAllow = function(){
                var current_user= wUser.getUser();
                var store_user= $scope.influencer.publisher.handle;
                if(!current_user){
                    return false;
                }
                if(current_user.username === store_user){
                    return true;
                }else if(current_user.account_status === 'staff'){
                    return true;
                }
            };

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('productDetailsCtrl', function (
            $scope,
            $window,
            $modalInstance,
            currentProduct,
            wProduct,
            currentSeed,
            wCard,
            wConfig,
            $timeout
        ) {

            /**
             * create the image with the path configurated on wConfig
             */
            $scope.image_close = wConfig.image_source() + 'X.svg';

            /**
             * initial params
             */
            $scope.cards= [];
            $scope.productItem= currentProduct;
            $scope.productImages= currentProduct.product_images;
            $scope.altProductImages= $scope.productImages;
            $timeout(function(){
                $scope.altProductImages= $scope.productImages;
            }, 500);
            $scope.currentRetailer= currentProduct.retailer_name;
            $scope.currentImage= $scope.productImages[0];

            $scope.productSizes= $scope.productItem.product_size.join(', ');
            $scope.currentDescription= $scope.productItem.short_description;
            $scope.showMore= true;
            $scope.productColors= $scope.productItem.product_color.map(function(color){
                return color.name;
            }).join(', ');

            /**
             * show the div with the extra product info
             */
            $scope.showMoreDescription= function(){
                $scope.currentDescription= $scope.productItem.long_description;
                $scope.showMore= false;
            };

            /**
             * change the current product image, this for the gallery
             */
            $scope.updateCurrentImage= function($index){
                $scope.currentImage= $scope.altProductImages[$index];
            };

            /**
             * close the current modal
             */
            $scope.closeTaggingTool= function(){
                $modalInstance.dismiss('cancel');
            };

            /**
             * listener, if the user change the current view the modal will close
             */
            $scope.$on('user:changeView', function() {
                $modalInstance.dismiss('cancel');
            });

            /**
             * Open the store with the store info and some other products
             */
            $scope.openStore= function(product){
                var seed_id= currentSeed.id;
                var product_id= product.id;
                var storeLink= wProduct.getStoreLink(seed_id, product_id);
                $window.open(storeLink, '_blank');
                $modalInstance.dismiss('cancel');
            };

            /**
             * initialize
             */
            var init= function(){
                wCard.getAll().then(function (response) {
                    $scope.cards = response.cards;
                    $scope.loading = false;
                    $scope.next= response.next;
                });
            };
            init();

            /**
             * funcionality to show or hide the current prodcts
             */
            $scope.showornot = function($index){
                var container_h = angular.element('.images-container').height();
                if($index*60 > container_h){
                    return false;
                }
                return true;
            };

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('FilterCtrl', function (
            $scope,
            $timeout,
            $rootScope,
            wCard,
            searchFilter,
            wProduct,
            wConfig,
            $stateParams,
            $state,
            wProfile,
            Page,
            wInfluencer
        ) {

            /**
             * analytics for emi
             */
            if($stateParams.emi){
                $rootScope.emi = $stateParams.emi;
            }
            if($stateParams.influencer){
                $rootScope.pre_influencer = $stateParams.influencer;
            }
            if($stateParams.sort){
                $rootScope.pre_sort = $stateParams.sort;
            }
            if($stateParams.term){
                $rootScope.pre_term = $stateParams.term;
            }

            var force_search;

            /**
             * [verify if the dest param on the login process is from this page, verify the params send back from api and start session process on the backend]
             */
            if($stateParams.session){
                wProfile.storeSession($stateParams.session);
                $state.go('search', {
                    session: undefined,
                    emi: undefined,
                    influencer: undefined,
                    sort: undefined,
                    term: undefined
                });
                return;
            }else if($stateParams.emi){
                $state.go('search', {
                    session:undefined,
                    emi:undefined,
                    influencer: undefined,
                    sort: undefined,
                    term: undefined
                });
                return;
            }else if($stateParams.influencer || $stateParams.sort || $stateParams.term){
                $state.go('search', {
                    session:undefined,
                    emi:undefined,
                    influencer: undefined,
                    sort: undefined,
                    term: undefined
                });
                return;
            }

            if($rootScope.pre_influencer || $rootScope.pre_sort || $rootScope.pre_term){
                force_search = true;
                searchFilter.clearFilters();
                if($rootScope.pre_term){
                    searchFilter.addTerm($rootScope.pre_term);
                }
                if($rootScope.pre_sort){
                    searchFilter.addSort($rootScope.pre_sort);
                }
                if($rootScope.pre_influencer){
                    wInfluencer.getDetailsUid($rootScope.pre_influencer).then(function (result) {
                        var uuid = result.profile.uuid;
                        var term= result.profile.username.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                        searchFilter.getViewParams({id: uuid.toString(), term: term, type: 'influencer', realTerm: result.profile.username});
                        $rootScope.pre_influencer = null;
                        $rootScope.pre_sort = null;
                        $rootScope.pre_term = null;
                        searchFilter.filter();
                    });
                }else{
                    $rootScope.pre_influencer = null;
                    $rootScope.pre_sort = null;
                    $rootScope.pre_term = null;
                    searchFilter.filter();
                }
            }

            /**
             * [analytics send params]
             */
            var analytics = {
                'event': 'search_page',
                'sub_event': 'visit'
            };
            if($rootScope.emi){
                analytics.email_id = $rootScope.emi;
                $rootScope.emi = null;
            }
            wProfile.analytics(analytics, 'search_page');
            /**
             * End Analytics
             */

            /**
             * [define the source images used on the current page]
             */
            $scope.image_arrow = wConfig.image_source() + 'arrow.png';
            $scope.image_close = wConfig.image_source() + 'X.svg';

            /**
             * initialize perfect scroll bar for the list of cards
             */
            if(jQuery('.filter-layer-checkbox').size()){
                jQuery('.filter-layer-checkbox').perfectScrollbar();
            }

            /**
             * [current_uuid start as null and it will replace if we are in an embed site]
             */
            $scope.current_uuid = null;
            if(window.wp_witlee_uuid){
                $scope.current_uuid= window.wp_witlee_uuid;
                wConfig.setUuid(window.wp_witlee_uuid);
            }
            if(window.wp_witlee_theme){
                wConfig.setTheme(window.wp_witlee_theme);
            }
            if(window.wp_witlee_embed){
                wConfig.setEmbed(window.wp_witlee_embed);
            }

            /**
             * initial params
             */
            var full_category_store = null;
            var result_categories = [];
            var selected_subcategories = [];
            var selected_categories = [];
            $scope.tag_categories = [];
            $scope.tag_subcategories = [];
            $scope.loadingdata = true;
            $scope.nodata = false;
            var checkBoxMenu= [];
            var checkBoxMenu_temp= [];
            var full_categories = [];
            $scope.count= 0;
            $scope.cards= [];
            $scope.navigate = false;
            $scope.menuStatus = [{
                isOpen : false
            },{
                isOpen : false
            },{
                isOpen : false
            }];
            $scope.if_menu_items= {
                'brand': 0,
                'category': 0,
                'influencer': 0
            };
            $scope.filterSortOrder= {
                'popular': 'most popular',
                'new': 'newest',
                'best': 'best seller'
            };
            $scope.filterItemsMenuAlt=[];
            var ctrl = this;
            var loading = true;
            var currentCategoryOpen = null;

            /**
             * list all the categories
             */
            wProduct.getCategories().then(function(response){
                $scope.categories = response;
            });

            /**
             * open the subcategories list, once you click on each category
             */
            $scope.openSubcategories = function($index, category){
                if(category.subcategory.length === 0){
                    return;
                }
                if($index === currentCategoryOpen){
                    currentCategoryOpen = null;
                }else{
                    currentCategoryOpen = $index;
                }
            };

            /**
             * verify if the current category is open
             */
            $scope.isOpen = function($index){
                if ($index === currentCategoryOpen){
                    return true;
                }
                return false;
            };

            /**
             * verify if the category have items
             */
            $scope.categoryItems = function(){
                if(selected_subcategories.length > 0 || selected_categories.length > 0){
                    return true;
                }
                return false;
            };

            /**
             * verify if the current subcategory was selected
             */
            $scope.checkedIfSubcategory= function(category, sub){
                var clase = '';
                angular.forEach(selected_subcategories, function(subcategory){
                    if(subcategory.sub_id === sub.id){
                        clase = 'selected';
                    }
                });
                // angular.forEach($scope.tag_subcategories, function(tag, k){
                // 	if(tag.sub_id === sub.id){
                // 		$scope.tag_subcategories[k].details = sub;
                // 	}
                // });
                return clase;
            };

            /**
             * verify if the subcategory was selected for mobile list
             */
            $scope.checkedIfSubcategoryMobile= function(category, sub){
                var clase = '';
                angular.forEach($scope.sub_categories_selected_temp, function(subcategory){
                    if(subcategory.sub_id === sub.id){
                        clase = 'selected';
                    }
                });
                return clase;
            };

            /**
             * select all the subcategories in the selected category
             */
            $scope.selectAll = function(category){
                var cats = result_categories.map(function(item){
                    return item.id;
                });
                var index = cats.indexOf(category.id);
                var subcategories = result_categories[index].sub_category;
                subcategories = subcategories.map(function(item){
                    return item.id;
                });
                angular.forEach(category.subcategory, function(subcategory){
                    if(_.contains(subcategories, subcategory.id)){
                        searchFilter.selectSubCategory(category, subcategory);
                    }
                });
                searchFilter.filter();
            };

            /**
             * detect if the user select a category on the main menu
             */
            $scope.$on('user:menufilter', function($event, response){
                angular.forEach($scope.categories, function(category){
                    if(category.id === response.category.id){
                        $scope.selectAll(category);
                        return;
                    }
                });
            });

            /**
             * show the total subcategories
             */
            $scope.totalResults = function(category){
                var cats = result_categories.map(function(item){
                    return item.id;
                });
                if(_.contains(cats, category.id)){
                    var index = cats.indexOf(category.id);
                    return result_categories[index].count;
                }
                return 0;
            };

            /**
             * show the total items in the subcategory
             */
            $scope.totalResultsSubcategory = function(category, subcategory){
                var cats = result_categories.map(function(item){
                    return item.id;
                });
                if(_.contains(cats, category.id)){
                    var index = cats.indexOf(category.id);
                    var subcategories = result_categories[index].sub_category;
                    subcategories = subcategories.map(function(item){
                        return item.id;
                    });
                    if(_.contains(subcategories, subcategory.id)){
                        var subindex = subcategories.indexOf(subcategory.id);
                        return result_categories[index].sub_category[subindex].count;
                    }
                }
                return 0;
            };

            /**
             * hide the current subcategory if there are no items
             */
            $scope.subCategoryResult = function(category, subcategory){
                var cats = result_categories.map(function(item){
                    return item.id;
                });
                if(!_.contains(cats, category.id)){
                    return 'hidden';
                }else{
                    var index = cats.indexOf(category.id);
                    var subcategories = result_categories[index].sub_category;
                    subcategories = subcategories.map(function(item){
                        return item.id;
                    });
                    if(!_.contains(subcategories, subcategory.id)){
                        return 'hidden';
                    }
                }
            };

            /**
             * hide the current subcategory if there are no items
             */
            $scope.subCategoryResultMobile = function(category, subcategory){
                var cats = result_categories.map(function(item){
                    return item.id;
                });
                if(!_.contains(cats, category.id)){
                    return 'hidden';
                }else{
                    var index = cats.indexOf(category.id);
                    var subcategories = result_categories[index].sub_category;
                    subcategories = subcategories.map(function(item){
                        return item.id;
                    });
                    if(!_.contains(subcategories, subcategory.id)){
                        return 'hidden';
                    }
                }
            };

            /**
             * verify if the category is already full selected
             */
            $scope.checkParentFull = function(category){
                var cats = result_categories.map(function(item){
                    return item.id;
                });
                if(!_.contains(cats, category.id)){
                    return 'hidden';
                }
                cats = $scope.tag_categories.map(function(item){
                    return item.id;
                });
                if(_.contains(selected_categories, category.id)){
                    if(!_.contains(cats, category.id)){
                        $scope.tag_categories.push(category);
                    }
                    return 'full-selected';
                }else{
                    if(selected_categories.length === 0){
                        $scope.tag_categories = [];
                    }else{
                        var tmp_tags = $scope.tag_categories;
                        var true_tags = [];
                        angular.forEach(tmp_tags, function(tag){
                            if(_.contains(selected_categories, tag.id)){
                                true_tags.push(tag);
                            }
                        });
                        $scope.tag_categories = true_tags;
                    }
                }
                var clase = '';
                var subcats = selected_subcategories.map(function(item){
                    return item.cat_id;
                });
                if(_.contains(subcats, category.id)){
                    clase = 'partial-selected';
                }
                return clase;
            };

            /**
             * populate the initial params after make a search
             */
            var mainParams= function(searchResult){
                $scope.cards= searchResult.cards;
                $scope.count= searchResult.count;
                $scope.people= searchResult.influencers;
                $scope.topPeople= $scope.people.slice(0, 5);
                $scope.brands= searchResult.brands;
                $scope.topBrands= $scope.brands.slice(0, 5);
                $scope.next= searchResult.next;
                checkBoxMenu= searchResult.checkBoxMenu;
                $scope.filterItemsMenuAlt= searchResult.filterItemsMenuAlt;
                $scope.if_menu_items= searchResult.if_menu_items;
                $scope.sort= searchResult.sort;
                $scope.filterSortSelected = $scope.filterSortOrder[ $scope.sort ];
                $scope.full_cat = searchResult.full_cat;
                if($scope.full_cat){
                    $scope.cards = [];
                }

                angular.element('input[name=searchInput]').val(searchResult.term);

                $timeout(function(){
                    if($scope.full_cat){
                        angular.forEach($scope.categories, function(category){
                            if(category.id === $scope.full_cat){
                                $scope.selectAll(category);
                                return;
                            }
                        });
                    }
                }, 200);
            };

            /**
             * initialize the filter page getting the cards from the API, this conditional verify if the site was reloaded or if the user make a search (new or search again with new terms)
             */
            if(!searchFilter.broadCast() && !force_search){
                var searchResult = null;
                searchFilter.filter(1).then(function(response){
                    if(response=== 401){
                        searchFilter.filter(1).then(function(response){
                            loading= false;
                            searchResult= response;
                            mainParams(searchResult);
                        });
                        return;
                    }
                    loading= false;
                    searchResult= response;
                    mainParams(searchResult);
                });
            }

            /**
             * detect if users are on the filter page and make a new search with new terms
             */
            $scope.$on('user:newsearch', function($event, response) {
                $scope.nodata = false;
                $scope.cards= [];
                full_category_store = response.categories_full_store;
                selected_categories = response.categories_selected;
                selected_subcategories = response.subcategories_selected;
                $scope.tag_subcategories = selected_subcategories;
                result_categories = response.categories_result;
                $scope.sub_categories_selected_temp = response.subcategories_selected;
                $scope.loadingdata = true;
                $timeout(function () {
                    loading= false;
                    var searchResult= response;
                    $scope.cards= searchResult.cards;
                    $scope.count= searchResult.count;
                    $scope.people= searchResult.influencers;
                    $scope.brands= searchResult.brands;
                    $scope.topBrands= $scope.brands.slice(0, 5);
                    $scope.next= searchResult.next;
                    checkBoxMenu= searchResult.checkBoxMenu;
                    $scope.filterItemsMenuAlt= searchResult.filterItemsMenuAlt;
                    $scope.if_menu_items= searchResult.if_menu_items;
                    $scope.sort= searchResult.sort;
                    $scope.filterSortSelected = $scope.filterSortOrder[ $scope.sort ];
                    full_categories = response.full_categories;
                    if($scope.cards.length === 0){
                        $scope.nodata = true;
                        Page.setTitle('Search outfits from our top Influencers');
                        Page.setDescription('Search outfits from our top Influencers');
                    } else if ($scope.people.length === 1) {
                        if ($scope.tag_subcategories.length > 0) {
                            $timeout(function () {
                                var subcategories = "";
                                for (var o = 0; o < $scope.tag_subcategories.length; o ++) {
                                    if (o === 0) {
                                        subcategories += $scope.tag_subcategories[o].details.term;
                                    } else if (o === 1) {
                                        subcategories += ', ' + $scope.tag_subcategories[o].details.term;
                                    } else if (o === 2) {
                                        subcategories += ' and ' + $scope.tag_subcategories[o].details.term;
                                    } else {
                                        break;
                                    }
                                }
                                Page.setTitle('Shop ' + subcategories + ' from ' + $scope.people[0].name);
                                Page.setDescription('Shop ' + subcategories + ' from ' + $scope.people[0].name);
                            }, 100);
                        } else {
                            Page.setTitle('Shop outfits from ' + $scope.people[0].name);
                            Page.setDescription('Shop outfits from ' + $scope.people[0].name);
                        }
                    } else if ($scope.if_menu_items.brand > 0) {
                        var brands = '';
                        var i;
                        for (i = 0; i < $scope.if_menu_items.brand; i++) {
                            if (i === 0) {
                                brands += ($scope.brands[i].name);
                            } else if ((i > 0) && (i < $scope.if_menu_items.brand - 1)) {
                                brands += ', ' + $scope.brands[i].name;
                            } else {
                                brands += ' and ' + $scope.brands[i].name;
                            }
                        }
                        if ($scope.people.length > 0) {
                            var influencers = '';
                            var k;
                            for (k = 0; k < $scope.people.length; k++) {
                                if (k === 0) {
                                    influencers += ($scope.people[k].name);
                                } else if ((k > 0) && (i < $scope.people.length - 1)) {
                                    influencers += ', ' + $scope.people[k].name;
                                } else {
                                    influencers += ' and ' + $scope.people[k].name;
                                }
                            }
                            Page.setTitle('Shop outfits from ' + influencers + '. Brands from ' +  brands);
                            Page.setDescription('Shop outfits from ' + influencers + '. Brands from ' + brands);
                        } else {
                            Page.setTitle('Shop outfits from ' + brands);
                            Page.setDescription('Shop outfits from ' + brands);
                        }
                    } else {
                        Page.setTitle('Search outfits from our top Influencers');
                        Page.setDescription('Search outfits from our top Influencers');
                    }
                    angular.element('input[name=searchInput]').val(searchResult.term);
                    $scope.loadingdata = false;
                }, 50);
            });

            /**
             * open and shuts the menu for mobile version
             */
            $scope.toggleNavigate = function(search) {
                var res = null;
                if(!search){
                    res= searchFilter.openMobileFilter();
                }else{
                    res= searchFilter.closeMobileFilter();
                }
                $scope.sub_categories_selected_temp = selected_subcategories;
                $scope.if_menu_items_temp= res.if_menu_items_temp;
                checkBoxMenu_temp= res.checkBoxMenu_temp;
                jQuery('body').toggleClass('o-hidden');
                jQuery('.form-btn-mobile').toggleClass('fixed');
                $scope.navigate = !$scope.navigate;
                return;
            };

            /**
             * make the search for mobile, once you select the categories and click on Apply button
             */
            $scope.filterMobile = function() {
                searchFilter.searchMobileFilter();
                searchFilter.makeMobileReal();
                searchFilter.filter();
                $scope.toggleNavigate(true);
            };

            /**
             * clear the current selected categories, for mobile
             */
            $scope.clearAll = function() {
                searchFilter.clearFilters();
                var res= searchFilter.clearMobileFilter();
                $scope.if_menu_items_temp= res.if_menu_items_temp;
                checkBoxMenu_temp= res.checkBoxMenu_temp;
                searchFilter.filter();
                $scope.toggleNavigate(true);
            };

            $scope.filterSortSelected = $scope.filterSortOrder[$scope.sort];
            $scope.filterUpdateSortOrder = function ( selectedValue ) {
                searchFilter.addSort(selectedValue);
                $scope.filterSortSelected = $scope.filterSortOrder[ selectedValue ];
                searchFilter.filter();
            };

            /**
             * verify if the current subcategory was selected
             */
            $scope.checkedIf= function(term){
                if (_.contains(checkBoxMenu, term)){
                    return true;
                }
                return false;
            };
            $scope.checkedIfMobile= function(term){
                if (_.contains(checkBoxMenu_temp, term)){
                    return true;
                }
                return false;
            };

            /**
             * pagination, get more cards from API
             */
            ctrl.nextPage = function() {
                var url= $scope.next;
                if (loading || $scope.count < 10 || url === null){
                    return;
                }
                $scope.loadingdata = true;
                loading = true;
                wCard.nextPage(url).then(function (result) {
                    if (!result.error) {
                        $scope.next= result.next;
                        if(result.cards.length>0){
                            Array.prototype.push.apply($scope.cards, result.cards);
                            loading = false;
                        }
                    }else{
                        loading = true;
                    }
                    $scope.loadingdata = false;
                });
            };

            /**
             * selec event, after you click on a subcategory item
             */
            $scope.setSelectedItemMobile = function(obj, type){
                var id= null;
                id= obj.uuid;
                var term= obj.term.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                var res= searchFilter.getViewParams_temp({id: id, term: term, type: type, realTerm: obj.term});
                $scope.if_menu_items_temp= res.if_menu_items_temp;
                checkBoxMenu_temp= res.checkBoxMenu_temp;
            };
            $scope.setSelectedSubCategory = function(subcategory, category){
                searchFilter.selectSubCategory(category, subcategory);
                searchFilter.filter();
            };
            $scope.setSelectedSubCategoryMobile = function(subcategory, category){
                var res = searchFilter.selectSubCategoryTemp(category, subcategory);
                $scope.sub_categories_selected_temp = res.sub_categories_selected_temp;
            };
            $scope.setSelectedItem= function(obj, type){
                var id= obj.uuid;
                var term= '';
                var realTerm= '';
                if(type === 'influencer'){
                    if(obj.term){
                        term= obj.term.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                    }else if(obj.username){
                        term= obj.username.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                    }
                    realTerm= obj.name;
                }else{
                    if(obj.term){
                        term= obj.term.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                        realTerm= obj.term;
                    }else if(obj.name){
                        term= obj.name.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                        realTerm= obj.name;
                    }
                }
                searchFilter.getViewParams({id: id, term: term, type: type, realTerm: realTerm});
                searchFilter.filter();
            };

            /**
             * remove subcategory selected
             */
            $scope.removeSubcategory = function(subcategory){
                var category = {id:subcategory.cat_id};
                searchFilter.removeSubcategory(category, subcategory);
                searchFilter.filter();
            };
            $scope.removeFullCategory = function(category){
                searchFilter.removeFullCategory(category);
                searchFilter.filter();
            };
            $scope.removeSelectedItem= function(obj, type){
                var param= null;
                if(type==='category'){
                    $scope.removeFullCategory(obj);
                }else{
                    param= {uuid: obj.id.toString(), term: obj.name};
                    $scope.setSelectedItem(param, type);
                }
            };

            /**
             * filter page menu events
             */
            var openCloseMenu= function(elem){
                if(elem.hasClass('active')) {
                    elem.removeClass('active');
                } else {
                    jQuery('.filter-layer.active').removeClass('active');
                    elem.addClass('active');
                }
            };
            jQuery('.menu-item-label').on('click', function() {
                var elem= jQuery(this).closest('li');
                openCloseMenu(elem.find('.filter-layer'));
                jQuery(document).one('click', function closeMenu (e){
                    if(elem.has(e.target).length === 0){
                        elem.find('.filter-layer').removeClass('active');
                    } else {
                        jQuery(document).one('click', closeMenu);
                    }
                });
                if(jQuery('.filter-layer-checkbox').size()){
                    jQuery('.filter-layer-checkbox').perfectScrollbar('update');
                }
            });

            var global_store= jQuery('.filter-menu-filter-container');
            var last_scrolltop= 0;
            var top = '0px';
            var initial_top = '-60px';
            $scope.sticky_max_style = '';
            $scope.position_container = 0;
            if(typeof window.wp_witlee_sticky !== 'undefined'){
                var sticky = window.wp_witlee_sticky;
                if(sticky){
                    sticky = sticky.replace(/[^a-zA-Z_-]/g, '');
                    var elem_id = angular.element('#'+sticky);
                    var elem_class = angular.element('.'+sticky);
                    if(elem_id.size()){
                        top = elem_id.height() + 'px';
                    }else if(elem_class.size()){
                        top = elem_class.height() + 'px';
                    }
                }
                $scope.sticky_max_style = 'max-width:'+jQuery('#wp-witlee').width()+'px';
                $scope.position_container = jQuery('#wp-witlee').offset().top;
            }

            jQuery(window).resize(function() {
                initial_top = '-' + jQuery('#filter-menu').height() + 'px';
                if(typeof window.wp_witlee_sticky !== 'undefined'){
                    $scope.sticky_max_style = 'max-width:'+jQuery('#wp-witlee').width()+'px';
                }
                jQuery('.filter-page-container').css({'padding-top':jQuery('#filter-menu').height() + 'px'});
                $timeout(function(){
                    jQuery('.filter-page-container').css({'padding-top':jQuery('#filter-menu').height() + 'px'});
                }, 100);
            });
            var scrolling = false;
            $timeout(function() {
                if(angular.element('.searchResult').size()){

                    /**
                     * old infinite scroll functionality
                     */
                    /*jQuery('.main').scroll(function(){
                     var _WidthScreen= jQuery(window).width();
                     if(_WidthScreen <= 756){
                     var tope= 4*jQuery(window).height();
                     var topHome= -1*jQuery('.home').offset().top;
                     var limit= jQuery('.cards').height();
                     if(limit-tope<= topHome){
                     ctrl.nextPage();
                     }
                     }
                     });*/
                    jQuery(window).scroll(function(){
                        if(scrolling){
                            return;
                        }
                        scrolling = true;
                        var current_header = jQuery('#main_nav').height();
                        initial_top = '-' + jQuery('#filter-menu').height() + 'px';
                        var elem= jQuery(this);
                        var current_scroll= elem.scrollTop();
                        if(current_scroll <= $scope.position_container + current_header){
                            if(typeof window.wp_witlee_sticky !== 'undefined'){
                                global_store.removeClass('fixed');
                                global_store.css({'top':0});
                            }else{
                                global_store.css({'top':top});
                            }
                        }else if(current_scroll>$scope.position_container + 100 + current_header){
                            global_store.addClass('fixed');
                            if(current_scroll> last_scrolltop){
                                global_store.css({'top':initial_top});
                            }else{
                                if(typeof window.wp_witlee_sticky === 'undefined'){
                                    top = '100px';
                                    if(jQuery(window).width()<=767){
                                        top= '74px';
                                    }
                                }
                                global_store.css({'top':top});
                            }
                        }
                        last_scrolltop= current_scroll;
                        scrolling = false;

                    });
                }
            }, 100);

            /**
             * search brands on the filter page menu
             */
            $scope.filterBrands= function(){
                $scope.filteredBrands= [];
                var params= {name: $scope.filter_brand};
                wCard.filterBrands(params).then(function(response){
                    $scope.filterError= '';
                    if(response === 404){
                        $scope.filterError= 'No matches were found.';
                        return;
                    }
                    $scope.filteredBrands= response;
                });
            };

            /**
             * search people on the filter page menu
             */
            $scope.filterPeople= function(){
                var params= {term: $scope.filter_person};
                wCard.filterPeople(params).then(function(response){
                    $scope.personFilterError= '';
                    if(response === 404){
                        $scope.personFilterError= 'No matches were found.';
                        return;
                    }
                    $scope.filteredPeople= response;
                });
            };

            /**
             * search people, brands on filter page mobile menu
             */
            $scope.searchMobile = {};
            $scope.filterPeopleMobile= function(){
                var params= {term: $scope.searchMobile.person};
                wCard.filterPeople(params).then(function(response){
                    $scope.personFilterError= '';
                    if(response === 404){
                        $scope.personFilterError= 'No matches were found.';
                        return;
                    }
                    $scope.filteredPeople= response;
                });
            };
            $scope.filterBrandsMobile= function(){
                $scope.filteredBrands= [];
                var params= {name: $scope.searchMobile.brand};
                wCard.filterBrands(params).then(function(response){
                    $scope.filterError= '';
                    if(response === 404){
                        $scope.filterError= 'No matches were found.';
                        return;
                    }
                    $scope.filteredBrands= response;
                });
            };

            /**
             * autocomplete, fires when user keypress
             */
            $scope.preFilter= function(){
                $timeout(function () {
                    if($scope.filter_brand && $scope.filter_brand.length >= 3){
                        $scope.filterBrands();
                    }
                },100);
            };

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('HomeCtrl', function (
            $scope,
            wCard,
            wMixPanel,
            wConfig,
            $state,
            $stateParams,
            $rootScope,
            wProfile,
            Page
        ) {

            Page.setTitle('Inspired Fashion Shopping');
            Page.setDescription('Inspired Fashion Shopping');

            /**
             * analytics for emi
             */
            if($stateParams.emi){
                $rootScope.emi = $stateParams.emi;
            }

            /**
             * verify if the current url contain the session params that allow users to log in
             * if not, send mixPanel event
             */
            if($stateParams.session){
                wProfile.storeSession($stateParams.session);
                $state.go('home', {
                    session:undefined,
                    emi:undefined
                });
                return;
            }else if($stateParams.emi){
                $state.go('home', {
                    session:undefined,
                    emi:undefined
                });
                return;
            }

            if(window.allow_ga_mp){
                wMixPanel.sendData('home page', {'load': true});
            }

            /**
             * [analytics send params]
             */
            var analytics = {
                'event': 'home_page',
                'sub_event': 'visit'
            };
            if($rootScope.emi){
                analytics.email_id = $rootScope.emi;
                $rootScope.emi = null;
            }
            wProfile.analytics(analytics, 'home_page');

            /**
             * verify if the current site if embed or not
             */
            if(window.wp_witlee_theme){
                wConfig.setTheme(window.wp_witlee_theme);
            }
            if(window.wp_witlee_embed){
                wConfig.setEmbed(window.wp_witlee_embed);
            }
            if(window.wp_witlee_uuid){
                wConfig.setUuid(window.wp_witlee_uuid);
                $state.go('store', {handle: window.wp_witlee_uuid });
            }

            /**
             * Initial params
             */
            var ctrl = this;
            ctrl.cards = [];
            ctrl.loading = true;
            ctrl.feed = {params: {page: 1}};
            var loadingdata = false;

            /**
             * initialize
             */
            ctrl.init = function () {
                loadingdata = true;
                ctrl.feed.params = {page: 1};
                wCard.getAll().then(function (response) {
                    if(response === 401){
                        ctrl.init();
                        return;
                    }
                    ctrl.cards = response.cards;
                    ctrl.loading = false;
                    $scope.next= response.next;
                    ctrl.feed.params.page++;
                    loadingdata = false;
                });
            };

            /**
             * get more data, for infinite scroll
             */
            ctrl.getMore = function () {
                if($scope.next===null){
                    return;
                }
                if (ctrl.loading){
                    return;
                }
                loadingdata = true;
                ctrl.loading = true;
                wCard.getMore( $scope.next ).then(function (response) {
                    if(window.allow_ga_mp){
                        wMixPanel.sendData('home page', {
                            'load' : false,
                            'scroll' : ctrl.feed.params.page
                        });
                    }
                    Array.prototype.push.apply(ctrl.cards, response.cards);
                    $scope.next= response.next;
                    ctrl.feed.params.page++;
                    ctrl.loading = false;
                    loadingdata = false;
                });
            };

            /**
             * listener function for reload and initialize the current controller again
             */
            $scope.$on('home:reload', function () {
                $scope.next= null;
                ctrl.init();
            });

        });

}());

(function(){

    'use strict';
    angular.module('Witlee.main')
        .controller('navBarCtrl', function (
            $scope,
            $rootScope,
            $state,
            $modal,
            $timeout,
            $location,
            $window,
            wUser,
            wProfile,
            wConfig,
            searchFilter,
            wCard,
            wMixPanel,
            wPerson
        ) {

            /**
             * [images from the source configurate on wCofig]
             */
            $scope.image_menu = wConfig.image_source() + 'hamburger.png';
            $scope.image_logo = wConfig.image_source() + 'witlee.png';
            $scope.image_logo_main = wConfig.image_source() + 'placeholder-logo.png';
            $scope.image_search = wConfig.image_source() + 'search.svg';
            $scope.image_close = wConfig.image_source() + 'X.svg';

            /**
             * [current_uuid initialize as null until there is uuid passed on the plugin]
             * @type string
             */
            $scope.current_uuid = null;
            if(window.wp_witlee_uuid){
                $scope.current_uuid= window.wp_witlee_uuid;
                wConfig.setUuid(window.wp_witlee_uuid);
                if(window.allow_ga_mp){
                    wMixPanel.sendData('embed site', {'influencer': window.wp_witlee_uuid, 'embed': true});
                }
            }

            /**
             * [wp_witlee_theme could be light or dark, this will change the current page styles]
             */
            if(window.wp_witlee_theme){
                wConfig.setTheme(window.wp_witlee_theme);
            }

            /**
             * [wp_witlee_embed verify if is a embed site, this params will be pass in the wordpress plugin]
             */
            if(window.wp_witlee_embed){
                wConfig.setEmbed(window.wp_witlee_embed);
            }

            /**
             * [verify if there is a current user logged in]
             * @type {[type]}
             */
            $scope.currentUser= wUser.getUser();
            $scope.getLogged= function(){
                if(wProfile.userToken()){
                    wProfile.getLogged().then(function(res){
                        if(res === 401){
                            return;
                        }
                        $scope.isLogged= wUser.logIn(res);
                        $scope.currentUser= wUser.getUser();
                        if(wProfile.needEmail()==='true' && !window.wp_witlee_uuid){
                            runEmialVerification();
                        }
                    });
                }
            };
            $scope.getLogged();

            /**
             * [this script listen if the user logged in from another controller]
             */
            /*$scope.$on('user:loggedin', function () {
             $scope.getLogged();
             });*/

            /**
             * [toStore send users to their storefront page]
             */
            $scope.toStore = function(){
                $state.go('store', {handle : $scope.currentUser.username});
            };

            /**
             * [runEmialVerification pop up a modal if the user have no email registered]
             */
            var runEmialVerification= function(){
                $modal.open({
                    animation: true,
                    windowClass: 'witlee-modal mail-verification-modal',
                    controller: 'mailVerificationCtrl',
                    controllerAs: 'mailVerification',
                    templateUrl: 'modules/main/views/mailVerification.html'
                });
            };

            /**
             * [initialize params]
             */
            var ctrl = this;
            ctrl.cards = [];
            ctrl.enabled = true;
            ctrl.count = 0;
            ctrl.searchTerms = searchFilter.getTerm();
            ctrl.menuMobile = false;
            ctrl.search = true;
            ctrl.allowSubs = false;
            var allowScroll= true;

            /**
             * [login redirect user to API to start the login process]
             * @param  int mob [empty / 1 if you are on mobile]
             */
            $scope.login = function (mob) {
                var dest= window.location.href;
                if(mob){
                    $scope.toggleMainNavigate();
                }
                $window.location.href= wConfig.instagramLogin(dest);
            };

            /**
             * [reloadImages reload the current site getting all the images again]
             */
            ctrl.reloadImages = function () {
                if ($state.current.name === 'home'){
                    $rootScope.$broadcast('home:reload');
                }
            };

            /**
             * [disabledSearch]
             */
            ctrl.disabledSearch = function() {
                ctrl.search = false;
            };

            /**
             * [enabledSearch]
             */
            ctrl.enabledSearch = function() {
                $timeout( function(){
                    ctrl.search = true;
                }, 500);
            };

            /**
             * [searchKeyPress start the search event]
             */
            ctrl.searchKeyPress = function() {

                /**
                 * [analytics send params]
                 */
                var analytics = {'event': 'navbar_search', 'sub_event': 'search', 'terms': ctrl.searchTerms};
                wProfile.analytics(analytics, 'navbar_search');
                /**
                 * End Analytics
                 */

                searchFilter.addTerm(ctrl.searchTerms);
                var target = angular.element('form.mobile-search');
                var elem = target.find('input');
                elem.blur();
                searchFilter.filter();
            };

            /**
             * [goToStatic redirect user to static sites (Privacy, about, terms)]
             */
            $scope.goToStatic= function(staticUrl){
                $scope.toggleMainNavigate();
                $state.go(staticUrl);
            };

            /**
             * [logOut destroy session data]
             */
            $scope.logOut= function(mob){
                wProfile.logOutUser().then(function(){
                    $scope.isLogged = false;
                    if(mob){
                        $scope.toggleMainNavigate();
                    }
                });
            };

            $scope.toggleMainNavigate = function(search) {
                angular.element('.filter-layer-more').removeClass('active');
                var elem= jQuery('body');
                var top= jQuery(window).scrollTop();
                allowScroll= false;
                elem.toggleClass('o-hidden-main');
                if(!elem.hasClass('o-hidden-main')){
                    allowScroll= true;
                    top= 0;
                }
                elem.find('.filter-mobile-container').css({marginTop:top});
                $scope.navigate = !$scope.navigate;
                jQuery('.filter-mobile').scrollTop(0);
                ctrl.enabled = false;
                $timeout( function(){
                    ctrl.enabled = true;
                }, 1000);
                if (search) {
                    ctrl.enabledSearch();
                } else {
                    ctrl.disabledSearch();
                }
            };

            ctrl.blur = function() {
                ctrl.menuMobile = false;
            };

            /**
             * [detect the device and create a blur event, this will work for ios chrome and some other browsers]
             */
            if(/iPhone|iPod|Android|iPad/.test(window.navigator.platform)){
                jQuery(document).on('focus', 'input[name="searchInputMobile"]', function() {
                    jQuery('body').scrollTop(window.pageYOffset);
                    jQuery('nav').css({'position':'absolute', 'top':window.pageYOffset});
                }).on('blur', 'input[name="searchInputMobile"]', function() {
                    jQuery('nav').css({'position':'', 'top':0});
                });
            }

            ctrl.focus = function(event) {
                $timeout( function(){
                    var inp = jQuery(event.target);
                    var len = inp.val().length;
                    inp[0].focus();
                    inp[0].setSelectionRange(len, len);
                }, 500);
                ctrl.menuMobile = true;
            };

            /**
             * [menu initialize params]
             */
            $scope.categories= [];
            $scope.brands= [];
            $scope.people= [];

            /**
             * [menuInit get menu data from API]
             */
            var menuInit= function(){
                wPerson.mainMenu().then(function(response){
                    $scope.categories= response.category;
                    $scope.brands= response.brand;
                    $scope.people= response.influencer;
                    $scope.hashtags = response.hashtag;
                });
            };
            menuInit();

            /**
             * [goToFn this will close the main menu when you click on some item]
             */
            var goToFn= function(mob){
                if(mob>0){
                    $scope.toggleMainNavigate();
                }else{
                    var target= jQuery('.main-menu-item-label');
                    var elem= target.closest('div');
                    target.removeClass('active');
                    elem.find('.main-filter-layer').removeClass('active');
                }
            };

            /**
             * [search functions]
             */
            var goToSearchPpl= function(term){
                $state.go('store', {handle:term});
            };
            $scope.searchCall= function(type, realTerm, id){
                var term= realTerm.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                searchFilter.getViewParams({id: id.toString(), term: term, type: type, realTerm: realTerm});
            };
            $scope.goSearchHashtag= function(toSearch, mob){
                goToFn(mob);
                searchFilter.clearFilters();
                searchFilter.addTerm(toSearch);
                searchFilter.filter();
            };
            $scope.goSearchBrand= function(brand, mob){
                goToFn(mob);
                searchFilter.clearFilters();
                $scope.searchCall('brand', brand.term, brand.uuid);
                searchFilter.filter();
            };
            $scope.goSearchCategory= function(category, mob){
                goToFn(mob);
                searchFilter.clearFilters();
                searchFilter.addFullCategory(category.id);
                if ($state.current.name !== 'search'){
                    $state.go('search', {t:undefined,ne:undefined});
                }else{
                    $rootScope.$broadcast('user:menufilter', {category: category});
                }
            };
            $scope.goSearchInfluencer= function(item, mob){
                var term = item.term;
                goToFn(mob);
                goToSearchPpl(term);
            };

            $scope.loading = false;
            $scope.successSubs = false;

            $scope.$on('navbar:subscription', function($event, uuid) {
                $scope.handle = uuid;
                $timeout( function(){
                    ctrl.allowSubs = !ctrl.allowSubs;
                }, 2000);
            });

            $scope.$on('navbar:afterSend', function($event, res) {
                $scope.loading = false;
                if (res) {
                    $scope.successSubs = true;
                    var object = {
                        value: true,
                        timestamp: new Date()
                    }
                    localStorage.setItem($scope.handle, JSON.stringify(object));
                    $timeout( function(){
                        ctrl.allowSubs = !ctrl.allowSubs;
                    }, 3000);
                } else {
                    console.log('error')
                }
            });

            $scope.sendEmail = function() {
                if ($scope.subscriptionForm.$valid) {
                    $scope.loading = true;
                    $rootScope.$broadcast('storeFront:sendEmail', $scope.subscription);
                }
            }

            $scope.closeSubs = function() {
                var object = {
                    value: false,
                    timestamp: new Date()
                }
                localStorage.setItem($scope.handle, JSON.stringify(object));
                ctrl.allowSubs = false;
            }

            /**
             * [main menu events]
             */
            var openCloseMenu= function(elem){
                if(elem.hasClass('active')) {
                    elem.removeClass('active');
                } else {
                    jQuery('.main-filter-layer.active').removeClass('active');
                    elem.addClass('active');
                }
            };
            jQuery(document).on('touchstart touchmove',function(){
                if(allowScroll){
                    return true;
                }
            });
            jQuery('body').on('click', '.main-menu-item-label:not(".mobile-main-menu-item")', function() {
                var target= jQuery(this);
                target.addClass('active');
                var elem= jQuery(this).closest('div');
                openCloseMenu(elem.find('.main-filter-layer'));
                jQuery(document).one('click', function closeMenu (e){
                    if(elem.has(e.target).length === 0){
                        target.removeClass('active');
                        elem.find('.main-filter-layer').removeClass('active');
                    } else {
                        jQuery(document).one('click', closeMenu);
                    }
                });
            }).on('click', '#embed-witlee-menu', function(){
                var target= jQuery(this);
                target.addClass('active');
                var elem= jQuery(this).closest('div');
                openCloseMenu(elem.find('.main-filter-layer'));
                jQuery(document).one('click', function closeMenu (e){
                    if(elem.has(e.target).length === 0){
                        target.removeClass('active');
                        elem.find('.main-filter-layer').removeClass('active');
                    } else {
                        jQuery(document).one('click', closeMenu);
                    }
                });
            }).on('touchstart','.scrollable',function(e) {
                e.stopPropagation();
                if (e.currentTarget.scrollTop === 0) {
                    e.currentTarget.scrollTop = 1;
                } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
                    e.currentTarget.scrollTop -= 1;
                }
            }).on('touchmove','.scrollable',function(e) {
                e.stopPropagation();
            });

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('footerCtrl', function (
            $scope
        ) {

            $scope.current_uuid = null;

            if(window.wp_witlee_uuid){
                $scope.current_uuid= window.wp_witlee_uuid;
            }

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('SearchCtrl', function (
            $scope,
            wConfig,
            $state,
            $timeout
        ) {

            /**
             * verify if the current site is an embed site
             */
            if(window.wp_witlee_uuid){
                wConfig.setUuid(window.wp_witlee_uuid);
            }
            if(window.wp_witlee_theme){
                wConfig.setTheme(window.wp_witlee_theme);
            }
            if(window.wp_witlee_embed){
                wConfig.setEmbed(window.wp_witlee_embed);
            }

            /**
             * return true if the current site have less the 756px width and false is dont
             */
            var isMobile= function(){
                var _WidthScreen= jQuery(window).width();
                if(_WidthScreen <= 756){
                    return true;
                }
                return false;
            };

            /**
             * initial params
             */
            var scrollableDes= jQuery(window);
            var container= jQuery('.search-view');
            var top_limit;
            $timeout(function () {
                top_limit = jQuery('.sticky-profile').offset().top;
            }, 100);
            var initial_top = 0;
            var initial_top_mobile = 0;
            var embed_top = 0;

            /**
             * verify if the current embed site have a sticky header
             */
            if(window.wp_witlee_sticky){
                var sticky = window.wp_witlee_sticky;
                sticky = sticky.replace(/[^a-zA-Z_-]/g, '');
                var elem_id = angular.element('#'+sticky);
                var elem_class = angular.element('.'+sticky);
                if(elem_id.size()){
                    embed_top = elem_id.height();
                }else if(elem_class.size()){
                    embed_top = elem_class.height();
                }
            }else{
                top_limit += 10;
                initial_top_mobile = 70;
            }

            /**
             * sticky header functionality
             * WARNING
             * this current script is working for non-embed / embed site
             */
            $timeout(function() {
                if(angular.element('.search-view').size()){
                    scrollableDes.scroll(function(){
                        if(!isMobile()){
                            if(scrollableDes.scrollTop() > top_limit){
                                container.find('#products-sort').hide();
                                container.find('.sticky-sort').addClass('active');
                                container.find('.sticky-profile').addClass('active');
                                container.find('.non_sticky_title').addClass('active');
                                if(window.wp_witlee_embed)
                                    jQuery('.sticky-profile').css({
                                        'position': 'fixed',
                                        'top': embed_top
                                    });
                            }else{
                                container.find('#products-sort').show();
                                container.find('.sticky-sort').removeClass('active');
                                container.find('.sticky-profile').removeClass('active');
                                container.find('.non_sticky_title').removeClass('active');
                                if(window.wp_witlee_embed)
                                    jQuery('.sticky-profile').css({
                                        'position': 'relative',
                                        'top':initial_top
                                    });
                            }
                        }else{
                            if(jQuery(window).scrollTop() > top_limit+300){
                                container.find('.sticky-profile').addClass('active');
                                container.find('.non_sticky_title').addClass('active');
                                if(window.wp_witlee_embed)
                                    jQuery('.sticky-profile').css({
                                        'position' : 'fixed',
                                        'top' : initial_top_mobile
                                    });
                            }else{
                                container.find('.sticky-profile').removeClass('active');
                                container.find('.non_sticky_title').removeClass('active');
                                if(window.wp_witlee_embed)
                                    jQuery('.sticky-profile').css({
                                        'position' : 'relative',
                                        'top' : initial_top_mobile
                                    });
                            }
                        }
                    });
                    var titles = null;
                    scrollableDes.scroll(function(){
                        titles = angular.element('.products-title');
                        var current_position = scrollableDes.scrollTop();
                        if(current_position >= 280){
                            jQuery(jQuery('.results > section h2').get().reverse()).each(function(i, elem){
                                var el = jQuery(elem);
                                if( el.position().top <= current_position + 200 ) {
                                    jQuery('.seed .selected').removeClass('selected');
                                    jQuery('[data-seed-id='+el.attr( 'id' )+']').addClass('selected');
                                    return false;
                                }
                            });
                        }
                    });
                }
            }, 100);

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('SearchProfileCtrl', function (
            $scope,
            $stateParams,
            wCard,
            wMixPanel,
            $state,
            $rootScope,
            wProducts,
            wProfile
        ) {

            /**
             * analytics for emi
             */
            if($stateParams.emi){
                $rootScope.emi = $stateParams.emi;
            }

            /**
             * verify is there is a session param that allow users to log in
             */
            if($stateParams.session){
                wProfile.storeSession($stateParams.session);
                $state.go('product.results', {
                    seedId:$stateParams.seedId,
                    session:undefined,
                    emi:undefined
                });
                return;
            }else if($stateParams.emi){
                $state.go('product.results', {
                    seedId:$stateParams.seedId,
                    session:undefined,
                    emi:undefined
                });
                return;
            }

            /**
             * [analytics send params]
             */
            var analytics = {
                'event': 'product_page',
                'sub_event': 'visit',
                'image_id': $stateParams.id,
                'seed_id': $stateParams.seedId
            };
            if($rootScope.emi){
                analytics.email_id = $rootScope.emi;
                $rootScope.emi = null;
            }
            wProfile.analytics(analytics, 'product_page');

            /**
             * initial params
             */
            var ctrl = this;
            ctrl.person= wCard.current.publisher;
            ctrl.image= wCard.current.image;
            ctrl.seeds= wCard.current.seeds;
            ctrl.front= wCard.current.front;
            ctrl.selected= +$stateParams.id;

            /**
             * get the influencer data
             */
            var searchInfluencer= function(influencer){
                if(window.allow_ga_mp){
                    wMixPanel.sendData('picture page', {
                        'influencer': influencer,
                        'image_id': wCard.current.id,
                        'load': true
                    });
                }
            };
            ctrl.sendEvent= function(){
                searchInfluencer(wCard.current.publisher.handle);
            };

            /**
             * seeds functionality
             * WARNING
             * This funcionality hide/show the current seeds items
             */
            if(ctrl.seeds.length<=5){
                $scope.hideControls = true;
            }

            /**
             * sort functionality
             */
            $scope.filterSortSelected = wProducts.getFilterSortSelected();
            $scope.filterSortOrder= {
                'match' : 'best match',
                'price' : 'price'
            };
            $scope.filterUpdateSortOrder = function ( selectedValue ) {
                var params = {sort : selectedValue};
                $rootScope.$broadcast('user:newsort', params);
            };
            $scope.$on('user:newsortvalue', function($event, response) {
                $scope.filterSortSelected = response.sort;
            });

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('SearchResultsCtrl', function (
            wCard,
            wProduct,
            $rootScope,
            $stateParams,
            $timeout,
            $scope,
            $state,
            wProducts
        ) {

            /**
             * initial params
             */
            var ctrl = this;
            $scope.filterSortSelected = wProducts.getFilterSortSelected();
            $scope.image_id = wCard.current.id;
            $scope.current = wCard.current;
            ctrl.seeds = wCard.current.seeds;
            var seed_res= {
                'influencer': '',
                'image_id': wCard.current.id,
                'search': []
            };

            ctrl.setSeed = function ( seedId ) {
                ctrl.loading = true;
                ctrl.seed = seedId;
                ctrl[ ctrl.seed ] = {products : {}};
                var selectedSeed = _.find( wCard.current.seeds, { id: ctrl.seed } );
                ctrl.config = {params: {name: selectedSeed.name,sort: wProducts.getFilterSortSelected(),brand: selectedSeed.brand}, seed_id: seedId, img_id: $stateParams.id};
                if( selectedSeed.brand_name ){
                    ctrl.config.params.brand = selectedSeed.brand_name;
                }
                if( selectedSeed.color_name ){
                    ctrl.config.params.color = selectedSeed.color_name;
                }
            };

            /**
             * if the user clicked on a seed items this will redirect to the product page and scroll down to the current seed products
             */
            ctrl.scrollToSeed = function( seed ){
                wCard.Person.prototype.scrollTo.seed( null, seed, seed === ctrl.seeds[0].id );
            };

            /**
             * reload the current result page
             */
            var reload= function(){
                $scope.filterSortSelected = wProducts.getFilterSortSelected();
                $rootScope.$broadcast('user:newsortvalue', {sort : $scope.filterSortSelected});
                angular.forEach(ctrl.seeds, function(seed){
                    ctrl.init(seed, $scope.isLastNew);
                });
            };

            /**
             * sort funcionality
             */
            $scope.filterSortOrder= {
                'match' : 'best match',
                'price': 'price'
            };
            $scope.filterUpdateSortOrder = function ( selectedValue ) {
                wProducts.setFilterSortSelected(selectedValue);
                reload();
            };

            /**
             * initialize
             */
            ctrl.init = function ( seed, isLast ) {
                $scope.seedNew = seed;
                $scope.isLastNew = isLast;
                var seedId = seed.id;
                var current_sort= $scope.filterSortSelected;
                var params= { sort: current_sort };
                ctrl.globalState = $rootScope.state;
                ctrl.setSeed( seedId );
                wProduct.search( ctrl.config, params ).then( function ( products ) {
                    if(products === 401){
                        ctrl.init(seed, isLast);
                        return;
                    }
                    if(products){
                        seed_res.search.push({seed_id: seed.id, results:products.length});
                        ctrl[ seedId ].products = products;
                        if( $stateParams.seedId === seedId ) {
                            $timeout( function( ){
                                ctrl.scrollToSeed( seedId );
                            }, 500, true );
                        }
                    }
                });
            };

            /**
             * listener for newsort
             */
            $scope.$on('user:newsort', function($event, response) {
                wProducts.setFilterSortSelected(response.sort);
                reload();
            });

            /**
             * listener for product excluded
             */
            $scope.$on('user:excludeproduct', function($event, response) {
                var clase = '.' + response.seed + '-' + response.index;
                angular.element(clase).closest('div').remove();
            });

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('SortOrderCtrl', function ( ) {

            var ctrl = this;

            ctrl.options = {
                bestMatch : 'best match',
                price: 'price'
            };

            ctrl.selected = 'best match';
            ctrl.isoprn = false;

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('wCardCtrl', function (
            $scope,
            wConfig
        ) {

            /**
             * images from the configurated path
             */
            $scope.image_clock = wConfig.image_source() + 'clock@2x.png';
            $scope.image_heart = wConfig.image_source() + 'heart@2x.png';

            var ctrl = this;

            ctrl.goTo = {
                seed: goToSeed
            };

            function goToSeed(e, card, seed) {
                e.stopPropagation();
                card.publisher.goTo.seed(card, seed);
            }

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('navbarAvatarCtrl', function (
            $scope,
            $rootScope,
            wUser,
            wProfile,
            $state
        ) {

            /**
             * get the current user info from rootScope
             */
            $scope.currentUser= $rootScope.currentUser;

            /**
             * logout, destroy the localstorage or sessionstorage
             */
            $scope.logOut= function(mob){
                wProfile.logOutUser().then(function(){
                    $scope.isLogged = false;
                    if(mob){
                        $scope.toggleMainNavigate();
                    }
                });
            };

            /**
             * verify if the current page is embed and if there is a user configurated
             */
            if(window.wp_witlee_uuid){
                $scope.current_uuid= window.wp_witlee_uuid;
            }

            /**
             * redirect the user to the store page
             * @return {[type]} [description]
             */
            $scope.toStore = function(){
                $scope.currentUser= wUser.getUser();
                $state.go('store', {
                    handle : $scope.currentUser.username
                });
            };

            /**
             * redirec user to the tagging tool (store page)
             */
            $scope.toTaggingtool = function(){
                $scope.currentUser= wUser.getUser();
                $state.go('store', {
                    handle : $scope.currentUser.username,
                    tt: true
                });
            };

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('NotificationsCtrl', function ( ) {

        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .controller('mailVerificationCtrl', function (
            $scope,
            $modalInstance,
            wProfile,
            wConfig
        ) {

            /**
             * image configured path
             */
            $scope.image_close = wConfig.image_source() + 'X.svg';

            /**
             * send the new info with the email to the API
             */
            $scope.updateInfo= function(){
                var params= {
                    email:$scope.instEmail
                };
                wProfile.updateEmail(params).then(function(){
                    $modalInstance.dismiss('cancel');
                });
            };

            /**
             * close the modal
             */
            $scope.closeModal= function(){
                $modalInstance.dismiss('cancel');
            };

        });

}());

'use strict';

angular.module('Witlee')
    .directive('wtLoader', function( ){
        return {
            templateUrl: 'modules/main/views/wtloader.html',
            restrict: 'E'
        };
    });
(function(){

    'use strict';

    angular.module('Witlee.main')
        .directive('wCard', function (
            $rootScope,
            $state,
            $window,
            $timeout
        ) {
            return {
                restrict: 'E',
                templateUrl: 'modules/main/views/wCard.html',
                controller: 'wCardCtrl',
                controllerAs: 'Card',
                scope: {
                    card: '=data'
                },
                link: function (scope, elem, attrs, ctrl) {

                    /**
                     * [resize listener for .photo div, this will work since the current images are not square anymore]
                     */
                    scope.photo_height = '300px';
                    scope.photo_width = function() {
                        return {
                            w: elem.find('.photo').width()
                        };
                    };
                    scope.$watch(scope.photo_width, function (newValue) {
                        $timeout(function(){
                            scope.photo_height = newValue.w + 'px';
                        }, 50);
                    }, true);

                    /**
                     * [$element get the current element]
                     */
                    ctrl.$element = elem;
                    ctrl.limit = (scope.card.seeds && scope.card.seeds.length > 4) ? 3 : 4;
                    ctrl.originLimit = (scope.card.seeds && scope.card.seeds.length > 4) ? 3 : 4;

                    /**
                     * [determinate the current window width]
                     */
                    var w = angular.element($window);
                    scope._WidthScreen = function () {
                        return {
                            'w': w.width()
                        };
                    };

                    /**
                     * [add or reduce the total seeds to show on every imagetile]
                     * THIS COULD AFFECT THE CURRENT EMBED SITES
                     */
                    var limiter = function(){
                        if(w.width() <= 1090 && w.width() >= 480){
                            if(ctrl.originLimit === 3){
                                ctrl.limit = 2;
                            }else{
                                ctrl.limit = 3;
                            }
                            return true;
                        }else{
                            return false;
                        }
                    };
                    limiter();

                    /**
                     * [rezise listener]
                     */
                    scope.$watch(scope._WidthScreen, function (newValue) {
                        scope.windowWidth = newValue.w;
                        var limiter_res = limiter();
                        if(!limiter_res){
                            ctrl.limit = ctrl.originLimit;
                        }
                    }, true);
                    w.bind('resize', function () {
                        if(!scope.$$phase) {
                            scope.$apply();
                        }
                    });

                    ctrl.globalState = $rootScope.state;

                }
            };
        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .directive('wCardNoLazy', function (
            $rootScope
        ) {
            return {
                restrict: 'E',
                templateUrl: 'modules/main/views/wCardNoLazy.html',
                controller: 'wCardCtrl',
                controllerAs: 'Card',
                scope: {
                    card: '=data'
                },
                link: function (scope, elem, attrs, ctrl) {
                    ctrl.$element = elem;
                    ctrl.limit = (scope.card.seeds && scope.card.seeds.length > 4) ? 3 : 4;
                    ctrl.globalState = $rootScope.state;
                    scope.closeModal= function(){
                        $rootScope.$broadcast('user:changeView', {});
                    };
                }
            };
        })
        .directive('errSrc', function() {
            return {
                link: function(scope, element) {
                    element.bind('error', function() {
                        angular.element(element).closest('div.card').hide();
                    });
                }
            };
        })
        .directive('errGenSrc', function() {
            return {
                link: function(scope, element) {
                    element.bind('error', function() {
                        angular.element(element).closest('div').hide();
                    });
                }
            };
        });

}());

(function(){

    'use strict';

    angular.module('Witlee')
        .directive('navBar', function () {
            return {
                restrict: 'E',
                controller: 'navBarCtrl',
                controllerAs: 'Navbar',
                templateUrl: 'modules/main/views/navBar.html'
            };
        });

}());

'use strict';

angular.module('Witlee')
    .directive('wtFooter', function () {
        return {
            restrict: 'E',
            controller: 'footerCtrl',
            templateUrl: 'modules/main/views/wtFooter.html'
        };
    });

(function(){

    'use strict';

    angular.module('Witlee')
        .directive('backToTop', function(
            $rootScope
        ){
            return {
                templateUrl: 'modules/main/views/backToTop.html',
                restrict: 'E',
                link: function( scope ){
                    scope.wHeight = window.innerHeight;
                    scope.scrollToPosition = function ( ) {
                        jQuery( 'html, body' ).clearQueue().animate( { scrollTop: 0 }, 500, 'swing' );
                    };
                    function showBackToTopCheck() {
                        scope.showBTT = $rootScope.state.scrollPosition > scope.wHeight;
                    }
                    $rootScope.$watch( 'state', showBackToTopCheck, true );
                }
            };
        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .directive('homeScrollTop', function ($state) {
            return {
                link: function (scope, elem) {
                    elem.on('click', function () {
                        if ($state.current.name === 'home')
                            jQuery( 'html, body' ).clearQueue().animate( {
                                scrollTop: 0
                            }, 500, 'swing' );
                    });
                }
            };
        });

}());

(function(){

    'use strict';

    angular.module('Witlee.main')
        .directive('wNavbarAvatar', function () {
            return {
                restrict: 'E',
                controller: 'navbarAvatarCtrl',
                controllerAs: 'navbarAvatar',
                templateUrl: 'modules/main/views/wNavbarAvatar.html'
            };
        });

}());

'use strict';
angular.module('Witlee.main').directive('wNotifications', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/main/views/wNotifications.html'
    };
});
'use strict';
angular.module('Witlee.main')
    .directive('wProduct', function () {
        return {
            restrict: 'E',
            scope: {
                product: '=data',
                seed: '=seed',
                image: '=image',
                influencer: '=influencer',
                index: '=index'
            },
            templateUrl: 'modules/main/views/wProduct.html',
            controller: 'productItemCtrl'
        };
    });

'use strict';

angular.module('Witlee.main')
    .directive('wProfileAvatar', function () {
        return {
            restrict: 'E',
            scope: {
                avatar: '=data'
            },
            templateUrl: 'modules/main/views/wProfileAvatar.html'
        };
    });

'use strict';

angular.module('Witlee.main')
    .directive('screenWidth', function (
        $rootScope
    ) {
        return {
            link: function ( scope ) {
                var mql    = [];
                mql.push( matchMedia( '(max-width: 991px)' ) );
                mql.push( matchMedia( '(max-width: 767px)' ) );
                angular.forEach( mql, function( value ){
                    var mql = value;
                    mql.addListener( updateState );
                    updateState( mql );
                    window.mql = mql;
                } );
                scope.$on('$destroy', removeListener);
                function updateState( mql ) {
                    var screenSize = 'md';
                    if( mql.matches && mql.media === '(max-width: 767px)' ){
                        screenSize = 'xs';
                    } else if( mql.matches && mql.media === '(max-width: 991px)' ){
                        screenSize = 'sm';
                    }
                    $rootScope.state.screenWidth = screenSize;
                    if (!scope.$$phase){
                        scope.$apply();
                    }
                }
                function removeListener() {
                    angular.forEach( mql, function( value ){
                        var mql = value;
                        mql.removeListener( updateState );
                    });
                }
            }
        };
    });

'use strict';

angular.module('Witlee.main')
    .directive('wSearchSeed', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/main/views/wSearchSeed.html'
        };
    });

'use strict';

angular.module('Witlee.main')
    .directive('wSearchSeedMedium', function ($rootScope) {
        return {
            restrict: 'E',
            scope: {
                seed: '=data'
            },
            templateUrl: 'modules/main/views/wSearchSeedMedium.html',
            link: function (scope) {
                function setDimensions() {
                    if( $rootScope.state.screenWidth === 'xs' ) {
                        scope.seedSize = 55;
                    } else {
                        scope.seedSize = 50;
                    }
                }
                $rootScope.$watch('state', setDimensions, true);
            }
        };
    });

'use strict';

angular.module( 'Witlee.main' ).directive( 'searchScroll', function( ) {
    return {
        restrict: 'C'
    };
});

'use strict';

angular.module( 'Witlee.main' )
    .directive( 'searchProfileMini', function( ) {
        return {
            scope: {
                searchProfileMini: '=searchProfileMini'
            },
            link: function( scope ) {
                scope.searchProfileMini = true;
            }
        };
    });

'use strict';

angular.module('Witlee.main')
    .directive('sortOrder', function ( ) {
        return {
            restrict: 'E',
            templateUrl: 'modules/main/views/sortOrder.html',
            controller: 'SortOrderCtrl',
            controllerAs: 'sortOrder',
            link: function ( scope ) {
                scope.updateOrder = function ( selectedValue ) {
                    scope.sortOrder.selected = scope.sortOrder.options[ selectedValue ];
                };
            }
        };
    });

'use strict';
angular.module('Witlee.main').directive('owlCarouselFull', function ($timeout) {
    return {
        restrict: 'C',
        link: function (scope, element) {
            $timeout(function() {
                element.owlCarousel(scope.owlOptions);
                jQuery('.owl-next').click(function(){
                    element.trigger('next.owl.carousel');
                });
                jQuery('.owl-prev').click(function(){
                    element.trigger('prev.owl.carousel');
                });
            }, 500);
            scope.owlOptions = {
                navRewind: false,
                navigation: true,
                pagination: false,
                navText: ['',''],
                dots: false,
                responsive: {
                    0: {items: 2},
                    200: {items: 2},
                    313: {items: 3},
                    443: {items: 3},
                    573: {items: 4},
                    638: {items: 4},
                    703: {items: 5},
                    768: {items: 3},
                    900: {items: 4},
                    1000: {items: 5},
                    1200: {items: 5}
                }
            };
        }
    };
});

'use strict';
angular.module('Witlee.main').directive('wTileTaggingItem', function ($rootScope) {
    return {
        restrict: 'E',
        templateUrl: 'modules/store/views/wTileTaggingItem.html',
        link: function (scope) {
            function setDimensions() {
                if( $rootScope.state.screenWidth === 'xs' ) {
                    scope.seedSize = 70;
                } else {
                    scope.seedSize = 90;
                }
            }
            $rootScope.$watch('state', setDimensions, true);
        }
    };
});
'use strict';
angular.module('Witlee.main')
    .directive('wProductSearch', function ($rootScope, wCard, wProduct, $timeout) {
        return {
            restrict: 'E',
            templateUrl: 'modules/store/views/wProductSearch.html',
            scope: {
                product: '=product',
                key: '=key',
                current_id: '=currentid',
                searchProductBrand: '=searchProductBrand',
                searchProductName: '=searchProductName',
                updateproduct : '=updateproduct',
                currentseed : '=currentseed'
            },
            link: function (scope, element, attrs) {
                scope.eventproduct = false;
                scope.current_product_image = scope.product.image.url;
                scope.current_product_image_id = scope.product.image.id;
                scope.changeProductImage = function(item){
                    scope.current_product_image = item.url;
                    scope.current_product_image_id = item.id;
                    element.find(".cont-svg-product").css({"background-image":"url("+item.url+")"});
                }
                scope.select = function(product, card_id) {
                    scope.eventproduct = true;
                    var dataPost = {
                        search_brand: scope.product.brand,
                        search_term: scope.product.product_name,
                        product_id: product.elastic_id,
                        image_url: scope.current_product_image,
                        image_id: scope.current_product_image_id
                    }
                    wCard.saveSeed(dataPost, card_id).then(function (data) {
                        scope.eventproduct = false;
                        $rootScope.$broadcast('tagging:newProduct', {});
                    });
                }
                scope.updateSeed= function(product){
                    scope.eventproduct = true;
                    var seed = scope.currentseed;
                    var imagetile = scope.current_id;
                    var obj= {
                        product_id: product.id,
                        image_url: scope.current_product_image,
                        image_id: scope.current_product_image_id
                    };
                    wProduct.updateImagetileSeed(imagetile, seed, obj).then(function(data){
                        scope.eventproduct = false;
                        $rootScope.$broadcast('tagging:newProduct', {});
                    });
                }
            }
        };
    });
'use strict';
angular.module('Witlee.main').directive('owlCarouselTagging', function ($timeout) {
    return {
        restrict: 'C',
        link: function (scope, element, attr) {
            $timeout(function() {
                element.owlCarousel(scope.owlOptions);
                scope.nextImage = function(){
                    element.trigger('next.owl.carousel');
                }
                scope.prevImage = function(){
                    element.trigger('prev.owl.carousel');
                }
            }, 500);
            scope.owlOptions = {
                navigation: false,
                pagination: false,
                items: 4,
                rewindNav: false,
                afterAction : afterAction
            };
            function afterAction(){
                if(this.owl.currentItem >= 1){
                    nav.find('.btn-prev-carousel').show();
                }else{
                    nav.find('.btn-prev-carousel').hide();
                }
                if(this.owl.currentItem + 4 >= this.owl.owlItems.length){
                    nav.find('.btn-next-carousel').hide();
                }else{
                    nav.find('.btn-next-carousel').show();
                }
            }
        }
    };
});
'use strict';
angular.module('Witlee.main')
    .filter( 'numberAbbr', function( ) {
        return function( input ) {
            var decPlaces = Math.pow( 10, 0 ),
                abbrev = [ 'k', 'M' ],
                i, number;
            for ( i = abbrev.length - 1 ; i >= 0 ; i-- ) {
                var size = Math.pow( 10, ( i + 1 ) * 3 );
                if ( size <= input ) {
                    input = Math.round( input * decPlaces / size ) / decPlaces;
                    if ( ( input === 1000 ) && ( i < abbrev.length - 1 ) ) {
                        number = 1;
                        i++;
                    }
                    input += abbrev[i];
                    break;
                }
            }
            return input;
        };
    });

'use strict';
angular.module('Witlee.main')
    .filter('noWhiteSpace', function(){
        return function(string) {
            return string.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
        };
    });
'use strict';

angular.module('Witlee.main')
    .filter('to_trusted', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    });

'use strict';
angular.module('Witlee.main')
    .directive('errSrc', function() {
        return {
            link: function(scope, element) {
                element.bind('error', function() {
                    angular.element(element).closest('div.card').hide();
                });
            }
        };
    });
angular.module('Witlee.main')
    .directive('errSrcCar', function($timeout) {
        return {
            link: function(scope, element) {
                element.bind('error', function() {
                    $timeout(function(){
                        angular.element(element).closest('div.owl-item').addClass('hidden');
                    }, 500);
                });
            }
        };
    });
angular.module('Witlee.main')
    .directive('errProSrc', function() {
        return {
            link: function(scope, element, attrs) {
                var nImg = document.createElement('img');
                nImg.onerror = function(){
                    angular.element(element).closest('div.product').hide();
                };
                nImg.src = attrs.errProSrc;
            }
        };
    });
angular.module('Witlee.main')
    .directive('errAvatarSrc', function() {
        return {
            link: function(scope, element) {
                element.bind('error', function() {
                    angular.element(element).closest('w-avatar').hide();
                });
            }
        };
    });
angular.module('Witlee.main')
    .directive('errGenSrc', function() {
        return {
            link: function(scope, element) {
                element.bind('error', function() {
                    angular.element(element).closest('div').hide();
                });
            }
        };
    });

'use strict';
angular.module('Witlee.store', [
    'ngSanitize',
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'infinite-scroll',
    'ui.bootstrap',
    'Witlee.models',
    'angular-owl-carousel',
    'angular-ladda',
    'angular-click-outside'
]);
(function(){

    'use strict';

    angular.module('Witlee.store')
        .controller('StoreMainCtrl', function (
            $scope,
            $stateParams,
            $modal,
            $timeout,
            $state,
            $rootScope,
            $window,
            wCard,
            wInfluencer,
            wStoreFront,
            wMixPanel,
            searchFilter,
            wConfig,
            wUser,
            wProfile,
            Page
        ) {

            /**
             * analytics for emi
             */
            var analytics = {};
            if($stateParams.emi){
                $rootScope.emi = $stateParams.emi;
            }

            /**
             * [image_close this will get the close icon from the source on wConfig]
             * @type URL
             */
            $scope.image_close = wConfig.image_source() + 'X.svg';

            /**
             * [session if users login the API will return the current session on the url]
             * @param  string $stateParams.session
             * @return false if there is no session
             */
            if($stateParams.session){
                wProfile.storeSession($stateParams.session);

                /**
                 * [if there is a session, this will clear the params on the current page]
                 */
                $state.go('store', {
                    handle: $stateParams.handle,
                    session: undefined,
                    emi: undefined
                });
                return;
            }else if($stateParams.emi){
                $state.go('store', {
                    handle: $stateParams.handle,
                    session: undefined,
                    emi: undefined
                });
                return;
            }

            /**
             * [current_uuid this param will pass for embed sites]
             * @type string
             */
            var current_uuid = null;
            if(window.wp_witlee_uuid){
                wConfig.setUuid(window.wp_witlee_uuid);
                current_uuid = window.wp_witlee_uuid;
            }

            /**
             * [allowUser will return true if there is a user logged in]
             * @return true/false
             */
            $scope.allowUser= function(){
                var current_user= wUser.getUser();
                var store_user= $stateParams.handle;
                if(!current_user){
                    return false;
                }
                if(current_user.username === store_user){
                    return true;
                }else if(current_user.account_status === 'staff'){
                    return true;
                }
                return false;
            };
            $timeout(function(){
                if($stateParams.tt === 'true'){
                    if($scope.allowUser()){
                        $scope.showTaggingTool();
                    }
                }
            }, 1000);

            /**
             * [accordion configuration]
             */
            $scope.oneAtATime = true;
            $scope.menuStatus = [{isOpen : false},{isOpen : false},{isOpen : false}];

            /**
             * [inital data / configuration]
             */
            $scope.categories = [];
            $scope.brands = [];
            $scope.top_people = [];
            $scope.people = [];
            $scope.navigate = false;
            $scope.param_influencer= $stateParams.handle;
            $scope.param_uid= 0;
            $scope.profile= {};
            $scope.profile_tiles= {};
            $scope.hashtags= {};
            $scope.logoBrands= {};
            $scope.menuStore= [];

            /**
             * [showComingSoong open the modal if there is not enough data to show]
             */
            var showComingSoong = function(){
                angular.element('.no-content').show();
                $scope.currentProfile = $scope.profile;
            };

            /**
             * [getTilesHomeStore get items for sections New, Best and Popular]
             * @param  string category [name of the current section]
             */
            var getTilesHomeStore = function(category){
                $scope.clear();
                wInfluencer.getTilesHomeStore($scope.param_uid, category).then(function (result) {
                    if(result === 401){
                        getTilesHomeStore(category);
                        return;
                    }
                    switch(category){
                        case 'new': $scope.newerList = result.slice(0,6);
                            break;
                        case 'popular': $scope.mostPopularList= result.slice(0,6);
                            break;
                        case 'best': $scope.bestSellerList= result.slice(0,6);
                    }

                }).catch(function(e){
                    console.log('Got error getting imagetiles', e);
                    $state.go('home');
                    return;
                });
            };
            var getNewItemsFilter= function(){
                var category='new';
                getTilesHomeStore(category);
            };
            var getBestSellerItemsFilter= function(){
                var category='best';
                getTilesHomeStore(category);
            };
            var getMostPopularItemsFilter= function(){
                var category='popular';
                getTilesHomeStore(category);
            };

            /**
             * [getInfluencerDetails populate the initial data getting results from the API]
             * @param  string uid [the influencer's id]
             */
            var getInfluencerDetails= function(uid){
                wInfluencer.getDetailsUid(uid).then(function (result) {

                    var name = result.profile.name;
                    var retailers = '';
                    var i;
                    for (i = 0; i < result.retailer_tiles.length; i++) {
                        if (i === 0) {
                            retailers += (result.retailer_tiles[i].retailer);
                        } else if ((i > 0) && (i < result.retailer_tiles.length - 1)) {
                            retailers += ', ' + result.retailer_tiles[i].retailer;
                        } else {
                            retailers += ' and ' + result.retailer_tiles[i].retailer;
                        }
                    }

                    var top_categories = '';
                    var brands = '';

                    for (i = 0; i < result.menu_items.length; i++) {
                        if (i === 0) {
                            top_categories += (result.menu_items[i].term);
                        } else if ((i > 0) && (i < result.menu_items.length - 1)) {
                            top_categories += ', ' + result.menu_items[i].term;
                        } else {
                            top_categories += ' and ' + result.menu_items[i].term;
                        }
                        for (var o = 0; o < result.menu_items[i].top_brands.length; o ++) {
                            if ((o === 0) && (i === 0)) {
                                brands += (result.menu_items[i].top_brands[o].name);
                            } else if ((i === result.menu_items.length - 1) && (o === result.menu_items[i].top_brands.length - 1)) {
                                brands += ' and ' + result.menu_items[i].top_brands[o].name;
                            } else {
                                brands += ', ' + result.menu_items[i].top_brands[o].name;
                            }
                        }
                    }

                    Page.setTitle('Shop the latest from ' + name);
                    Page.setDescription('Shop the latest fashions from ' + name + '. Featuring retailers like ' + retailers + '. Brands from ' + brands + '. Top categories ' + top_categories);

                    /**
                     * [if user is not allowed, resend the function]
                     */
                    if(result === 401){
                        getInfluencerDetails(uid);
                        return;
                    }
                    $scope.realTerm= result.profile.name;
                    $scope.profile= result.profile;
                    $scope.profile_tiles= result.promo_tiles;
                    $scope.hashtags= result.hashtags;
                    $scope.totalHashsToShow=0;
                    if($scope.hashtags.length >= 4){
                        $scope.totalHashsToShow=4;
                    }else{
                        if($scope.hashtags.length < 2){
                            $scope.totalHashsToShow=0;
                        }else{
                            if($scope.hashtags.length === 3){
                                $scope.totalHashsToShow=0;
                            }else{
                                $scope.totalHashsToShow= $scope.hashtags.length;
                            }
                        }
                    }
                    $scope.logoBrands= result.retailer_tiles.slice(0, 5);
                    $scope.menuStore= result.menu_items;

                    if($scope.profile.coming_soon){
                        showComingSoong();
                    }else{
                        getNewItemsFilter();
                        getBestSellerItemsFilter();
                        getMostPopularItemsFilter();
                    }
                    $timeout(function(){
                        jQuery('.storeFront-container').css({'padding-top':jQuery('#filter-menu').height() + 'px'});
                        var store_menu_items = jQuery('.filter-min li');
                        var current_top = angular.element(store_menu_items[0]).position().top;
                        var current_index_position = 0;
                        angular.forEach(store_menu_items, function(item){
                            if(jQuery(item).position().top === current_top){
                                current_index_position ++;
                            }
                        });
                        $scope.more_menu_items = result.menu_items.slice(current_index_position);
                    }, 100);
                    /**
                     * [analytics send params]
                     */
                    analytics = {
                        'event': 'store_page',
                        'sub_event': 'visit',
                        'store_uuid': $scope.profile.uuid
                    };
                    if($rootScope.emi){
                        analytics.email_id = $rootScope.emi;
                        $rootScope.emi = null;
                    }
                    wProfile.analytics(analytics, 'store_page');
                    /**
                     * [analytics send params]
                     */
                }).catch(function(e){
                    console.log('Got error getting influencer\'s details', e);
                    $state.go('home');
                    return;
                });
            };

            $scope.showMoreStoreItems = function(){
                angular.element('.filter-layer-more').addClass('active');
            };

            var closeMoreMenu = function(){
                angular.element('.filter-layer-more').removeClass('active');
            };

            $scope.closeThis = function(){
                closeMoreMenu();
            };
            jQuery(window).scroll(function(){
                closeMoreMenu();
            });

            /**
             * [toggleNavigate Open/Close the menu for mobile]
             * @param  string title  [category name]
             * @param  int key    [category id]
             * @param  int subKey [index]
             */
            $scope.toggleNavigate = function(title, key, subKey) {
                angular.element('.filter-layer-more').removeClass('active');
                $scope.toSearchCategory= title;
                $scope.toSearchId= key;
                if(subKey >= 0){
                    $scope.mobCats= $scope.menuStore[subKey].sub_category;
                    $scope.mobBrands= $scope.menuStore[subKey].top_brands;
                    $scope.mobPopular= $scope.menuStore[subKey].promo_tile.imagetile_url;
                }
                jQuery('body').toggleClass('o-hidden');
                if(title){
                    $scope.titleMenuHide= title;
                }
                $scope.navigate = !$scope.navigate;
            };

            /**
             * [Functions to make a search, these funcs will connect to the filter page]
             */
            var searchCall= function(type, realTerm, id){
                var term= realTerm.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                if(type=== 'influencer'){
                    searchFilter.getViewParams({id: id.toString(), term: term, type: type, realTerm: $scope.realTerm});
                }else{
                    searchFilter.getViewParams({id: id.toString(), term: term, type: type, realTerm: realTerm});
                }
            };
            $scope.goSearch= function(influencer, toSearch){
                if($scope.profile.coming_soon){
                    return;
                }
                searchFilter.clearFilters();
                searchFilter.addTerm(toSearch);
                if(!current_uuid){
                    searchCall('influencer', influencer, $scope.profile.uuid);
                }
                jQuery('body').removeClass('o-hidden');
                searchFilter.filter();
            };
            $scope.goSearchSort= function(influencer, sortBy){
                searchFilter.clearFilters();
                searchFilter.addTerm('');
                searchFilter.addSort(sortBy);
                if(!current_uuid){
                    searchCall('influencer', influencer, $scope.profile.uuid);
                }
                jQuery('body').removeClass('o-hidden');
                searchFilter.filter();
            };
            $scope.goSearchBrand= function(category, influencer, brand){
                searchFilter.clearFilters();
                var term= '';
                if(category){
                    angular.forEach(category.sub_category, function(subcategory){
                        searchFilter.selectSubCategory(category, subcategory, true);
                    });
                }
                var brandId= null;
                if(brand.retailer_id){
                    brandId= brand.retailer_id.toString();
                }else{
                    brandId= brand.uuid;
                }
                term= brand.name.replace(/[\s]/g, '').replace(/[!@#$%&\/]/g, '');
                searchCall('brand', brand.name, brandId);

                if(!current_uuid){
                    searchCall('influencer', influencer, $scope.profile.uuid);
                }
                jQuery('body').removeClass('o-hidden');
                searchFilter.filter();
            };
            $scope.goSearchSubCategory= function(category, subcategory, influencer){
                var search_category = {id: category.id, subcategory: category.sub_category};
                var search_subcategory = subcategory;
                searchFilter.clearFilters();
                searchFilter.selectSubCategory(search_category, search_subcategory);

                if(!current_uuid){
                    searchCall('influencer', influencer, $scope.profile.uuid);
                }

                jQuery('body').removeClass('o-hidden');
                searchFilter.filter();
            };
            $scope.goSearchCategory= function(category, influencer){
                searchFilter.clearFilters();
                searchCall('category', category.term, category.id);

                if(!current_uuid){
                    searchCall('influencer', influencer, $scope.profile.uuid);
                }

                jQuery('body').removeClass('o-hidden');
                searchFilter.filter();
            };

            /**
             * [showTaggingTool open the tagging tool moda, this is just for users logged in with stuff permission]
             */
            $scope.showTaggingTool = function(){
                wStoreFront.setInfluencerId($scope.profile.uuid);
                $modal.open({
                    animation: true,
                    windowClass: 'witlee-modal product-modal tagging-tool',
                    controller: 'taggingGridCtrl',
                    templateUrl: 'modules/store/views/wTaggingGrid.html',
                    size: 'lg',
                    backdrop : 'static',
                    resolve: {
                        user_id: function () {
                            return $scope.profile.uuid;
                        }
                    }
                });
            };

            /**
             * [menu functions]
             */
            var closeMenu= function(elem){
                elem.removeClass('active');
            };
            var openMenu= function(elem){
                jQuery('.filter-layer.active').removeClass('active');
                elem.addClass('active');
            };

            /**
             * [listBrandsValSide return class to show or hidde items]
             * @return string
             */
            $scope.listBrandsValSide = function(){
                var clase = '';
                switch($scope.logoBrands.length){
                    case 4: clase = 'col-xs-2';
                        break;
                    case 3: clase = '';
                        break;
                    case 2: clase = 'col-xs-3';
                        break;
                    case 1: clase = 'col-xs-4';
                        break;
                }
                return clase;
            };
            $scope.listBrandsVal= function(){
                var clase = '';
                switch($scope.logoBrands.length){
                    case 4: clase = 'col-xs-2';
                        break;
                    case 3: clase = 'col-xs-4';
                        break;
                    case 2: clase = 'col-xs-3';
                        break;
                    case 1: clase = 'col-xs-2';
                        break;
                }
                return clase;
            };

            /**
             * [menu events]
             */
            jQuery('.storeFront').on('mouseenter', '.filter-item', function(){
                var elem= jQuery(this);
                if(jQuery(window).width()>767){
                    elem.find('.menu-item-label').addClass('active');
                }
                openMenu(elem.find('.filter-layer'));
                if(jQuery('.filter-layer-checkbox').size()){
                    jQuery('.filter-layer-checkbox').perfectScrollbar('update');
                }
            }).on('mouseleave', '.filter-item', function(){
                var elem= jQuery(this);
                elem.find('.menu-item-label').removeClass('active');
                closeMenu(elem.find('.filter-layer'));
            });

            var global_store= jQuery('.filter-menu-store-container');
            var last_scrolltop= 0;
            var top = '0px';
            var initial_top = '-60px';
            $scope.sticky_max_style = '';
            $scope.position_container = 0;
            if(typeof window.wp_witlee_sticky !== 'undefined'){
                var sticky = window.wp_witlee_sticky;
                if(sticky){
                    sticky = sticky.replace(/[^a-zA-Z_-]/g, '');
                    var elem_id = angular.element('#'+sticky);
                    var elem_class = angular.element('.'+sticky);
                    if(elem_id.size()){
                        top = elem_id.height() + 'px';
                    }else if(elem_class.size()){
                        top = elem_class.height() + 'px';
                    }
                }
                $scope.sticky_max_style = 'max-width:'+jQuery('#wp-witlee').width()+'px';
                $scope.position_container = jQuery('#wp-witlee').offset().top;
            }

            jQuery(window).resize(function() {
                initial_top = '-' + jQuery('#filter-menu').height() + 'px';
                if(typeof window.wp_witlee_sticky !== 'undefined'){
                    $scope.sticky_max_style = 'max-width:'+jQuery('#wp-witlee').width()+'px';
                }
                jQuery('.storeFront-container').css({'padding-top':jQuery('#filter-menu').height() + 'px'});
                $timeout(function(){
                    jQuery('.storeFront-container').css({'padding-top':jQuery('#filter-menu').height() + 'px'});
                    var store_menu_items = jQuery('.filter-min li');
                    var current_top = angular.element(store_menu_items[0]).position().top;
                    var current_index_position = 0;
                    angular.forEach(store_menu_items, function(item){
                        if(jQuery(item).position().top === current_top){
                            current_index_position ++;
                        }
                    });
                    $scope.more_menu_items = $scope.menuStore.slice(current_index_position);
                }, 100);
            });
            var scrolling = false;
            $timeout(function() {
                if(angular.element('.storeFront').size()){
                    jQuery(window).scroll(function(){
                        closeMoreMenu();
                        if(scrolling){
                            return;
                        }
                        scrolling = true;
                        var current_header = jQuery('#main_nav').height();
                        initial_top = '-' + jQuery('#filter-menu').height() + 'px';
                        var elem= jQuery(this);
                        var current_scroll= elem.scrollTop();
                        if(last_scrolltop!==current_scroll){
                            var element= jQuery('.filter-layer.active');
                            element.removeClass('active');
                            if(current_scroll <= $scope.position_container + current_header){
                                if(typeof window.wp_witlee_sticky !== 'undefined'){
                                    global_store.removeClass('fixed');
                                    global_store.css({'top':0});
                                }else{
                                    global_store.css({'top':top});
                                }
                            }else if(current_scroll>$scope.position_container + 100 + current_header){
                                global_store.addClass('fixed');
                                if(current_scroll> last_scrolltop){
                                    global_store.css({'top':initial_top});
                                }else{
                                    if(typeof window.wp_witlee_sticky === 'undefined'){
                                        top = '100px';
                                        if(jQuery(window).width()<=767){
                                            top= '74px';
                                        }
                                    }
                                    global_store.css({'top':top});
                                }
                            }
                            last_scrolltop= current_scroll;
                            scrolling = false;
                        }
                    });
                }
            }, 100);

            $scope.clear= function(){
                $scope.cards= [];
            };

            var diffDays = function(date) {
                var now = new Date();
                date = new Date(date);
                var timeDiff = Math.abs(now.getTime() - date.getTime());
                var days = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
                return days;
            };

            $scope.subscription = false;

            /**
             * [init]
             */
            var init = function(){
                var search_influencer = $scope.param_influencer;
                $scope.param_uid = search_influencer;
                getInfluencerDetails($scope.param_uid);
                var objectSubs = JSON.parse(localStorage.getItem($scope.param_uid));
                if (objectSubs === null) {
                    wInfluencer.getEmailSubscription($scope.param_uid).then(function (result) {
                        if (!result) {
                            $rootScope.$broadcast('navbar:subscription', $scope.param_uid);
                            $timeout( function(){
                                $scope.subscription = true;
                            }, 2000);
                        }
                    });
                } else if (objectSubs.value === false && diffDays(objectSubs.timestamp) > 0) {
                    wInfluencer.getEmailSubscription($scope.param_uid).then(function (result) {
                        if (!result) {
                            $rootScope.$broadcast('navbar:subscription', $scope.param_uid);
                            $timeout( function(){
                                $scope.subscription = true;
                            }, 2000);
                        }
                    });
                }

                /**
                 * [mixPanel send event]
                 */
                if(window.allow_ga_mp){
                    wMixPanel.sendData('store page', {'load': true,'influencer': search_influencer});
                }
            };
            init();

            $scope.$on('storeFront:sendEmail', function($event, email) {
                var data = {'email': email};
                wInfluencer.sendEmailSubscription($scope.param_uid, data).then(function () {
                    $scope.subscription = false;
                    $rootScope.$broadcast('navbar:afterSend', true);
                }, function() {
                    $scope.subscription = false;
                    $rootScope.$broadcast('navbar:afterSend', false);
                });
            });

            $scope.checkContent = function(){
                if($scope.profile.coming_soon){
                    return 'active';
                }
            };

            /**
             * [cantWaitVote add vote for comming soon modal]
             */
            $scope.cantWaitVote = function(){
                var uuid = $scope.currentProfile.uuid;
                wProfile.cantWaitVote(uuid).then(function(response){
                    $scope.currentProfile.store_votes = response.votes;
                }).catch(function(e){
                    console.log('Got error sending vote', e);
                    $state.go('home');
                    return;
                });
            };

        });

}());

'use strict';
angular.module('Witlee.store')
    .controller('taggingGridCtrl', function (
        $scope,
        $modalInstance,
        $timeout,
        wCard,
        wStoreFront,
        wProduct,
        wConfig,
        user_id,
        wProfile,
        $rootScope
    ) {

        var runLazyBG = function(){
            jQuery('.products-search-container').each(function(){
                var target = jQuery(this);
                window.lazyBG(target);
            });
        }

        $scope.image_close = wConfig.image_source() + "X.svg";

        $scope.next= null;
        $scope.loading = true;
        $scope.more = false;
        $scope.spinner = false;
        $scope.mainTagView= true;
        var product_name_search = "";
        $scope.initial_seeds_loading = true;
        var product_brand_search = "";

        $timeout(function() {
            jQuery('.content-modal').perfectScrollbar();
            jQuery('[data-toggle=tooltip]').hover(function(){
                jQuery(this).tooltip('show');
            }, function(){
                jQuery(this).tooltip('hide');
            });
        }, 500);

        $timeout(function() {
            var elem= angular.element('.modal');
            elem.scroll(function() {
                if($scope.mainTagView && jQuery(window).width()<=767){
                    if(elem.scrollTop() + elem.height() + 300 >= elem.find('.modal-dialog').height()){
                        $scope.getMoreTiles();
                    }
                }
                var a = elem.scrollTop();
                angular.element('.preview-product').css('top', a + 'px');
            });
        }, 10);
        $scope.reCallCurrent= function(){
            jQuery(".content-modal").scrollTop(0);
            $scope.seedsRelated= [];
            $scope.productsSelect= [];
            wCard.getCurrent($scope.currentImageId).then(function(data){
                $scope.productsSelect = data.seeds;
            });
        }
        $scope.excludeSeed= function(product, seed){
            var obj= {
                product_id: product.id
            };
            wProduct.excluseImagetileSeed($scope.currentImageId, seed, obj).then(function(data){
                $scope.reCallCurrent();
            });
        }
        $scope.showSeedsRelated= function(seed, $event){
            $scope.initial_seeds = [];
            $scope.productList= [];
            $scope.seedsRelated= [];
            angular.element(".img-responsive.active").removeClass("active");
            var elem= angular.element($event.target);
            elem.addClass("active");
            $scope.current_seed_id = seed.id;

            $scope.currentSeedId= seed.id;
            $scope.currentImageId= $scope.current_id;
            var params= {sort: "bestfit"};
            var dataObj = {
                image_id: $scope.currentImageId,
                params: params,
                seed_id: seed.id
            };
            wProduct.searchSeedProduct(dataObj).then(function (data) {
                $scope.loading = false;
                if(data.count == 0) {
                    $scope.empty = true;
                    return false
                }
                $scope.seedsRelated = data.products;
                $timeout(function(){
                    jQuery('.content-modal').perfectScrollbar('destroy');
                    runLazyBG();
                }, 100);
            });
        };
        $scope.init = function () {
            jQuery('.products-search-container').perfectScrollbar();
            var params= {sort: ""};
            var dataObj = {
                params: params
            };
            if($scope.selectedSortValue && $scope.selectedSortValue !== "match"){
                dataObj.params.sort= $scope.selectedSortValue;
            }
            $scope.cards= [];
            jQuery(".content-modal").scrollTop(0);
            var userId= user_id;
            if ($scope.spinner)
                return;
            $scope.spinner = true;
            $scope.loading = true;
            $scope.empty = false;
            $scope.cards = [];
            $scope.count = 0;
            $scope.username = undefined;
            $scope.feed = {params: {page: 1}};
            if(!$scope.toggleSwitch){
                /**
                 * [analytics send params]
                 */
                var analytics = {"event": "tagging_page", "sub_event": "visit", "search_terms": "untagged", "store_uuid": user_id};
                wProfile.analytics(analytics, "tagging_page");
                /**
                 * End Analytics
                 */
                wCard.getAllUntagged(dataObj, userId).then(function (cards) {
                    $scope.cards = cards.cards;
                    $scope.loading = false;
                    $scope.spinner = false;
                    $scope.count = cards.count;
                    $scope.next= cards.next;
                });
            }else{
                /**
                 * [analytics send params]
                 */
                var analytics = {"event": "tagging_page", "sub_event": "visit", "search_terms": "tagged", "store_uuid": user_id};
                wProfile.analytics(analytics, "tagging_page");
                /**
                 * End Analytics
                 */
                wCard.getAllTagged(dataObj, userId).then(function (cards) {
                    $scope.cards = cards.cards;
                    $scope.loading = false;
                    $scope.spinner = false;
                    $scope.count = cards.count;
                    $scope.next= cards.next;
                });
            }
        }
        $scope.switch_tiles= function(){
            $scope.more= false;
            $scope.feed.params.page= 1;
            $scope.init();
        }
        var type_ahead_name = null;
        var type_ahead_brand = null;
        $scope.getSimilarSeedsBrand = function(key){
            if(!$scope.productBrand){
                return;
            }else{
                if(type_ahead_brand === $scope.productBrand){
                    return;
                }
                type_ahead_brand = $scope.productBrand;
                getSimilarSeeds(key);
            }

        }
        $scope.getSimilarSeedsName = function(key){
            if(!$scope.productName){
                return;
            }else{
                if(type_ahead_name === $scope.productName){
                    return;
                }
                type_ahead_name = $scope.productName;
                getSimilarSeeds(key);
            }
        }
        var getSimilarSeeds = function(key){
            if(key.keyCode === 13){
                return;
            }else{
                $scope.is_search = false;
            }
            if($scope.promise){
                $scope.promise.cancel();
            }
            if(!$scope.productBrand && !$scope.productName){
                return;
            }
            $scope.initial_seeds = [];
            $scope.seedsRelated = [];
            $scope.productList = [];

            var brand = $scope.productBrand;
            var name = $scope.productName;
            var params = {brand: brand, name: name};
            $scope.promise = wProduct.getInitialSeedsInfy(user_id, params);
            $scope.promise.promise.then(function(response){
                $scope.initial_seeds = response.products;
                $scope.initial_seeds_next = response.next;
                $scope.initial_seeds_count = response.count;
                $timeout(function(){
                    jQuery('.content-modal').perfectScrollbar('destroy');
                    runLazyBG();
                    if($scope.is_search === true){
                        $scope.initial_seeds = [];
                    }
                }, 100);
            });
        }
        var initialSeeds = function(){
            $scope.initial_seeds_loading = true;
            $scope.loadingdata = true;
            var params = {};
            wProduct.getInitialSeeds(user_id, params).then(function(response){
                $scope.initial_seeds_loading = false;
                $scope.loadingdata = false;
                $scope.initial_seeds = response.products;
                $scope.initial_seeds_next = response.next;
                $scope.initial_seeds_count = response.count;
                $timeout(function(){
                    jQuery('.content-modal').perfectScrollbar('destroy');
                    runLazyBG();
                }, 100);
            });
        }
        $scope.moreInitialSeeds = function(){
            if ($scope.initial_seeds_loading)
                return;
            if (!$scope.initial_seeds_next)
                return;
            $scope.initial_seeds_loading = true;
            wProduct.moreInitialSeeds($scope.initial_seeds_next).then(function (data) {
                $scope.initial_seeds_next = data.next;
                Array.prototype.push.apply($scope.initial_seeds, data.products);
                $scope.initial_seeds_loading = false;
            });
        }
        $scope.showSearchTaggingTool= function(card, is_new){
            $scope.initial_seeds = [];
            $scope.seedsRelated = [];
            $scope.productList = [];
            $scope.current_id= card.id;
            $scope.clearParams();
            $scope.cardsCarousel = [];
            $scope.cardsCarousel = $scope.cards.slice(0, 20);
            wCard.getCurrentDetail(card.id).then(function(card){
                /**
                 * [analytics send params]
                 */
                var analytics = {"event": "image_tagging_page", "sub_event": "visit", "store_uuid": user_id, "image_id": card.id};
                wProfile.analytics(analytics, "image_tagging_page");
                /**
                 * End Analytics
                 */
                $scope.productsSelect= card.seeds;
                $scope.mainTagView= false;
                $scope.searchTagItem= card;
            });
            initialSeeds();
            $timeout(function(){
                jQuery('.content-modal').perfectScrollbar('destroy');
            }, 100);
        };
        $scope.closeTaggingTool= function(){
            $modalInstance.dismiss('cancel');
        }
        $scope.backTaggingTool= function(){
            if($scope.promise){
                $scope.promise.cancel();
            }
            $timeout(function(){
                jQuery('.content-modal').perfectScrollbar();
                //jQuery('.products-search-container').perfectScrollbar('destroy');
            }, 100);
            $scope.more= false;
            $scope.feed.params.page= 1;
            $scope.mainTagView= true;
            $scope.init();
        }
        $scope.searchProducts = function() {
            if($scope.promise){
                $scope.promise.cancel();
            }
            $scope.is_search = true;
            $scope.initial_seeds = [];
            $scope.productList= [];
            $scope.seedsRelated= [];

            $scope.loginLoading = true;
            $scope.searchProductBrand= $scope.productBrand;
            $scope.searchProductName= $scope.productName;
            $scope.empty = false;
            $scope.dataObj = {params: {brand: $scope.productBrand,name: $scope.productName,page: 1}};
            $scope.promise = wProduct.searchProduct($scope.dataObj);
            $scope.promise.promise.then(function (data) {
                $scope.loginLoading = false;
                $scope.searchInf= true;
                if(data.count == 0) {
                    $scope.empty = true;
                    return false
                }
                $scope.next_more_results = data.next;
                $scope.productList = data.products;
                $timeout(function(){
                    jQuery('.content-modal').perfectScrollbar('destroy');
                    runLazyBG();
                }, 100);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
        $scope.clearParams= function(){
            jQuery(".content-modal").scrollTop(0);
            $scope.productList= [];
            $scope.productBrand= "";
            $scope.productName= "";
            $scope.searchProductBrand= "";
            $scope.searchProductName= "";    }
        $scope.select = function(index, card_id) {
            $scope.selectProduct = {
                item: $scope.productList[index]
            };
            $scope.dataPost = {
                search_brand: $scope.searchProductBrand,
                search_term: $scope.searchProductName,
                product_id: $scope.selectProduct.item.elastic_id
            }
            wCard.saveSeed(card_id, $scope.dataPost).then(function (data) {
                wCard.getCurrentDetail($scope.current_id).then(function(card){
                    $scope.productsSelect= card.seeds;
                    $scope.current_id= card.id;
                    $scope.mainTagView= false;
                    $scope.searchTagItem= card;
                    $scope.clearParams();
                    $scope.dataObj= null;
                    jQuery(".content-modal").scrollTop(0);
                });
            });
        }
        $scope.isCurrent= function(card){
            if(card.id === $scope.current_id)
                return true;
            return false;
        }
        $scope.selectedProduct= function(productId){
            $.each($scope.productsSelect, function(key, item){
                if(item.id === productId)
                    return true;
                return false;
            });
        }
        $scope.ignore= function(card, nindex){
            $scope.count--;
            var params= {"imagetile": card.id};
            $scope.cards.splice(nindex, 1);
            var owl_item= jQuery(".owl-item").eq(nindex).remove();
            wCard.ignoreTile({}, params).then(function(data){
            });
        };
        $scope.getMoreTiles = function () {
            if ($scope.next === null)
                return;
            if ($scope.more || $scope.loading)
                return;
            $scope.spinner = true;
            $scope.loading = true;
            var userId= user_id;
            $scope.feed.params.page++;
            wCard.getMore( $scope.next ).then(function(cards){
                    Array.prototype.push.apply($scope.cards, cards.cards);
                    $scope.loading = false;
                    $scope.spinner = false;
                    $scope.next= cards.next;
                },
                function(error) {
                    $scope.spinner = false;
                    $scope.loading = false;
                    $scope.more = true;
                });
        };
        $scope.moreResultProducts = function() {
            if(!$scope.productList)
                return;
            if(!$scope.productList.length)
                return;
            if ($scope.loading)
                return;
            if (!$scope.dataObj)
                return;
            if(!$scope.next_more_results)
                return;
            $scope.loading = true;
            $scope.dataObj.params.page++;
            $scope.promise = wProduct.searchProduct($scope.dataObj);
            $scope.promise.promise.then(function (data) {
                Array.prototype.push.apply($scope.productList, data.products);
                $scope.next_more_results = data.next;
                $scope.loading = false;
                jQuery('.products-search-container').perfectScrollbar("update");
            });
        };

        $scope.remove = function(id, index, card_id) {
            $scope.dataPost = {img_id: card_id, seed_id: id};
            wCard.removeSeed($scope.dataPost).then(function (data) {
                $scope.productsSelect.splice(index, 1);
            });
        }

        $scope.filterSortOrder= {"match" : 'best match',"popular": 'most popular',"new": 'newest',"best": 'best seller'};
        $scope.filterSortSelected = $scope.filterSortOrder["match"];
        $scope.filterUpdateSortOrder = function ( selectedValue, $event ) {
            $scope.selectedSortValue= selectedValue;
            $scope.filterSortSelected = $scope.filterSortOrder[ selectedValue ];
            $scope.init();
        }
        $scope.$on('tagging:newProduct', function(response){
            wCard.getCurrentDetail($scope.current_id).then(function(card){

                $scope.productList = [];
                $scope.seedsRelated = [];
                $scope.productBrand = "";
                $scope.productName = "";

                $scope.productsSelect= card.seeds;
                $scope.current_id= card.id;
                $scope.mainTagView= false;
                $scope.searchTagItem= card;
                $scope.clearParams();
                jQuery(".content-modal").scrollTop(0);
            });
        });

    });
'use strict';
angular.module('Witlee.store').controller('carruselCtrl', function ($scope, $timeout, $rootScope, $stateParams, wCard, untaggedByUser) {
        $scope.owl = undefined;
        $scope.tiles = untaggedByUser;
        $scope.user = wCard.current;
        $scope.loading = true;
        $scope.spinner = false;
        $scope.spinner_switch = false;
        $scope.more = false;
        $scope.toggleSwitch = true;
        $scope.empty = false;
        $scope.feed = {params: {page: 1}};
        $scope.changeTile = function(card) {
            $rootScope.$broadcast('results.post:changeTile', card);
        }
        $scope.toggleCarousel = function(toggle) {
            $scope.more = false;
            $scope.empty = false;
            $scope.tiles.count = 0;
            $scope.feed.params.page = 1;
            $scope.spinner_switch = true;
            $scope.loading = true;
            var dataObj = {params: {user: $stateParams.guid}};
            wCard.getAll(dataObj, $scope.toggleSwitch).then(function(cards) {
                if (cards.count == 0) {
                    $scope.more = true;
                    $scope.empty = true;
                    $scope.tiles.cards = [];
                    $scope.tiles.count = 0;
                } else {
                    $scope.tiles = cards;
                    $scope.feed.params.page++;
                }
                $scope.spinner_switch = false;
                $scope.loading = false;
            });
        }
        $scope.ignore = function(card) {
            var index = $scope.tiles.cards.indexOf(card);
            var nextItem = $scope.tiles.cards[index + 1];
            $scope.dataPost = {imagetile: card.id};
            wCard.ignoreCard($scope.dataPost).then(function(data){
                var index = $scope.tiles.cards.indexOf(card);
                $scope.tiles.cards.splice(index, 1);
                $rootScope.$broadcast('results.post:ignore', card.id, nextItem.id, index);
            });
        }
        $scope.loadMore = function () {
            if ($scope.loading)
                return;
            $scope.more = true;
            $scope.feed.params.user = $stateParams.guid;
            $scope.loading = true;
            $scope.spinner = true;
            wCard.getMore($scope.feed, $scope.toggleSwitch).then(function (cards) {
                Array.prototype.push.apply($scope.tiles.cards, cards);
                $scope.loading = false;
                $scope.more = false;
                $timeout(function() {
                    $scope.spinner = false;
                    jQuery(".owl-carousel").owlCarousel();
                    var owl = jQuery(".owl-carousel").data('owlCarousel');
                    owl.goTo((($scope.feed.params.page - 1) * 20) - 8);
                    $scope.feed.params.page++;
                }, 100);
            }, function(error) {
                $scope.more = true;
                $scope.loading = false;
                $scope.spinner = false;
            });
        };
        $scope.init = function() {
            $scope.loading = false;
            $scope.feed.params.page++;
        }
    })
    .directive('wCarrusel', function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'modules/store/views/carrusel.html',
            controller: 'carruselCtrl',
            controllerAs: 'carrusel',
            scope: {
                card: '=data'
            },
            link: function (scope, elem, attrs, ctrl) {
                ctrl.$element = elem;
                ctrl.limit = (scope.card.seeds && scope.card.seeds.length > 4) ? 3 : 4;
                ctrl.globalState = $rootScope.state;
            }
        };
    });
'use strict';
angular.module('Witlee.store')
    .directive('wTaggingGrid', function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'modules/store/views/wTaggingGrid.html',
            controller: 'taggingGridCtrl',
            controllerAs: 'taggingGrid',
            scope: {
            },
            link: function (scope, elem, attrs, ctrl) {
            }
        };
    });
'use strict';

angular.module('Witlee.common', []);
'use strict';

angular.module('Witlee.common')
    .directive('wAvatar', function ($rootScope) {
        return {
            restrict: 'E',
            scope: {
                avatar: '=data'
            },
            templateUrl: 'modules/common/views/wAvatar.html',
            link: function(scope, elem, attrs){
                scope.closeModal= function(){
                    $rootScope.$broadcast('user:changeView', {});
                }
            }
        }
    });
'use strict';

angular.module('Witlee.main')
    .directive('wCardSeed', function () {
        return {
            restrict: 'E',
            scope: {
                seed: '=data'
            },
            templateUrl: 'modules/common/views/wCardSeed.html'
        };
    });
'use strict';

angular.module('Witlee.common')
    .directive('wMediumAvatar', function () {
        return {
            restrict: 'E',
            scope: {
                avatar: '=data'
            },
            templateUrl: 'modules/common/views/wMediumAvatar.html'
        };
    });
'use strict';

angular.module('Witlee.common')
    .directive('stopPropagation', function () {
        return {
            link: function (scope, elem) {
                elem.on('click', function (e) {
                    e.stopPropagation();
                });
            }
        };
    });
'use strict';

angular.module('Witlee.data', []);
'use strict';

angular.module('Witlee.data')
    .factory('wHttp', function ($http) {
        function Http() {}

        Http.get = function (url, config) {
            return $http.get(url, config);
        };

        Http.post = function (url, data, config) {
            return $http.post(url, data, config);
        };

        Http.put = function (url, data, config) {
            return $http.put(url, data, config);
        };

        Http.delete = function (url, config) {
            return $http.delete(url, config);
        };

        return Http;
    });
'use strict';
angular.module('Witlee.models', [
    'ngSanitize',
    'Witlee.data'
]);
'use strict';
angular.module('Witlee.models')
    .service('wConfig', function ($http, $state, $window) {
        /**
         * [current API PATH http://api.witlee.com/v1 ... ]
         */
        $window.allow_ga_mp = true; //false to prevent the GA and MP events
        var IMAGES_SOURCE = "cdn.witlee.com/images/"; //For images, do not need the protocol
        // var API_ROOT= 'api.staging.witlee.com'; //Production API. Do not need protocol
        var API_ROOT= 'api.witlee.com'; //Develop API. Do not need protocol
        var API_VERSION= '/v1'; //API version

        var uuid= null;
        var theme= null;

        this.protocol = function(){
            return document.location.protocol + "//";
        };
        this.image_source = function(){
            return this.protocol() + IMAGES_SOURCE;
        };
        this.setUuid= function(uuid){
            angular.element(".main-menu").hide();
            this.uuid= uuid;
        };
        this.getUuid= function(){
            return this.uuid;
        };
        this.setTheme= function(theme){
            angular.element("body").addClass(theme);
            this.theme= theme;
        };
        this.setEmbed= function(){
            angular.element("body").addClass("wp_embed");
        };
        this.api_path = function(){
            return document.location.protocol + "//" + API_ROOT + API_VERSION;
        };
        this.sendHeaders= function(){
            if(localStorage.getItem("xsession")){
                $http.defaults.headers.common["x-session"] = localStorage.getItem("xsession");
            };
            if(localStorage.getItem("token")){
                $http.defaults.headers.common.Authorization = 'Token ' + localStorage.getItem("token");
            }else{
                delete $http.defaults.headers.common.Authorization;
            }
            if(this.uuid){
                $http.defaults.headers.common.influencer = this.uuid;
            };
        };
        this.clearHeaders= function(){
            localStorage.removeItem("token");
            localStorage.removeItem("NeedEmail");
        };
        this.storeLink= function(seed_id, product_id){
            return this.api_path() + '/clicks/' + seed_id + '/products/' + product_id;
        };
        this.instagramLogin= function(dest){
            var params= [];
            if(dest){
                dest = encodeURIComponent(dest);
                params.push("dest="+dest);
            };
            if(localStorage.getItem("xsession")){
                params.push("xs="+localStorage.getItem("xsession"));
            };
            if(params.length > 0){
                params = params.join("&");
                params = "?" + params;
            };

            this.sendHeaders();
            return this.api_path() + '/profile/login/instagram'+params;
        };
        this.influencer_details= function(
            influencer_id){
            this.sendHeaders();
            return this.api_path() + '/influencers/'+influencer_id;
        };
        this.influencer_email_subscription= function(influencer_id){
            this.sendHeaders();
            return this.api_path() + '/influencers/'+influencer_id+'/subscribe_email';
        };
        this.logOut= function(){
            this.sendHeaders();
            return this.api_path() + '/rest-auth/logout/';
        };
        this.influencer_search = function(){
            this.sendHeaders();
            return this.api_path() + '/influencer/search';
        };
        this.influencer_images= function(influencer_id){
            this.sendHeaders();
            return this.api_path() + '/influencer/'+influencer_id+'/tiles';
        };
        this.influencer_category= function(influencer_id, category){
            this.sendHeaders();
            return this.api_path() + '/influencers/'+influencer_id+'/'+category;
        };
        this.influencer_follow = function(){
            this.sendHeaders();
            return this.api_path() + '/influencer/follow';
        };
        this.card_vote = function(){
            this.sendHeaders();
            return this.api_path() + '/imagetile/vote';
        };
        this.product_img_tile = function(){
            this.sendHeaders();
            return this.api_path() + '/imagetiles';
        };
        this.productCurrent = function(imagetileId){
            this.sendHeaders();
            return this.api_path() + '/imagetiles/'+imagetileId;
        };
        this.tile_search = function(){
            this.sendHeaders();
            return this.api_path() + '/imagetiles/search';
        };
        this.getMoreTiles = function(type, userId){
            this.sendHeaders();
            return this.api_path() + '/imagetiles/'+type+'?uuid='+userId;
        };
        this.ignoreTile = function(){
            this.sendHeaders();
            return this.api_path() + '/imagetiles';
        };
        this.updateseed = function(image_id, seed_id){
            return this.api_path() + '/imagetiles/'+image_id+'/seeds/'+seed_id;
        };
        this.excludeseed = function(image_id, seed_id){
            return this.api_path() + '/imagetiles/'+image_id+'/seeds/'+seed_id+'/exclude';
        };
        this.saveSeed = function(card_id){
            this.sendHeaders();
            return this.api_path() + '/imagetiles/'+card_id+"/seeds";
        };
        this.removeSeed = function(img_id, seed_id){
            this.sendHeaders();
            return this.api_path() + '/imagetiles/'+img_id+"/seeds/"+seed_id;
        };
        this.card_current_detail = function(imagetileId){
            this.sendHeaders();
            return this.api_path() + '/imagetiles/'+imagetileId;
        };
        this.product_search = function(img_id, seed_id){
            this.sendHeaders();
            return this.api_path() + '/imagetiles/'+img_id+"/seeds/"+seed_id+"/products";
        };
        this.profile = function(){
            this.sendHeaders();
            return this.api_path() + '/profile';
        };
        this.updateProfile = function(){
            this.sendHeaders();
            return this.api_path() + '/profile/update_email';
        };
        this.profile_image = function(){
            this.sendHeaders();
            return this.api_path() + '/profileimage';
        };
        this.searchProduct = function(){
            this.sendHeaders();
            return this.api_path() + '/products';
        };
        this.productDetails= function(product_id){
            this.sendHeaders();
            return this.api_path() + '/products/'+ product_id;
        };
        this.filterBrands= function(){
            this.sendHeaders();
            return this.api_path() + '/brands';
        };
        this.filterPeople= function(){
            this.sendHeaders();
            return this.api_path() + '/influencers';
        };
        this.logOutUser= function(){
            this.sendHeaders();
            return this.api_path() + '/profile/logout';
        };
        this.getCategories= function(){
            this.sendHeaders();
            return this.api_path() + '/categories';
        };
        this.cantWaitVote= function(uuid){
            this.sendHeaders();
            return this.api_path() + '/influencers/'+uuid+'/vote';
        };
        this.initialSeeds = function(influencer){
            this.sendHeaders();
            return this.api_path() + '/influencers/'+influencer+'/seeds';
        };
        this.mainMenu = function(){
            this.sendHeaders();
            return this.api_path() + '/imagetiles/menu';
        };
        this.checkSession = function(){
            this.sendHeaders();
            return this.api_path() + '/profile/check_session';
        };
        this.analytics = function(){
            this.sendHeaders();
            return this.api_path() + '/log_event';
        }

    });

'use strict';

angular.module('Witlee.models')
    .factory('wBlogPost', function ($sce) {
        function BlogPost(data) {
            this.title = data.title;
            this.text = data.text;
            this.url = data.blog_deeplink;
            this.createdAt = data.posting_date;
            if (data.imagetile) {
                this.image = {
                    id: data.imagetile.id,
                    url: $sce.trustAsResourceUrl(data.imagetile.imagetile_url)
                };
            }
        }

        return BlogPost;
    });
'use strict';

angular.module('Witlee.models')
    .factory('wCard', function (
        $sce,
        wHttp,
        wPerson,
        wConfig
    ) {

        function Card(card) {
            _.assign(this, card);
            this.publisher.photo = $sce.trustAsResourceUrl(this.publisher.photo);
        }

        Card.getAlt = function(array) {
            // function getAlt(array) {
            var alt = "";
            for (var i = 0; i < array.length; i++) {
                if (i == 0) {
                    alt += (array[i].name);
                } else if ((i > 0) && (i < array.length - 1)) {
                    alt += ', ' + array[i].name;
                } else {
                    alt += ' and ' + array[i].name;
                }
            }
            return alt;
        }

        wPerson.prototype.scrollTo = {
            seed: scrollToSeed
        };

        Card.current = {};
        Card.Person = wPerson;

        Card.getAll = function (config) {
            var url = wConfig.product_img_tile();
            return wHttp.get( url , config)
                .then(function (res) {
                    var headers = res.headers();
                    if(headers['x-session']){
                        localStorage.setItem('xsession', headers['x-session']);
                    }
                    var datos= res.data.results.map(function (image) {
                        return new Card({
                            id: image.id,
                            image: {
                                src: image.imagetile_url,
                                alt: Card.getAlt(image.seeds)
                            },
                            publisher: new wPerson(image),
                            seeds: image.seeds,
                            updateTime: image.update_time,
                            votes: {
                                count: image.votes || 0,
                                voted: false
                            }
                        });
                    });
                    var result= {
                        cards: datos,
                        next: res.data.next
                    };
                    return result;
                }, function(res){
                    if(res.status === 401){
                        wConfig.clearHeaders();
                        return res.status;
                    }
                });
        };

        Card.filterBrands= function(param){
            var url = wConfig.filterBrands();
            var params = {
                params : param
            };
            return wHttp.get( url , params ).then(function (res) {
                return res.data;
            }, function(error){
                return error.status;
            });
        };

        Card.filterPeople= function(param){
            var url = wConfig.filterPeople();
            var params = {
                params: param
            };
            return wHttp.get( url , params ).then(function (res) {
                return res.data;
            }, function(error){
                return error.status;
            });
        };

        Card.getMore = function ( url ) {
            return wHttp.get( url ).then(function (res) {
                var datos= res.data.results.map(function (image) {
                    return new Card({
                        id: image.id,
                        image: {
                            src: image.imagetile_url,
                            alt: Card.getAlt(image.seeds)
                        },
                        publisher: new wPerson(image),
                        seeds: image.seeds,
                        updateTime: image.update_time,
                        votes: {
                            count: image.votes || 0,
                            voted: false
                        }
                    });
                });
                var result= {
                    cards: datos,
                    next: res.data.next
                };
                return result;
            });
        };

        Card.getCurrent = function ( imagetileId, seedId ) {
            var params = {};
            Card.selected = +seedId;
            if (Card.selected) {
                params.id = seedId;
            }
            var url = wConfig.productCurrent(imagetileId);
            return wHttp.get( url , {
                params: params
            }).then(function (res) {
                var data = res.data;
                Card.current = new Card({
                    id: data.id,
                    image: {
                        src: data.imagetile_url,
                        alt: Card.getAlt(data.seeds)
                    },
                    publisher: new wPerson(data),
                    seeds: data.seeds,
                    updateTime: data.update_time,
                    votes: {
                        count: data.count,
                        voted: false
                    }
                });
                return Card.current;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Card.getCurrent(imagetileId, seedId);
                    return;
                }
            });
        };

        Card.nextPage = function (url) {
            return wHttp.get( url ).then(function (res) {
                var results = res.data.results.map(function (image) {
                    return new Card({
                        id: image.id,
                        image: {
                            src: image.imagetile_url,
                            alt: Card.getAlt(image.seeds)
                        },
                        publisher: new wPerson(image),
                        seeds: image.seeds,
                        updateTime: image.update_time,
                        votes: {
                            count: image.votes || 0,
                            voted: false
                        }
                    });
                });
                var count = res.data.count;
                var next = res.data.next;
                var result = {
                    cards: results,
                    count: count,
                    next: next
                };
                return result;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Card.nextPage(url);
                    return;
                }
            });
        };

        Card.filter = function (param) {
            var url = wConfig.tile_search();
            var params = {
                params: param
            };
            return wHttp.get( url, params).then(function (res) {
                var results = res.data.results.map(function (image) {
                    return new Card({
                        id: image.id,
                        image: {
                            src: image.imagetile_url,
                            alt: Card.getAlt(image.seeds)
                        },
                        publisher: new wPerson(image),
                        seeds: image.seeds,
                        updateTime: image.update_time,
                        votes: {
                            count: image.votes || 0,
                            voted: false
                        }
                    });
                });
                var count = res.data.count;
                var next = res.data.next;
                var inf = res.data.influencers.results;
                var cat = res.data.categories;
                var bra = res.data.brands.results;
                var result = {
                    cards: results,
                    count: count,
                    next: next,
                    categories: cat,
                    influencers: inf,
                    brands: bra
                };
                return result;
            }, function(res){
                wConfig.clearHeaders();
                return res.status;
            });
        };

        Card.getCurrentDetail = function ( imagetileId ) {
            var url = wConfig.card_current_detail(imagetileId);
            return wHttp.get( url ).then(function (image) {
                var data = image.data;
                return data;
            }, function(image){
                if(image.status === 401){
                    wConfig.clearHeaders();
                    Card.getCurrentDetail(imagetileId);
                    return;
                }
            });
        };

        Card.getMoreUntaggedTiles = function (config, userId) {
            var url = wConfig.getMoreTiles('untagged', userId);
            config = config || {};
            return getMoreTiles(url, config);
        };

        Card.getMoreTaggedTiles = function (config, userId) {
            var url = wConfig.getMoreTiles('tagged', userId);
            config = config || {};
            return getMoreTiles(url, config);
        };

        function getMoreTiles(url, config){
            var params = {
                params: config.params
            };
            return wHttp.get( url, params ).then(function (res) {
                return res.data.results.map(function (image) {
                    return new Card({
                        id: image.id,
                        image: {
                            src: image.imagetile_url,
                            alt: Card.getAlt(image.seeds)
                        },
                        publisher: new wPerson(image),
                        seeds: image.seeds,
                        updateTime: image.update_time,
                        votes: {
                            count: image.votes || 0,
                            voted: false
                        }
                    });
                });
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Card.getMoreTiles(url, config);
                    return;
                }
            });
        }

        Card.getAllUntagged = function(config, userId) {
            var url = wConfig.getMoreTiles('untagged', userId);
            return getAllTiles(url, config);
        };

        Card.getAllTagged = function(config, userId) {
            var url = wConfig.getMoreTiles('tagged', userId);
            return getAllTiles(url, config);
        };

        function getAllTiles(url, config){
            var params = {
                params: config.params
            };
            return wHttp.get( url, params).then(function (res) {
                var cards = res.data.results.map(function (image) {
                    return new Card({
                        id: image.id,
                        image: {
                            src: image.imagetile_url,
                            alt: Card.getAlt(image.seeds)
                        },
                        publisher: new wPerson(image),
                        seeds: image.seeds,
                        updateTime: image.update_time,
                        votes: {
                            count: image.votes || 0,
                            voted: false
                        }
                    });
                });
                var count = res.data.count;
                var result = {
                    cards: cards,
                    count: count,
                    next: res.data.next
                };
                return result;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Card.getAllTiles(url, config);
                    return;
                }
            });
        }

        Card.ignoreTile = function(config, params) {
            var url = wConfig.ignoreTile();
            config = config || {};
            return wHttp.delete( url + '/' + params.imagetile ).then(function (res) {
                return res;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Card.ignoreTile(config, params);
                    return;
                }
            });
        };

        Card.saveSeed = function (params, image_id) {
            var url = wConfig.saveSeed(image_id);
            return wHttp.post( url , params).then(function (res) {
                var data = res.data;
                return data;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Card.saveSeed(params, image_id);
                    return;
                }
            });
        };

        Card.removeSeed = function (params) {
            var url= wConfig.removeSeed(params.img_id, params.seed_id);
            return wHttp.delete( url ).then(function (res) {
                var data = res.data;
                return data;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Card.removeSeed(params);
                    return;
                }
            });
        };

        function scrollToSeed( e, seedId, $first ) {
            if (e) {
                e.stopPropagation();
            }
            var $el = jQuery( '#seed_' + seedId ),
                toPoint = $first ? 600 : 220;
            Card.blockSelected = true;
            var toTop= $el.offset( ).top;
            var container= jQuery( 'html, body' );
            var _WidthScreen= jQuery(window).width();
            jQuery( '.seed .selected' ).removeClass( 'selected' );
            jQuery( '[data-seed-id=seed_' + seedId + ']' ).addClass( 'selected' );
            var scroll_top= toTop-toPoint;
            if(_WidthScreen <= 756){
                var initial= container.scrollTop();
                scroll_top= initial+toTop-toPoint;
            }
            jQuery( 'html, body' ).clearQueue().animate( {
                scrollTop: scroll_top
            }, 1500, 'swing', function( ){
                Card.blockSelected = false;
            } );
        }

        return Card;

    });

'use strict';
angular.module('Witlee.models')
    .factory('wHashtag', function ($sce) {
        function Hashtag(data) {
            this.id = data.hashtag_id;
            this.name = data.hashtag;
            this.image = {
                id: data.imagetile.id,
                url: $sce.trustAsResourceUrl(data.imagetile.imagetile_url)
            };
        }
        return Hashtag;
    });
'use strict';
angular.module('Witlee.models')
    .factory('wInfluencer', function (
        $q,
        $sce,
        wHttp,
        wCard,
        wPromoCard,
        wRetailerCard,
        wHashtag,
        wBlogPost,
        wPerson,
        wConfig
    ) {

        function Influencer(data) {
            this.id = data.guid;
            this.handle = data.username;
            this.photo = $sce.trustAsResourceUrl(data.photo);
            this.media = {
                count: data.media_count
            };
            this.followers = data.followed_by;
            this.following = data.following;
            this.imagetile = {
                all: data.imagetile_counts.all,
                new: data.imagetile_counts.new,
                popular: data.imagetile_counts.popular,
                bestSeller: data.imagetile_counts.best_seller
            };
        }

        Influencer.canceler = function(){
            return $q.defer();
        };

        Influencer.search = function (data) {
            var url= wConfig.influencer_details();
            return wHttp.post( url , data)
                .then(function (res) {
                    return res.data.map(function (influencer) {
                        return new Influencer(influencer);
                    });
                }, function(res){
                    if(res.status === 401){
                        wConfig.clearHeaders();
                        Influencer.search(data);
                        return;
                    }
                });
        };

        Influencer.prototype.getDetails = function () {
            var url= wConfig.influencer_details(this.id);
            var influencer = this;

            return wHttp.get( url )
                .then(function (res) {
                    _.merge(influencer, {
                        promoCards: res.data.promo_tiles.map(function (card) {
                            return new wPromoCard(card);
                        }),
                        brands: res.data.retailer_tiles.map(function (card) {
                            return new wRetailerCard(card);
                        }),
                        hashtags: res.data.hashtags.map(function (hashtag) {
                            return new wHashtag(hashtag);
                        }),
                        relatedInfluencers: res.data.related_influencers.map(function (relatedInfluencer) {
                            return new Influencer(relatedInfluencer);
                        }),
                        blogPost: new wBlogPost(res.data.blog_post)
                    });
                }, function(res){
                    if(res.status === 401){
                        wConfig.clearHeaders();
                        Influencer.getDetails();
                        return;
                    }
                });
        };

        Influencer.prototype.getImages = function (config) {
            var url = wConfig.influencer_details(this.id);
            return wHttp.get( url , config)
                .then(function (res) {
                    return res.data.results.map(function (image) {
                        return new wCard({
                            id: image.id,
                            image: {
                                src: image.imagetile_url,
                                alt: wCard.getAlt(image.seeds)
                            },
                            publisher: new Influencer(image),
                            seeds: image.product_seeds,
                            updateTime: image.update_time,
                            votes: {
                                count: image.votes,
                                voted: false
                            }
                        });
                    });
                }, function(res){
                    if(res.status === 401){
                        wConfig.clearHeaders();
                        Influencer.getImages(config);
                        return;
                    }
                });
        };

        Influencer.getTilesHomeStore = function (idInf, category) {
            var url= wConfig.influencer_category(idInf, category);
            return wHttp.get( url )
                .then(function (res) {
                    return res.data.results.map(function (image) {
                        return new wCard({
                            id: image.id,
                            image: {
                                src: image.imagetile_url,
                                alt: wCard.getAlt(image.seeds)
                            },
                            publisher: new wPerson(image),
                            seeds: image.seeds,
                            updateTime: image.update_time,
                            votes: {
                                count: image.votes || 0,
                                voted: false
                            }
                        });
                    });
                }, function(res){
                    wConfig.clearHeaders();
                    return res.status;
                });
        };

        Influencer.prototype.getAllImages = function () {
            return $q.all([
                this.getImages({ params: { new: 1 }}),
                this.getImages({ params: { popular: 1 }}),
                this.getImages({ params: { best: 1 }})
            ]);
        };

        Influencer.getDetailsUid = function (uid) {
            var url = wConfig.influencer_details(uid);
            return wHttp.get( url )
                .then(function (res) {
                    return res.data;
                }, function(res){
                    wConfig.clearHeaders();
                    return res.status;
                });
        };

        Influencer.getEmailSubscription = function (uid) {
            var url = wConfig.influencer_email_subscription(uid);
            return wHttp.get( url )
                .then(function (res) {
                    return res.data;
                }, function(res){
                    wConfig.clearHeaders();
                    return res.status;
                });
        };

        Influencer.sendEmailSubscription = function (uid, data) {
            var url = wConfig.influencer_email_subscription(uid);
            return wHttp.post( url, data)
                .then(function (res) {
                    return res.data;
                }, function(res){
                    wConfig.clearHeaders();
                    return res.status;
                });
        };

        Influencer.updateEmailSubscription = function (uid) {
            var url = wConfig.influencer_email_subscription(uid);
            return wHttp.put( url )
                .then(function (res) {
                    return res.data;
                }, function(res){
                    wConfig.clearHeaders();
                    return res.status;
                });
        };

        Influencer.followOnInstragram= function(data){
            var url= wConfig.influencer_follow();
            return wHttp.post( url , data)
                .then(function (res) {
                    return res.data;
                }, function(error){
                    if(error.status === 401){
                        wConfig.clearHeaders();
                        Influencer.followOnInstragram(data);
                        return;
                    }
                });
        };

        Influencer.searchInfluencer = function (data) {
            var url = wConfig.influencer_details();
            return wHttp.post( url , data)
                .then(function (res) {
                    return res.data;
                }, function(res){
                    if(res.status === 401){
                        wConfig.clearHeaders();
                        Influencer.searchInfluencer(data);
                        return;
                    }
                });
        };

        return Influencer;

    });

'use strict';
angular.module('Witlee.models')
    .factory('wPerson', function (
        $state,
        wConfig,
        wHttp
    ) {

        function Person(image) {
            this.name = image.profile.name;
            this.handle = image.profile.username;
            this.photo = image.profile.photo;
            this.followers = image.profile.followed_by;
            this.following = image.profile.following;
            this.like = {
                count: image.like_count
            };
        }

        Person.prototype.goTo = {
            seed: goToSeed
        };

        function goToSeed( card, seed ) {
            $state.go('product.results', { id: card.id, seedId: seed.id });
        }

        Person.mainMenu = function(){
            var url = wConfig.mainMenu();
            return wHttp.get( url ).then(function(res){
                return res.data;
            });
        };

        return Person;

    });

'use strict';
angular.module('Witlee.models')
    .factory('wProduct', function (
        $q,
        wHttp,
        wConfig
    ) {

        function Product(product) {
            _.assign(this, product);
        }

        Product.getCategories = function(){
            var url = wConfig.getCategories();
            return wHttp.get( url ).then(function (res) {
                return res.data;
            });
        };

        Product.search = function (config, param) {
            config = config || {};
            var url = wConfig.product_search(config.img_id, config.seed_id);
            var params= {
                params: param
            };
            return wHttp.get( url , params ).then(function (res) {
                return res.data.results.map(function (product) {
                    return product;
                });
            }, function(res){
                wConfig.clearHeaders();
                return res.status;
            });
        };
        Product.updateImagetileSeed = function (image_id, seed_id, params) {
            var url = wConfig.updateseed(image_id, seed_id);

            return wHttp.put( url , params).then(function (res) {
                var data = res.data;
                return data;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Product.updateImagetileSeed(image_id, seed_id, params);
                    return;
                }
            });
        };
        Product.getStoreLink= function(seed_id, product_id){
            var url= wConfig.storeLink(seed_id, product_id);
            return url;
        }
        Product.excluseImagetileSeed = function (image_id, seed_id, params) {
            var url = wConfig.excludeseed(image_id, seed_id);

            return wHttp.post( url , params).then(function (res) {
                var data = res.data;
                return data;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Product.excluseImagetileSeed(image_id, seeD_id, params);
                    return;
                }
            });
        };
        Product.getInitialSeedsInfy = function(influencer, params){
            var canceler = $q.defer();
            var cancel = function(){
                canceler.resolve();
            }
            var params = {params: params};
            var url = wConfig.initialSeeds(influencer);
            var promise = wHttp.get( url, params, {timeout: canceler.promise} ).then(function(res){
                var results = res.data.results.map(function(data){
                    return new Product({
                        id: data.id,
                        elastic_id: data.id,
                        product_name: data.product_name,
                        price: data.price,
                        brand: data.brand,
                        link: data.link,
                        image: data.img,
                        category: data.category,
                        instock: data.instock,
                        description: data.description,
                        retailer_name: data.retailer_name,
                        retailer_id: data.retailer_id,
                        colors: data.colors,
                        all_images: data.all_images
                    });
                });
                var result = {
                    products: results,
                    next: res.data.next,
                    count: res.data.count
                }
                return result;
            });
            return {promise: promise, cancel: cancel};
        }
        Product.getInitialSeeds = function(influencer, params){
            var params = {params: params};
            var url = wConfig.initialSeeds(influencer);
            return wHttp.get( url, params ).then(function(res){
                var results = res.data.results.map(function(data){
                    return new Product({
                        id: data.id,
                        elastic_id: data.id,
                        product_name: data.product_name,
                        price: data.price,
                        brand: data.brand,
                        link: data.link,
                        image: data.img,
                        category: data.category,
                        instock: data.instock,
                        description: data.description,
                        retailer_name: data.retailer_name,
                        retailer_id: data.retailer_id,
                        colors: data.colors,
                        all_images: data.all_images
                    });
                });
                var result = {
                    products: results,
                    next: res.data.next,
                    count: res.data.count
                }
                return result;
            });
        }
        Product.moreInitialSeeds = function(url){
            var url = url;
            return wHttp.get( url ).then(function(res){
                var results = res.data.results.map(function(data){
                    return new Product({
                        id: data.id,
                        elastic_id: data.id,
                        product_name: data.product_name,
                        price: data.price,
                        brand: data.brand,
                        link: data.link,
                        image: data.img,
                        category: data.category,
                        instock: data.instock,
                        description: data.description,
                        retailer_name: data.retailer_name,
                        retailer_id: data.retailer_id,
                        colors: data.colors,
                        all_images: data.all_images
                    });
                });
                var result = {
                    products: results,
                    next: res.data.next
                }
                return result;
            });
        }
        Product.searchSeedProduct = function (config) {
            config = config || {};

            var url= wConfig.product_search(config.image_id, config.seed_id);

            return wHttp.get( url ).then(function (res) {
                var count = 0;
                var results = res.data.results.map(function (data) {
                    return new Product({
                        id: data.id,
                        elastic_id: data.id,
                        product_name: data.product_name,
                        price: data.price,
                        brand: data.brand,
                        link: data.link,
                        image: data.img,
                        category: data.category,
                        instock: data.instock,
                        description: data.description,
                        retailer_name: data.retailer_name,
                        retailer_id: data.retailer_id,
                        colors: data.colors,
                        all_images: data.all_images
                    });
                });
                if (results.length) {
                    count = results.length;
                }
                var result = {
                    products: results,
                    count: count
                }
                return result;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Product.searchSeedProduct(config);
                    return;
                }
            });
        };
        Product.productDetails= function(config){
            config = config || {};
            var url= wConfig.productDetails(config.id);
            return wHttp.get( url ).then(function (res) {
                var results = res.data;
                return results;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Product.productDetails(config);
                    return;
                }
            });
        }
        Product.searchProduct = function (config) {
            var canceler = $q.defer();
            var cancel = function(){
                canceler.resolve();
            }
            config = config || {};
            var url= wConfig.searchProduct();
            var promise = wHttp.get( url , {
                params: config.params
            }, {timeout: canceler}).then(function (res) {
                var count = 0;
                var results = res.data.results.map(function (data) {
                    return new Product({
                        elastic_id: data.id,
                        product_name: data.product_name,
                        price: data.price,
                        brand: data.brand,
                        link: data.link,
                        image: data.img,
                        category: data.category,
                        instock: data.instock,
                        description: data.description,
                        retailer_name: data.retailer_name,
                        retailer_id: data.retailer_id,
                        colors: data.colors,
                        all_images: data.all_images
                    });
                });
                if (results.length) {
                    count = results.length;
                }
                var result = {
                    products: results,
                    count: count,
                    next: res.data.next
                }
                return result;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Product.searchProduct(config);
                    return;
                }
            });
            return {promise: promise, cancel: cancel};
        };
        return Product;
    }).service('wProducts', function () {
    var filterSortSelected= "match";
    this.setFilterSortSelected = function(sort) {
        filterSortSelected = sort;
    };
    this.getFilterSortSelected = function() {
        return filterSortSelected;
    };
});

'use strict';
angular.module('Witlee.models')
    .factory('wProfile', function ($q, wHttp, wCard, wConfig, $rootScope) {
        function Profile(data) {
            this.id = data.id;
            this.handle = data.profile_username;
            this.photo = data.profile_photo;
            this.followers = data.followed_by;
            this.rank = data.rank;
            this.views = data.views;
            this.categories = data.profile_categories.map(function (category) {
                return new Category(category);
            });
            this.imageCount = this.image_count;
        };
        function Category(data) {
            this.id = data.category_id;
            this.name = data.name;
            this.brands = data.profile_brands.map(function (brand) {
                return new Brand(brand);
            });
        }
        function Brand(data) {
            this.id = data.brand_id;
            this.name = data.name;
            this.count = data.brand_count;
        }
        Profile.get = function (handle) {
            return $q.all([
                Profile.getByHandle(handle),
                Profile.getImages(handle)
            ]).then(function (data) {
                Profile.cache = data;
                return data;
            });
        };
        Profile.getByHandle = function (handle) {
            var url = wConfig.profile();
            return wHttp.get( url , {
                params: {
                    handle: handle
                }
            }).then(function (res) {
                return new Profile(res.data);
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Profile.getByHandle(handle);
                    return;
                }
            });
        };
        Profile.getImages = function (handle) {
            var url = wConfig.profile_image();
            return wHttp.get( url , {
                params: {
                    handle: handle
                }
            }).then(function (res) {
                return res.data.map(function (image) {
                    return new wCard({
                        id: image.id,
                        image: {
                            src: image.imagetile_url,
                            alt: wCard.getAlt(image.seeds)
                        },
                        publisher: new wCard.Person(image),
                        seeds: image.product_seeds
                    });
                });
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Profile.getImages(handle);
                    return;
                }
            });
        };
        Profile.getMoreImages = function (config) {
            var url= wConfig.profile_image();
            return wHttp.get( url , config)
                .then(function (res) {
                    return res.data.map(function (image) {
                        return new wCard({
                            id: image.id,
                            image: {
                                src: image.imagetile_url,
                                alt: wCard.getAlt(image.seeds)
                            },
                            publisher: new wCard.Person(image),
                            seeds: image.product_seeds
                        });
                    });
                }, function(res){
                    if(res.status === 401){
                        wConfig.clearHeaders();
                        Profile.getMoreImages(config);
                        return;
                    }
                });
        };
        Profile.checkSession = function(view){
            var url = wConfig.checkSession();
            return wHttp.get( url ).then(function( res ){
                if(res.headers()["x-token"]){
                    localStorage.setItem("token", res.headers()["x-token"]);
                }
                if(res.headers()["x-need-email"]){
                    localStorage.setItem("NeedEmail", res.headers()["x-need-email"]);
                }
                if(res.headers()["x-session"]){
                    localStorage.setItem("xsession", res.headers()["x-session"]);
                }
            }, function(error){
                return error.status;
            });
        };
        Profile.getLogged = function () {
            var url= wConfig.profile();
            return wHttp.get( url ).then(function (res) {
                var data= res.data;
                return data;
            }, function(res){
                wConfig.clearHeaders();
                return res.status;
            });
        };
        Profile.updateEmail = function (params) {
            var url= wConfig.updateProfile();
            return wHttp.put( url , params).then(function (res) {
                var data= res.statusText;
                localStorage.setItem("NeedEmail", "false");
                return data;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    return;
                }
            });
        };
        Profile.cantWaitVote = function (uuid) {
            var url= wConfig.cantWaitVote(uuid);
            return wHttp.put( url ).then(function (res) {
                return res.data;
            });
        };
        Profile.logOut= function(){
            var url= wConfig.logOut();
            return wHttp.post( url ).then(function (res) {
                var data= res;
                return data;
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    return;
                }
            });
        }
        Profile.needEmail= function(){
            return localStorage.getItem("NeedEmail");
        }
        Profile.userToken= function(){
            return localStorage.getItem("token");
        }
        Profile.logOutUser= function(){
            var url= wConfig.logOutUser();
            return wHttp.get( url ).then(function(res){
                console.log(res.headers());
                $rootScope.currentUser= null;
                wConfig.clearHeaders();
            });
        }
        Profile.storeSession = function(session){
            localStorage.setItem("xsession", session);
            $rootScope.$broadcast('user:loggedin', {});
        }
        Profile.getCategories= function(){
            var url = wConfig.categories();
            return wHttp.get( url ).then(function(res){
                return res.data.map(function (result) {
                    return result;
                });
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Profile.getCategories();
                    return;
                }
            });
        };
        Profile.getBrands= function(){
            var url= wConfig.brands();
            return wHttp.get( url ).then(function(res){
                return res.data.map(function (result) {
                    return result;
                });
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Profile.getBrands();
                    return;
                }
            });
        };
        Profile.getPeople= function(){
            var url = wConfig.people();
            return wHttp.get( url ).then(function(res){
                return res.data.map(function (result) {
                    return result;
                });
            }, function(res){
                if(res.status === 401){
                    wConfig.clearHeaders();
                    Profile.getPeople();
                    return;
                }
            });
        };
        Profile.analytics = function(params, event){
            console.log(event);
            var url = wConfig.analytics();
            if(window.wp_witlee_uuid){
                params.embedded_site = window.wp_witlee_uuid;
            }
            wHttp.post( url, params ).then(function(res){});
        }
        return Profile;
    });
'use strict';
angular.module('Witlee.models')
    .factory('wPromoCard', function (wPerson) {
        function PromoCard(data) {
            this.id = data.id;
            this.image = {
                src: data.imagetile_url
            };
            this.publisher = new wPerson(data);
            this.seeds = data.seeds;
            this.updateTime = data.update_time;
            this.votes = {
                count: data.votes || 0,
                voted: false
            }
        }
        return PromoCard;
    })
'use strict';
angular.module('Witlee.models')
    .factory('wRetailerCard', function () {
        function RetailerCard(data) {
            this.name = data.retailer;
            this.url = data.retailer_url;
            this.logo = data.logo;
        }
        return RetailerCard;
    });
'use strict';
angular.module('Witlee.models')
    .service('wStoreFront', function () {
        var influencerId= "";
        this.setInfluencerId= function(ninfluencerId){
            influencerId= ninfluencerId;
        };
        this.getInfluencerId= function(){
            return influencerId;
        };
        this.clearParams= function(){
            influencerId= "";
        };
    });
'use strict';
angular.module('Witlee.models')
    .service('wUser', function ($rootScope) {
        var isLogged = false;
        this.getUser= function(){
            return $rootScope.currentUser;
        };
        this.logIn = function(user) {
            $rootScope.currentUser= user;
            return true;
        };
        this.getIsLogged = function() {
            return isLogged;
        };
    });
(function(){

    'use strict';
    angular.module('Witlee.models')
        .service('searchFilter', function (
            $state,
            wCard,
            wMixPanel,
            $rootScope
        ) {

            var term= '',
                sort= 'best',
                influencer= [],
                brands= [],
                category= [],
                subcategory= [];
            var influencer_temp= [],
                brands_temp= [],
                category_temp= [],
                subcategory_temp= [];

            var full_cat = null;

            var full_categories = [];

            var previousSeach= {};
            var checkBoxMenu= [];
            var checkBoxMenu_temp= [];
            var filterItemsMenuAlt= [];
            var filterItemsMenuAlt_temp= [];
            var if_menu_items= {
                'brand': 0,
                'category': 0,
                'subcategory': 0,
                'influencer': 0
            };
            var if_menu_items_temp= {
                'brand': 0,
                'category': 0,
                'subcategory': 0,
                'influencer': 0
            };

            var is_broadcast = false;

            this.broadCast = function(){
                return is_broadcast;
            };
            this.setBroadCast = function(){
                is_broadcast = true;
            };

            this.clearFilters= function(){
                full_cat = null;
                sub_categories_selected = [];
                categories_full_selected = [];
                term= '';
                sort= 'best';
                influencer= [];
                brands= [];
                category= [];
                previousSeach= {};
                checkBoxMenu= [];
                filterItemsMenuAlt= [];
                if_menu_items= {
                    'brand': 0,
                    'category': 0,
                    'subcategory': 0,
                    'influencer': 0
                };
                angular.element('input[name=searchInput]').val('');
                angular.element('input[name=searchInputMobile]').val('');
            };

            this.removeElement= function(array, id){
                for (var i= 0 ; i < array.length ; i++) {
                    if(array[i].id === id){
                        array.splice(i, 1);
                    }
                }
                return array;
            };

            this.checkLocation= function(){
                if ($state.current.name !== 'search'){
                    $state.go('search');
                    return true;
                }else{
                    return false;
                }
            };

            this.pushDataToTemp= function(){
                if_menu_items_temp= {};
                checkBoxMenu_temp= [];
                filterItemsMenuAlt_temp= [];
                brands_temp= [];
                influencer_temp= [];
                category_temp= [];
                subcategory_temp= [];

                if_menu_items_temp.brand= if_menu_items.brand;
                if_menu_items_temp.category= if_menu_items.category;
                if_menu_items_temp.influencer= if_menu_items.influencer;

                var i;

                for (i = 0; i < checkBoxMenu.length; i++) {
                    checkBoxMenu_temp.push(checkBoxMenu[i]);
                }

                for (i = 0; i < filterItemsMenuAlt.length; i++) {
                    filterItemsMenuAlt_temp.push(filterItemsMenuAlt[i]);
                }

                for (i = 0; i < brands.length; i++) {
                    brands_temp.push(brands[i]);
                }

                for (i = 0; i < influencer.length; i++) {
                    influencer_temp.push(influencer[i]);
                }

                for (i = 0; i < category.length; i++) {
                    category_temp.push(category[i]);
                }
                for (i = 0; i < subcategory.length; i++) {
                    subcategory_temp.push(subcategory[i]);
                }
            };
            this.pushDataFromTemp= function(){
                if_menu_items= {};
                checkBoxMenu= [];
                filterItemsMenuAlt= [];
                brands= [];
                influencer= [];

                if_menu_items.brand= if_menu_items_temp.brand;
                if_menu_items.influencer= if_menu_items_temp.influencer;

                var i;

                for (i = 0; i < checkBoxMenu_temp.length; i++) {
                    checkBoxMenu.push(checkBoxMenu_temp[i]);
                }

                for (i = 0; i < filterItemsMenuAlt_temp.length; i++) {
                    filterItemsMenuAlt.push(filterItemsMenuAlt_temp[i]);
                }

                for (i = 0; i < brands_temp.length; i++) {
                    brands.push(brands_temp[i]);
                }

                for (i = 0; i < influencer_temp.length; i++) {
                    influencer.push(influencer_temp[i]);
                }

            };
            this.openMobileFilter= function(){
                this.pushDataToTemp();
                return this.returnTemps();
            };
            this.closeMobileFilter= function(){
                this.pushDataToTemp();
                return this.returnTemps();
            };
            this.clearMobileFilter= function(){
                this.pushDataToTemp();
                return this.returnTemps();
            };
            this.searchMobileFilter= function(){
                this.pushDataFromTemp();
                return this.returnNoTemps();
            };
            this.returnTemps= function(){
                var response= {
                    if_menu_items_temp: if_menu_items_temp,
                    checkBoxMenu_temp: checkBoxMenu_temp
                };
                return response;
            };
            this.returnNoTemps= function(){
                var response= {
                    if_menu_items: if_menu_items,
                    checkBoxMenu: checkBoxMenu
                };
                return response;
            };

            this.addFullCategory = function(id_cat){
                full_cat = id_cat;
            };

            this.removeFullCategory = function(cat){
                var index = full_categories.indexOf(parseInt(cat.id));
                full_categories.splice(index, 1);
            };

            this.manageFullCategory = function(cat){
                full_categories.push(cat);
            };

            this.clearFullCategories = function(){
                full_categories = [];
            };

            var sub_categories_selected = [];
            var categories_full_selected = [];
            var sub_categories_selected_temp = [];
            var categories_full_selected_temp = [];
            this.removeSubcategory = function(cat, sub){
                var tmp_sub_categories_selected = sub_categories_selected.map(function(tmp_sub){
                    return tmp_sub.sub_id;
                });
                if(_.contains(tmp_sub_categories_selected, sub.sub_id)){
                    var tmp_index = tmp_sub_categories_selected.indexOf(sub.sub_id);
                    sub_categories_selected.splice(tmp_index, 1);
                }
                var tmp_categories_selected = sub_categories_selected.map(function(tmp_sub){
                    return tmp_sub.cat_id;
                });
                if(!_.contains(tmp_categories_selected, cat.id)){
                    var index = categories_full_selected.indexOf(cat.id);
                    categories_full_selected.splice(index, 1);
                }
            };
            this.selectSubCategory = function(cat, sub, storeFront){
                var tmp_sub_categories_selected = sub_categories_selected.map(function(tmp_sub){
                    return tmp_sub.sub_id;
                });
                var to_full_categories = true;

                if(_.contains(tmp_sub_categories_selected, sub.id)){
                    var tmp_index = tmp_sub_categories_selected.indexOf(sub.id);
                    sub_categories_selected.splice(tmp_index, 1);
                }else{
                    if (typeof sub.term === 'undefined') {
                        sub['term'] = sub['name']
                    }
                    sub_categories_selected.push({cat_id:cat.id, sub_id:sub.id, details: sub});
                }
                tmp_sub_categories_selected = sub_categories_selected.map(function(tmp_sub){
                    return tmp_sub.sub_id;
                });
                angular.forEach(cat.subcategory, function(subcategory){
                    if(!_.contains(tmp_sub_categories_selected, subcategory.id)){
                        to_full_categories = false;
                    }
                });
                if(storeFront){
                    to_full_categories = false;
                }
                if(to_full_categories && !_.contains(categories_full_selected, cat.id)){
                    categories_full_selected.push(cat.id);
                }else if(!to_full_categories && _.contains(categories_full_selected, cat.id)){
                    categories_full_selected = _.without(categories_full_selected, cat.id);
                }

            };
            this.selectSubCategoryTemp = function(cat, sub, storeFront){
                var tmp_sub_categories_selected = sub_categories_selected_temp.map(function(tmp_sub){
                    return tmp_sub.sub_id;
                });
                var to_full_categories = true;

                if(_.contains(tmp_sub_categories_selected, sub.id)){
                    var tmp_index = tmp_sub_categories_selected.indexOf(sub.id);
                    sub_categories_selected_temp.splice(tmp_index, 1);
                }else{
                    sub_categories_selected_temp.push({cat_id:cat.id, sub_id:sub.id});
                }
                tmp_sub_categories_selected = sub_categories_selected_temp.map(function(tmp_sub){
                    return tmp_sub.sub_id;
                });
                angular.forEach(cat.subcategory, function(subcategory){
                    if(!_.contains(tmp_sub_categories_selected, subcategory.id)){
                        to_full_categories = false;
                    }
                });
                if(storeFront){
                    to_full_categories = false;
                }
                if(to_full_categories && !_.contains(categories_full_selected_temp, cat.id)){
                    categories_full_selected_temp.push(cat.id);
                }else if(!to_full_categories && _.contains(categories_full_selected_temp, cat.id)){
                    categories_full_selected_temp = _.without(categories_full_selected_temp, cat.id);
                }

                var response= {
                    sub_categories_selected_temp: sub_categories_selected_temp,
                    categories_full_selected_temp: categories_full_selected_temp
                };
                return response;

            };
            this.makeMobileReal = function(){
                sub_categories_selected= sub_categories_selected_temp;
                categories_full_selected= categories_full_selected_temp;
            };

            this.getViewParams_temp= function(params){
                if(_.contains(checkBoxMenu_temp, params.term)){
                    if_menu_items_temp[params.type]--;
                    checkBoxMenu_temp = _.without(checkBoxMenu_temp, params.term);
                    switch(params.type){
                        case 'influencer':
                            influencer_temp= _.without(influencer_temp, params.term);
                            break;
                        case 'brand':
                            brands_temp= this.removeElement(brands_temp, params.id);
                            break;
                    }
                    var arrayAlt= filterItemsMenuAlt_temp;
                    $.each(arrayAlt, function(key, item){
                        if(typeof item !== 'undefined'){
                            if(item.name=== params.term){
                                filterItemsMenuAlt_temp.splice(key, 1);
                            }
                        }
                    });
                }else{
                    if_menu_items_temp[params.type]++;
                    checkBoxMenu_temp.push(params.term);
                    switch(params.type){
                        case 'influencer':
                            this.addInfluencer_temp(params.term);
                            break;
                        case 'brand':
                            this.addBrand_temp(params.id, params.term);
                            break;
                    }
                    filterItemsMenuAlt_temp.push({
                        'name':params.term,
                        'id':params.id,
                        'type':params.type,
                        'realTerm': params.realTerm
                    });
                }
                var response= {
                    if_menu_items_temp: if_menu_items_temp,
                    checkBoxMenu_temp: checkBoxMenu_temp
                };
                return response;
            };

            this.getViewParams= function(params){
                if(_.contains(checkBoxMenu, params.term)){
                    if_menu_items[params.type]--;
                    checkBoxMenu = _.without(checkBoxMenu, params.term);
                    switch(params.type){
                        case 'influencer':
                            influencer= _.without(influencer, params.term);
                            break;
                        case 'category':
                            category= this.removeElement(category, params.id);
                            break;
                        case 'subcategory':
                            subcategory= this.removeElement(subcategory, params.id);
                            break;
                        case 'brand':
                            brands= this.removeElement(brands, params.id);
                            break;
                    }
                    var arrayAlt= filterItemsMenuAlt;
                    $.each(arrayAlt, function(key, item){
                        if(typeof item !== 'undefined'){
                            if(item.name=== params.term){
                                filterItemsMenuAlt.splice(key, 1);
                            }
                        }
                    });
                }else{
                    if_menu_items[params.type]++;
                    checkBoxMenu.push(params.term);
                    switch(params.type){
                        case 'influencer':
                            this.addInfluencer(params.term);
                            break;
                        case 'category':
                            this.addCategory(params.id, params.term);
                            break;
                        case 'subcategory':
                            this.addSubCategory(params.id, params.term);
                            break;
                        case 'brand':
                            this.addBrand(params.id, params.term);
                            break;
                    }
                    filterItemsMenuAlt.push({
                        'name':params.term,
                        'id':params.id,
                        'type':params.type,
                        'realTerm': params.realTerm
                    });
                }
                var response= {
                    if_menu_items: if_menu_items,
                    checkBoxMenu: checkBoxMenu
                };
                return response;
            };

            this.getSelectedCategories= function(){
                return categories_full_selected;
            };
            this.getSelectedSubCategories= function(){
                return sub_categories_selected;
            };
            this.getSearchCategories= function(){
                return categories_full_selected;
            };
            this.getSearchSubCategories= function(){
                var subcategories = [];
                angular.forEach(sub_categories_selected, function(subcategory){
                    if(!_.contains(categories_full_selected, subcategory.cat_id)){
                        subcategories.push(subcategory.sub_id);
                    }
                });
                return subcategories;
            };
            this.getSearchBrands= function(){
                return brands.map(function(bra){
                    return bra.id;
                });
            };
            this.getSearchInfluencers= function(){
                return influencer;
            };

            this.addSort= function(newSort){
                sort= newSort;
            };
            this.addTerm= function(newTerm){
                term= newTerm;
            };
            this.addCategory= function(id, term){
                var itemCategory= {
                    'id': id,
                    'name': term
                };
                category.push(itemCategory);
            };
            this.addSubCategory= function(id, term){
                var itemCategory= {
                    'id': id,
                    'name': term
                };
                subcategory.push(itemCategory);
            };
            this.addInfluencer= function(itemInfluencer){
                influencer.push(itemInfluencer);
            };
            this.addBrand= function(id, term){
                var itemBrand= {
                    'id': id,
                    'name': term
                };
                brands.push(itemBrand);
            };
            this.addCategory_temp= function(id, term){
                var itemCategory= {
                    'id': id,
                    'name': term
                };
                category_temp.push(itemCategory);
            };
            this.addSubCategory_temp= function(id, term){
                var itemCategory= {
                    'id': id,
                    'name': term
                };
                subcategory_temp.push(itemCategory);
            };
            this.addInfluencer_temp= function(itemInfluencer){
                influencer_temp.push(itemInfluencer);
            };
            this.addBrand_temp= function(id, term){
                var itemBrand= {
                    'id': id,
                    'name': term
                };
                brands_temp.push(itemBrand);
            };

            this.getTerm= function(){
                return term;
            };
            this.getSort= function(){
                return sort;
            };

            this.filter= function(is_new){
                var target= this;
                var response= {};
                target.setBroadCast();
                target.checkLocation();

                var sort_param= '';
                if(target.getSort() !== 'match'){
                    sort_param= target.getSort();
                }

                var searchParams= {
                    brand: target.getSearchBrands(),
                    category: target.getSearchCategories(),
                    sub_category: target.getSearchSubCategories(),
                    influencer: target.getSearchInfluencers(),
                    term: target.getTerm(),
                    sort: sort_param
                };
                return wCard.filter(searchParams).then(function (result) {
                    if(result === 401){
                        return result;
                    }
                    var mixPanelFilter= {
                        'load': false,
                        'brand': searchParams.brand,
                        'influencer': searchParams.influencer,
                        'category': searchParams.category,
                        'term': searchParams.term,
                        'sort': target.getSort()
                    };
                    if(previousSeach !== searchParams){
                        mixPanelFilter.load= true;
                    }
                    previousSeach = searchParams;
                    wMixPanel.sendData('tile search', mixPanelFilter);

                    response = {
                        term: searchParams.term,
                        cards: result.cards,
                        count: result.count,
                        next: result.next,
                        categories_result: result.categories,
                        categories_selected: target.getSelectedCategories(),
                        subcategories_selected: target.getSelectedSubCategories(),
                        influencers: result.influencers,
                        brands: result.brands,
                        checkBoxMenu: checkBoxMenu,
                        filterItemsMenuAlt: filterItemsMenuAlt,
                        if_menu_items: if_menu_items,
                        sort: target.getSort(),
                        is_new: is_new,
                        full_cat: full_cat
                    };
                    if(!target.checkLocation()){
                        $rootScope.$broadcast('user:newsearch', response);
                    }
                    return response;
                });
            };
        });

}());

'use strict';
angular.module('Witlee.models')
    .service('wMixPanel', function () {

        this.sendData = function(event, data) {
            mixpanel.track(event, data);
        };

    });

'use strict';

angular.module('Witlee.models')
    .factory('Page', function() {
        var title = 'Inspired Fashion Shopping  | Witlee';
        var description = 'Inspired Fashion Shopping';
        return {
            getTitle: function() { return title; },
            setTitle: function(newTitle) { title = newTitle + ' | Witlee' },
            getDescription: function() { return description; },
            setDescription: function(newDescription) { description = newDescription }
        };
    });
angular.module("Witlee.main").run(["$templateCache", function($templateCache) {$templateCache.put("modules/common/views/wAvatar.html","<a ui-sref=\"store({ handle: avatar.handle })\" ng-click=\"closeModal()\" stop-propagation><img alt=\"avatar\" data-ng-src=\"{{::avatar.photo}}\" err-avatar-src></a>");
    $templateCache.put("modules/common/views/wCardSeed.html","<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" height=\"40\" width=\"40\"><g><rect x=\"0\" y=\"0\" width=\"40\" height=\"40\" fill=\"white\"/></g><image class=\"card-seed-item\" alt=\"{{::seed.name}} at {{::seed.retailer}}\" data-ng-href=\"{{::seed.image_url}}\" xlink:href=\"\" height=\"40\" width=\"40\" err-gen-src/></svg>");
    $templateCache.put("modules/common/views/wMediumLargeAvatar.html","<a ui-sref=\"profile.main({ handle: avatar.handle })\" stop-propagation><img alt=\"avatar\" data-ng-src=\"{{::avatar.photo}}\"></a>");
    $templateCache.put("modules/main/views/about-witlee.html","<section class=\"home\"><h2>About Witlee</h2><div id=\"about-witlee\"><div class=\"static-content\"><div class=\"container-fluid\"><p>Augmented reality boy into sensory-ware Shibuya rain 8-bit euro-pop dissident construct render-farm drugs BASE jump alcohol narrative. Hacker free-market courier cartel wonton soup shrine dome. Advert human pen weathered bicycle refrigerator cyber-assault hacker paranoid gang woman. Shanty town neon bomb garage RAF media BASE jump advert fluidity shrine network physical woman receding 3D-printed systema futurity. Car-ware claymore mine soul-delay assault franchise network cardboard monofilament. Industrial grade stimulate human into BASE jump courier systema dome smart. Dead franchise media computer smart-sprawl dome beef noodles boat vehicle knife skyscraper pre-face forwards euro-pop-ware.</p><p>Soul-delay woman knife dolphin assassin saturation point BASE jump Legba 3D-printed weathered. Sentient shrine cyber-claymore mine futurity warehouse DIY gang pistol narrative crypto-neural. Marketing DIY face forwards engine boat BASE jump sign Shibuya chrome dolphin bridge tube faded tiger-team modem. Vehicle boy cardboard tattoo rain Chiba vinyl silent neural disposable. Construct euro-pop man Shibuya woman otaku motion face forwards. Market corrupted decay stimulate apophenia drugs military-grade bridge cardboard. Sentient refrigerator convenience store table youtube systemic bicycle cyber-Chiba wristwatch skyscraper. Refrigerator stimulate narrative cyber-physical garage papier-mache.</p></div></div></div></section>");
    $templateCache.put("modules/main/views/backToTop.html","<a data-ng-class=\"{ \'show-btt\': showBTT }\" data-ng-click=\"scrollToPosition( )\"></a>");
    $templateCache.put("modules/main/views/contact.html","<section class=\"home\"><h2>Contact</h2><div id=\"contact\"><div class=\"static-content\"><div class=\"container-fluid\">See: <a href=\"witlee.com\" target=\"_new\">Witlee.com</a></div></div></div></section>");
    $templateCache.put("modules/main/views/home.html","<section class=\"home\" data-ng-init=\"home.init()\" infinite-scroll=\"home.getMore()\" infinite-scroll-distance=\"\'3\'\"><h1>Inspired Fashion Shopping</h1><div class=\"cards\"><div data-ng-repeat=\"card in home.cards track by $index\" class=\"card col-sm-4 col-md-4 col-xs-6\"><w-card data=\"card\"></w-card></div></div><wt-loader ng-if=\"loadingdata\" class=\"loader-mask\"></wt-loader><wt-footer></wt-footer></section>");
    $templateCache.put("modules/main/views/mailVerification.html","<div class=\"modal-body\"><div class=\"closeModalWindow maiVerifyClose hidden-xs\"><a data-ng-click=\"closeModal()\"><img src=\"{{ image_close }}\"></a></div><form class=\"verify-mail\"><div class=\"form-group col-md-9\"><input type=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Your email\" size=\"75\" data-ng-model=\"instEmail\"></div><div class=\"col-md-9\"><button type=\"submit\" class=\"btn btn-neutral\" data-ng-click=\"updateInfo()\">save</button> <a href=\"\" data-ng-click=\"closeModal()\" class=\"btn btn-transparent right\">Skip >></a></div><div class=\"col-md-12\"><p>Please enter your email address to get our newsletter and have access to more functionality.<br>We will not sell or distribute your email address without your express consent see <a href=\"/term-of-use\" data-ng-click=\"closeModal()\">Terms of Service</a> for more information.</p></div></form></div>");
    $templateCache.put("modules/main/views/navBar.html","<div class=\"box-subscription\" ng-class=\"{\'allow-subs\':Navbar.allowSubs}\"><div class=\"main-subs\"><div class=\"contain-subs\"><form class=\"form-subs\" novalidate ng-submit=\"sendEmail()\" name=\"subscriptionForm\"><label>Stay up to date on the latest from <span>Gal Meets Glam</span></label><div class=\"box-container-subs\"><div class=\"wrapper-subs\"><div class=\"email-box pull-right\"><div class=\"input-group\" ng-if=\"!successSubs\"><div class=\"has-feedback\"><span class=\"fa fa-envelope form-control-feedback\"></span> <input type=\"email\" placeholder=\"email address\" class=\"form-control\" ng-model=\"subscription\" required></div><span class=\"input-group-btn\"><button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"subscriptionForm.$invalid || loading\">{{ loading ? \"loading...\" : \"join\" }}</button></span></div><div class=\"message-subs\" ng-if=\"successSubs\">Thank you for subscribing to my list!</div></div></div></div></form><div class=\"close-sect\"><span class=\"close-subs\" ng-click=\"closeSubs()\"></span></div></div></div></div><div class=\"powered\"><a href=\"http://www.witlee.com\" target=\"_blank\">powered by Witlee</a></div><div id=\"main_nav\" class=\"navbar navbar-default\"><div class=\"company-product\" ng-class=\"{\'active\':Navbar.menuMobile}\"><div class=\"dropdown hamburguer-icon\" dropdown><a href class=\"main-menu-item-label hidden-xs\"><img alt=\"Menu\" ng-src=\"{{ image_menu }}\"></a> <a href class=\"main-menu-item-label mobile-main-menu-item\" data-ng-click=\"toggleMainNavigate(false)\"><img alt=\"Menu\" ng-src=\"{{ image_menu }}\"></a><div id=\"embed-witlee-menu\" ng-if=\"current_uuid\" class=\"witlee-menu-mobile\"><img ng-src=\"{{ image_logo }}\"><div class=\"main-filter-layer witlee-menu-items\"><ul><li ng-if=\"!currentUser\"><button ng-click=\"login()\" id=\"login-witlee-menu\"><i class=\"fa fa-instagram\"></i> Your Store</button></li><li ng-if=\"currentUser\" class=\"witlee-menu-item\"><span ng-click=\"logOut()\">Sign out</span></li></ul></div></div><div class=\"main-filter-layer\"><div class=\"filter-layer-checkbox\"><div class=\"list-filter\"><div class=\"no-padding\" ng-class=\"{\'col-xs-6\':current_uuid, \'col-xs-3\':!current_uuid}\"><h3>Categories</h3><ul><li data-ng-repeat=\"(key, item) in categories\" data-ng-class=\"key>4?\'hide\':\'\'\"><div><a data-ng-click=\"goSearchCategory(item, 0)\">{{ item.term.toLowerCase() }}</a></div></li></ul></div><div class=\"no-padding\" ng-class=\"{\'col-xs-6\':current_uuid, \'col-xs-3\':!current_uuid}\"><h3>Brands</h3><ul><li data-ng-repeat=\"(key, item) in brands\" data-ng-class=\"key>4?\'hide\':\'\'\"><div><a data-ng-click=\"goSearchBrand(item, 0)\">{{ item.term.toLowerCase() }}</a></div></li></ul></div><div class=\"col-xs-3 no-padding\" ng-if=\"!current_uuid\"><h3>People</h3><ul><li data-ng-repeat=\"(key, item) in people\" data-ng-class=\"key>4?\'hide\':\'\'\"><div><a data-ng-click=\"goSearchInfluencer(item, 0)\">{{ item.term.toLowerCase() }}</a></div></li></ul></div><div class=\"col-xs-3 no-padding\" ng-if=\"!current_uuid\"><h3>#Hashtags</h3><ul><li data-ng-repeat=\"hashtag in hashtags\"><div><a class=\"hashtag-item-menu\" data-ng-click=\"goSearchHashtag(\'#{{ hashtag.term | lowercase }}\', 0)\">#{{ hashtag.term | lowercase }}</a></div></li></ul></div><div class=\"main-menu-bottom row\"><div class=\"col-md-9 no-padding\" ng-if=\"!current_uuid\"><ul><li><a href=\"http://witlee.com\" target=\"_new\">Contact</a></li><li><a href=\"/privacy-policy\">Privacy Policy</a></li><li><a href=\"/term-of-use\">Terms of Use</a></li></ul></div><div class=\"col-md-3 no-padding powered-site\"><ul><li><a href=\"http://witlee.com\">Powered by Witlee</a></li></ul></div></div></div></div></div></div><a ng-if=\"!current_uuid\" class=\"product-name\" ui-sref=\"home\" data-ng-click=\"Navbar.reloadImages()\" home-scroll-top><img alt=\"Witlee\" ng-src=\"{{ image_logo_main }}\"></a> <a ng-if=\"current_uuid\" class=\"product-name\" ui-sref=\"store({handle:current_uuid})\" home-scroll-top><img alt=\"Witlee\" ng-src=\"{{ image_logo_main }}\"></a><form name=\"searchFormMobile\" ui-keypress=\"{\'13\':\'Navbar.searchKeyPress($event)\'}\" ng-submit=\"Navbar.searchKeyPress($event)\" class=\"mobile-search\" ng-class=\"{\'background\':!Navbar.search}\"><input type=\"text\" name=\"searchInputMobile\" placeholder=\"what are you shopping for?\" data-ng-model=\"Navbar.searchTerms\" data-ng-focus=\"Navbar.focus($event)\" data-ng-disabled=\"!Navbar.enabled\" data-ng-blur=\"Navbar.blur()\"></form></div><div class=\"search\"><form name=\"searchForm\" ng-submit=\"Navbar.searchKeyPress($event)\"><label><img alt=\"Search icon\" ng-src=\"{{ image_search }}\"> <input name=\"searchInput\" data-ng-model=\"Navbar.searchTerms\" placeholder=\"what are you shopping for?\"> <button id=\"searchSubmit\" type=\"submit\">search</button></label></form></div><div class=\"account\"><div data-ng-if=\"currentUser && !current_uuid\"><w-navbar-avatar class=\"main-menu-item-label main-menu-profile\"></w-navbar-avatar></div><div id=\"toInstContainer\" class=\"text-center\" ng-if=\"!currentUser && !current_uuid\"><button id=\"loginToInstagramDesktop\" data-ng-click=\"login(0)\" class=\"hidden-sm\"><i class=\"fa fa-instagram\"></i>Sign in with Instagram</button> <button id=\"loginToInstagramDesktop\" data-ng-click=\"login(0)\" class=\"visible-sm\"><i class=\"fa fa-instagram\"></i>Instagram</button></div><div id=\"embed-witlee-menu\" ng-if=\"current_uuid\"><img ng-src=\"{{ image_logo }}\"><div class=\"main-filter-layer witlee-menu-items\"><ul><li ng-if=\"!currentUser\"><button ng-click=\"login()\" id=\"login-witlee-menu\"><i class=\"fa fa-instagram\"></i> Your Store</button></li><li ng-if=\"currentUser\" class=\"witlee-menu-item\"><span ng-click=\"logOut()\">Sign out</span></li></ul></div></div></div></div><div class=\"filter-mobile main-menu-hide scrollable\" data-ng-class=\"{\'active\': navigate, \'\': !navigate}\"><div class=\"main-menu-mobile-container\"><a class=\"closeMainMenu\" ng-click=\"toggleMainNavigate(true);$event.stopPropagation();\"><img ng-src=\"{{ image_close }}\"></a><div class=\"mobile-header\"><div data-ng-if=\"currentUser\" class=\"loggedContainer\"><div class=\"mobile-profile-avatar\"><img ng-src=\"{{ currentUser.photo }}\"></div><div class=\"mobile-header-store\" ng-click=\"toStore()\">My Storefront</div></div><div data-ng-if=\"!currentUser\" class=\"loggedContainer\"><button id=\"loginToInstagram\" data-ng-click=\"login(1)\"><i class=\"fa fa-instagram\"></i>Sign in with Instagram</button></div></div><div class=\"accordion-filter\"><div class=\"mobile-menu-item-label\"><span class=\"panel-heading\" data-ng-click=\"\">My Feed</span></div><accordion close-others=\"oneAtATime\"><accordion-group is-open=\"menuStatus[0].isOpen\"><accordion-heading><span data-ng-click=\"toggleStatus()\"><i data-ng-class=\"{\'active\':if_menu_items.category > 0}\" class=\"circle-i\"></i>Categories</span> <i class=\"glyphicon pull-right\" data-ng-class=\"{\'glyphicon-minus\': menuStatus[0].isOpen, \'glyphicon-plus\': !menuStatus[0].isOpen}\"></i></accordion-heading><div class=\"list-filter\"><ul><li data-ng-repeat=\"item in categories\"><div><a data-ng-click=\"goSearchCategory(item, 1)\">{{ item.term }}</a></div></li></ul></div></accordion-group><accordion-group is-open=\"menuStatus[1].isOpen\"><accordion-heading><i data-ng-class=\"{\'active\':if_menu_items.category > 0}\" class=\"circle-i\"></i>Brands <i class=\"glyphicon pull-right\" data-ng-class=\"{\'glyphicon-minus\': menuStatus[1].isOpen, \'glyphicon-plus\': !menuStatus[1].isOpen}\"></i></accordion-heading><div class=\"list-filter\"><ul><li data-ng-repeat=\"(key, item) in brands\" data-ng-class=\"key>4?\'hide\':\'\'\"><div><a data-ng-click=\"goSearchBrand(item, 1)\">{{ item.term }}</a></div></li></ul></div><b data-ng-if=\"result_brand.length == 0 && result_top_brand.length == 0\">Empty result</b></accordion-group><accordion-group is-open=\"menuStatus[2].isOpen\" ng-if=\"!current_uuid\"><accordion-heading><i data-ng-class=\"{\'active\':if_menu_items.category > 0}\" class=\"circle-i\"></i>People <i class=\"glyphicon pull-right\" data-ng-class=\"{\'glyphicon-minus\': menuStatus[2].isOpen, \'glyphicon-plus\': !menuStatus[2].isOpen}\"></i></accordion-heading><div class=\"list-filter\"><ul><li data-ng-repeat=\"(key, item) in people\" data-ng-class=\"key>4?\'hide\':\'\'\"><div><a data-ng-click=\"goSearchInfluencer(item, 1)\">{{ item.term }}</a></div></li></ul></div><b data-ng-if=\"result_people.length == 0 && result_top_people.length == 0\">Empty result</b></accordion-group><accordion-group is-open=\"menuStatus[3].isOpen\" ng-if=\"!current_uuid\"><accordion-heading><i data-ng-class=\"{\'active\':if_menu_items.category > 0}\" class=\"circle-i\"></i>#Hashtags <i class=\"glyphicon pull-right\" data-ng-class=\"{\'glyphicon-minus\': menuStatus[3].isOpen, \'glyphicon-plus\': !menuStatus[3].isOpen}\"></i></accordion-heading><div class=\"list-filter\"><ul><li data-ng-repeat=\"hashtag in hashtags\"><div><a class=\"hashtag-item-menu\" data-ng-click=\"goSearchHashtag(\'#{{ hashtag.term | lowercase }}\', 1)\">#{{ hashtag.term | lowercase }}</a></div></li></ul></div><b data-ng-if=\"result_people.length == 0 && result_top_people.length == 0\">Empty result</b></accordion-group></accordion><hr><div class=\"mobile-menu-item-label\" ng-if=\"!current_uuid\"><a class=\"panel-heading\" href=\"http://witlee.com\" target=\"_new\">Contact</a></div><div class=\"mobile-menu-item-label\" ng-if=\"!current_uuid\"><a class=\"panel-heading\" data-ng-click=\"goToStatic(\'privacy-policy\')\">Privacy Policy</a></div><div class=\"mobile-menu-item-label\" ng-if=\"!current_uuid\"><a class=\"panel-heading\" data-ng-click=\"goToStatic(\'term-of-use\')\">Terms of Use</a></div><div class=\"col-md-12\"><button data-ng-if=\"currentUser\" class=\"btn btn-block btn-logout\" data-ng-click=\"logOut(1)\">Sign Out</button></div></div></div></div>");
    $templateCache.put("modules/main/views/notifications.html","<div id=\"notifications-page\" class=\"\"><section class=\"home\"><div class=\"container-fluid text-center no-padding\"><h2 class=\"notificationsTitle\">Notifications</h2><section class=\"home\"><div class=\"col-md-12\"><ul><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11264871_1437855259850476_440627854_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11282853_912787632098134_1373631651_n.jpg\"><div class=\"notificatin-description\"><p>Moola! This Instagram just made you $1.57. <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11324474_838605559528626_1120468601_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11351674_385586518317295_110407691_n.jpg\"><div class=\"notificatin-description\"><p>Moola! This Instagram just made you $1.57. <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11324474_838605559528626_1120468601_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11264871_1437855259850476_440627854_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11282853_912787632098134_1373631651_n.jpg\"><div class=\"notificatin-description\"><p>Moola! This Instagram just made you $1.57. <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11324474_838605559528626_1120468601_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11351674_385586518317295_110407691_n.jpg\"><div class=\"notificatin-description\"><p>Moola! This Instagram just made you $1.57. <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11324474_838605559528626_1120468601_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li></ul></div></section></div></section></div>");
    $templateCache.put("modules/main/views/privacy-policy.html","<section class=\"home\"><h2>Privacy Policy</h2><div id=\"privacy-policy\"><div class=\"static-content\"><div class=\"container-fluid\"><em>Date of Last Revision: November, 2015</em><p><strong class=\"header\">Our Policy:</strong><br>Welcome to the web site (the â€œ<strong>Site</strong>â€) of Witlee, Inc. (â€œ<strong>Witlee</strong>â€, â€œweâ€, â€œusâ€ and/or â€œourâ€). This Site is operated by Witlee and has been created to provide information about our Witlee and our Influencer commerce, mobile applications and related services (together with the Site, the â€œ<strong>Services</strong>â€) to our Service visitors (â€œyouâ€, â€œyourâ€). This Privacy Policy sets forth Witleeâ€™s policy with respect to information including personally identifiable data (â€œ<strong>Personal Data</strong>â€) and other information that is collected from visitors to the Site and Services.</p><p><strong class=\"header\">Information We Collect:</strong><br>When you interact with us through the Services, we may collect Personal Data and other information from you, as further described below:<br><strong>Personal Data That You Provide Through the Services</strong>: We collect Personal Data from you when you voluntarily provide such information, such as when you contact us with inquiries, respond to one of our surveys, register for access to the Services or use certain Services. Wherever Witlee collects Personal Data we make an effort to provide a link to this Privacy Policy.<br><strong>By voluntarily providing us with Personal Data, you are consenting to our use of it in accordance with this Privacy Policy. If you provide Personal Data to the Services, you acknowledge and agree that such Personal Data may be transferred from your current location to the offices and servers of Witlee and the authorized third parties referred to herein located in the United States.</strong></p><p><strong>Other Information:</strong><br><strong>Non-Identifiable Data</strong>: When you interact with Witlee through the Services, we receive and store certain personally non-identifiable information. Such information, which is collected passively using various technologies, cannot presently be used to specifically identify you. Witlee may store such information itself or such information may be included in databases owned and maintained by Witlee affiliates, agents or service providers. The Services may use such information and pool it with other information to track, for example, the total number of visitors to our Site, the number of visitors to each page of our Site, and the domain names of our visitors\' Internet service providers. It is important to note that no Personal Data is available or used in this process.</p><p>In operating the Services, we may use a technology called \"cookies.\" A cookie is a piece of information that the computer that hosts our Services gives to your browser when you access the Services. Our cookies help provide additional functionality to the Services and help us analyze Services usage more accurately. For instance, our Site may set a cookie on your browser that allows you to access the Services without needing to remember and then enter a password more than once during a visit to the Site. In all cases in which we use cookies, we will not collect Personal Data except with your permission. On most web browsers, you will find a â€œhelpâ€ section on the toolbar. Please refer to this section for information on how to receive notification when you are receiving a new cookie and how to turn cookies off. We recommend that you leave cookies turned on because they allow you to take advantage of some of the Service features.</p><p><strong>Aggregated Personal Data</strong>: In an ongoing effort to better understand and serve the users of the Services, Witlee often conducts research on its customer demographics, interests and behavior based on the Personal Data and other information provided to us. This research may be compiled and analyzed on an aggregate basis, and Witlee may share this aggregate data with its affiliates, agents and business partners. This aggregate information does not identify you personally. Witlee may also disclose aggregated user statistics in order to describe our services to current and prospective business partners, and to other third parties for other lawful purposes.</p><p><strong>Do Not Track</strong>: Our Service currently does not respond to â€œDo Not Trackâ€ signals and operates as described in this Privacy Policy whether or not a Do Not Track signal is received. If we do so in the future, we will describe how we do so in this Privacy Policy.</p><p><strong>Location Information</strong>: Our Service may collect and use the location information of your content to provide certain functionality of our Service. Location information may be publicly displayed within the Service. Please keep in mind that other users can see this information and they may use it or disclose it to other individuals or entities outside of our control and without your knowledge. Your location information may be subject to abuse, misuse, and monitoring by others, so please be careful. We may also use content location information in an aggregate way, as described above in the â€œAggregated Personal Dataâ€ section.</p><p><strong>Google Analytics</strong>: We may allow third party service providers to use cookies or similar technologies to collect information about your browsing activities over time and across different websites following your use of the Services. For example, we use Google Analytics, a web analytics service provided by Google, Inc. (â€œGoogleâ€). Google Analytics uses cookies to help us analyze how users use the Site and enhance your experience when you use the Service. For more information on how Google uses this data, go to www.google.com/policies/privacy/partners/.</p><p><strong class=\"header\">Our Use of Your Personal Data and Other Information:</strong><br>Witlee uses the Personal Data you provide in a manner that is consistent with this Privacy Policy. If you provide Personal Data for a certain reason, we may use the Personal Data in connection with the reason for which it was provided. For instance, if you contact us by email, we will use the Personal Data you provide to answer your question or resolve your problem. Also, if you provide Personal Data in order to obtain access to the Services, we will use your Personal Data to provide you with access to such services and to monitor your use of such services. Witlee and its subsidiaries and affiliates (the â€œRelated Companiesâ€) may also use your Personal Data and other personally non-identifiable information collected through the Services to help us improve the content and functionality of the Services, to better understand our users and to improve the Services. Witlee and its affiliates may use this information to contact you in the future to tell you about services we believe will be of interest to you. If we do so, each marketing communication we send you will contain instructions permitting you to \"opt-out\" of receiving future marketing communications. In addition, if at any time you wish not to receive any future marketing communications or you wish to have your name deleted from our mailing lists, please contact us as indicated below. If Witlee intends on using any Personal Data in any manner that is not consistent with this Privacy Policy, you will be informed of such anticipated use prior to or at the time at which the Personal Data is collected.</p><p><strong class=\"header\">Our Disclosure of Your Personal Data and Other Information:</strong><br>Witlee is not in the business of selling your information. We consider this information to be a vital part of our relationship with you. There are, however, certain circumstances in which we may share your Personal Data with certain third parties without further notice to you, as set forth below:</p><p><strong>Business Transfers</strong>: As we develop our business, we might sell or buy businesses or assets. In the event of a corporate sale, merger, reorganization, dissolution or similar event, Personal Data may be part of the transferred assets.</p><p><strong>Related Companies</strong>: We may also share your Personal Data with our Related Companies for purposes consistent with this Privacy Policy.</p><p><strong>Agents, Consultants and Related Third Parties</strong>: Witlee, like many businesses, sometimes hires other companies to perform certain business-related functions. Examples of such functions include mailing information, maintaining databases and processing payments. When we employ another entity to perform a function of this nature, we only provide them with the information that they need to perform their specific function.</p><p><strong>Legal Requirements</strong>: Witlee may disclose your Personal Data if required to do so by law or in the good faith belief that such action is necessary to (i) comply with a legal obligation, (ii) protect and defend the rights or property of Witlee, (iii) act in urgent circumstances to protect the personal safety of users of the Services or the public, or (iv) protect against legal liability.</p><p><strong class=\"header\">Your Choices</strong>:<br>You can visit the Site without providing any Personal Data. If you choose not to provide any Personal Data, you may not be able to use certain Services.</p><p><strong class=\"header\">Exclusions:</strong><br>This Privacy Policy does not apply to any Personal Data collected by Witlee other than Personal Data collected through the Services. This Privacy Policy shall not apply to any unsolicited information you provide to Witlee through the Services or through any other means. This includes, but is not limited to, information posted to any public areas of the Services, such as forums, any ideas for new products or modifications to existing products, and other unsolicited submissions (collectively, â€œUnsolicited Informationâ€). All Unsolicited Information shall be deemed to be non-confidential and Witlee shall be free to reproduce, use, disclose, and distribute such Unsolicited Information to others without limitation or attribution.</p><p><strong class=\"header\">Children:</strong><br>Witlee does not knowingly collect Personal Data from children under the age of 13. If you are under the age of 13, please do not submit any Personal Data through the Services. We encourage parents and legal guardians to monitor their childrenâ€™s Internet usage and to help enforce our Privacy Policy by instructing their children never to provide Personal Data on the Services without their permission. If you have reason to believe that a child under the age of 13 has provided Personal Data to Witlee through the Services, please contact us, and we will endeavor to delete that information from our databases.</p><p><strong class=\"header\">Links to Other Web Sites:</strong><br>This Privacy Policy applies only to the Services. The Services may contain links to other web sites not operated or controlled by Witlee (the â€œThird Party Sitesâ€). The policies and procedures we described here do not apply to the Third Party Sites. The links from the Services do not imply that Witlee endorses or has reviewed the Third Party Sites. We suggest contacting those sites directly for information on their privacy policies.</p><p><strong class=\"header\">Integrating Social Networking Services:</strong><br>One of the special features of the Service is that it allows you to enable or log in to the Services via various social networking services like Facebook or Twitter (â€œSocial Networking Service(s)â€). By directly integrating these services, we make your online experiences richer and more personalized. To take advantage of this feature, we will ask you to log into or grant us permission via the relevant Social Networking Service. When you add a Social Networking Services account to the Service or log into the Service using your Social Networking Services account, we will collect relevant information necessary to enable the Service to access that Social Networking Service and your data contained within that Social Networking Service. As part of such integration, the Social Networking Service will provide us with access to certain information that you have provided to the Social Networking Service, and we will use, store and disclose such information in accordance with this Privacy Policy. However, please remember that the manner in which Social Networking Services use, store and disclose your information is governed by the policies of such third parties, and Witlee shall have no liability or responsibility for the privacy practices or other actions of any Social Networking Services that may be enabled within the Service.</p><p>You may also have the option of posting your Services activities to Social Networking Services when you access content through the Services (for example, you may post to Facebook that you performed an activity on the Service); you acknowledge that if you choose to use this feature, your friends, followers and subscribers on any Social Networking Services you have enabled will be able to view such activity.</p><p><strong class=\"header\">Security:</strong><br>Witlee takes reasonable steps to protect the Personal Data provided via the Services from loss, misuse, and unauthorized access, disclosure, alteration, or destruction. However, no Internet or email transmission is ever fully secure or error free. In particular, email sent to or from the Services may not be secure. Therefore, you should take special care in deciding what information you send to us via email. Please keep this in mind when disclosing any Personal Data to Witlee via the Internet.</p><p><strong class=\"header\">Other Terms and Conditions:</strong><br>Your access to and use of the Services is subject to the Terms of Service at <a href=\"http://www.witlee.com/serviceterms.html\">www.witlee.com/serviceterms.html</a> or <a href-=\"http://www.witlee.com/serviceterms.html\">www.witlee.com/serviceterms</a></p><p><strong class=\"header\">Changes to Witleeâ€™s Privacy Policy:</strong><br>The Services and our business may change from time to time. As a result, at times it may be necessary for Witlee to make changes to this Privacy Policy. Witlee reserves the right to update or modify this Privacy Policy at any time and from time to time without prior notice. Please review this policy periodically, and especially before you provide any Personal Data. This Privacy Policy was last updated on the date indicated above. Your continued use of the Services after any changes or revisions to this Privacy Policy shall indicate your agreement with the terms of such revised Privacy Policy.</p><p><strong class=\"header\">Access to Information; Contacting Witlee:</strong><br>To keep your Personal Data accurate, current, and complete, please contact us as specified below. We will take reasonable steps to update or correct Personal Data in our possession that you have previously submitted via the Services. Please also feel free to contact us if you have any questions about Witleeâ€™s Privacy Policy or the information practices of the Services.</p><p>You can contact us at 350 Aldean Ave, Mountain View, CA 94043 or at <a href=\"mailto:privacy@witlee.com?subject=privacy\">privacy@witlee.com</a> for any questions.</p></div></div></div></section>");
    $templateCache.put("modules/main/views/profile.html","<section class=\"profile\"><div ui-view=\"header\"></div><div class=\"views\"><div ui-view=\"user\"></div><div ui-view=\"seeds\"></div></div></section>");
    $templateCache.put("modules/main/views/profileHeader.html","<header><div class=\"profile\"><h4>{{header.info.handle}}</h4></div><div class=\"info\"><h4>Rank #{{header.info.rank}}</h4><h4>Followers: {{header.info.followers}}</h4><h4>Image Views: {{header.info.views}}</h4></div></header>");
    $templateCache.put("modules/main/views/profileSeeds.html","<section class=\"seeds\" infinite-scroll=\"seed.getMore()\" infinite-scroll-distance=\"1\"><div data-ng-repeat=\"card in seed.cards | filter: seed.filter\" class=\"card\"><w-card data=\"card\"></w-card></div></section>");
    $templateCache.put("modules/main/views/profileUser.html","<w-profile-avatar data=\"user.info\"></w-profile-avatar><h3>Sort by</h3><div class=\"categories\"><div class=\"category\" data-ng-repeat=\"category in user.info.categories\"><a data-ng-click=\"category.show = !category.show\" data-ng-class=\"{ selected: category.show }\">{{category.name}}</a><ul class=\"brands ng-hide\" data-ng-show=\"category.show\"><li class=\"brand\" data-ng-repeat=\"brand in category.brands\"><label><input type=\"checkbox\" data-ng-model=\"brand.show\"> <span></span> {{brand.name}}</label></li></ul></div></div>");
    $templateCache.put("modules/main/views/search.html","<section class=\"search-view search-scroll\" data-ng-class=\"{ \'sticky-profile-seed\': showMiniSeeds }\"><div class=\"profile sticky-profile\" ui-view=\"profile\"></div><div class=\"results product-page\" ui-view=\"results\"></div><wt-footer></wt-footer></section>");
    $templateCache.put("modules/main/views/searchProfile.html","<div class=\"profile-container\"><div class=\"search-seed-profile\"><div class=\"publisher sticky_publisher\"><w-avatar data=\"profile.person\"></w-avatar><div class=\"profile_description\"><h4><a ui-sref=\"store({ handle: profile.person.handle })\" stop-propagation>{{::profile.person.handle}}</a></h4><h5>{{::profile.person.followers | numberAbbr}} followers</h5></div></div><h2>{{::profile.seeds.length}} products</h2><div class=\"publisher\"><w-avatar data=\"profile.person\"></w-avatar><div><h4><a ui-sref=\"store({ handle: profile.person.handle })\" stop-propagation>{{::profile.person.handle}}</a></h4><h5>{{::profile.person.followers | numberAbbr}} followers</h5></div></div><div class=\"search-seed-picture\" style=\"background-image:url({{::profile.image.src}})\"><img src=\"{{::profile.image.src}}\" alt=\"{{::profile.person.name}} wearing {{::profile.image.alt}}\"></div></div><div class=\"search-seed-seeds\"><h2>{{::profile.seeds.length}} products in this Instagram</h2><div class=\"owl-carousel owl-carousel-full\" ng-init=\"profile.sendEvent()\"><div class=\"seed\" data-ng-repeat=\"seed in profile.seeds track by seed.id\"><w-search-seed data=\"seed\" data-seed-id=\"seed_{{ seed.id }}\" class=\"{{ $index === 0 ? \'selected\' : \'\' }}\" data-ng-click=\"profile.person.scrollTo.seed( $event, seed.id, $first )\"></w-search-seed></div></div><div class=\"owl-controls clickable\"><div class=\"owl-buttons\"><div class=\"owl-prev prev\">prev</div><div class=\"owl-next next\">next</div></div></div></div><!--<h2 class=\"sticky_title\">Customers were also interested in</h2>--><div class=\"sort-order sticky-sort\"><div class=\"btn-group\" dropdown is-open=\"status.isopen\"><button type=\"button\" dropdown-toggle class=\"btn dropdown-toggle\">{{ filterSortOrder[filterSortSelected] }}</button><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"(key, value) in filterSortOrder\" ng-class=\"{ \'selected-item\' : filterSortSelected === key }\" ng-click=\"filterUpdateSortOrder( key )\">{{::value}}</li></ul></div></div></div>");
    $templateCache.put("modules/main/views/searchResults.html","<section class=\"products\" ng-repeat=\"seed in results.seeds track by seed.id\" ng-init=\"results.init( seed, $last )\"><h2 id=\"seed_{{::seed.id}}\" ng-if=\"results[ seed.id ].products.length>0\" ng-attr-class=\"{{ \'products-title js-index-\' + $index }}\">Customers were also interested in</h2><div id=\"products-sort\" ng-if=\"$first\" class=\"sort-order\"><div class=\"btn-group\" dropdown is-open=\"status.isopen\"><button type=\"button\" dropdown-toggle class=\"btn dropdown-toggle\">{{ filterSortOrder[filterSortSelected] }}</button><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"(key, value) in filterSortOrder\" ng-class=\"{ \'selected-item\' : filterSortSelected === key }\" ng-click=\"filterUpdateSortOrder( key )\">{{::value}}</li></ul></div></div><div class=\"product-list\"><div class=\"product\" ng-repeat=\"product in results[ seed.id ].products track by $index + \'_\' + product.img.url\"><w-product data=\"product\" class=\"{{seed.id}}-{{$index}}\" index=\"$index\" image=\"image_id\" influencer=\"current\" seed=\"seed\"></w-product></div><div class=\"product\"></div><div class=\"product\"></div><div class=\"product\"></div></div></section>");
    $templateCache.put("modules/main/views/searchResultsView.html","<div id=\"filter-page-results\" class=\"searchResult\"><div class=\"filter-menu-filter-container\"><div id=\"filter-menu\"><div class=\"row home-menu\"><div class=\"container-fluid\"><div id=\"filters-menu\"><div class=\"left total-results\"><span>{{count}} results</span> <input type=\"hidden\" value=\"{{Navbar.searchTerms}}\" ng-model=\"term\"></div><div class=\"divider\"></div><ul class=\"filter-menu-items filter-min\"><li class=\"filter-item\" ng-click=\"toggleNavigate(false)\"><span>filter</span></li></ul><ul class=\"filter-menu-items hidden-xs\"><li class=\"filter-item filter-categories\"><span class=\"menu-item-label\"><i ng-class=\"{\'active\': categoryItems()}\" class=\"circle-i\"></i>categories <i class=\"fa fa-caret-down\"></i></span><div class=\"filter-layer\"><div class=\"filter-layer-checkbox\"><div class=\"list-filter\"><ul class=\"filter-categories-new\"><li class=\"filter-category-new\" ng-repeat=\"(key, category) in categories\" ng-class=\"checkParentFull(category)\" ng-if=\"category.subcategory.length > 0\"><div><label class=\"category-name\" ng-click=\"selectAll(category)\" ng-class=\"{\'active\':isOpen(key)}\">{{ (category.name) }}</label><span class=\"all_selection\" ng-click=\"openSubcategories(key, category)\" ng-class=\"{\'active\':isOpen(key)}\"><img ng-src=\"{{ image_arrow }}\"></span> <span class=\"hidden\">[{{ totalResults(category) }}]</span></div><ul class=\"sub-category-list\" ng-if=\"category.subcategory.length > 0\" ng-class=\"{\'active\':isOpen(key)}\"><li class=\"sub-cat-item\" ng-repeat=\"sub_item in category.subcategory\" ng-class=\"subCategoryResult(category, sub_item)\"><label ng-click=\"setSelectedSubCategory(sub_item, category)\" ng-class=\"checkedIfSubcategory(category, sub_item)\">{{ (sub_item.name) }} <span class=\"hidden\">[{{ totalResultsSubcategory(category, sub_item) }}]</span></label></li></ul></li></ul></div></div></div></li><li class=\"filter-item filter-brands\"><span class=\"menu-item-label\"><i ng-class=\"{\'active\':if_menu_items.brand > 0}\" class=\"circle-i\"></i>brands <i class=\"fa fa-caret-down\"></i></span><div class=\"filter-layer\"><form name=\"brand_filter\" ng-submit=\"filterBrands()\"><div class=\"form-group has-feedback has-double-feedback has-double-feedback\"><input type=\"text\" class=\"form-control\" ng-model=\"filter_brand\" placeholder=\"search brands...\" ng-keypress=\"preFilter()\"> <span class=\"glyphicon glyphicon-search form-control-feedback left-feedback\"></span> <span class=\"glyphicon glyphicon-arrow-right form-control-feedback\"></span></div></form><div class=\"filter-layer-checkbox\"><div class=\"list-filter\"><ul><li ng-if=\"topBrands.length != 0\"><b>Top Brands</b></li><li ng-repeat=\"x in topBrands\" ng-if=\"x.term !== null\"><div class=\"checkbox\"><input type=\"checkbox\" ng-checked=\'checkedIf(\"{{ x.term | noWhiteSpace }}\")\'><label ng-click=\'setSelectedItem(x, \"brand\")\'>{{ x.term.toLowerCase() }}</label></div></li></ul><ul><li class=\"all-title\"><b>All brands</b></li><li ng-if=\"filterError\">{{ filterError }}</li><li ng-repeat=\"x in filteredBrands | orderBy:\'name\'\" ng-if=\"x.name !== null\"><div class=\"checkbox\"><input type=\"checkbox\" ng-checked=\'checkedIf(\"{{ x.name | noWhiteSpace }}\")\'><label ng-click=\'setSelectedItem(x, \"brand\")\'>{{ x.name.toLowerCase() }}</label></div></li></ul><b ng-if=\"result_brand.length == 0 && result_top_brand.length == 0\">Empty result</b></div></div></div></li><li ng-class=\"{\'hide\':current_uuid}\" class=\"filter-item filter-person\"><span class=\"menu-item-label\"><i ng-class=\"{\'active\':if_menu_items.influencer > 0}\" class=\"circle-i\"></i>person <i class=\"fa fa-caret-down\"></i></span><div class=\"filter-layer\"><form ng-submit=\"filterPeople()\"><div class=\"form-group has-feedback has-double-feedback has-double-feedback\"><input type=\"text\" class=\"form-control\" ng-model=\"filter_person\" placeholder=\"search people...\"> <span class=\"glyphicon glyphicon-search form-control-feedback left-feedback\"></span> <span class=\"glyphicon glyphicon-arrow-right form-control-feedback\"></span></div></form><div class=\"filter-layer-checkbox\"><div class=\"list-filter\"><ul><li ng-if=\"topPeople.length != 0\"><b>Top People</b></li><li ng-repeat=\"x in topPeople\" ng-if=\"x.term !== null\"><div class=\"checkbox\"><input type=\"checkbox\" ng-checked=\'checkedIf(\"{{ x.term | noWhiteSpace }}\")\'><label ng-click=\'setSelectedItem(x, \"influencer\")\'>{{ x.name }}</label></div></li></ul><ul><li ng-if=\"result_people.length != 0\"><b>All People</b></li><li ng-if=\"personFilterError\">{{ personFilterError }}</li><li ng-repeat=\"x in filteredPeople | orderBy:\'name\'\" ng-if=\"x.username\"><div class=\"checkbox\"><input type=\"checkbox\" ng-checked=\'checkedIf(\"{{ x.username | noWhiteSpace }}\")\'><label ng-click=\'setSelectedItem(x, \"influencer\")\'>{{ (x.name) }}</label></div></li></ul></div><b ng-if=\"result_people.length == 0 && result_top_people.length == 0\">Empty result</b></div></div></li></ul><div id=\"filter-sort\" class=\"sort-order\"><div class=\"btn-group\" dropdown is-open=\"status.isopen\"><button type=\"button\" dropdown-toggle class=\"btn dropdown-toggle\">{{ filterSortSelected }}</button><ul class=\"dropdown-menu bigest\" role=\"menu\"><li ng-repeat=\"(key, value) in filterSortOrder\" ng-class=\"{ \'selected-item\' : ( filterSortSelected === value ) }\" ng-click=\"filterUpdateSortOrder( key )\">{{::value}}</li></ul></div></div></div></div></div></div></div><div class=\"filter-mobile\" ng-class=\"{\'active\': navigate, \'\': !navigate}\"><h2>Filter <a ng-click=\"toggleNavigate(true)\"><img ng-src=\"{{ image_close }}\"></a></h2><div class=\"accordion-filter\"><accordion close-others=\"oneAtATime\"><accordion-group is-open=\"menuStatus[0].isOpen\"><accordion-heading><span ng-click=\"toggleStatus()\"><i ng-class=\"{\'active\': categoryItems()}\" class=\"circle-i\"></i>Categories</span> <i class=\"pull-right\" ng-class=\"{\'is_close\': menuStatus[0].isOpen, \'is_open\': !menuStatus[0].isOpen}\"></i></accordion-heading><div class=\"list-filter\"><ul class=\"filter-categories-new\"><li class=\"filter-category-new\" ng-repeat=\"(key, category) in categories\" ng-class=\"checkParentFull(category)\" ng-if=\"category.subcategory.length > 0\"><div><label class=\"category-name\" ng-click=\"openSubcategories(key, category)\" ng-class=\"{\'active\':isOpen(key)}\">{{ (category.name) }}</label></div><ul class=\"sub-category-list\" ng-if=\"category.subcategory.length > 0\" ng-class=\"{\'active\':isOpen(key)}\"><li class=\"sub-cat-item\" ng-repeat=\"sub_item in category.subcategory\" ng-class=\"subCategoryResultMobile(category, sub_item)\"><label ng-click=\"setSelectedSubCategoryMobile(sub_item, category)\" ng-class=\"checkedIfSubcategoryMobile(category, sub_item)\">{{ (sub_item.name) }}</label></li></ul></li></ul></div></accordion-group><accordion-group is-open=\"menuStatus[1].isOpen\"><accordion-heading><i ng-class=\"{\'active\':if_menu_items_alt.brand > 0}\" class=\"circle-i\"></i>Brands <i class=\"pull-right\" ng-class=\"{\'is_close\': menuStatus[1].isOpen, \'is_open\': !menuStatus[1].isOpen}\"></i></accordion-heading><form name=\"brand_filter\" ng-submit=\"filterBrandsMobile()\"><div class=\"form-group has-feedback has-double-feedback has-double-feedback\"><input type=\"text\" class=\"form-control\" ng-model=\"searchMobile.brand\" placeholder=\"search brands...\" ng-keypress=\"preFilter()\"> <span class=\"glyphicon glyphicon-search form-control-feedback left-feedback\"></span> <span class=\"glyphicon glyphicon-arrow-right form-control-feedback\"></span></div></form><div class=\"list-filter\"><ul><li ng-if=\"topBrands.length != 0\"><b>Top Brands</b></li><li ng-repeat=\"x in topBrands\" ng-if=\"x.term !== null\"><div class=\"checkbox\"><input type=\"checkbox\" ng-checked=\'checkedIfMobile(\"{{ x.term | noWhiteSpace }}\")\'><label ng-click=\'setSelectedItemMobile(x, \"brand\")\'>{{ x.term.toLowerCase() }}</label></div></li></ul><ul><li ng-if=\"result_brand.length != 0\"><b>All brands</b></li><li ng-if=\"filterError\">{{ filterError }}</li><li ng-repeat=\"x in filteredBrands | orderBy:\'name\'\" ng-if=\"x.name !== null\"><div class=\"checkbox\"><input type=\"checkbox\" ng-checked=\'checkedIfMobile(\"{{ x.name | noWhiteSpace }}\")\'><label ng-click=\'setSelectedItemMobile(x, \"brand\")\'>{{ x.name.toLowerCase() }}</label></div></li></ul></div><b ng-if=\"result_brand.length == 0 && result_top_brand.length == 0\">Empty result</b></accordion-group><accordion-group is-open=\"menuStatus[2].isOpen\" ng-if=\"!current_uuid\"><accordion-heading><i ng-class=\"{\'active\':if_menu_items_alt.influencer > 0}\" class=\"circle-i\"></i>Person <i class=\"pull-right\" ng-class=\"{\'is_close\': menuStatus[2].isOpen, \'is_open\': !menuStatus[2].isOpen}\"></i></accordion-heading><form ng-submit=\"filterPeopleMobile()\"><div class=\"form-group has-feedback has-double-feedback has-double-feedback\"><input type=\"text\" class=\"form-control\" name=\"mobile_person_input\" ng-model=\"searchMobile.person\" placeholder=\"search people...\"> <span class=\"glyphicon glyphicon-search form-control-feedback left-feedback\"></span> <span class=\"glyphicon glyphicon-arrow-right form-control-feedback\"></span></div></form><div class=\"list-filter\"><ul><li ng-if=\"topPeople.length != 0\"><b>Top People</b></li><li ng-repeat=\"x in topPeople\" ng-if=\"x.term !== null\"><div class=\"checkbox\"><input type=\"checkbox\" ng-checked=\'checkedIfMobile(\"{{ x.term | noWhiteSpace }}\")\'><label ng-click=\'setSelectedItemMobile(x, \"influencer\")\'>{{ x.name }}</label></div></li></ul><ul><li ng-if=\"result_people.length != 0\"><b>All People</b></li><li ng-if=\"personFilterError\">{{ personFilterError }}</li><li ng-repeat=\"x in filteredPeople | orderBy:\'name\'\" ng-if=\"x.username\"><div class=\"checkbox\"><input type=\"checkbox\" ng-checked=\'checkedIfMobile(\"{{ x.username | noWhiteSpace }}\")\'><label ng-click=\'setSelectedItemMobile(x, \"influencer\")\'>{{ (x.name) }}</label></div></li></ul></div><b ng-if=\"result_people.length == 0 && result_top_people.length == 0\">Empty result</b></accordion-group></accordion></div><div class=\"text-center form-btn-mobile text-center\"><button class=\"btn btn-clear col-xs-5\" ng-click=\"clearAll()\">clear all</button> <button class=\"btn btn-apply col-xs-5\" ng-click=\"filterMobile()\">apply</button></div></div><section class=\"home\"><div class=\"filter-page-container\"><div id=\"filter-selected-items\" class=\"\"><div class=\"filter-selected-item\" ng-repeat=\"filterItem in tag_categories\"><div class=\"filter-item-selected\">{{ filterItem.name.toLowerCase() }} <i class=\"fa fa-close\" ng-click=\"selectAll(filterItem)\"></i></div></div><div class=\"filter-selected-item\" ng-repeat=\"filterItem in tag_subcategories\"><div class=\"filter-item-selected\">{{ filterItem.details.term.toLowerCase() }} <i class=\"fa fa-close\" ng-click=\"removeSubcategory(filterItem)\"></i></div></div><div class=\"filter-selected-item\" ng-repeat=\"filterItem in filterItemsMenuAlt\"><div class=\"filter-item-selected\">{{ filterItem.realTerm.toLowerCase() }} <i class=\"fa fa-close\" ng-click=\"removeSelectedItem(filterItem, \'{{ filterItem.type }}\')\"></i></div></div></div><section class=\"home filter-cards-list\" infinite-scroll=\"filter.nextPage()\" infinite-scroll-distance=\"1\"><div class=\"cards\"><div ng-if=\"nodata\" class=\"witlee-message text-center\">No results found</div><div ng-repeat=\"card in cards track by $index\" class=\"card col-sm-4 col-md-4 col-xs-6\" ng-class=\"{\'hide\': !card.image.src}\"><w-card data=\"card\" id=\"{{card.id}}\"></w-card></div></div><wt-loader ng-if=\"loadingdata\" class=\"loader-mask\"></wt-loader></section></div></section><wt-footer></wt-footer></div>");
    $templateCache.put("modules/main/views/sortOrder.html","<div class=\"btn-group\" dropdown is-open=\"status.isopen\"><button type=\"button\" dropdown-toggle class=\"btn dropdown-toggle\">{{ sortOrder.selected }}</button><ul class=\"dropdown-menu\" role=\"menu\"><li data-ng-repeat=\"(key, value) in sortOrder.options\" data-ng-class=\"{ \'selected-item\' : ( sortOrder.selected === value ) }\" data-ng-click=\"updateOrder( key )\">{{::value}}</li></ul></div>");
    $templateCache.put("modules/main/views/term-of-use.html","<section class=\"home\"><h2>Term of use</h2><div id=\"term-of-use\"><div class=\"static-content\"><div class=\"container-fluid\"><p><em>Date of Last Revision: November, 2015</em></p><p><strong>Welcome to Witlee!</strong> Witlee Inc. (â€œWitlee,â€ â€œwe,â€ â€œus,â€ â€œourâ€) provides its services which are described below, to you through its website located at www.witlee.com (the â€œSiteâ€) and through its mobile applications and related services (collectively, such services, including any new features and applications, and the Site, the â€œServiceâ€), subject to the following Terms of Service (as amended from time to time, the â€œTerms of Serviceâ€). We reserve the right, at our sole discretion, to change or modify portions of these Terms of Service at any time. If we do this, we will post the changes on this page and will indicate at the top of this page the date these terms were last revised. We will also notify you, either through the Services user interface, in an email notification or through other reasonable means. Any such changes will become effective no earlier than fourteen (14) days after they are posted, except that changes addressing new functions of the Services or changes made for legal reasons will be effective immediately. Your continued use of the Service after the date any such changes become effective constitutes your acceptance of the new Terms of Service.</p><p>In addition, when using certain services, you will be subject to any additional terms applicable to such services that may be posted on the Service from time to time, including, without limitation, the Privacy Policy located at <a href=\"http://www.witlee.com/privacy.html\">http://witlee.com/privacy</a> or <a href=\"http://www.witlee.com/privacy.html\">http://witlee.com/privacy.html</a>All such terms are hereby incorporated by reference into these Terms of Service.</p><p><strong class=\"header\">Access and Use of the Service</strong><br><strong>Services Description:</strong> The Service is designed to provide you with access to fashion content (including images, videos and links) and to provide a related commercial experience. <strong>Your Registration Obligations</strong>: You may be required to register with Witlee in order to access and use certain features of the Service. If you choose to register for the Service, you agree to provide and maintain true, accurate, current and complete information about yourself as prompted by the Serviceâ€™s registration form. Registration data and certain other information about you are governed by our Privacy Policy. If you are under 13 years of age, you are not authorized to use the Service, with or without registering. In addition, if you are under 18 years old, you may use the Service, with or without registering, only with the approval of your parent or guardian.</p><p><strong>Member Account, Password and Security</strong>: You are responsible for maintaining the confidentiality of your password and account, if any, and are fully responsible for any and all activities that occur under your password or account. You agree to (a) immediately notify Witlee of any unauthorized use of your password or account or any other breach of security, and (b) ensure that you exit from your account at the end of each session when accessing the Service. Witlee will not be liable for any loss or damage arising from your failure to comply with this Section.</p><p><strong>Modifications to Service</strong>: Witlee reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that Witlee will not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.</p><p><strong>General Practices Regarding Use and Storage</strong>: You acknowledge that Witlee may establish general practices and limits concerning use of the Service, including without limitation the maximum period of time that data or other content will be retained by the Service and the maximum storage space that will be allotted on Witleeâ€™s servers on your behalf. You agree that Witlee has no responsibility or liability for the deletion or failure to store any data or other content maintained or uploaded by the Service. You acknowledge that Witlee reserves the right to terminate accounts that are inactive for an extended period of time. You further acknowledge that Witlee reserves the right to change these general practices and limits at any time, in its sole discretion, with or without notice.</p><p><strong>Mobile Services</strong>: The Service includes certain services that are available via a mobile device, including (i) the ability to upload content to the Service via a mobile device, (ii) the ability to browse the Service and the Site from a mobile device and (iii) the ability to access certain features through an application downloaded and installed on a mobile device (collectively, the â€œMobile Servicesâ€). To the extent you access the Service through a mobile device, your wireless service carrierâ€™s standard charges, data rates and other fees may apply. In addition, downloading, installing, or using certain Mobile Services may be prohibited or restricted by your carrier, and not all Mobile Services may work with all carriers or devices. By using the Mobile Services, you agree that we may communicate with you regarding Witlee and other entities by SMS, MMS, text message or other electronic means to your mobile device and that certain information about your usage of the Mobile Services may be communicated to us. In the event you change or deactivate your mobile telephone number, you agree to promptly update your Witlee account information to ensure that your messages are not sent to the person that acquires your old number.</p><p><strong class=\"header\">Conditions of Use</strong><br><strong>User Conduct</strong>: You are solely responsible for all code, video, images, information, data, text, software, music, sound, photographs, graphics, messages or other materials (â€œcontentâ€) that you upload, post, publish or display (hereinafter, â€œuploadâ€) or email or otherwise use via the Service. The following are examples of the kind of content and/or use that is illegal or prohibited by Witlee. Witlee reserves the right to investigate and take appropriate legal action against anyone who, in Witleeâ€™s sole discretion, violates this provision, including without limitation, removing the offending content from the Service, suspending or terminating the account of such violators and reporting you to the law enforcement authorities. You agree to not use the Service to:</p><p><ol class=\"letters\"><li>email or otherwise upload any content that (i) infringes any intellectual property or other proprietary rights of any party; (ii) you do not have a right to upload under any law or under contractual or fiduciary relationships; (iii) contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment; (iv) poses or creates a privacy or security risk to any person; (v) constitutes unsolicited or unauthorized advertising, promotional materials, commercial activities and/or sales, â€œjunk mail,â€ â€œspam,â€ â€œchain letters,â€ â€œpyramid schemes,â€ â€œcontests,â€ â€œsweepstakes,â€ or any other form of solicitation; (vi) is unlawful, harmful, threatening, abusive, harassing, tortious, excessively violent, defamatory, vulgar, obscene, pornographic, libelous, invasive of anotherâ€™s privacy, hateful racially, ethnically or otherwise objectionable; or (vii) in the sole judgment of Witlee, is objectionable or which restricts or inhibits any other person from using or enjoying the Service, or which may expose Witlee or its users to any harm or liability of any type;</li><li>interfere with or disrupt the Service or servers or networks connected to the Service, or disobey any requirements, procedures, policies or regulations of networks connected to the Service; or</li><li>violate any applicable local, state, national or international law, or any regulations having the force of law;</li><li>impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity;</li><li>solicit personal information from anyone under the age of 18;</li><li>harvest or collect email addresses or other contact information of other users from the Service by electronic or other means for the purposes of sending unsolicited emails or other unsolicited communications;</li><li>advertise or offer to sell or buy any goods or services for any business purpose that is not specifically authorized;</li><li>further or promote any criminal activity or enterprise or provide instructional information about illegal activities; or</li><li>obtain or attempt to access or otherwise obtain any materials or information through any means not intentionally made available or provided for through the Service.</li></ol></p><p><strong>Special Notice for International Use; Export Controls</strong>: Software (defined below in \"Intellectual Property Rights\") available in connection with the Service and the transmission of applicable data, if any, is subject to United States export controls. No Software may be downloaded from the Service or otherwise exported or re-exported in violation of U.S. export laws. Downloading or using the Software is at your sole risk. Recognizing the global nature of the Internet, you agree to comply with all local rules and laws regarding your use of the Service, including as it concerns online conduct and acceptable content.</p><p><strong>Commercial Use</strong>: Unless otherwise expressly authorized herein or in the Service, you agree not to display, distribute, license, perform, publish, reproduce, duplicate, copy, create derivative works from, modify, sell, resell, exploit, transfer or upload for any commercial purposes, any portion of the Service, use of the Service, or access to the Service.</p><p><strong class=\"header\">Intellectual Property Rights</strong><br><strong>Service Content, Software and Trademarks</strong>: You acknowledge and agree that the Service may contain content or features (â€œService Contentâ€) that are protected by copyright, patent, trademark, trade secret or other proprietary rights and laws. Except as expressly authorized by Witlee, you agree not to modify, copy, frame, scrape, rent, lease, loan, sell, distribute or create derivative works based on the Service or the Service Content, in whole or in part, except that the foregoing does not apply to your own User Content (as defined below) that you legally upload to the Service. In connection with your use of the Service you will not engage in or use any data mining, robots, scraping or similar data gathering or extraction methods. If you are blocked by Witlee from accessing the Service (including by blocking your IP address), you agree not to implement any measures to circumvent such blocking (e.g., by masking your IP address or using a proxy IP address). Any use of the Service or the Service Content other than as specifically authorized herein is strictly prohibited. The technology and software underlying the Service or distributed in connection therewith are the property of Witlee, our affiliates and our partners (the â€œSoftwareâ€). You agree not to copy, modify, create a derivative work of, reverse engineer, reverse assemble or otherwise attempt to discover any source code, sell, assign, sublicense, or otherwise transfer any right in the Software. Any rights not expressly granted herein are reserved by Witlee.</p><p>The Witlee name and logos are trademarks and service marks of Witlee (collectively the â€œWitlee Trademarksâ€). Other Witlee, product, and service names and logos used and displayed via the Service may be trademarks or service marks of their respective owners who may or may not endorse or be affiliated with or connected to Witlee. Nothing in this Terms of Service or the Service should be construed as granting, by implication, estoppel, or otherwise, any license or right to use any of Witlee Trademarks displayed on the Service, without our prior written permission in each instance. All goodwill generated from the use of Witlee Trademarks will inure to our exclusive benefit.</p><p><strong>Third Party Material</strong>: Under no circumstances will Witlee be liable in any way for any content or materials of any third parties (including users), including, but not limited to, for any errors or omissions in any content, or for any loss or damage of any kind incurred as a result of the use of any such content. You acknowledge that Witlee does not pre-screen content, but that Witlee and its designees will have the right (but not the obligation) in their sole discretion to refuse or remove any content that is available via the Service. Without limiting the foregoing, Witlee and its designees will have the right to remove any content that violates these Terms of Service or is deemed by Witlee, in its sole discretion, to be otherwise objectionable. You agree that you must evaluate, and bear all risks associated with, the use of any content, including any reliance on the accuracy, completeness, or usefulness of such content.</p><p><strong>User Content Transmitted Through the Service</strong>: With respect to the content or other materials you upload through the Service or share with other users or recipients (collectively, â€œUser Contentâ€), you represent and warrant that you own all right, title and interest in and to such User Content, including, without limitation, all copyrights and rights of publicity contained therein. By uploading any User Content you hereby grant and will grant Witlee and its affiliated companies a nonexclusive, worldwide, royalty free, fully paid up, transferable, sublicensable, perpetual, irrevocable license to copy, display, upload, perform, distribute, store, modify and otherwise use your User Content in connection with the operation of the Service or the promotion, advertising or marketing thereof in any form, medium or technology now known or later developed.</p><p>You acknowledge and agree that any questions, comments, suggestions, ideas, feedback or other information about the Service (â€œSubmissionsâ€), provided by you to Witlee are non-confidential and Witlee will be entitled to the unrestricted use and dissemination of these Submissions for any purpose, commercial or otherwise, without acknowledgment or compensation to you.</p><p>You acknowledge and agree that Witlee may preserve content and may also disclose content if required to do so by law or in the good faith belief that such preservation or disclosure is reasonably necessary to: (a) comply with legal process, applicable laws or government requests; (b) enforce these Terms of Service; (c) respond to claims that any content violates the rights of third parties; or (d) protect the rights, property, or personal safety of Witlee, its users and the public. You understand that the technical processing and transmission of the Service, including your content, may involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.</p><p><strong>Copyright Complaints</strong>: Witlee respects the intellectual property of others, and we ask our users to do the same. If you believe that your work has been copied in a way that constitutes copyright infringement, or that your intellectual property rights have been otherwise violated, you should notify Witlee of your infringement claim in accordance with the procedure set forth below.</p><p>Witlee will process and investigate notices of alleged infringement and will take appropriate actions under the Digital Millennium Copyright Act (â€œDMCAâ€) and other applicable intellectual property laws with respect to any alleged or actual infringement. A notification of claimed copyright infringement should be emailed to Witleeâ€™s Copyright Agent at doron@witlee.com (Subject line: â€œDMCA Takedown Requestâ€).</p><p>To be effective, the notification must be in writing and contain the following information:<ul><li>an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright or other intellectual property interest;</li><li>a description of the copyrighted work or other intellectual property that you claim has been infringed;</li><li>a description of where the material that you claim is infringing is located on the Service, with enough detail that we may find it on the Service;</li><li>your address, telephone number, and email address;</li><li>a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright or intellectual property owner, its agent, or the law;</li><li>a statement by you, made under penalty of perjury, that the above information in your Notice is accurate and that you are the copyright or intellectual property owner or authorized to act on the copyright or intellectual property ownerâ€™s behalf.</li></ul></p><p><strong>Counter-Notice</strong>: If you believe that your User Content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright ownerâ€™s agent, or pursuant to the law, to upload and use the content in your User Content, you may send a written counter-notice containing the following information to the Copyright Agent:<ul><li>your physical or electronic signature;</li><li>identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled;</li><li>a statement that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification of the content; and</li><li>your name, address, telephone number, and email address, a statement that you consent to the jurisdiction of the federal court located within Northern District of California and a statement that you will accept service of process from the person who provided notification of the alleged infringement.</li></ul>If a counter-notice is received by the Copyright Agent, Witlee will send a copy of the counter-notice to the original complaining party informing that person that it may replace the removed content or cease disabling it in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, member or user, the removed content may be replaced, or access to it restored, in 10 to 14 business days or more after receipt of the counter-notice, at our sole discretion.</p><p><strong>Repeat Infringer Policy</strong>: In accordance with the DMCA and other applicable law, Witlee has adopted a policy of terminating, in appropriate circumstances and at Witlee\'s sole discretion, users who are deemed to be repeat infringers. Witlee may also at its sole discretion limit access to the Service and/or terminate the memberships of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.</p><p><strong class=\"header\">Third Party Websites</strong><br>The Service may provide, or third parties may provide, links or other access to other sites and resources on the Internet. Witlee has no control over such sites and resources and Witlee is not responsible for and does not endorse such sites and resources. You further acknowledge and agree that Witlee will not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any content, events, goods or services available on or through any such site or resource. Any dealings you have with third parties found while using the Service are between you and the third party, and you agree that Witlee is not liable for any loss or claim that you may have against any such third party.</p><p><strong class=\"header\">Social Networking Services</strong><br>You may enable or log in to the Service via various online third party services, such as social media and social networking services like Facebook, Instagram, Youtube or Twitter (â€œSocial Networking Servicesâ€). By logging in or directly integrating these Social Networking Services into the Service, we make your online experiences richer and more personalized. To take advantage of this feature and capabilities, we may ask you to authenticate, register for or log into Social Networking Services on the websites of their respective providers. As part of such integration, the Social Networking Services will provide us with access to certain information that you have provided to such Social Networking Services, and we will use, store and disclose such information in accordance with our Privacy Policy. For more information about the implications of activating these Social Networking Services and Witleeâ€™s use, storage and disclosure of information related to you and your use of such services within Witlee (including your friend lists and the like), please see our Privacy Policy at http://witlee.com/privacy or http://witlee.com/privacy.html However, please remember that the manner in which Social Networking Services use, store and disclose your information is governed solely by the policies of such third parties, and Witlee shall have no liability or responsibility for the privacy practices or other actions of any third party site or service that may be enabled within the Service.</p><p>In addition, Witlee is not responsible for the accuracy, availability or reliability of any information, content, goods, data, opinions, advice or statements made available in connection with Social Networking Services. As such, Witlee is not liable for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such Social Networking Services. Witlee enables these features merely as a convenience and the integration or inclusion of such features does not imply an endorsement or recommendation.</p><p><strong class=\"header\">Indemnity and Release</strong><br>You agree to release, indemnify and hold Witlee and its affiliates and their officers, employees, directors and agents harmless from any from any and all losses, damages, expenses, including reasonable attorneysâ€™ fees, rights, claims, actions of any kind and injury (including death) arising out of or relating to your use of the Service, any User Content, your connection to the Service, your violation of these Terms of Service or your violation of any rights of another. If you are a California resident, you waive California Civil Code Section 1542, which says: â€œA general release does not extend to claims which the creditor does not know or suspect to exist in his favor at the time of executing the release, which if known by him must have materially affected his settlement with the debtor.â€ If you are a resident of another jurisdiction, you waive any comparable statute or doctrine.</p><p><strong class=\"header\">Disclaimer of Warranties</strong><br>YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN â€œAS ISâ€ AND â€œAS AVAILABLEâ€ BASIS. WITLEE EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT.</p><p>WITLEE MAKES NO WARRANTY THAT (I) THE SERVICE WILL MEET YOUR REQUIREMENTS, (II) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (III) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE, OR (IV) THE QUALITY OF ANY PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS.</p><p><strong class=\"header\">Limitation of Liability</strong><br>YOU EXPRESSLY UNDERSTAND AND AGREE THAT WITLEE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY DAMAGES, OR DAMAGES FOR LOSS OF PROFITS INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF WITLEE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, RESULTING FROM: (I) THE USE OR THE INABILITY TO USE THE SERVICE; (II) THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND SERVICES RESULTING FROM ANY GOODS, DATA, INFORMATION OR SERVICES PURCHASED OR OBTAINED OR MESSAGES RECEIVED OR TRANSACTIONS ENTERED INTO THROUGH OR FROM THE SERVICE; (III) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; (IV) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE SERVICE; OR (V) ANY OTHER MATTER RELATING TO THE SERVICE. IN NO EVENT WILL WITLEEâ€™S TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES OR CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID WITLEE IN THE LAST SIX (6) MONTHS, OR, IF GREATER, ONE HUNDRED DOLLARS ($100).</p><p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU. IF YOU ARE DISSATISFIED WITH ANY PORTION OF THE SERVICE OR WITH THESE TERMS OF SERVICE, YOUR SOLE AND EXCLUSIVE REMEDY IS TO DISCONTINUE USE OF THE SERVICE.</p><p><strong class=\"header\">Arbitration</strong><br>At Witleeâ€™s or your election, all disputes, claims, or controversies arising out of or relating to the Terms of Service or the Service that are not resolved by mutual agreement may be resolved by binding arbitration to be conducted before JAMS, or its successor. Unless otherwise agreed by the parties, arbitration will be held in Mountain View, California before a single arbitrator mutually agreed upon by the parties, or if the parties cannot mutually agree, a single arbitrator appointed by JAMS, and will be conducted in accordance with the rules and regulations promulgated by JAMS unless specifically modified in the Terms of Service. The arbitration must commence within forty-five (45) days of the date on which a written demand for arbitration is filed by either party. The arbitratorâ€™s decision and award will be made and delivered within sixty (60) days of the conclusion of the arbitration and within six (6) months of the selection of the arbitrator. The arbitrator will not have the power to award damages in excess of the limitation on actual compensatory, direct damages set forth in the Terms of Service and may not multiply actual damages or award punitive damages or any other damages that are specifically excluded under the Terms of Service, and each party hereby irrevocably waives any claim to such damages. The arbitrator may, in his or her discretion, assess costs and expenses (including the reasonable legal fees and expenses of the prevailing part) against any party to a proceeding. Any party refusing to comply with an order of the arbitrators will be liable for costs and expenses, including attorneysâ€™ fees, incurred by the other party in enforcing the award. Notwithstanding the foregoing, in the case of temporary or preliminary injunctive relief, any party may proceed in court without prior arbitration for the purpose of avoiding immediate and irreparable harm. The provisions of this arbitration section will be enforceable in any court of competent jurisdiction.</p><p>Notwithstanding the provisions of the introductory section above, if Witlee changes this â€˜Arbitrationâ€™ section after the date you first accepted these Terms of Service (or accepted any subsequent changes to these Terms of Service ), you may reject any such change by sending us written notice within 30 days of the date such change became effective, as indicated in the â€œDate of Last Revisionâ€ date above or in the date of Witleeâ€™s email to you notifying you of such change. By rejecting any change, you are agreeing that you will arbitrate any dispute between you and Witlee in accordance with the provisions of this section as of the date you first accepted these Terms of Service (or accepted any subsequent changes to these Terms of Service).</p><p><strong class=\"header\">Termination</strong><br>You agree that Witlee, in its sole discretion, may suspend or terminate your account (or any part thereof) or use of the Service and remove and discard any content within the Service, for any reason, including, without limitation, for lack of use or if Witlee believes that you have violated or acted inconsistently with the letter or spirit of these Terms of Service. Any suspected fraudulent, abusive or illegal activity that may be grounds for termination of your use of Service, may be referred to appropriate law enforcement authorities. Witlee may also in its sole discretion and at any time discontinue providing the Service, or any part thereof, with or without notice. You agree that any termination of your access to the Service under any provision of this Terms of Service may be effected without prior notice, and acknowledge and agree that Witlee may immediately deactivate or delete your account and all related information and files in your account and/or bar any further access to such files or the Service. Further, you agree that Witlee will not be liable to you or any third party for any termination of your access to the Service.</p><p><strong class=\"header\">User Disputes</strong><br>You agree that you are solely responsible for your interactions with any other user in connection with the Service and Witlee will have no liability or responsibility with respect thereto. Witlee reserves the right, but has no obligation, to become involved in any way with disputes between you and any other user of the Service.</p><p><strong class=\"header\">General</strong><br>These Terms of Service constitute the entire agreement between you and Witlee and govern your use of the Service, superseding any prior agreements between you and Witlee with respect to the Service. You also may be subject to additional terms and conditions that may apply when you use affiliate or third party services, third party content or third party software. These Terms of Service will be governed by the laws of the State of California without regard to its conflict of law provisions. With respect to any disputes or claims not subject to arbitration, as set forth above, you and Witlee agree to submit to the personal and exclusive jurisdiction of the state and federal courts located within Santa Clara County, California.</p><p>The failure of Witlee to exercise or enforce any right or provision of these Terms of Service will not constitute a waiver of such right or provision. If any provision of these Terms of Service is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavor to give effect to the partiesâ€™ intentions as reflected in the provision, and the other provisions of these Terms of Service remain in full force and effect. You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to use of the Service or these Terms of Service must be filed within one (1) year after such claim or cause of action arose or be forever barred. A printed version of this agreement and of any notice given in electronic form will be admissible in judicial or administrative proceedings based upon or relating to this agreement to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form. You may not assign this Terms of Service without the prior written consent of Witlee, but Witlee may assign or transfer this Terms of Service, in whole or in part, without restriction. The section titles in these Terms of Service are for convenience only and have no legal or contractual effect. Notices to you may be made via either email or regular mail. The Service may also provide notices to you of changes to these Terms of Service or other matters by displaying notices or links to notices generally on the Service.</p><p><strong class=\"header\">Your Privacy</strong><br>At Witlee, we respect the privacy of our users. For details please see our Privacy Policy. By using the Service, you consent to our collection and use of personal data as outlined therein.</p><p><strong class=\"header\">Notice for California Users</strong><br>Under California Civil Code Section 1789.3, users of the Service from California are entitled to the following specific consumer rights notice: The Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs may be contacted in writing at 1625 North Market Blvd., Suite N 112, Sacramento, CA 95834, or by telephone at (916) 445-1254 or (800) 952-5210. You may contact us at Witlee, Inc., 350 Aldean Ave, Mountain View, CA 94043</p><p><strong class=\"header\">Questions?Â  Concerns?Â  Suggestions?</strong><br>You can contact us at 350 Aldean Ave, Mountain View, CA 94043 or at <a href=\"mailto:service@witlee.com?subject=serviceterms\">service@witlee.com</a> to report any violations of these Terms of Service or for any questions regarding this Terms of Service or our Service.</p></div></div></div></section>");
    $templateCache.put("modules/main/views/wCard.html","<div class=\"card-container\" data-ng-class=\"{\'no-tags\': !card.seeds.length}\"><div class=\"user-photo\"><div class=\"photo\" style=\"background-image:url({{card.image.src}}); height: {{ photo_height }}\" ui-sref=\"product.results({id: card.id})\"><img alt=\"{{card.publisher.name}} wearing {{card.image.alt}}\" data-src=\"{{card.image.src}}\" ng-class=\"{\'small-screen\': (Card.globalState.screenWidth !== \'md\')}\" err-src></div><div class=\"publisher\"><w-avatar data=\"card.publisher\"></w-avatar><div class=\"info\"><div class=\"post\"><h5><a class=\"publisher-name\" ui-sref=\"store({ handle: card.publisher.handle })\" stop-propagation>{{::card.publisher.handle}}</a></h5><div class=\"time-ago\"><img alt=\"Time ago\" ng-src=\"{{ image_clock }}\"><div>{{card.updateTime}}</div></div></div><div class=\"followers\"><img alt=\"followers\" ng-src=\"{{ image_heart }}\"><div>{{::card.publisher.like.count | number}}</div></div></div></div><div class=\"bottom\"><div class=\"seeds\"><div class=\"seed\" data-ng-if=\"!card.seeds.length\">No items yet!</div><div class=\"seed\" ng-repeat=\"(key, seed) in card.seeds | limitTo: Card.limit track by seed.id\" ng-click=\"Card.goTo.seed($event, card, seed)\" ng-class=\"{\'hidden-ipad\':key>1}\"><w-card-seed data=\"seed\"></w-card-seed></div><div class=\"more seed\" data-ng-if=\"card.seeds.length > 4\"><a ui-sref=\"product.results({id: card.id})\">&plus; {{(card.seeds.length - Card.limit)}}</a></div></div><a class=\"shop\" data-ng-class=\"{disabled: !card.seeds.length}\" data-ng-click=\"!card.seeds.length && $event.preventDefault()\" ui-sref=\"product.results({id: card.id})\">shop now &raquo;</a></div></div></div>");
    $templateCache.put("modules/main/views/wCardNoLazy.html","<div class=\"card-container\" data-ng-class=\"{\'no-tags\': !card.seeds.length}\"><div class=\"user-photo\"><div class=\"photo\"><img alt=\"{{card.image.alt}}\" ng-src=\"{{card.image.src}}\" data-ng-class=\"{\'small-screen\': (Card.globalState.screenWidth !== \'md\')}\" ui-sref=\"product.results({id: card.id})\" ng-click=\"closeModal()\" err-src></div><div class=\"publisher\"><w-avatar data=\"card.publisher\"></w-avatar><div class=\"info\"><div class=\"post\"><h5><a class=\"publisher-name\" ng-click=\"closeModal()\" ui-sref=\"store({ handle: card.publisher.handle })\" stop-propagation>{{::card.publisher.handle}}</a></h5><div class=\"time-ago\"><img alt=\"Time ago\" ng-src=\"{{ image_clock }}\"><div>{{card.updateTime}}</div></div></div><div class=\"followers\"><img alt=\"followers\" ng-src=\"{{ image_heart }}\"><div>{{::card.publisher.like.count | number}}</div></div></div></div><div class=\"bottom\"><div class=\"seeds\"><div class=\"seed\" data-ng-if=\"!card.seeds.length\">No items yet!</div><div class=\"seed\" data-ng-repeat=\"seed in card.seeds | limitTo: Card.limit track by seed.id\" data-ng-click=\"Card.goTo.seed($event, card, seed)\"><w-card-seed data=\"seed\"></w-card-seed></div><div class=\"more seed\" data-ng-if=\"card.seeds.length > 4\"><a ng-click=\"closeModal()\" ui-sref=\"product.results({id: card.id})\">&plus; {{:: (card.seeds.length - Card.limit)}}</a></div></div><a class=\"shop\" data-ng-class=\"{disabled: !card.seeds.length}\" data-ng-click=\"!card.seeds.length && $event.preventDefault()\" ng-click=\"closeModal()\" ui-sref=\"product.results({id: card.id})\">shop now &raquo;</a></div></div></div>");
    $templateCache.put("modules/main/views/wNavbarAvatar.html","<div class=\"user-avatar\"><img ng-src=\"{{ currentUser.photo }}\" height=\"36\" width=\"36\"></div><div class=\"main-filter-layer\"><div class=\"filter-layer-checkbox\"><div class=\"list-filter\"><div class=\"col-md-12 no-padding\"><ul><li><a ng-if=\"!current_uuid\" ng-click=\"toStore()\">My Storefront</a></li><li><a ng-if=\"!current_uuid\" ng-click=\"toTaggingtool()\">Tag Images</a></li><!--<li>\n            <a data-ng-click=\"\">Analytics</a>\n          </li>--></ul></div><div class=\"main-menu-bottom row\"><ul><li class=\"signout\"><a data-ng-click=\"logOut()\">Sign out</a></li></ul></div></div></div></div>");
    $templateCache.put("modules/main/views/wNotifications.html","<a class=\"count\" href>{{\'1\'}}</a><div class=\"main-filter-layer\"><div class=\"filter-layer-checkbox\"><div class=\"list-filter\"><div class=\"col-md-12 no-padding\"><ul><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11264871_1437855259850476_440627854_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11282853_912787632098134_1373631651_n.jpg\"><div class=\"notificatin-description\"><p>Moola! This Instagram just made you $1.57. <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11324474_838605559528626_1120468601_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11351674_385586518317295_110407691_n.jpg\"><div class=\"notificatin-description\"><p>Moola! This Instagram just made you $1.57. <span class=\"green\">View Analytics</span></p></div></li><li><img class=\"left notification-image\" src=\"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11324474_838605559528626_1120468601_n.jpg\"><div class=\"notificatin-description\"><p>Woot! 100 people viewed this Instagram! <span class=\"green\">View Analytics</span></p></div></li></ul></div></div></div></div>");
    $templateCache.put("modules/main/views/wProduct.html","<a target=\"_blank\" data-ng-click=\"toProductPage(seed, product)\" class=\"product-item\"><!-- <div class=\"cont-svg-product\" style=\"background-image:url(\'{{::product.img.url}}\')\" err-pro-src=\"{{::product.img.url}}\"></div> --> <img class=\"cont-svg-product\" style=\"background-image:url(\'{{::product.img.url}}\')\" err-pro-src=\"{{::product.img.url}}\" alt=\"{{::product.name}} at {{::product.retailer_name}}\"><div class=\"exclude-item\" ng-if=\"isAllow()\" ng-click=\"excludeSeed(image, product, seed); $event.stopPropagation();\"><span>X</span></div><div class=\"details\"><div class=\"brand\" ng-if=\"product.brand\">{{ ::product.brand.toLowerCase() }}</div><div class=\"product-name\">{{ ::product.name.toLowerCase() }}</div><div class=\"retailer\" ng-if=\"product.retailer_name\">{{ ::product.retailer_name.toLowerCase() }} / <span class=\"sale_price\" ng-class=\"{\'active\':product.sale_price && product.sale_price>0}\">{{::product.price | currency:\'$\':0}}</span> <span class=\"product_price\" ng-if=\"product.sale_price && product.sale_price>0\">{{ product.sale_price | currency:\'$\':0 }}</span></div></div></a>");
    $templateCache.put("modules/main/views/wProductDetails.html","<div><div class=\"product-header-details\"><div class=\"product-content-details visible-xs-block\"><a class=\"closeTaggingTool\" data-ng-click=\"closeTaggingTool()\"><img ng-src=\"{{ image_close }}\"></a><div class=\"product-content-header\"><h2>{{ productItem.product_name }}</h2><h3>{{ productItem.brand }}</h3></div></div><div class=\"product-content-details visible-sm\"><a class=\"closeTaggingTool\" data-ng-click=\"closeTaggingTool()\"><img ng-src=\"{{ image_close }}\"></a></div><div class=\"images-container\"><ul class=\"thumb-list\"><li ng-repeat=\"item in altProductImages track by $index\" ng-if=\"showornot($index)\"><img ng-src=\"{{ item.url }}\" ng-click=\"updateCurrentImage( $index )\"></li></ul><div class=\"current-image\"><img ng-src=\"{{ currentImage.url }}\"></div></div><div class=\"product-content-details\"><div class=\"product-content-header hidden-xs\"><h2>{{ productItem.product_name }}</h2><h3>{{ productItem.brand }}</h3></div><div class=\"product-content-body\"><div class=\"product-content-description col-md-6 no-padding\"><div class=\"product-description\" ng-bind-html=\"currentDescription | to_trusted\"></div><span ng-if=\"showMore\" class=\"showMore\" ng-click=\"showMoreDescription()\">Show more</span><div class=\"product-more-details\"><p ng-if=\"productColors\"><b>Colors</b> <span>{{ productColors }}</span></p><p ng-if=\"productSizes\"><b>Sizes</b> <span>{{ productSizes }}</span></p></div></div><div class=\"product-content-price col-md-6\"><div class=\"product-price\"><span ng-if=\"productItem.retail_price\" class=\"retail_price bold\" ng-class=\"productItem.sale_price > 0? \'line-th\':\'\'\">{{productItem.retail_price | currency:\'$\':0}}</span> <span ng-if=\"productItem.sale_price > 0\" class=\"sell_price\">{{productItem.sale_price | currency:\'$\':0}}</span></div><a ng-click=\"openStore(productItem)\" class=\"buy-now btn btn-witlee btn-block\">buy at {{ currentRetailer }}</a></div></div></div></div><div class=\"product-body-related hidden\"><div class=\"other-tiles-title\"><h2>This item in other outfits</h2></div><div class=\"other-tiles-list\"><div class=\"card col-sm-4\" ng-repeat=\"card in cards\"><w-card-no-lazy data=\"card\"></w-card-no-lazy></div></div></div></div>");
    $templateCache.put("modules/main/views/wProfileAvatar.html","<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" height=\"200\" width=\"200\"><defs><clipPath id=\"clip-circle\"><circle r=\"100\" cx=\"100\" cy=\"100\"/></clipPath></defs><image clip-path=\"url(#clip-circle)\" data-ng-href=\"{{::avatar.photo}}\" xlink:href=\"\" height=\"200\" width=\"200\"/></svg>");
    $templateCache.put("modules/main/views/wSearchSeed.html","<!-- <div class=\"search-seed-photo\" style=\"background-image:url(\'{{::seed.image_url}}\')\"></div> --> <img alt=\"{{::seed.name}} at {{::seed.retailer}}\" class=\"search-seed-photo\" style=\"background-image:url(\'{{::seed.image_url}}\')\"><div class=\"seed-info\"><h3 data-ng-if=\"seed.name\">{{::seed.name }}</h3><h4 data-ng-if=\"seed.brand\">{{::seed.brand}}</h4><h5>{{:: seed.price | currency:\'$\':0 }}</h5></div>");
    $templateCache.put("modules/main/views/wSearchSeedMedium.html","<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" data-ng-attr-height=\"{{ seedSize }}\" data-ng-attr-width=\"{{ seedSize }}\"><image class=\"seed-item-medium\" data-ng-href=\"{{::seed.image_url}}\" xlink:href=\"\" data-ng-attr-height=\"{{ seedSize }}\" data-ng-attr-width=\"{{ seedSize }}\" alt=\"{{::seed.brand_name}} - {{::seed.name}}\" err-gen-src/></svg>");
    $templateCache.put("modules/main/views/wtFooter.html","<div class=\"text-center\" ng-if=\"current_uuid\"><a href=\"http://www.witlee.com\" target=\"_blank\">storefront by Witlee</a></div><div class=\"text-right mixpanel-partner\" ng-if=\"!current_uuid\"><a href=\"https://mixpanel.com/f/partner\" target=\"_blank\"><img src=\"//cdn.mxpnl.com/site_media/images/partner/badge_light.png\" alt=\"Mobile Analytics\"></a></div>");
    $templateCache.put("modules/main/views/wtloader.html","<div class=\"wt-loader\"><div class=\"sk-fading-circle\"><div class=\"sk-circle1 sk-circle\"></div><div class=\"sk-circle2 sk-circle\"></div><div class=\"sk-circle3 sk-circle\"></div><div class=\"sk-circle4 sk-circle\"></div><div class=\"sk-circle5 sk-circle\"></div><div class=\"sk-circle6 sk-circle\"></div><div class=\"sk-circle7 sk-circle\"></div><div class=\"sk-circle8 sk-circle\"></div><div class=\"sk-circle9 sk-circle\"></div><div class=\"sk-circle10 sk-circle\"></div><div class=\"sk-circle11 sk-circle\"></div><div class=\"sk-circle12 sk-circle\"></div></div></div>");
    $templateCache.put("modules/store/views/mainView.html","<div class=\"no-content\"><div class=\"comming-soon-container container text-center\"><span class=\"pull-right\">People Waiting: {{ currentProfile.store_votes }}</span><div class=\"profile-name\"><h3>{{ currentProfile.name }}</h3><h4>Tag at least 3 images to unlock store</h4></div><h1>Coming Soon</h1><div class=\"text-center\"><button ng-click=\"cantWaitVote()\" class=\"btn btn-lg btn-witlee-success\">Can\'t Wait</button></div></div></div><div id=\"filter-page-results\" class=\"storeFront\" ng-class=\"{\'subscription-view\':subscription1}\"><div class=\"filter-menu-store-container\" style=\"top: 100px\"><div id=\"filter-menu\" style=\"{{ sticky_max_style }}\" ng-class=\"{\'subscription-view\':subscription1}\"><div class=\"row home-menu\"><div class=\"container-fluid\"><div id=\"filters-menu\"><ul class=\"pull-right more-button visible-xs\"><li class=\"\"><div id=\"moreItems\" class=\"menu-item-label more-menu\" ng-click=\"showMoreStoreItems()\" click-outside=\"closeThis()\" outside-if-not=\"moreItems\" ng-if=\"more_menu_items.length > 0\">More<div class=\"filter-layer-more\"><ul><li ng-repeat=\"(key, more_item) in more_menu_items\" class=\"filter-more-item\" ng-click=\"toggleNavigate(\'{{more_item.term}}\', {{more_item.id}}, key)\"><div class=\"menu-item-label\">{{ more_item.term }}</div></li></ul></div></div></li></ul><ul class=\"filter-menu-items filter-min\"><li ng-repeat=\"(key, itemStore) in menuStore\" class=\"filter-item\" ng-click=\"toggleNavigate(\'{{itemStore.term}}\', {{itemStore.id}}, key)\"><div class=\"menu-item-label\">{{ itemStore.term }}</div></li></ul><ul class=\"filter-menu-items show-desktop\"><li ng-repeat=\"(key, itemStore) in menuStore\" ng-class=\"key>6?\'hidden-sm hidden-md hidden-lg hidden-xs\':\'\'\" class=\"filter-item\"><div class=\"menu-item-label\">{{ itemStore.term }}</div><div class=\"filter-layer\"><div class=\"filter-layer-checkbox\"><div class=\"list-filter\"><div class=\"col-xs-3\" ng-if=\"itemStore.sub_category.length > 0\"><h3>Categories</h3><ul><li ng-repeat=\"(key, item) in itemStore.sub_category\" ng-if=\"key <= 7\"><div><label ng-click=\"goSearchSubCategory(itemStore, item, \'{{ param_influencer }}\')\">{{ item.term }}</label></div></li></ul></div><div ng-class=\"itemStore.sub_category.length > 0? \'col-xs-3\':\'col-xs-6\' \"><h3>Top Brands</h3><ul><li ng-repeat=\"(key, item) in itemStore.top_brands\" ng-if=\"key <= 7\"><div><label ng-click=\"goSearchBrand(itemStore, \'{{ param_influencer }}\', item)\">{{ item.name.toLowerCase() }}</label></div></li></ul></div><div class=\"col-xs-6\"><h3>Popular Look</h3><div><img ng-src=\"{{ itemStore.promo_tile.imagetile_url }}\" alt=\"\"></div></div></div></div></div></li></ul><div id=\"filter-sort\" ng-if=\"allowUser()\" class=\"sort-order tagging-tool-desktop\"><div class=\"btn-group\"><button id=\"tagInstagram\" type=\"button\" class=\"btn btn-block text-center\" ng-click=\"showTaggingTool()\" data-toggle=\"modal\" data-target=\"#myModal\">tag Instagrams</button></div></div></div></div></div></div></div><div class=\"filter-mobile\" ng-class=\"{\'active\': navigate, \'\': !navigate}\"><h2>{{ titleMenuHide }} <a ng-click=\"toggleNavigate(\'\', \'\', -1)\"><img ng-src=\"{{ image_close }}\"></a></h2><div class=\"accordion-filter\"><accordion close-others=\"oneAtATime\"><accordion-group is-open=\"menuStatus[0].isOpen\" ng-if=\"mobCats.length>0\"><accordion-heading><span ng-click=\"toggleStatus()\">Categories</span> <i class=\"glyphicon pull-right\" ng-class=\"{\'glyphicon-minus\': menuStatus[0].isOpen, \'glyphicon-plus\': !menuStatus[0].isOpen}\"></i></accordion-heading><div class=\"list-filter\"><ul><li ng-repeat=\"item in mobCats\"><div><label ng-click=\"goSearchCategory(item, \'{{ param_influencer }}\')\">{{ item.term }}</label></div></li></ul></div></accordion-group><accordion-group is-open=\"menuStatus[1].isOpen\"><accordion-heading><span ng-click=\"toggleStatus()\">Top Brands</span> <i class=\"glyphicon pull-right\" ng-class=\"{\'glyphicon-minus\': menuStatus[1].isOpen, \'glyphicon-plus\': !menuStatus[0].isOpen}\"></i></accordion-heading><div class=\"list-filter\"><ul><li ng-repeat=\"item in mobBrands\"><div><label ng-click=\"goSearchBrand(0, \'{{ param_influencer }}\', item)\">{{ item.name.toLowerCase() }}</label></div></li></ul></div></accordion-group><div class=\"img_menu_mobile\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a href=\"\"><span class=\"ng-scope\">Popular Look</span></a></h4></div><img ng-src=\"{{ mobPopular }}\" alt=\"\"></div></accordion></div></div><section class=\"home\"><div class=\"storeFront-container\"><div ng-if=\"allowUser()\" class=\"text-center tagging-tool-mobile\"><button type=\"button\" class=\"btn text-center\" ng-click=\"showTaggingTool()\" data-toggle=\"modal\" data-target=\"#myModal\">tag Instagrams</button></div><div class=\"container-fluid text-center no-padding\"><h1 class=\"storeInfTitle\">{{ profile.name }} - {{ profile.username }}</h1><section class=\"home\"><div id=\"bellowTop\"><div class=\"mask\"><div class=\"instagram_profile col-xs-12 text-center\"><div class=\"profile_picture\" ng-class=\"checkContent()\"><img ng-src=\"{{ profile.photo }}\" alt=\"{{ profile.name }}\" err-gen-src></div></div></div><div ng-repeat=\"(index, tile) in profile_tiles\" ng-class=\"index > 1?\'hidden-xs\':\'\'\" class=\"col-sm-4 no-padding col-xs-6 img-back\"><img ng-src=\"{{ tile.imagetile_url }}\" alt=\"\"></div></div><div id=\"bellowAbove\"><ul class=\"logo_brands col-xs-12\" ng-if=\"logoBrands.length > 0\"><li class=\"hidden-xs\" ng-class=\"listBrandsValSide()\"></li><li ng-repeat=\"(key, item) in logoBrands\" ng-class=\"listBrandsVal()\"><img ng-click=\"goSearch(\'{{ param_influencer }}\', item.retailer)\" ng-src=\"{{ item.logo }}\" alt=\"{{ item.retailer }}\" class=\"logo-item\"></li><li class=\"hidden-xs\" ng-class=\"listBrandsValSide()\"></li></ul><div class=\"shopByTagsContainer\" ng-hide=\"hashtags.length < 2\"><h2>Shop by #Hashtag</h2><ul class=\"shopByTags\"><li ng-repeat=\"(index, item) in hashtags\" ng-class=\"index >= totalHashsToShow?\'hidden-xs hidden-sm\':\'\'\" ng-if=\"index < 5\"><div ng-click=\"goSearch(\'{{ param_influencer }}\', \'{{ item.hashtag }}\')\" class=\"hastag-item\"><figure style=\"background-image: url({{ item.imagetile.imagetile_url }})\"></figure><p>{{ item.hashtag | lowercase }}Â»</p></div></li></ul></div></div></section></div><div class=\"container-fluid text-center store-cards-container\" ng-show=\"newerList.length > 0\"><a class=\"seeAll\" ng-click=\"goSearchSort(\'{{ param_influencer }}\', \'new\')\">see all &raquo;</a><h2 class=\"intTitle\">New In</h2><section class=\"home\"><div class=\"cards row\"><div ng-repeat=\"(index, card) in newerList\" ng-class=\"index>2?\'hidden-xs\':\'\'\" class=\"card col-sm-4 col-md-4 col-xs-6\"><w-card data=\"card\"></w-card></div></div></section></div><div class=\"container-fluid text-center store-cards-container\" ng-show=\"mostPopularList.length > 0\"><a class=\"seeAll\" ng-click=\"goSearchSort(\'{{ param_influencer }}\', \'popular\')\">see all &raquo;</a><h2 class=\"intTitle\">Most Popular</h2><section class=\"home\"><div class=\"cards row\"><div ng-repeat=\"(index, card) in mostPopularList\" ng-class=\"index>2?\'hidden-xs\':\'\'\" class=\"card col-sm-4 col-md-4 col-xs-6\"><w-card data=\"card\"></w-card></div></div></section></div><div class=\"container-fluid text-center store-cards-container\" ng-show=\"bestSellerList.length > 0\"><a class=\"seeAll\" ng-click=\"goSearchSort(\'{{ param_influencer }}\', \'best\')\">see all &raquo;</a><h2 class=\"intTitle\">Best Seller</h2><section class=\"home\"><div class=\"cards row\"><div ng-repeat=\"(index,card) in bestSellerList\" ng-class=\"index>2?\'hidden-xs\':\'\'\" class=\"card col-sm-4 col-md-4 col-xs-6\"><w-card data=\"card\"></w-card></div></div></section></div></div></section><wt-footer></wt-footer></div>");
    $templateCache.put("modules/store/views/wProductSearch.html","<div class=\"box-list\"><div class=\"mask-product\" ng-if=\"eventproduct\"><wt-loader class=\"loader-mask\"></wt-loader></div><figure><div class=\"cont-svg-product lazybg\" data-bg=\"{{current_product_image}}\" style=\"background-image:url(/images/grey.gif)\"></div><div class=\"tagThisImgTagTool\" ng-if=\"updateproduct\"><span class=\"selectThisProduct\" data-ng-click=\"updateSeed(product)\" data-ng-if=\"!selectedProduct(product.id)\">Use this product</span></div><div class=\"tagThisImgTagTool\" ng-if=\"!updateproduct\"><span class=\"selectThisProduct\" ng-click=\"select(product, {{current_id}})\" data-ng-if=\"!selectedProduct(product.id)\">select this product</span> <span class=\"selectedProduct\" ng-if=\"selectedProduct(product.id)\"><i class=\"fa fa-check\"></i> Selected</span></div></figure><div class=\"thumbs_images\"><div class=\"owl-carousel owl-carousel-tagging\"><div class=\"product-carousel-item lazybg\" ng-repeat=\"item in product.all_images\" data-bg=\"{{ item.url }}\" style=\"background-image:url(/images/grey.gif)\" ng-mouseover=\"changeProductImage(item)\"></div></div><div class=\"customNavigation\"><a class=\"btn-prev-carousel\" ng-click=\"prevImage()\">Previous</a> <a class=\"btn-next-carousel\" ng-click=\"nextImage()\">Next</a></div></div><div class=\"desc-box\"><p class=\"productBrand\">{{product.brand.toLowerCase()}}</p><p class=\"productName\">{{product.product_name.toLowerCase()}}</p><p>{{product.retailer_name.toLowerCase()}} <b>/ {{product.price | currency}}</b></p></div></div>");
    $templateCache.put("modules/store/views/wTaggingGrid.html","<div class=\"main-tagging-container\" data-ng-show=\"mainTagView===true\"><div class=\"modal-body w-tag-card\" data-ng-init=\"init()\"><div class=\"closeContainer\"><div class=\"switch-container\" data-ng-show=\"mainTagView===true\"><div class=\"swith-content pull-right\"><div data-ng-if=\"!toggleSwitch\"><span>Untagged</span></div><div data-ng-if=\"toggleSwitch\"><span>Tagged</span></div><label class=\"label-switch\"><input type=\"checkbox\" data-ng-disabled=\"spinner\" data-ng-change=\"switch_tiles()\" data-ng-model=\"toggleSwitch\"><div class=\"checkbox\" data-ng-class=\"{\'disabled\': spinner}\"></div></label></div></div><a class=\"closeTaggingTool\" data-ng-click=\"closeTaggingTool()\"><img ng-src=\"{{ image_close }}\"></a><h2 class=\"gridTitle\">Curate and tag images for your storefront</h2></div><div class=\"content-modal images-grid\"><div><div class=\"cards\" infinite-scroll=\"getMoreTiles()\" infinite-scroll-distance=\"0\" infinite-scroll-container=\"\'.content-modal\'\"><section class=\"home\"><div data-ng-repeat=\"card in cards track by $index\" class=\"card tagging-grid-item card col-sm-3 col-md-3 col-xs-6\"><div class=\"w-tag-card\"><div class=\"card-container no-overflow\" data-ng-class=\"{\'no-tags\': !card.seeds.length}\"><div class=\"user-photo\"><div class=\"photo\"><img alt=\"{{card.image.alt}}\" ng-src=\"{{card.image.src}}\" ng-class=\"{\'small-screen\': (Card.globalState.screenWidth !== \'md\')}\" err-src></div></div><div class=\"tagToolAction\"><div class=\"removeSeedTagTool\" data-ng-click=\"ignore(card, $index)\"><button></button></div><div class=\"tagThisImgTagTool\"><span data-ng-click=\"showSearchTaggingTool(card, true)\" class=\"selectThisProduct\">tag this image</span></div></div></div></div></div></section></div></div></div></div></div><div class=\"main-tagging-search-container\" ng-show=\"mainTagView===false\"><div class=\"modal-body w-tag-card\"><div class=\"closeContainer\"><a class=\"closeTaggingTool\" data-ng-click=\"closeTaggingTool()\"><img ng-src=\"{{ image_close }}\"></a> <a class=\"hidden-xs backTaggingTool left\" data-ng-click=\"backTaggingTool()\">Â« back</a> <a class=\"visible-xs backTaggingTool left\" data-ng-click=\"backTaggingTool()\">Â« back</a><h2 class=\"gridTitle\">Tag your Instagram</h2></div><div class=\"content-modal search-products-result\"><div id=\"grid-item-details\"><section class=\"home\"><div class=\"tagging-item\"><div class=\"current-card-container\"><div class=\"card\"><div class=\"card-container\" data-ng-class=\"{\'no-tags\': !card.seeds.length}\"><div class=\"user-photo\"><div class=\"photo\"><img alt=\"{{searchTagItem.image.alt}}\" data-ng-src=\"{{searchTagItem.imagetile_url}}\" data-ng-class=\"{\'small-screen\': (Card.globalState.screenWidth !== \'md\')}\" err-src></div></div></div></div><div class=\"box-select hide-tablet\" data-ng-if=\"productsSelect.length\"><div class=\"select-photos clearfix\"><div class=\"itemSelected\" data-ng-repeat=\"result in productsSelect\"><div class=\"photo-select\"><div class=\"search-seed-photo\" style=\"background-image:url({{result.image_url}})\" ng-click=\"showSeedsRelated(result, $event)\"></div><div class=\"seed-info\"><h3 ng-if=\"result.name\">{{ result.name }}</h3><h4 data-ng-if=\"result.brand\">{{ result.brand }}</h4><h5>{{ result.price | currency:\'$\':0 }}</h5></div><div class=\"close-photo\"><a data-ng-click=\"remove(result.id, $index, {{current_id}})\"></a></div></div></div></div></div></div><div class=\"tagging-search-form\"><div class=\"box-select show-tablet\" data-ng-if=\"productsSelect.length\"><div class=\"select-photos clearfix\"><div class=\"itemSelected\" data-ng-repeat=\"result in productsSelect\"><div class=\"photo-select\"><div class=\"search-seed-photo\" style=\"background-image:{{result.image_url}}\" ng-click=\"showSeedsRelated(result, $event)\"></div><div class=\"seed-info\"><h3 ng-if=\"result.name\">{{ result.name }}</h3><h4 data-ng-if=\"result.brand\">{{ result.brand }}</h4><h5>{{ result.price | currency:\'$\':0 }}</h5></div><div class=\"close-photo\"><a data-ng-click=\"remove(result.id, $index, {{current_id}})\"></a></div></div></div></div></div><form class=\"form-inline data-ng-pristine data-ng-valid\" name=\"searchProduct\"><div class=\"form-group col-md-4 col-xs-12\"><input type=\"text\" placeholder=\"brand or retailer name...\" data-ng-model=\"productBrand\" class=\"form-control\" ng-keyup=\"getSimilarSeedsBrand(event=$event)\" ng-focus=\"return;\"></div><div class=\"form-group col-md-4 col-xs-12\"><input type=\"text\" placeholder=\"product name (ex. black ankle strap sandals)\" ng-model=\"productName\" class=\"form-control\" ng-keyup=\"getSimilarSeedsName(event=$event)\"></div><div class=\"form-group col-md-4 col-xs-12\"><button ladda=\"loginLoading\" class=\"btn btn-witlee btn-large btn-search-tagging-tool\" ng-click=\"searchProducts()\">search</button><label class=\"text-danger\" data-ng-if=\"empty\">Empty results</label></div></form><wt-loader ng-if=\"loadingdata\" class=\"loader-mask\"></wt-loader><div class=\"products-search-container\"><div class=\"wrapper-products\" ng-if=\"initial_seeds.length>0\"><h4 class=\"text-left\"><b>Found {{ initial_seeds_count }} previously tagged images</b></h4><div infinite-scroll=\"moreInitialSeeds()\" infinite-scroll-distance=\"0\" infinite-scroll-container=\"\'.products-search-container\'\"><div class=\"product w-product\" data-ng-repeat=\"(key, product) in initial_seeds\"><w-product-search product=\"product\" key=\"key\" currentid=\"current_id\" searchproductbrand=\"searchProductBrand\" searchproductname=\"searchProductName\"></w-product-search></div></div><div class=\"\" data-ng-if=\"loading\"><div class=\"col-xs-12\"><p class=\"bg-primary\"><i class=\"fa fa-spinner fa-pulse\"></i> Loading data...</p></div></div></div><div class=\"wrapper-products\" ng-if=\"productList.length>0\"><div infinite-scroll=\"moreResultProducts()\" infinite-scroll-distance=\"1\" infinite-scroll-container=\"\'.products-search-container\'\"><div class=\"product w-product\" data-ng-repeat=\"(key, product) in productList\"><w-product-search product=\"product\" key=\"key\" currentid=\"current_id\" searchproductbrand=\"searchProductBrand\" searchproductname=\"searchProductName\"></w-product-search></div></div><div class=\"\" data-ng-if=\"loading\"><div class=\"col-xs-12\"><p class=\"bg-primary\"><i class=\"fa fa-spinner fa-pulse\"></i> Loading data...</p></div></div></div><div class=\"wrapper-products\" ng-if=\"seedsRelated.length>0\"><div><div class=\"product w-product\" data-ng-repeat=\"(key, product) in seedsRelated\"><w-product-search product=\"product\" key=\"key\" currentid=\"current_id\" searchproductbrand=\"searchProductBrand\" searchproductname=\"searchProductName\" updateproduct=\"true\" currentseed=\"current_seed_id\"></w-product-search></div></div><div class=\"\" data-ng-if=\"loading\"><div class=\"col-xs-12\"><p class=\"bg-primary\"><i class=\"fa fa-spinner fa-pulse\"></i> Loading data...</p></div></div></div></div></div></div></section></div></div></div></div>");
    $templateCache.put("modules/store/views/wTileTaggingItem.html","<div class=\"close-photo\"><button class=\"closeItemCarrusel\" data-ng-click=\"ignore(card, $index)\"></button></div><image ng-src=\"{{::card.image.src}}\" err-src-car>");}]);