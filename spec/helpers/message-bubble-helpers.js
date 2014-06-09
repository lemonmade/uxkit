(function() {
  var getDifferenceBetweenIndecesInParentSet, root;

  getDifferenceBetweenIndecesInParentSet = function($el1, $el2) {
    var $parentSet, index1, index2;
    $parentSet = $el1.parent().children();
    index1 = $parentSet.index($el1);
    index2 = $parentSet.index($el2);
    return index2 - index1;
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.getDifferenceBetweenIndecesInParentSet = getDifferenceBetweenIndecesInParentSet;

}).call(this);
