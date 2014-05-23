function getDifferenceBetweenIndecesInParentSet($el1, $el2) {
    var $parentSet = $el1.parent().children(),
        index1 = $parentSet.index($el1),
        index2 = $parentSet.index($el2);

    return index2 - index1;
}