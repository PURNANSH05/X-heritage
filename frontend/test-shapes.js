import pptxgen from 'pptxgenjs';
const p = new pptxgen();
console.log('shapes on instance:', p.shapes);
console.log('shapes on class:', pptxgen.shapes);
console.log('ShapeType on instance:', p.ShapeType);
console.log('ShapeType on class:', pptxgen.ShapeType);
// Let's see what keys are in shapes if it exists
if (p.shapes) console.log('shapes keys:', Object.keys(p.shapes));
if (pptxgen.shapes) console.log('class shapes keys:', Object.keys(pptxgen.shapes));
