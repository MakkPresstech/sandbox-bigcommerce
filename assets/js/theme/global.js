import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import privacyCookieNotification from './global/cookieNotification';
import maintenanceMode from './global/maintenanceMode';
import carousel from './common/carousel';
import 'lazysizes';
import loadingProgressBar from './global/loading-progress-bar';
import svgInjector from './global/svg-injector';

export default class Global extends PageManager {
    onReady() {
        // Only load visible elements until the onload event fires,
        // after which preload nearby elements.
        window.lazySizesConfig = window.lazySizesConfig || {};
        window.lazySizesConfig.loadMode = 1;

        cartPreview(this.context.secureBaseUrl, this.context.cartId);
        quickSearch();
        currencySelector();
        foundation($(document));
        quickView(this.context);
        carousel();
        menu();
        mobileMenuToggle();
        privacyCookieNotification();
        maintenanceMode(this.context.maintenanceMode);
        loadingProgressBar();
        svgInjector();

        /* BundleB2B */
        const $body = $('body');
        const $_body = $('.body');
        $body.append(`<script src="https://cdn.bundleb2b.net/b3-auto-loader.js"></script>`);
        window.b3themeConfig = window.b3themeConfig || {};
        window.b3themeConfig.useContainers = {
            'dashboard.endMasquerade.container': '#header',
        };
        const inPages = () => {
            const urlArray = [
                '/buy-again/',
                '/address-book/',
                '/quote/',
                '/quotes-list/',
                '/dashboard/',
                '/order-detail/',
                '/quick-order-pad/',
                '/shopping-list/',
                '/shopping-lists/',
                '/user-management/',
                '/invoices/',
                '/invoice-payment/',
                '/invoice-details/',
                '/invoice-payment-receipt/',
                '/account.php',
            ];
            const current = window.location.pathname;
            return urlArray.includes(current);
        };
        window.b3themeConfig.useJavaScript = {
            tpa: {
                callback(app) {
                    const {
                        isLogin,
                        isB2CUser,
                        isB2BUser,
                        isInpage,
                        context: {
                            page_type,
                            themeSettings: {
                                hide_page_heading,
                            },
                        },
                    } = app;

                    if (hide_page_heading) {
                        if (isLogin && isInpage) {
                            const pageHeading = `<h1 class="page-heading">${app.text['tpa.button']}</h1>`;
                            const $page = $('.page');
                            $page.prepend(pageHeading);
                        }

                        if (inPages() && (page_type === 'page')) {
                            const $b3PageHeading = $('.b3_page_heading');
                            $b3PageHeading.show();
                        }
                    }
                },
            },
            login: {
                beforeMount(login) {
                    login.removeBCMenus = () => {
                        const {
                            isShowAddressBook,
                        } = login.state

                        const wishlistsEls = document.querySelectorAll('[href^="/wishlist.php"]')
                        const addressesEls = document.querySelectorAll('[href^="/account.php?action=address_book"]')
                        const actionWishlists = document.querySelectorAll('[action^="/wishlist.php"]')
                        wishlistsEls.forEach(wishlistsEl => {
                            if (wishlistsEl.parentNode.children.length > 1) wishlistsEl.remove()
                            else wishlistsEl.parentNode.remove()
                        })
                        if (isShowAddressBook) {
                            addressesEls.forEach(addressesEl => {
                                addressesEl.parentNode.remove()
                            })
                        }
                        actionWishlists.forEach(actionWishlist => {
                            actionWishlist.remove()
                        })

                        // render account nav
                        const {
                            isMobile,
                            context: {
                                urls: {
                                    auth: {
                                        logout,
                                    },
                                },
                            },
                        } = login;
                        const $nav = $('.navBar.navBar--sub.navBar--account', $_body);
                        if (isMobile && (screen.width > 801) && inPages()) {
                            /* 
                             * SCREEN SIZES
                             * Remember to update /assets/scss/settings/global/screensizes/screensizes.scss
                             * Remember to update /assets/js/theme/common/media-query-list.js
                             */
                            $nav.show();
                        }

                        const $logout = $nav.find(`[href="${logout}"]`);
                        const logoutHTML = `
                            <li class="navBar-item">
                                <a class="navBar-action" href="${logout}">Sign out</a>
                            </li>
                        `;
                        if ($logout.length === 0) {
                            $nav.find('.navBar-section').append(logoutHTML);
                        }
                    };
                },
                callback(login) {
                    const {
                        isB2CUser,
                        isMobile,
                    } = login;
                    const $nav = $('.navBar.navBar--sub.navBar--account', $_body);
                    const $orders = $('.page_type__account_orderstatus .body .account');
                    const $profile = $('.page_type__editaccount .body .account');

                    if (isB2CUser) {
                        $orders.show();
                        $profile.show();
                        if (isMobile && inPages()) {
                            $nav.show();
                        }
                    }
                },
            },
        };
        /* BundleB2B */

        $('.sticky-tabs .tab:not(.finish--order) .tab-title').on('click', function () {
            $('html, body').animate({
                scrollTop: $(".productView-description").offset().top - 100
            }, 100);
        });

        $('#review__badge').on('click', function () {
            $('.tab').removeClass('is-active');
            $('.tab a[href="#tab-reviews"]').parent().addClass('is-active');
            $('.tab-content').removeClass('is-active');
            $('#tab-reviews').addClass('is-active');
            document.querySelector(".productView-description").scrollIntoView();
        });
        $('.finish--order').on('click', function (e) {
            e.preventDefault();
            document.querySelector("#productLed-template").scrollIntoView();
        })
    }
}
