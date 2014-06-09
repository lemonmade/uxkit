getDifferenceBetweenIndecesInParentSet = ($el1, $el2) ->
    $parentSet = $el1.parent().children()
    index1 = $parentSet.index $el1
    index2 = $parentSet.index $el2
    index2 - index1

root = exports ? this
root.getDifferenceBetweenIndecesInParentSet = getDifferenceBetweenIndecesInParentSet