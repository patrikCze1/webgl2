class Helper {
    constructor () {

    }

    randomInt(range) {
        return Math.floor(Math.random() * range);
    }

    radToDeg(r) {
        return r * 180 / Math.PI;
    }
    
    degToRad(d) {
        return d * Math.PI / 180;
    }
    
}