"use strict";

goog.provide('tutao.util.KnockoutObservableAdapter');

/**
 * This adapter creates knockout observables from our entity classes 
 * @constructor
 * @param {Object=} entity A tutadb generated Entity-Class
 */
tutao.util.KnockoutObservableAdapter = function(entity) {
	var self = this;
	this.entity = entity;
	function observable() {
		return entity;
	};

    ko.subscribable.call(observable);
    observable.peek = function() { return _latestValue };
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
    ko.utils.extend(observable, ko.observable['fn']);

    ko.exportProperty(observable, 'peek', observable.peek);
    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);
    
	this.entity.registerObserver(function() {
		observable["notifySubscribers"](self.entity);
	});
    
    return observable;
};

tutao.util.KnockoutObservableAdapter.prototype[ko.observable.protoProperty] = ko.observable;