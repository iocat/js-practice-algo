'use strict'

const BT = 1
const LT = -1
const EQ = 0

const NUMBER_ORDER = (arr, i, j) => arr[j] - arr[i] > 0
    ? LT
    : arr[j] - arr[i] < 0
        ? BT
        : EQ

const swap = (arr, i, j) => { [arr[i], arr[j]] = [arr[j], arr[i]] }

/**
 * sorts the array using bubble sort algorithm
 * 
 * WORST CASE COMPLEXITY & COMPLEXITY: O(n^2) - O(n) for copying the array + O(n^2) for bubbling
 * BEST CASE COMPLEXITY: O(n) for already sorted array - O(n) for copying the array + O(n) for no swaps
 * SPACE COMPLEXITY: O(N) if accounting for immutability. For sorting alone, it needs O(1) space.
 *
 * Stable sort
 * 
 * @param {*} arr the original array
 * @param {*} opts the sorting options 
 */
const sortBubble = (arr, { order } = {
    order: NUMBER_ORDER
}) => {
    if (arr.length === 0 || arr.length === 1) {
        return arr
    }

    const sorted = [...arr]

    for (let bubbled = 0; bubbled < sorted.length - 1; bubbled++) { // bubbled keeps track the bubbling cycle so far
        let swapped = false
        const bubbleUpTo = sorted.length - bubbled - 1
        for (let bubbleInd = 0; bubbleInd <= bubbleUpTo; bubbleInd++) {
            if (order(sorted, bubbleInd, bubbleInd + 1) === BT) {
                swap(sorted, bubbleInd, bubbleInd + 1) // this guarantees arr[bubbleInd] < arr[bubbleInd + 1]
                swapped = true
            } else if (bubbleInd === bubbleUpTo && !swapped) { // bubbled to the end and there has been no swaps so far
                return sorted
            }
        }
    }

    return sorted
}

/**
 * sorts the array using the insertion sort algorithm
 * 
 * WORST CASE COMPLEXITY: O(n^2)
 * BEST CASE COMPLEXITY: O(n) for already sorted array
 * SPACE COMPLEXITY here: O(N) if accounting for immutability. For sorting alone, it needs O(1) space.
 * 
 * @param {*} arr 
 * @param {*} param1 
 */
const sortInsertion = (arr, { order } = {
    order: NUMBER_ORDER
}) => {
    if (arr.length === 0 || arr.length === 1) {
        return arr
    }
    const sorted = [...arr]
    for (let rightLimit = 1; rightLimit < sorted.length; rightLimit++) {
        let pointer = rightLimit
        while (pointer > 0 && order(sorted, pointer - 1, pointer) === BT) { // keeps move the right-most item to the left as possible
            swap(sorted, pointer, pointer - 1) // this guarantees arr[pointer - 1] < arr[pointer]
            pointer--
        }
    }
    return sorted
}


/**
 * 
 * sorts the arry using selection sort algorithm
 * WORST CASE COMPLEXITY: O(n^2)
 * BEST CASE COMPLEXITY: O(n^2)
 * SPACE COMPLEXITY here: O(N) if accounting for immutability. For sorting alone, it needs O(1) space.
 * 
 * 
 * @param {*} arr 
 * @param {*} param1 
 */
const sortSelection = (arr, { order } = {
    order: NUMBER_ORDER
}) => {
    if (arr.length === 0 || arr.length === 1) {
        return arr
    }
    const getMinInd = (arr, start, end) => {
        if (end > arr.length - 1 || start < 0 || start > end) {
            throw new Error('invalid start and end indeces')
        }
        if (end === start) {
            return start
        } else { // guarantees end - start > 1
            let minInd = start
            for (let p = start + 1; p <= end; p++) {
                if (order(arr, minInd, p) === BT) {
                    minInd = p
                }
            }
            return minInd
        }
    }

    const sorted = [...arr]
    for (let i = 0; i < sorted.length; i++) {
        swap(sorted, i, getMinInd(sorted, i, sorted.length - 1))
    }

    return sorted
}

const pickPivotInd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const partition = (sorted, left, right, pivotInd, order) => {
    // partitioning
    swap(sorted, left, pivotInd) // move pivot into the left
    let sortedInd = left
    for (let ind = left + 1; ind <= right; ind++) {
        if (order(sorted, sortedInd, ind) === BT) {
            // moves the pivot to the index, the index to the pivot location
            swap(sorted, ind, sortedInd)
            // moves the pivot now from the index to the location next to the index
            swap(sorted, ind, sortedInd + 1)
        }
    }
    return sortedInd
}

const qSort = (sorted, left, right, order) => {
    if (left === right || left > right) {
        return
    }
    if (right - left === 1) {
        if (order(sorted, left, right) === BT) {
            swap(sorted, left, right)
        }
    }
    const pivotInd = pickPivotInd(left, right)
    const sortedPivotInd = partition(sorted, left, right, pivotInd, order)
    qSort(sorted, left, sortedPivotInd - 1, order)
    qSort(sorted, sortedPivotInd + 1, right, order)
}

/**
 * Sorts the array using quicksort algorithm
 * 
 * ASYMTOTIC COMPLEXITY: O(n*logn)
 * WORST CASE COMPLEXITY: O(N^2) for terribly selected pivots
 * SPACE COMPLEXITY: O(N) if accounting for immutability, otherwise O(1)
 * 
 * @param {*} arr 
 * @param {*} param1 
 */
const sortQuick = (arr, { order } = { order: NUMBER_ORDER }) => {
    if (arr.length === 0 || arr.length === 1) {
        return arr
    }
    const sorted = [...arr]
    qSort(sorted, 0, sorted.length - 1, order)
    return sorted
}



const mergeSorted = (arr1, arr2, order) => {
    let merged = Array(arr1.length + arr2.length), i1 = 0, i2 = 0, i = 0
    while (i1 < arr1.length && i2 < arr2.length) {
        if (order([arr1[i1], arr2[i2]], 0, 1) === BT) {
            merged[i++] = arr2[i2++]
        } else {
            merged[i++] = arr1[i1++]
        }
    }
    while (i2 < arr2.length) {
        merged[i++] = arr2[i2++]
    }
    while (i1 < arr1.length) {
        merged[i++] = arr1[i1++]
    }
    return merged
}

/**
 * sorts the array using mergesort
 * 
 * BEST TIME COMPLEXITY O(N*logN)
 * WORST TIME COMPLEXITY O(N*logN)
 * SPACE COMPLEXITY O(N) accounting for immutability. For sorting alone, it needs temporarily merged arrays
 * 
 * @param {*} arr 
 * @param {*} param1 
 */
const sortMerge = (arr, { order } = { order: NUMBER_ORDER }) => {
    if (arr.length === 0 || arr.length === 1) {
        return arr
    } else if (arr.length === 2) {
        const sorted = [...arr]
        if (order(arr, 0, 1) === BT) {
            swap(sorted, 0, 1)
        }
        return sorted
    }

    const fstHalf = sortMerge(arr.slice(0, Math.floor(arr.length / 2) + 1), {order})
    const sndHalf = sortMerge(arr.slice(Math.floor(arr.length / 2) + 1), {order})
    return mergeSorted(fstHalf, sndHalf, order)
}


module.exports = {
    sortMerge,
    sortQuick,
    sortSelection,
    sortBubble,
    sortInsertion,
    BT, LT, EQ
}