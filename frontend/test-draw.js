import pptxgen from 'pptxgenjs';

const pres = new pptxgen();
const slide = pres.addSlide();

try {
  // Let's print out what types are valid or check the structure of shapes
  console.log('shapes RECT value:', pres.shapes.RECT);
  console.log('ShapeType rect value:', pres.ShapeType?.rect);
  
  // Let's try drawing with pres.shapes.RECT
  slide.addShape(pres.shapes.RECT, { x: 1, y: 1, w: 2, h: 2, fill: { color: 'FF0000' } });
  console.log('Draw with pres.shapes.RECT succeeded');
} catch (e) {
  console.log('Draw with pres.shapes.RECT failed:', e.message);
}

try {
  // Let's try using a string name for shape directly
  slide.addShape('rect', { x: 1, y: 3, w: 2, h: 2, fill: { color: '00FF00' } });
  console.log('Draw with string "rect" succeeded');
} catch (e) {
  console.log('Draw with string "rect" failed:', e.message);
}

try {
  // Let's try using the class property shapes
  slide.addShape(pptxgen.shapes?.RECT, { x: 1, y: 5, w: 2, h: 2, fill: { color: '0000FF' } });
  console.log('Draw with pptxgen.shapes.RECT succeeded');
} catch (e) {
  console.log('Draw with pptxgen.shapes.RECT failed:', e.message);
}
