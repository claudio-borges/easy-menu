;
(function($, window, document, undefined) {
    "use strict";
    $.fn.menu = function(options) {
        var init = function() {
            var defaults = {
                    visibleBrands: true,
                    itemsPerColumn: 5,
                    alignWithParent: false,
                    productInMenu: false,
                    titleFeatured: "Destaque",
                    collectionsUrl: "",
                    callback: function() {}
                },
                $department,
                $category,
                settings = $.extend({}, defaults, options),
                $el_brands = $(this).find('.brandFilter'),
                $menuOutObject,
                menuOutTimer;

            if (!settings.visibleBrands) {
                $el_brands.remove();
                $department = $(this).find('h3');
                $category = $(this).find('ul');
            } else {
                $(this).find('.brandFilter h3').unwrap().addClass('brandFilter');
                $department = $(this).find('h3');
                $category = $(this).find('ul');
            }

            $department.each(function() {
                $(this).addClass('item-menu' + $department.length);
            }).last().addClass('last');

            $category.each(function() {
                $(this).addClass('sub-menu' + $category.length);
            }).last().addClass('last');

            $department.on({
                mouseenter: function(e) {
                    e.preventDefault();
                    $menuOutObject = $(this).next();
                    if (settings.alignWithParent) {
                        var _pos = $(this).position();
                        $menuOutObject.css('left', _pos.left).addClass('align-with-parent');
                    }

                    if (!$menuOutObject.is(':visible')) {
                        $($menuOutObject).parent().find('>ul:visible').hide();
                    }
                    clearTimeout(menuOutTimer);
                    $(this).find('a').addClass('selected');
                    $(this).find('span.menu-item-texto').addClass('selected');
                    $(this).addClass('selected');
                    $menuOutObject.fadeIn();
                },
                mouseleave: function(e) {
                    e.preventDefault();
                    menuOutTimer = setTimeout(function() {
                        $menuOutObject.hide();
                    }, 10);
                    $(this).find('a').removeClass('selected');
                    $(this).find('span.menu-item-texto').removeClass('selected');
                    $(this).removeClass('selected');
                }
            });

            $category.each(function() {
                var $mainMenu = $(this),
                    $sizeList = Math.ceil($(this).find('li').size() / settings.itemsPerColumn),
                    cont = 0,
                    placeMenu = 0;

                for (var i = 0; i < $sizeList; i++) {
                    $mainMenu.addClass('unstyled').append('<div class="place-menu item' + cont + '"></div>');
                    cont++;
                };

                $('li', this).each(function(i) {
                    cont = i + 1;
                    if (cont % settings.itemsPerColumn == 0) {
                        $(this).appendTo($mainMenu.find('.item' + placeMenu));
                        placeMenu++;
                    } else {
                        $(this).appendTo($mainMenu.find('.item' + placeMenu));
                    }
                });
            }).on({
                mouseenter: function(e) {
                    e.preventDefault();
                    $menuOutObject = $(this);
                    $menuOutObject.prev('h3').addClass('selected');
                    clearTimeout(menuOutTimer);
                },
                mouseleave: function(e) {
                    e.preventDefault();
                    menuOutTimer = setTimeout(function() {
                        $menuOutObject.hide();
                    }, 10);
                    $menuOutObject.prev('h3').removeClass('selected');
                }
            });

            if (settings.productInMenu) {
                var addItem = {
                    items: {},
                    exec: function() {
                        addItem.getItems();
                    },
                    getItems: function() {
                        $.ajax({
                            url: "//" + document.location.host + settings.collectionsUrl,
                            dataType: "html",
                            success: addItem.getSuccess,
                            error: addItem.getError
                        });
                    },
                    getSuccess: function(data) {
                        var $data = $(data),
                            $collections = $data.filter('div:not(.ajax-content-loader)'),
                            $shelf,
                            $title,
                            $listProducts,
                            $wrap;

                        $collections.each(function() {
                            $shelf = $(this);
                            $title = $shelf.find('h2');
                            $listProducts = $title.next('ul');
                            $wrap = $('<div class="shelf-menu"><h6>' + settings.titleFeatured + '</h6></div>').append($listProducts);

                            $category.each(function() {
                                if ($(this).prev('h3').find('a').text() == $title.html()) {
                                    $(this).append($wrap);
                                }
                            });
                        });

                    },
                    getError: function() {
                        console.log('erro');
                    }
                }
                addItem.exec();
            }

            settings.callback.call(this);
        }

        return this.each(init);
    }
})(jQuery, window, document);