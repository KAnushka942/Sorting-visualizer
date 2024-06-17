const n = 40;
let array = [];
let audioCtx = null;
let animationTimeouts = [];

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (AudioContext )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init() {
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];

    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.style.backgroundColor = 'black');

    array = [];
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play() {
    const algorithm = document.getElementById("algorithm").value;
    switch (algorithm) {
        case "bubble":
            animate(bubbleSort([...array]));
            break;
        case "insertion":
            animate(insertionSort([...array]));
            break;
        case "quick":
            animate(quickSort([...array]));
            break;
        case "selection":
            animate(selectionSort([...array]));
            break;
        default:
            console.error("Unknown algorithm selected.");
            break;
    }
}

function animate(moves) {
    if (moves.length == 0) {
        showBars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type == "swap" || move.type == "insert") {
        [array[i], array[j]] = [array[j], array[i]];
    }
    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);
    showBars(move);
    animationTimeouts.push(setTimeout(function () {
        animate(moves);
    }, 30));
}

function bubbleSort(array) {
    const moves = [];
    let swapped;
    do {
        swapped = false;
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return moves;
}

function insertionSort(array) {
    const moves = [];
    for (let i = 1; i < array.length; i++) {
        let current = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > current) {
            array[j + 1] = array[j];
            moves.push({ indices: [j + 1, j], type: "insert" });
            j--;
        }
        array[j + 1] = current;
    }
    return moves;
}

function quickSort(array) {
    const moves = [];

    function partition(left, right) {
        const pivot = array[Math.floor((right + left) / 2)];
        let i = left;
        let j = right;

        while (i <= j) {
            while (array[i] < pivot) {
                i++;
            }
            while (array[j] > pivot) {
                j--;
            }
            if (i <= j) {
                if (i !== j) {
                    moves.push({ indices: [i, j], type: "swap" });
                    [array[i], array[j]] = [array[j], array[i]];
                }
                i++;
                j--;
            }
        }
        return i;
    }

    function sort(left, right) {
        let index;
        if (array.length > 1) {
            index = partition(left, right);
            if (left < index - 1) {
                sort(left, index - 1);
            }
            if (index < right) {
                sort(index, right);
            }
        }
    }

    sort(0, array.length - 1);
    return moves;
}

function selectionSort(array) {
    const moves = [];
    for (let i = 0; i < array.length; i++) {
        let min = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[min]) {
                min = j;
            }
        }
        if (i !== min) {
            moves.push({ indices: [i, min], type: "swap" });
            [array[i], array[min]] = [array[min], array[i]];
        }
    }
    return moves;
}

function showBars(move) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
        }
        container.appendChild(bar);
    }
}

init();