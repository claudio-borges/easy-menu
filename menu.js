;
(function($, window, document, undefined) {
    "use strict";
    /**
     * Plugin desenvolvido para estruturação do menu principal, apresentando várias opções para sua configuração
     * @class Menu
     * @param {Object} options Opções definidas pelo usuário
     * @return CallExpression
     */
    $.fn.menuClickQI = function(options) {
        /**
         * Inicialização de todas as variáveis padrões e funções do plugin
         * @method init
         * @return 
         */
        var init = function() {
            /**
             * Objeto defaults contendo todas as variáveis e funções padrões do plugin
             * @property defaults
             * @type {Object}
             */
            var defaults = {
                    /**
                     * Define a apresentação das marcas no menu principal
                     * @property visibleBrands
                     * @default true
                     * @type {Boolean}
                     */
                    visibleBrands: true,
                    /**
                     * Define a quantidade de colunas de categorias
                     * @property itemsPerColumn
                     * @default 5
                     * @type {Number}
                     */
                    itemsPerColumn: 5,
                    /**
                     * Define se a categoria será apresentada alinhada ao seu respectivo departamento
                     * @property alignWithParent
                     * @default false
                     * @type {Boolean}
                     */
                    alignWithParent: false,
                    /**
                     * Define a apresentação de produtos no menu, sendo apresentados juntamente com as categorias de cada departamento.
                     * Para seu perfeito funcionamento, deve-se criar um template exclusivo para os produtos, que devem ser organizados
                     * por coleções e inseridas no template através de um PlaceHolder. Cada componente do PlaceHolder deve ser criado com
                     * o mesmo nome do departamento.
                     * @property productInMenu
                     * @default false
                     * @type {Boolean}
                     */
                    productInMenu: false,
                    /**
                     * Define o título apresentado acima do produto inserido no menu, destacando sua função.
                     * @property titleFeatured
                     * @default "Destaque"
                     * @type {String}
                     */
                    titleFeatured: "Destaque",
                    /**
                     * Define o caminho da página contendo as coleções com produtos para serem apresentados no menu.
                     * O caminho deve ser escrito precedido de uma /, como no exemplo: "/colecao-menu".
                     * @property collectionsUrl
                     * @default ""
                     * @type {String}
                     */
                    collectionsUrl: "",
                    /**
                     * Função de callback vazia inserida como padrão do plugin
                     * @method Callback Padrão
                     * @return Possibilita a personalização do plugin
                     */
                    callback: function() {}
                },
                /**
                 * Variável vazia utilizada para captura dos elementos que representam os departamentos, sendo estes as tags H3 do menu.
                 * @property $department
                 * @type {undefined}
                 */
                $department,
                /**
                 * Variável vazia utilizada para captura dos elementos que representam as categorias, sendo estes as tags UL subsequentes as H3.
                 * @property $category
                 * @type {undefined}
                 */
                $category,
                /**
                 * Objeto criado para mesclar as opções padrões definidas no plugin com as opções definidas pelo usuário. Toda a manipulação das
                 * opções do plugin é realizada com este objeto.
                 * @property settings
                 * @type {Object}
                 */
                settings = $.extend({}, defaults, options),
                /**
                 * Variável criada para receber o elemento de Marcas, tornando-se um objeto facilmente manipulável.
                 * @property $el_brands
                 * @type {Object}
                 */
                $el_brands = $(this).find('.brandFilter'),
                /**
                 * Variável vazia, criada com a função de auxiliar na manipulação dos eventos de mouseenter e mouseleave, tanto dos departamentos,
                 * quanto das categorias.
                 * @property $menuOutObject
                 * @type {undefined}
                 */
                $menuOutObject,
                /**
                 * Variável vazia, utilizada como temporizador para o efeito de fade in e fade out do menu.
                 * @property menuOutTimer
                 * @type {undefined}
                 */
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
                /**
                 * Evento mouseenter aplicado na lista de departamentos
                 * @method Department Mouseenter
                 * @param {} e Objeto selecionado passado como parâmetro
                 * @return 
                 */
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
                /**
                 * Description
                 * @method mouseleave
                 * @param {} e
                 * @return 
                 */
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
                /**
                 * Evento mouseenter aplicado na lista de categorias
                 * @method Category Mouseenter
                 * @param {} e Objeto selecionado passado como parâmetro
                 * @return 
                 */
                mouseenter: function(e) {
                    e.preventDefault();
                    $menuOutObject = $(this);
                    $menuOutObject.prev('h3').addClass('selected');
                    clearTimeout(menuOutTimer);
                },
                /**
                 * Description 
                 * @method mouseleave
                 * @param {} e
                 * @return 
                 */
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
                    /**
                     * Description
                     * @method exec
                     * @return 
                     */
                    exec: function() {
                        addItem.getItems();
                    },
                    /**
                     * Description
                     * @method getItems
                     * @return 
                     */
                    getItems: function() {
                        $.ajax({
                            url: "//" + document.location.host + settings.collectionsUrl,
                            dataType: "html",
                            success: addItem.getSuccess,
                            error: addItem.getError
                        });
                    },
                    /**
                     * Description
                     * @method getSuccess
                     * @param {} data
                     * @return 
                     */
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
                    /**
                     * Description
                     * @method getError
                     * @return 
                     */
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