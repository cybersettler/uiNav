const d3 = require('d3');
const viewPattern = /^view\/(\w+)/;

function NavWidget(view, scope) {
    this.view = view;
    this.scope = scope;
    this.renderTemplate = scope.templateEngine.compile(view.innerHTML);
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
    if (widget.display) {
        renderNavFromDisplay(widget);
    } else {
        widget.view.innerHTML = widget.renderTemplate({model: widget.model});
    }

    initializeLinks(widget);
}

function renderNavFromDisplay(widget) {
    var data = widget.display.items;
    let ul = widget.view.querySelector('ul');

    let li = d3.select(ul)
        .selectAll("li")
        .data(data)
        .classed('active', function(d, i) {
            return widget.selectedIndex === i;
        });

    li.enter()
        .append('li')
        .classed('dropdown', function(d) {
            return d.type === 'dropdown';
        })
        .classed('active', function(d, i) {
            return widget.selectedIndex === i;
        })
        .html(function(d) {
            if (d.template) {
                return widget.scope.templateEngine.render(d.template, widget);
            } else {
                let template = '<a href="' + d.href + '">' + d.label + '</a>';
                return widget.scope.templateEngine.render(template, widget);
            }
        });

    li.exit().remove();
}

function initializeLinks(widget) {
    Array.from(widget.querySelectorAll('a'))
        .forEach(initLink, {widget: widget});
}

function initLink(item, i) {
    let widget = this.widget;
    let href = item.getAttribute('href');
    item.addEventListener(onLinkActivate);
    function onLinkActivate(e) {
        e.preventDefault();
        widget.selectedIndex = i;
        widget.scope.navigateTo(href);
        widget.render();
    }
}

module.exports = NavWidget;