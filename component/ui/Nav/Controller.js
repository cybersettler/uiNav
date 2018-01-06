const NavWidget = require('./NavWidget.js');

function NavController(view, scope) {

    // Controller constructor is called when an instance
    // of the html element is created

    // Controllers are stateless, the model is used to
    // store state data instead.

    // This class extends component/view/AbstractController
    // so we need to call the super constructor
    this.super(view, scope);
    var controller = this;
    scope.onAttached.then(function () {

        var bindingAttributes = [];

        if (view.hasAttribute('data-model')) {
            bindingAttributes.push('model');
        }

        if (view.hasAttribute('data-display')) {
            bindingAttributes.push('display');
        }

        scope.bindAttributes(bindingAttributes);

        controller.navWidget = new NavWidget(view, scope);
        controller.navWidget.render();
    });

    this.render = function () {
        this.navWidget.render();
    };
}

module.exports = NavController;
