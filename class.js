class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    //console.log('stuff');
    return '(' + this.x + ', ' + this.y + ')';
  }
}
var b = new Point();
b.toString()