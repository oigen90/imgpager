'use strict';

var PhotoListView = (function () {

    var $element;

    var _scrollHeight = 384; // FIXME: should be in configs.

    function PhotoListView (element) {
        $element = element;

        this.activeRow = 0;
        this.activeItem = 0;

        disableDefaultKeyScroll();

        // registerScrollEvent();

        console.log('[app] INIT: PhotoListView');
    }

    PhotoListView.prototype.render = function (newList) {
        console.log('new list!!! ', newList);

        var htmlContent = '';
        for (var i = 0; i < newList.length; i++) {
            htmlContent += createRow(newList[i]);
        }

        $element.innerHTML = htmlContent;
    };

    PhotoListView.prototype.changeActiveItem = function(itemData) {
        var context = this;

        context.activeItem = itemData.new;

        var oldItem = $element.children[context.activeRow].children[itemData.old];
        var newItem = $element.children[context.activeRow].children[itemData.new];
        oldItem.classList.remove('active');
        newItem.classList.add('active');
    };

    PhotoListView.prototype.changeActiveRow = function(rowData) {
        var context = this;

        context.activeRow = rowData.new;

        var oldItem = $element.children[rowData.old].children[context.activeItem];
        var newItem = $element.children[rowData.new].children[context.activeItem];
        oldItem.classList.remove('active');

        scrollRow(rowData.new);

        newItem.classList.add('active');
    };

    function scrollRow (toIndex) {
        var scrollPos;
        if (!toIndex) {
            scrollPos = _scrollHeight
        } else {
            scrollPos = _scrollHeight * toIndex;
        }

        $element.scrollBy({
            top: scrollPos,
            left: 0,
            behavior: 'smooth'
        })
    }

    function createRow (rowData) {
        var rowHeader = '<div class="gallery-row" data-row="">';
        var rowFooter = '</div>';

        var rowContent = '';
        for (var i = 0; i < rowData.length; i++) {
            //rowContent += '<div class="gallery-row--item"><img src="' + rowData[i]['url_sq'] + '"/></div>';
            rowContent += '<div class="gallery-row--item"><div style="background-image: url(' + rowData[i]['url_m'] + ');"></div></div>';
        }

        return rowHeader + rowContent + rowFooter;
    }

    function disableDefaultKeyScroll () {
        window.onkeydown = function (e) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
            }
        };
    }

    function registerScrollEvent () {
        // $element.addEventListener('scroll', throttle(callback, 1000), true);
        window.addEventListener('scroll', function(e) {
            e.preventDefault();
            // throttle(callback, 1000)();
        });

        function throttle (fn, wait) {
            var time = Date.now();
            return function() {
                if ((time + wait - Date.now()) < 0) {
                    fn();
                    time = Date.now();
                }
            }
        }

        function callback () {
            console.log('SCROLL!');
        }
    }

    return PhotoListView;

})();