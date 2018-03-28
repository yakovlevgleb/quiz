// Polyfills
import 'core-js/fn/array/from';
Object.assign = require('object-assign');

import scrollbarWidth from 'scrollbarwidth';
import debounce from 'lodash.debounce';
import ResizeObserver from 'resize-observer-polyfill';

import './simplebar.css';

export default class SimpleBar {
    constructor(element, options) {
        this.el = element;
        this.flashTimeout;
        this.contentEl;
        this.scrollContentEl;
        this.dragOffset         = { x: 0, y: 0 };
        this.isVisible          = { x: true, y: true };
        this.scrollOffsetAttr   = { x: 'scrollLeft', y: 'scrollTop' };
        this.sizeAttr           = { x: 'offsetWidth', y: 'offsetHeight' };
        this.scrollSizeAttr     = { x: 'scrollWidth', y: 'scrollHeight' };
        this.offsetAttr         = { x: 'left', y: 'top' };
        this.globalObserver;
        this.mutationObserver;
        this.resizeObserver;
        this.currentAxis;
        this.isRtl;
        this.options = Object.assign({}, SimpleBar.defaultOptions, options);
        this.classNames = this.options.classNames;
        this.scrollbarWidth = scrollbarWidth();
        this.offsetSize = 20;
        this.flashScrollbar = this.flashScrollbar.bind(this);
        this.onDragY = this.onDragY.bind(this);
        this.onDragX = this.onDragX.bind(this);
        this.onScrollY = this.onScrollY.bind(this);
        this.onScrollX = this.onScrollX.bind(this);
        this.drag = this.drag.bind(this);
        this.onEndDrag = this.onEndDrag.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);

        this.recalculate = debounce(this.recalculate, 100, { leading: true });

        this.init();
    }

    static get defaultOptions() {
        return {
            autoHide: true,
            forceVisible: false,
            classNames: {
                content: 'simplebar-content',
                scrollContent: 'simplebar-scroll-content',
                scrollbar: 'simplebar-scrollbar',
                track: 'simplebar-track'
            },
            scrollbarMinSize: 25
        }
    }

    static get htmlAttributes() {
        return {
            autoHide: 'data-simplebar-auto-hide',
            forceVisible: 'data-simplebar-force-visible',
            scrollbarMinSize: 'data-simplebar-scrollbar-min-size'
        }
    }

    static initHtmlApi() {
        this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this);

        // MutationObserver is IE11+
        if (typeof MutationObserver !== 'undefined') {
            // Mutation observer to observe dynamically added elements
            this.globalObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    Array.from(mutation.addedNodes).forEach(addedNode => {
                        if (addedNode.nodeType === 1) {
                            if (addedNode.hasAttribute('data-simplebar')) {
                                !addedNode.SimpleBar && new SimpleBar(addedNode, SimpleBar.getElOptions(addedNode));
                            } else {
                                Array.from(addedNode.querySelectorAll('[data-simplebar]')).forEach(el => {
                                    !el.SimpleBar && new SimpleBar(el, SimpleBar.getElOptions(el));
                                });
                            }
                        }
                    });

                    Array.from(mutation.removedNodes).forEach(removedNode => {
                        if (removedNode.nodeType === 1) {
                            if (removedNode.hasAttribute('data-simplebar')) {
                                removedNode.SimpleBar && removedNode.SimpleBar.unMount();
                            } else {
                                Array.from(removedNode.querySelectorAll('[data-simplebar]')).forEach(el => {
                                    el.SimpleBar && el.SimpleBar.unMount();
                                });
                            }
                        }
                    });
                });
            });

            this.globalObserver.observe(document, { childList: true, subtree: true });
        }

        // Taken from jQuery `ready` function
        // Instantiate elements already present on the page
        if (document.readyState === 'complete' ||
                (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
            // Handle it asynchronously to allow scripts the opportunity to delay init
            window.setTimeout(this.initDOMLoadedElements.bind(this));
        } else {
            document.addEventListener('DOMContentLoaded', this.initDOMLoadedElements);
            window.addEventListener('load', this.initDOMLoadedElements);
        }
    }

    // Helper function to retrieve options from element attributes
    static getElOptions(el) {
        const options = Object.keys(SimpleBar.htmlAttributes).reduce((acc, obj) => {
            const attribute = SimpleBar.htmlAttributes[obj];
            if (el.hasAttribute(attribute)) {
                acc[obj] = JSON.parse(el.getAttribute(attribute) || true);
            }
            return acc;
        }, {});

        return options;
    }

    static removeObserver() {
        this.globalObserver.disconnect();
    }

    static initDOMLoadedElements() {
        document.removeEventListener('DOMContentLoaded', this.initDOMLoadedElements);
        window.removeEventListener('load', this.initDOMLoadedElements);

        Array.from(document.querySelectorAll('[data-simplebar]')).forEach(el => {
            if (!el.SimpleBar)
                new SimpleBar(el, SimpleBar.getElOptions(el));
        });
    }

    init() {
        // Save a reference to the instance, so we know this DOM node has already been instancied
        this.el.SimpleBar = this;

        this.initDOM();

        this.scrollbarX = this.trackX.querySelector(`.${this.classNames.scrollbar}`);
        this.scrollbarY = this.trackY.querySelector(`.${this.classNames.scrollbar}`);

        this.isRtl = getComputedStyle(this.contentEl).direction === 'rtl';

        this.scrollContentEl.style[this.isRtl ? 'paddingLeft' : 'paddingRight'] = `${this.scrollbarWidth || this.offsetSize}px`;
        this.scrollContentEl.style.marginBottom = `-${this.scrollbarWidth*2 || this.offsetSize}px`;
        this.contentEl.style.paddingBottom = `${this.scrollbarWidth || this.offsetSize}px`;

        if (this.scrollbarWidth !== 0) {
            this.contentEl.style[this.isRtl ? 'marginLeft' : 'marginRight'] = `-${this.scrollbarWidth}px`;
        }

        // Calculate content size
        this.recalculate();

        this.initListeners();
    }

    initDOM() {
        // make sure this element doesn't have the elements yet
        if (Array.from(this.el.children).filter(child => child.classList.contains(this.classNames.scrollContent)).length) {
            // assume that element has his DOM already initiated
            this.trackX = this.el.querySelector(`.${this.classNames.track}.horizontal`);
            this.trackY = this.el.querySelector(`.${this.classNames.track}.vertical`);
            this.scrollContentEl = this.el.querySelector(`.${this.classNames.scrollContent}`);
            this.contentEl = this.el.querySelector(`.${this.classNames.content}`);
        } else {
            // Prepare DOM
            this.scrollContentEl = document.createElement('div');
            this.contentEl = document.createElement('div');

            this.scrollContentEl.classList.add(this.classNames.scrollContent);
            this.contentEl.classList.add(this.classNames.content);

            while (this.el.firstChild)
                this.contentEl.appendChild(this.el.firstChild)

            this.scrollContentEl.appendChild(this.contentEl);
            this.el.appendChild(this.scrollContentEl);
        }

        if (!this.trackX || !this.trackY) {
            const track = document.createElement('div');
            const scrollbar = document.createElement('div');

            track.classList.add(this.classNames.track);
            scrollbar.classList.add(this.classNames.scrollbar);

            track.appendChild(scrollbar);

            this.trackX = track.cloneNode(true);
            this.trackX.classList.add('horizontal');

            this.trackY = track.cloneNode(true);
            this.trackY.classList.add('vertical');

            this.el.insertBefore(this.trackX, this.el.firstChild);
            this.el.insertBefore(this.trackY, this.el.firstChild);
        }

        this.el.setAttribute('data-simplebar', 'init');
    }

    initListeners() {
        // Event listeners
        if (this.options.autoHide) {
            this.el.addEventListener('mouseenter', this.onMouseEnter);
        }

        this.scrollbarY.addEventListener('mousedown', this.onDragY);
        this.scrollbarX.addEventListener('mousedown', this.onDragX);

        this.scrollContentEl.addEventListener('scroll', this.onScrollY);
        this.contentEl.addEventListener('scroll', this.onScrollX);

        // MutationObserver is IE11+
        if (typeof MutationObserver !== 'undefined') {
            // create an observer instance
            this.mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (this.isChildNode(mutation.target) || mutation.addedNodes.length) {
                        this.recalculate();
                    }
                });
            });

            // pass in the target node, as well as the observer options
            this.mutationObserver.observe(this.el, { attributes: true, childList: true, characterData: true, subtree: true });
        }

        this.resizeObserver = new ResizeObserver(this.recalculate.bind(this));
        this.resizeObserver.observe(this.el);
    }

    removeListeners() {
        // Event listeners
        if (this.options.autoHide) {
            this.el.removeEventListener('mouseenter', this.onMouseEnter);
        }

        this.scrollbarX.removeEventListener('mousedown', this.onDragX);
        this.scrollbarY.removeEventListener('mousedown', this.onDragY);

        this.scrollContentEl.removeEventListener('scroll', this.onScrollY);
        this.contentEl.removeEventListener('scroll', this.onScrollX);

        this.mutationObserver.disconnect();
        this.resizeObserver.disconnect();
    }

    onDragX(e) {
        this.onDrag(e, 'x');
    }

    onDragY(e) {
        this.onDrag(e, 'y');
    }

    /**
     * on scrollbar handle drag
     */
    onDrag(e, axis = 'y') {
        // Preventing the event's default action stops text being
        // selectable during the drag.
        e.preventDefault();

        const scrollbar = axis === 'y' ? this.scrollbarY : this.scrollbarX;

        // Measure how far the user's mouse is from the top of the scrollbar drag handle.
        const eventOffset = axis === 'y' ? e.pageY : e.pageX;

        this.dragOffset[axis] = eventOffset - scrollbar.getBoundingClientRect()[this.offsetAttr[axis]];
        this.currentAxis = axis;

        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this.onEndDrag);
    }


    /**
     * Drag scrollbar handle
     */
    drag(e) {
        let eventOffset, track, scrollEl;

        e.preventDefault();

        if (this.currentAxis === 'y') {
            eventOffset = e.pageY;
            track = this.trackY;
            scrollEl = this.scrollContentEl;
        } else {
            eventOffset = e.pageX;
            track = this.trackX;
            scrollEl = this.contentEl;
        }

        // Calculate how far the user's mouse is from the top/left of the scrollbar (minus the dragOffset).
        let dragPos = eventOffset - track.getBoundingClientRect()[this.offsetAttr[this.currentAxis]] - this.dragOffset[this.currentAxis];

        // Convert the mouse position into a percentage of the scrollbar height/width.
        let dragPerc = dragPos / track[this.sizeAttr[this.currentAxis]];

        // Scroll the content by the same percentage.
        let scrollPos = dragPerc * this.contentEl[this.scrollSizeAttr[this.currentAxis]];

        scrollEl[this.scrollOffsetAttr[this.currentAxis]] = scrollPos;
    }


    /**
     * End scroll handle drag
     */
    onEndDrag() {
        document.removeEventListener('mousemove', this.drag);
        document.removeEventListener('mouseup', this.onEndDrag);
    }


    /**
     * Resize scrollbar
     */
    resizeScrollbar(axis = 'y') {
        let track;
        let scrollbar;
        let scrollOffset;
        let contentSize;
        let scrollbarSize;

        if (axis === 'x') {
            track = this.trackX;
            scrollbar = this.scrollbarX;
            scrollOffset = this.contentEl[this.scrollOffsetAttr[axis]]; // Either scrollTop() or scrollLeft().
            contentSize = this.contentSizeX;
            scrollbarSize = this.scrollbarXSize;
        } else { // 'y'
            track = this.trackY;
            scrollbar = this.scrollbarY;
            scrollOffset = this.scrollContentEl[this.scrollOffsetAttr[axis]]; // Either scrollTop() or scrollLeft().
            contentSize = this.contentSizeY;
            scrollbarSize = this.scrollbarYSize;
        }

        let scrollbarRatio  = scrollbarSize / contentSize;
        let scrollPourcent  = scrollOffset / (contentSize - scrollbarSize);
        // Calculate new height/position of drag handle.
        let handleSize      = Math.max(~~(scrollbarRatio * scrollbarSize), this.options.scrollbarMinSize);
        let handleOffset    = ~~((scrollbarSize - handleSize) * scrollPourcent);

        // Set isVisible to false if scrollbar is not necessary (content is shorter than wrapper)
        this.isVisible[axis] = scrollbarSize < contentSize;

        if (this.isVisible[axis] || this.options.forceVisible) {
            track.style.visibility = 'visible';

            if (this.options.forceVisible) {
                scrollbar.style.visibility = 'hidden';
            } else {
                scrollbar.style.visibility = 'visible';
            }

            if (axis === 'x') {
                scrollbar.style.left = `${handleOffset}px`;
                scrollbar.style.width = `${handleSize}px`;
            } else {
                scrollbar.style.top = `${handleOffset}px`;
                scrollbar.style.height = `${handleSize}px`;
            }
        } else {
            track.style.visibility = 'hidden';
        }
    }


    /**
     * On scroll event handling
     */
    onScrollX() {
        this.flashScrollbar('x');
    }

    onScrollY() {
        this.flashScrollbar('y');
    }


    /**
     * On mouseenter event handling
     */
    onMouseEnter() {
        this.flashScrollbar('x');
        this.flashScrollbar('y');
    }


    /**
     * Flash scrollbar visibility
     */
    flashScrollbar(axis = 'y') {
        this.resizeScrollbar(axis);
        this.showScrollbar(axis);
    }


    /**
     * Show scrollbar
     */
    showScrollbar(axis = 'y') {
        if (!this.isVisible[axis]) {
            return
        }

        if (axis === 'x') {
            this.scrollbarX.classList.add('visible');
        } else {
            this.scrollbarY.classList.add('visible');
        }

        if (!this.options.autoHide) {
            return
        }
        if(typeof this.flashTimeout === 'number') {
            window.clearTimeout(this.flashTimeout);
        }

        this.flashTimeout = window.setTimeout(this.hideScrollbar.bind(this), 1000);
    }


    /**
     * Hide Scrollbar
     */
    hideScrollbar() {
        this.scrollbarX.classList.remove('visible');
        this.scrollbarY.classList.remove('visible');

        if(typeof this.flashTimeout === 'number') {
            window.clearTimeout(this.flashTimeout);
        }
    }


    /**
     * Recalculate scrollbar
     */
    recalculate() {
        this.contentSizeX = this.contentEl[this.scrollSizeAttr['x']];
        this.contentSizeY = this.contentEl[this.scrollSizeAttr['y']] - (this.scrollbarWidth || this.offsetSize);
        this.scrollbarXSize   = this.trackX[this.sizeAttr['x']];
        this.scrollbarYSize   = this.trackY[this.sizeAttr['y']];

        this.resizeScrollbar('x');
        this.resizeScrollbar('y');

        if (!this.options.autoHide) {
            this.showScrollbar('x');
            this.showScrollbar('y');
        }
    }


    /**
     * Getter for original scrolling element
     */
    getScrollElement(axis = 'y') {
        return axis === 'y' ? this.scrollContentEl : this.contentEl;
    }


    /**
     * Getter for content element
     */
    getContentElement() {
        return this.contentEl;
    }

    /**
     * UnMount mutation observer and delete SimpleBar instance from DOM element
     */
    unMount() {
        this.removeListeners();
        this.el.SimpleBar = null;
    }

    /**
     * Recursively walks up the parent nodes looking for this.el
     */
    isChildNode(el) {
        if (el === null) return false;
        if (el === this.el) return true;

        return this.isChildNode(el.parentNode);
    }
}

/**
 * HTML API
 */
SimpleBar.initHtmlApi();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJleHQvc2ltcGxlYmFyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFBvbHlmaWxsc1xuaW1wb3J0ICdjb3JlLWpzL2ZuL2FycmF5L2Zyb20nO1xuT2JqZWN0LmFzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxuaW1wb3J0IHNjcm9sbGJhcldpZHRoIGZyb20gJ3Njcm9sbGJhcndpZHRoJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2guZGVib3VuY2UnO1xuaW1wb3J0IFJlc2l6ZU9ic2VydmVyIGZyb20gJ3Jlc2l6ZS1vYnNlcnZlci1wb2x5ZmlsbCc7XG5cbmltcG9ydCAnLi9zaW1wbGViYXIuY3NzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2ltcGxlQmFyIHtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLmZsYXNoVGltZW91dDtcbiAgICAgICAgdGhpcy5jb250ZW50RWw7XG4gICAgICAgIHRoaXMuc2Nyb2xsQ29udGVudEVsO1xuICAgICAgICB0aGlzLmRyYWdPZmZzZXQgICAgICAgICA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICB0aGlzLmlzVmlzaWJsZSAgICAgICAgICA9IHsgeDogdHJ1ZSwgeTogdHJ1ZSB9O1xuICAgICAgICB0aGlzLnNjcm9sbE9mZnNldEF0dHIgICA9IHsgeDogJ3Njcm9sbExlZnQnLCB5OiAnc2Nyb2xsVG9wJyB9O1xuICAgICAgICB0aGlzLnNpemVBdHRyICAgICAgICAgICA9IHsgeDogJ29mZnNldFdpZHRoJywgeTogJ29mZnNldEhlaWdodCcgfTtcbiAgICAgICAgdGhpcy5zY3JvbGxTaXplQXR0ciAgICAgPSB7IHg6ICdzY3JvbGxXaWR0aCcsIHk6ICdzY3JvbGxIZWlnaHQnIH07XG4gICAgICAgIHRoaXMub2Zmc2V0QXR0ciAgICAgICAgID0geyB4OiAnbGVmdCcsIHk6ICd0b3AnIH07XG4gICAgICAgIHRoaXMuZ2xvYmFsT2JzZXJ2ZXI7XG4gICAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcjtcbiAgICAgICAgdGhpcy5yZXNpemVPYnNlcnZlcjtcbiAgICAgICAgdGhpcy5jdXJyZW50QXhpcztcbiAgICAgICAgdGhpcy5pc1J0bDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgU2ltcGxlQmFyLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5jbGFzc05hbWVzID0gdGhpcy5vcHRpb25zLmNsYXNzTmFtZXM7XG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxiYXJXaWR0aCgpO1xuICAgICAgICB0aGlzLm9mZnNldFNpemUgPSAyMDtcbiAgICAgICAgdGhpcy5mbGFzaFNjcm9sbGJhciA9IHRoaXMuZmxhc2hTY3JvbGxiYXIuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbkRyYWdZID0gdGhpcy5vbkRyYWdZLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25EcmFnWCA9IHRoaXMub25EcmFnWC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uU2Nyb2xsWSA9IHRoaXMub25TY3JvbGxZLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25TY3JvbGxYID0gdGhpcy5vblNjcm9sbFguYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kcmFnID0gdGhpcy5kcmFnLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub25FbmREcmFnID0gdGhpcy5vbkVuZERyYWcuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vbk1vdXNlRW50ZXIgPSB0aGlzLm9uTW91c2VFbnRlci5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGUgPSBkZWJvdW5jZSh0aGlzLnJlY2FsY3VsYXRlLCAxMDAsIHsgbGVhZGluZzogdHJ1ZSB9KTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXV0b0hpZGU6IHRydWUsXG4gICAgICAgICAgICBmb3JjZVZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgY2xhc3NOYW1lczoge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICdzaW1wbGViYXItY29udGVudCcsXG4gICAgICAgICAgICAgICAgc2Nyb2xsQ29udGVudDogJ3NpbXBsZWJhci1zY3JvbGwtY29udGVudCcsXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyOiAnc2ltcGxlYmFyLXNjcm9sbGJhcicsXG4gICAgICAgICAgICAgICAgdHJhY2s6ICdzaW1wbGViYXItdHJhY2snXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2Nyb2xsYmFyTWluU2l6ZTogMjVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgaHRtbEF0dHJpYnV0ZXMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhdXRvSGlkZTogJ2RhdGEtc2ltcGxlYmFyLWF1dG8taGlkZScsXG4gICAgICAgICAgICBmb3JjZVZpc2libGU6ICdkYXRhLXNpbXBsZWJhci1mb3JjZS12aXNpYmxlJyxcbiAgICAgICAgICAgIHNjcm9sbGJhck1pblNpemU6ICdkYXRhLXNpbXBsZWJhci1zY3JvbGxiYXItbWluLXNpemUnXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgaW5pdEh0bWxBcGkoKSB7XG4gICAgICAgIHRoaXMuaW5pdERPTUxvYWRlZEVsZW1lbnRzID0gdGhpcy5pbml0RE9NTG9hZGVkRWxlbWVudHMuYmluZCh0aGlzKTtcblxuICAgICAgICAvLyBNdXRhdGlvbk9ic2VydmVyIGlzIElFMTErXG4gICAgICAgIGlmICh0eXBlb2YgTXV0YXRpb25PYnNlcnZlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIC8vIE11dGF0aW9uIG9ic2VydmVyIHRvIG9ic2VydmUgZHluYW1pY2FsbHkgYWRkZWQgZWxlbWVudHNcbiAgICAgICAgICAgIHRoaXMuZ2xvYmFsT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbnMgPT4ge1xuICAgICAgICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKG11dGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShtdXRhdGlvbi5hZGRlZE5vZGVzKS5mb3JFYWNoKGFkZGVkTm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWRkZWROb2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFkZGVkTm9kZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2ltcGxlYmFyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWFkZGVkTm9kZS5TaW1wbGVCYXIgJiYgbmV3IFNpbXBsZUJhcihhZGRlZE5vZGUsIFNpbXBsZUJhci5nZXRFbE9wdGlvbnMoYWRkZWROb2RlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShhZGRlZE5vZGUucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc2ltcGxlYmFyXScpKS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFlbC5TaW1wbGVCYXIgJiYgbmV3IFNpbXBsZUJhcihlbCwgU2ltcGxlQmFyLmdldEVsT3B0aW9ucyhlbCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20obXV0YXRpb24ucmVtb3ZlZE5vZGVzKS5mb3JFYWNoKHJlbW92ZWROb2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZW1vdmVkTm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZW1vdmVkTm9kZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtc2ltcGxlYmFyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZE5vZGUuU2ltcGxlQmFyICYmIHJlbW92ZWROb2RlLlNpbXBsZUJhci51bk1vdW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShyZW1vdmVkTm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1zaW1wbGViYXJdJykpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWwuU2ltcGxlQmFyICYmIGVsLlNpbXBsZUJhci51bk1vdW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5nbG9iYWxPYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRha2VuIGZyb20galF1ZXJ5IGByZWFkeWAgZnVuY3Rpb25cbiAgICAgICAgLy8gSW5zdGFudGlhdGUgZWxlbWVudHMgYWxyZWFkeSBwcmVzZW50IG9uIHRoZSBwYWdlXG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnIHx8XG4gICAgICAgICAgICAgICAgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT09ICdsb2FkaW5nJyAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsKSkge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGl0IGFzeW5jaHJvbm91c2x5IHRvIGFsbG93IHNjcmlwdHMgdGhlIG9wcG9ydHVuaXR5IHRvIGRlbGF5IGluaXRcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuaW5pdERPTUxvYWRlZEVsZW1lbnRzLmJpbmQodGhpcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHRoaXMuaW5pdERPTUxvYWRlZEVsZW1lbnRzKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5pbml0RE9NTG9hZGVkRWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIHJldHJpZXZlIG9wdGlvbnMgZnJvbSBlbGVtZW50IGF0dHJpYnV0ZXNcbiAgICBzdGF0aWMgZ2V0RWxPcHRpb25zKGVsKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3Qua2V5cyhTaW1wbGVCYXIuaHRtbEF0dHJpYnV0ZXMpLnJlZHVjZSgoYWNjLCBvYmopID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IFNpbXBsZUJhci5odG1sQXR0cmlidXRlc1tvYmpdO1xuICAgICAgICAgICAgaWYgKGVsLmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgYWNjW29ial0gPSBKU09OLnBhcnNlKGVsLmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpIHx8IHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30pO1xuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cblxuICAgIHN0YXRpYyByZW1vdmVPYnNlcnZlcigpIHtcbiAgICAgICAgdGhpcy5nbG9iYWxPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGluaXRET01Mb2FkZWRFbGVtZW50cygpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIHRoaXMuaW5pdERPTUxvYWRlZEVsZW1lbnRzKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLmluaXRET01Mb2FkZWRFbGVtZW50cyk7XG5cbiAgICAgICAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1zaW1wbGViYXJdJykpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgaWYgKCFlbC5TaW1wbGVCYXIpXG4gICAgICAgICAgICAgICAgbmV3IFNpbXBsZUJhcihlbCwgU2ltcGxlQmFyLmdldEVsT3B0aW9ucyhlbCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBTYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSBpbnN0YW5jZSwgc28gd2Uga25vdyB0aGlzIERPTSBub2RlIGhhcyBhbHJlYWR5IGJlZW4gaW5zdGFuY2llZFxuICAgICAgICB0aGlzLmVsLlNpbXBsZUJhciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5pbml0RE9NKCk7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxiYXJYID0gdGhpcy50cmFja1gucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jbGFzc05hbWVzLnNjcm9sbGJhcn1gKTtcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJZID0gdGhpcy50cmFja1kucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jbGFzc05hbWVzLnNjcm9sbGJhcn1gKTtcblxuICAgICAgICB0aGlzLmlzUnRsID0gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRlbnRFbCkuZGlyZWN0aW9uID09PSAncnRsJztcblxuICAgICAgICB0aGlzLnNjcm9sbENvbnRlbnRFbC5zdHlsZVt0aGlzLmlzUnRsID8gJ3BhZGRpbmdMZWZ0JyA6ICdwYWRkaW5nUmlnaHQnXSA9IGAke3RoaXMuc2Nyb2xsYmFyV2lkdGggfHwgdGhpcy5vZmZzZXRTaXplfXB4YDtcbiAgICAgICAgdGhpcy5zY3JvbGxDb250ZW50RWwuc3R5bGUubWFyZ2luQm90dG9tID0gYC0ke3RoaXMuc2Nyb2xsYmFyV2lkdGgqMiB8fCB0aGlzLm9mZnNldFNpemV9cHhgO1xuICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5wYWRkaW5nQm90dG9tID0gYCR7dGhpcy5zY3JvbGxiYXJXaWR0aCB8fCB0aGlzLm9mZnNldFNpemV9cHhgO1xuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbGJhcldpZHRoICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZVt0aGlzLmlzUnRsID8gJ21hcmdpbkxlZnQnIDogJ21hcmdpblJpZ2h0J10gPSBgLSR7dGhpcy5zY3JvbGxiYXJXaWR0aH1weGA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYWxjdWxhdGUgY29udGVudCBzaXplXG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcblxuICAgICAgICB0aGlzLmluaXRMaXN0ZW5lcnMoKTtcbiAgICB9XG5cbiAgICBpbml0RE9NKCkge1xuICAgICAgICAvLyBtYWtlIHN1cmUgdGhpcyBlbGVtZW50IGRvZXNuJ3QgaGF2ZSB0aGUgZWxlbWVudHMgeWV0XG4gICAgICAgIGlmIChBcnJheS5mcm9tKHRoaXMuZWwuY2hpbGRyZW4pLmZpbHRlcihjaGlsZCA9PiBjaGlsZC5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jbGFzc05hbWVzLnNjcm9sbENvbnRlbnQpKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIGFzc3VtZSB0aGF0IGVsZW1lbnQgaGFzIGhpcyBET00gYWxyZWFkeSBpbml0aWF0ZWRcbiAgICAgICAgICAgIHRoaXMudHJhY2tYID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLmNsYXNzTmFtZXMudHJhY2t9Lmhvcml6b250YWxgKTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tZID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKGAuJHt0aGlzLmNsYXNzTmFtZXMudHJhY2t9LnZlcnRpY2FsYCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRlbnRFbCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jbGFzc05hbWVzLnNjcm9sbENvbnRlbnR9YCk7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRFbCA9IHRoaXMuZWwucXVlcnlTZWxlY3RvcihgLiR7dGhpcy5jbGFzc05hbWVzLmNvbnRlbnR9YCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBQcmVwYXJlIERPTVxuICAgICAgICAgICAgdGhpcy5zY3JvbGxDb250ZW50RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuY29udGVudEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsQ29udGVudEVsLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc05hbWVzLnNjcm9sbENvbnRlbnQpO1xuICAgICAgICAgICAgdGhpcy5jb250ZW50RWwuY2xhc3NMaXN0LmFkZCh0aGlzLmNsYXNzTmFtZXMuY29udGVudCk7XG5cbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmVsLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50RWwuYXBwZW5kQ2hpbGQodGhpcy5lbC5maXJzdENoaWxkKVxuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbENvbnRlbnRFbC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnRFbCk7XG4gICAgICAgICAgICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsQ29udGVudEVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50cmFja1ggfHwgIXRoaXMudHJhY2tZKSB7XG4gICAgICAgICAgICBjb25zdCB0cmFjayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgICAgICAgIHRyYWNrLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc05hbWVzLnRyYWNrKTtcbiAgICAgICAgICAgIHNjcm9sbGJhci5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3NOYW1lcy5zY3JvbGxiYXIpO1xuXG4gICAgICAgICAgICB0cmFjay5hcHBlbmRDaGlsZChzY3JvbGxiYXIpO1xuXG4gICAgICAgICAgICB0aGlzLnRyYWNrWCA9IHRyYWNrLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tYLmNsYXNzTGlzdC5hZGQoJ2hvcml6b250YWwnKTtcblxuICAgICAgICAgICAgdGhpcy50cmFja1kgPSB0cmFjay5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrWS5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbCcpO1xuXG4gICAgICAgICAgICB0aGlzLmVsLmluc2VydEJlZm9yZSh0aGlzLnRyYWNrWCwgdGhpcy5lbC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIHRoaXMuZWwuaW5zZXJ0QmVmb3JlKHRoaXMudHJhY2tZLCB0aGlzLmVsLmZpcnN0Q2hpbGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2ltcGxlYmFyJywgJ2luaXQnKTtcbiAgICB9XG5cbiAgICBpbml0TGlzdGVuZXJzKCkge1xuICAgICAgICAvLyBFdmVudCBsaXN0ZW5lcnNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvSGlkZSkge1xuICAgICAgICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5vbk1vdXNlRW50ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY3JvbGxiYXJZLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25EcmFnWSk7XG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyWC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uRHJhZ1gpO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsQ29udGVudEVsLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMub25TY3JvbGxZKTtcbiAgICAgICAgdGhpcy5jb250ZW50RWwuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5vblNjcm9sbFgpO1xuXG4gICAgICAgIC8vIE11dGF0aW9uT2JzZXJ2ZXIgaXMgSUUxMStcbiAgICAgICAgaWYgKHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgLy8gY3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlXG4gICAgICAgICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbnMgPT4ge1xuICAgICAgICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKG11dGF0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNDaGlsZE5vZGUobXV0YXRpb24udGFyZ2V0KSB8fCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gcGFzcyBpbiB0aGUgdGFyZ2V0IG5vZGUsIGFzIHdlbGwgYXMgdGhlIG9ic2VydmVyIG9wdGlvbnNcbiAgICAgICAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKHRoaXMuZWwsIHsgYXR0cmlidXRlczogdHJ1ZSwgY2hpbGRMaXN0OiB0cnVlLCBjaGFyYWN0ZXJEYXRhOiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcih0aGlzLnJlY2FsY3VsYXRlLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyLm9ic2VydmUodGhpcy5lbCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlTGlzdGVuZXJzKCkge1xuICAgICAgICAvLyBFdmVudCBsaXN0ZW5lcnNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvSGlkZSkge1xuICAgICAgICAgICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5vbk1vdXNlRW50ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zY3JvbGxiYXJYLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25EcmFnWCk7XG4gICAgICAgIHRoaXMuc2Nyb2xsYmFyWS5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uRHJhZ1kpO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsQ29udGVudEVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMub25TY3JvbGxZKTtcbiAgICAgICAgdGhpcy5jb250ZW50RWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5vblNjcm9sbFgpO1xuXG4gICAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH1cblxuICAgIG9uRHJhZ1goZSkge1xuICAgICAgICB0aGlzLm9uRHJhZyhlLCAneCcpO1xuICAgIH1cblxuICAgIG9uRHJhZ1koZSkge1xuICAgICAgICB0aGlzLm9uRHJhZyhlLCAneScpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIHNjcm9sbGJhciBoYW5kbGUgZHJhZ1xuICAgICAqL1xuICAgIG9uRHJhZyhlLCBheGlzID0gJ3knKSB7XG4gICAgICAgIC8vIFByZXZlbnRpbmcgdGhlIGV2ZW50J3MgZGVmYXVsdCBhY3Rpb24gc3RvcHMgdGV4dCBiZWluZ1xuICAgICAgICAvLyBzZWxlY3RhYmxlIGR1cmluZyB0aGUgZHJhZy5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNvbnN0IHNjcm9sbGJhciA9IGF4aXMgPT09ICd5JyA/IHRoaXMuc2Nyb2xsYmFyWSA6IHRoaXMuc2Nyb2xsYmFyWDtcblxuICAgICAgICAvLyBNZWFzdXJlIGhvdyBmYXIgdGhlIHVzZXIncyBtb3VzZSBpcyBmcm9tIHRoZSB0b3Agb2YgdGhlIHNjcm9sbGJhciBkcmFnIGhhbmRsZS5cbiAgICAgICAgY29uc3QgZXZlbnRPZmZzZXQgPSBheGlzID09PSAneScgPyBlLnBhZ2VZIDogZS5wYWdlWDtcblxuICAgICAgICB0aGlzLmRyYWdPZmZzZXRbYXhpc10gPSBldmVudE9mZnNldCAtIHNjcm9sbGJhci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVt0aGlzLm9mZnNldEF0dHJbYXhpc11dO1xuICAgICAgICB0aGlzLmN1cnJlbnRBeGlzID0gYXhpcztcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmRyYWcpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbkVuZERyYWcpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogRHJhZyBzY3JvbGxiYXIgaGFuZGxlXG4gICAgICovXG4gICAgZHJhZyhlKSB7XG4gICAgICAgIGxldCBldmVudE9mZnNldCwgdHJhY2ssIHNjcm9sbEVsO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QXhpcyA9PT0gJ3knKSB7XG4gICAgICAgICAgICBldmVudE9mZnNldCA9IGUucGFnZVk7XG4gICAgICAgICAgICB0cmFjayA9IHRoaXMudHJhY2tZO1xuICAgICAgICAgICAgc2Nyb2xsRWwgPSB0aGlzLnNjcm9sbENvbnRlbnRFbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50T2Zmc2V0ID0gZS5wYWdlWDtcbiAgICAgICAgICAgIHRyYWNrID0gdGhpcy50cmFja1g7XG4gICAgICAgICAgICBzY3JvbGxFbCA9IHRoaXMuY29udGVudEVsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBmYXIgdGhlIHVzZXIncyBtb3VzZSBpcyBmcm9tIHRoZSB0b3AvbGVmdCBvZiB0aGUgc2Nyb2xsYmFyIChtaW51cyB0aGUgZHJhZ09mZnNldCkuXG4gICAgICAgIGxldCBkcmFnUG9zID0gZXZlbnRPZmZzZXQgLSB0cmFjay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVt0aGlzLm9mZnNldEF0dHJbdGhpcy5jdXJyZW50QXhpc11dIC0gdGhpcy5kcmFnT2Zmc2V0W3RoaXMuY3VycmVudEF4aXNdO1xuXG4gICAgICAgIC8vIENvbnZlcnQgdGhlIG1vdXNlIHBvc2l0aW9uIGludG8gYSBwZXJjZW50YWdlIG9mIHRoZSBzY3JvbGxiYXIgaGVpZ2h0L3dpZHRoLlxuICAgICAgICBsZXQgZHJhZ1BlcmMgPSBkcmFnUG9zIC8gdHJhY2tbdGhpcy5zaXplQXR0clt0aGlzLmN1cnJlbnRBeGlzXV07XG5cbiAgICAgICAgLy8gU2Nyb2xsIHRoZSBjb250ZW50IGJ5IHRoZSBzYW1lIHBlcmNlbnRhZ2UuXG4gICAgICAgIGxldCBzY3JvbGxQb3MgPSBkcmFnUGVyYyAqIHRoaXMuY29udGVudEVsW3RoaXMuc2Nyb2xsU2l6ZUF0dHJbdGhpcy5jdXJyZW50QXhpc11dO1xuXG4gICAgICAgIHNjcm9sbEVsW3RoaXMuc2Nyb2xsT2Zmc2V0QXR0clt0aGlzLmN1cnJlbnRBeGlzXV0gPSBzY3JvbGxQb3M7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBFbmQgc2Nyb2xsIGhhbmRsZSBkcmFnXG4gICAgICovXG4gICAgb25FbmREcmFnKCkge1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmRyYWcpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbkVuZERyYWcpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVzaXplIHNjcm9sbGJhclxuICAgICAqL1xuICAgIHJlc2l6ZVNjcm9sbGJhcihheGlzID0gJ3knKSB7XG4gICAgICAgIGxldCB0cmFjaztcbiAgICAgICAgbGV0IHNjcm9sbGJhcjtcbiAgICAgICAgbGV0IHNjcm9sbE9mZnNldDtcbiAgICAgICAgbGV0IGNvbnRlbnRTaXplO1xuICAgICAgICBsZXQgc2Nyb2xsYmFyU2l6ZTtcblxuICAgICAgICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgICAgICAgICB0cmFjayA9IHRoaXMudHJhY2tYO1xuICAgICAgICAgICAgc2Nyb2xsYmFyID0gdGhpcy5zY3JvbGxiYXJYO1xuICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0ID0gdGhpcy5jb250ZW50RWxbdGhpcy5zY3JvbGxPZmZzZXRBdHRyW2F4aXNdXTsgLy8gRWl0aGVyIHNjcm9sbFRvcCgpIG9yIHNjcm9sbExlZnQoKS5cbiAgICAgICAgICAgIGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50U2l6ZVg7XG4gICAgICAgICAgICBzY3JvbGxiYXJTaXplID0gdGhpcy5zY3JvbGxiYXJYU2l6ZTtcbiAgICAgICAgfSBlbHNlIHsgLy8gJ3knXG4gICAgICAgICAgICB0cmFjayA9IHRoaXMudHJhY2tZO1xuICAgICAgICAgICAgc2Nyb2xsYmFyID0gdGhpcy5zY3JvbGxiYXJZO1xuICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0ID0gdGhpcy5zY3JvbGxDb250ZW50RWxbdGhpcy5zY3JvbGxPZmZzZXRBdHRyW2F4aXNdXTsgLy8gRWl0aGVyIHNjcm9sbFRvcCgpIG9yIHNjcm9sbExlZnQoKS5cbiAgICAgICAgICAgIGNvbnRlbnRTaXplID0gdGhpcy5jb250ZW50U2l6ZVk7XG4gICAgICAgICAgICBzY3JvbGxiYXJTaXplID0gdGhpcy5zY3JvbGxiYXJZU2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzY3JvbGxiYXJSYXRpbyAgPSBzY3JvbGxiYXJTaXplIC8gY29udGVudFNpemU7XG4gICAgICAgIGxldCBzY3JvbGxQb3VyY2VudCAgPSBzY3JvbGxPZmZzZXQgLyAoY29udGVudFNpemUgLSBzY3JvbGxiYXJTaXplKTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIG5ldyBoZWlnaHQvcG9zaXRpb24gb2YgZHJhZyBoYW5kbGUuXG4gICAgICAgIGxldCBoYW5kbGVTaXplICAgICAgPSBNYXRoLm1heCh+fihzY3JvbGxiYXJSYXRpbyAqIHNjcm9sbGJhclNpemUpLCB0aGlzLm9wdGlvbnMuc2Nyb2xsYmFyTWluU2l6ZSk7XG4gICAgICAgIGxldCBoYW5kbGVPZmZzZXQgICAgPSB+figoc2Nyb2xsYmFyU2l6ZSAtIGhhbmRsZVNpemUpICogc2Nyb2xsUG91cmNlbnQpO1xuXG4gICAgICAgIC8vIFNldCBpc1Zpc2libGUgdG8gZmFsc2UgaWYgc2Nyb2xsYmFyIGlzIG5vdCBuZWNlc3NhcnkgKGNvbnRlbnQgaXMgc2hvcnRlciB0aGFuIHdyYXBwZXIpXG4gICAgICAgIHRoaXMuaXNWaXNpYmxlW2F4aXNdID0gc2Nyb2xsYmFyU2l6ZSA8IGNvbnRlbnRTaXplO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlzaWJsZVtheGlzXSB8fCB0aGlzLm9wdGlvbnMuZm9yY2VWaXNpYmxlKSB7XG4gICAgICAgICAgICB0cmFjay5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZvcmNlVmlzaWJsZSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbGJhci5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjcm9sbGJhci5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyLnN0eWxlLmxlZnQgPSBgJHtoYW5kbGVPZmZzZXR9cHhgO1xuICAgICAgICAgICAgICAgIHNjcm9sbGJhci5zdHlsZS53aWR0aCA9IGAke2hhbmRsZVNpemV9cHhgO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXIuc3R5bGUudG9wID0gYCR7aGFuZGxlT2Zmc2V0fXB4YDtcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXIuc3R5bGUuaGVpZ2h0ID0gYCR7aGFuZGxlU2l6ZX1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFjay5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIE9uIHNjcm9sbCBldmVudCBoYW5kbGluZ1xuICAgICAqL1xuICAgIG9uU2Nyb2xsWCgpIHtcbiAgICAgICAgdGhpcy5mbGFzaFNjcm9sbGJhcigneCcpO1xuICAgIH1cblxuICAgIG9uU2Nyb2xsWSgpIHtcbiAgICAgICAgdGhpcy5mbGFzaFNjcm9sbGJhcigneScpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogT24gbW91c2VlbnRlciBldmVudCBoYW5kbGluZ1xuICAgICAqL1xuICAgIG9uTW91c2VFbnRlcigpIHtcbiAgICAgICAgdGhpcy5mbGFzaFNjcm9sbGJhcigneCcpO1xuICAgICAgICB0aGlzLmZsYXNoU2Nyb2xsYmFyKCd5Jyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBGbGFzaCBzY3JvbGxiYXIgdmlzaWJpbGl0eVxuICAgICAqL1xuICAgIGZsYXNoU2Nyb2xsYmFyKGF4aXMgPSAneScpIHtcbiAgICAgICAgdGhpcy5yZXNpemVTY3JvbGxiYXIoYXhpcyk7XG4gICAgICAgIHRoaXMuc2hvd1Njcm9sbGJhcihheGlzKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFNob3cgc2Nyb2xsYmFyXG4gICAgICovXG4gICAgc2hvd1Njcm9sbGJhcihheGlzID0gJ3knKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1Zpc2libGVbYXhpc10pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF4aXMgPT09ICd4Jykge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxiYXJYLmNsYXNzTGlzdC5hZGQoJ3Zpc2libGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsYmFyWS5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5hdXRvSGlkZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYodHlwZW9mIHRoaXMuZmxhc2hUaW1lb3V0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmZsYXNoVGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZsYXNoVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KHRoaXMuaGlkZVNjcm9sbGJhci5iaW5kKHRoaXMpLCAxMDAwKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEhpZGUgU2Nyb2xsYmFyXG4gICAgICovXG4gICAgaGlkZVNjcm9sbGJhcigpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJYLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJZLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5mbGFzaFRpbWVvdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuZmxhc2hUaW1lb3V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVjYWxjdWxhdGUgc2Nyb2xsYmFyXG4gICAgICovXG4gICAgcmVjYWxjdWxhdGUoKSB7XG4gICAgICAgIHRoaXMuY29udGVudFNpemVYID0gdGhpcy5jb250ZW50RWxbdGhpcy5zY3JvbGxTaXplQXR0clsneCddXTtcbiAgICAgICAgdGhpcy5jb250ZW50U2l6ZVkgPSB0aGlzLmNvbnRlbnRFbFt0aGlzLnNjcm9sbFNpemVBdHRyWyd5J11dIC0gKHRoaXMuc2Nyb2xsYmFyV2lkdGggfHwgdGhpcy5vZmZzZXRTaXplKTtcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJYU2l6ZSAgID0gdGhpcy50cmFja1hbdGhpcy5zaXplQXR0clsneCddXTtcbiAgICAgICAgdGhpcy5zY3JvbGxiYXJZU2l6ZSAgID0gdGhpcy50cmFja1lbdGhpcy5zaXplQXR0clsneSddXTtcblxuICAgICAgICB0aGlzLnJlc2l6ZVNjcm9sbGJhcigneCcpO1xuICAgICAgICB0aGlzLnJlc2l6ZVNjcm9sbGJhcigneScpO1xuXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLmF1dG9IaWRlKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dTY3JvbGxiYXIoJ3gnKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd1Njcm9sbGJhcigneScpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZXR0ZXIgZm9yIG9yaWdpbmFsIHNjcm9sbGluZyBlbGVtZW50XG4gICAgICovXG4gICAgZ2V0U2Nyb2xsRWxlbWVudChheGlzID0gJ3knKSB7XG4gICAgICAgIHJldHVybiBheGlzID09PSAneScgPyB0aGlzLnNjcm9sbENvbnRlbnRFbCA6IHRoaXMuY29udGVudEVsO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogR2V0dGVyIGZvciBjb250ZW50IGVsZW1lbnRcbiAgICAgKi9cbiAgICBnZXRDb250ZW50RWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudEVsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuTW91bnQgbXV0YXRpb24gb2JzZXJ2ZXIgYW5kIGRlbGV0ZSBTaW1wbGVCYXIgaW5zdGFuY2UgZnJvbSBET00gZWxlbWVudFxuICAgICAqL1xuICAgIHVuTW91bnQoKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuZWwuU2ltcGxlQmFyID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWN1cnNpdmVseSB3YWxrcyB1cCB0aGUgcGFyZW50IG5vZGVzIGxvb2tpbmcgZm9yIHRoaXMuZWxcbiAgICAgKi9cbiAgICBpc0NoaWxkTm9kZShlbCkge1xuICAgICAgICBpZiAoZWwgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGVsID09PSB0aGlzLmVsKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gdGhpcy5pc0NoaWxkTm9kZShlbC5wYXJlbnROb2RlKTtcbiAgICB9XG59XG5cbi8qKlxuICogSFRNTCBBUElcbiAqL1xuU2ltcGxlQmFyLmluaXRIdG1sQXBpKCk7XG4iXSwiZmlsZSI6ImV4dC9zaW1wbGViYXIuanMifQ==
