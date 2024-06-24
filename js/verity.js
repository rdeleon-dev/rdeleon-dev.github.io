const spots = document.querySelectorAll('div[id^=spot] > img');
const guardians = document.querySelectorAll('div[id^=shape] > img');

const shapes = {
    0: 'c',
    1: 's',
    2: 't'
};

var shapeHolding = [];

var possibleDrops = shuffler(shapes);
var threeD = generateThreeDShapes(possibleDrops);
var shapesToSwap = [];

//display callouts
document.getElementById('callouts').innerText = Object.values(possibleDrops).join('').toUpperCase(); 

//display shape
var buff = document.getElementById('buff');
buff.innerText = shapeHolding;

// display three d shapes
for (const [key, value] of Object.entries(possibleDrops)) {

    const shape = document.getElementById(`shape${key}`); 
    const shapes = [value, threeD[key]];
    displayShape(shape, shapes);

}

spots.forEach(spot => {
    spot.addEventListener('click', e => {

        
        var index = randomizeDrop(possibleDrops);
        const shape = possibleDrops[index];

        if(e.target.dataset.type == 'enemy')
        {
            e.target.src = "img/"+shape+".png";
            e.target.dataset.type = 'shape';
            e.target.dataset.shape = shape;

            delete possibleDrops[index];
        }
        else
        {
            // e.target.src = "img/hive.png";
            if(shapeHolding.length < 2)
            {
                e.target.src = '';
                shapeHolding.push(e.target.dataset.shape)
                buff.innerText = shapeToWord(shapeHolding)
                e.target.dataset.type = 'blank';
            }
            
        }
    });
})

guardians.forEach(guardian => {
    guardian.addEventListener('click', e => {
        if(shapeHolding.length == 1 && e.target.dataset.swapShape == '') {
            e.target.dataset.swapShape = shapeHolding;
            e.target.nextElementSibling.style = "display: block";
            shapeHolding = [];
            buff.innerText = '';
            shapesToSwap.push(e.target);
        }

        if(shapesToSwap.length == 2) {
            swapShapes();
        }
        
        if(shapeHolding.length == 2) {
            shapeHolding = [];
            buff.innerText = '';
        }

        if(Object.keys(possibleDrops).length == 0) {
            spawnKnights();
        }

    });
});

const randomizeDrop = obj => {
    var keys = Object.keys(obj);

    if(keys.length == 1)
        return keys[0];

    return keys[keys.length * Math.random() << 0];
};

function generateThreeDShapes(obj) {
    const rand = Math.floor(Math.random() * 3) + 1;

    switch(rand) {
        case 1:
            return shiftValuesUp(obj);
        case 3:
            return shiftValuesDown(obj);
        default:
            return obj;
    }
}

function shuffler(obj) {
    // Step 1: Extract values into an array
    var values = Object.values(obj);

    // Step 2: Shuffle the array (using Fisher-Yates shuffle algorithm)
    for (var i = values.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = values[i];
        values[i] = values[j];
        values[j] = temp;
    }

    // Step 3: Assign shuffled values back to the object properties
    var shuffledObj = {};
    Object.keys(obj).forEach(function(key, index) {
        shuffledObj[key] = values[index];
    });

    return shuffledObj;
}

// Function to shift values up
function shiftValuesUp(obj) {
    const keys = Object.keys(obj);
    const maxIndex = keys.length - 1;

    const shiftedObj = {};
    keys.forEach(key => {
        const currentIndex = parseInt(key);
        const newIndex = (currentIndex + 1) % (maxIndex + 1); // Wrap around using modulus
        shiftedObj[newIndex] = obj[key];
    });

    return shiftedObj;
}

// Function to shift values down
function shiftValuesDown(obj) {
    const keys = Object.keys(obj);
    const maxIndex = keys.length - 1;

    const shiftedObj = {};
    keys.forEach(key => {
        const currentIndex = parseInt(key);
        const newIndex = (currentIndex - 1 + (maxIndex + 1)) % (maxIndex + 1); // Wrap around using modulus
        shiftedObj[newIndex] = obj[key];
    });

    return shiftedObj;
}

function shapeToWord(shape) {
    shape = shape.sort().join('');
    switch(shape) {
        case 'c':
            return 'Orbicular';
        case 's':
            return 'Quadrate';
        case 't':
            return 'Triage';
        case 'cs':
            return 'Cylindroid';
        case 'ct':
            return 'Conoid';
        case 'st':
            return 'Trilateral';
    }
}

function spawnKnights() {
    console.log('test');
    possibleDrops = shuffler(shapes);
    spots.forEach(spot => {
        spot.dataset.type = 'enemy';
        spot.src = 'img/hive.png';
    })
}

function displayShape(shape, shapes) {
    joinedShape = shapes.sort().join('');
    shape.dataset.shape = joinedShape;
    shape.style.backgroundImage = `url("../img/${joinedShape}.png"`;
}

function swapShapes() {
    const element1 = shapesToSwap[0];
    const shapeElement1 = element1.parentElement;
    const element2 = shapesToSwap[1];
    const shapeElement2 = element2.parentElement
    
    var shape1 = shapeElement1.dataset.shape.replace(element1.dataset.swapShape, element2.dataset.swapShape).split('');
    var shape2 = shapeElement2.dataset.shape.replace(element2.dataset.swapShape, element1.dataset.swapShape).split('');

    element1.nextElementSibling.style = "display: none;";
    element1.dataset.swapShape = '';

    element2.nextElementSibling.style = "display: none;";
    element2.dataset.swapShape = '';

    displayShape(shapeElement1, shape1);
    displayShape(shapeElement2, shape2);

    shapesToSwap = [];
}