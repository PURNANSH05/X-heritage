import pptxgen from 'pptxgenjs';
const p = new pptxgen();
console.log('LAYOUTS content:', p.LAYOUTS);
console.log('presLayout current value:', p.presLayout);
// Let's try to set layout using standard pptxgen API
try {
  // Let's print out the LAYOUTS key names
  console.log('Supported layouts:', Object.keys(p.LAYOUTS));
} catch (e) {
  console.log('Error listing layouts:', e.message);
}
