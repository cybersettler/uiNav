const d3 = require('d3');
const viewPattern = /^view\/(\w+)/;

function NavWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    this.navList = view.shadowRoot.querySelector('ul');
}

NavWidget.prototype.render = function() {
    return this.fetchData()
        .then(function(widget) {
            render(widget);
        });
};

NavWidget.prototype.fetchData = function() {
    var promises = [];
    var widget = this;

    promises.push(widget.scope.onAppReady);

    if (this.view.hasAttribute('data-model')) {
        promises.push(
            this.scope.getModel().then(function(result) {
                widget.model = result;
            })
        );
    }

    if (this.view.hasAttribute('data-display')) {
        promises.push(
            this.scope.getDisplay().then(function(result) {
                widget.display = result;
            })
        );
    }

    return Promise.all(promises).then(function() {
        return widget;
    });
};


function render(widget) {
    if (widget.view.hasAttribute('data-role') &&
        widget.view.dataset.role === 'template') {
        generateDisplayFromTemplate(widget);
    }
    if (widget.display) {
        renderNavFromDisplay(widget);
    }
    initializeLinks(widget);
}

function generateDisplayFromTemplate(widget) {
    if (!widget.navList) {
        let list = document.createElement('ul');
        list.classList.add('nav', 'navbar-nav');
        widget.view.shadowRoot.appendChild(list);
        widget.navList = list;
    }

    widget.display = getDisplayFromTemplate(widget);
}

function renderNavFromDisplay(widget) {
    var data = getBodyData(widget);

    var ul = d3.select(body)
        .selectAll("ul")
        .data(data)
        .classed('active', function(d, i) {
            return widget.selectedIndex === i;
        });

    let li = d3.select(widget.navList)
        .selectAll('li')
        .data(widget.display.items);

    let enterLi = li.enter()
        .append('li')
        .classed('dropdown', function(d) {
            return d.type === 'dropdown';
        })
        .classed('active', function(d, i) {
            return widget.selectedIndex === i;
        })
        .html(function(d) {
            return widget.scope.templateEngine.render(d.content, widget);
        });

    enterLi.selectAll('a')
        .on('click', function(d, i) {
            let href = this.getAttribute('href');
            if (viewPattern.test(href)) {
                d3.event.preventDefault();
                widget.selectedIndex = i;
                widget.scope.navigateTo(href);
                widget.render();
            }
        });

    li.exit().remove();
}

function getDisplayFromTemplate(widget) {
    let result = {};
    let ul = widget.view.querySelector('ul');
    result.items = Array.from(
        ul.querySelectorAll('li'))
        .map(addDisplayItemFromTemplate);
    return result;
}

function addDisplayItemFromTemplate(item) {
    let result = {};
    if (item.classList.contains('dropdown')) {
        result.type = 'dropdown';
    } else {
        result.type = 'link';
    }

    result.content = item.innerHTML;
    return result;
}

module.exports = NavWidget;