const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to a typical desktop size
  await page.setViewportSize({ width: 1280, height: 800 });

  // Go to the local server
  await page.goto('http://127.0.0.1:8000');

  // Make sure planner list is visible
  await page.click('[data-target="planner"]');
  await page.waitForTimeout(500);

  // Type into it rapidly to trigger the input event
  await page.fill('.planner-input:first-child', 'Rapidly typing test');

  // Wait for the debounce to trigger the save
  await page.waitForTimeout(1000);

  // Reload the page to check if it saved
  await page.reload();

  // Wait for the planner to render again
  await page.waitForSelector('.planner-input', { state: 'attached' });

  // Make sure planner list is visible
  await page.click('[data-target="planner"]');
  await page.waitForTimeout(500);

  // Take a screenshot
  await page.screenshot({ path: 'planner-screenshot.png' });

  const val = await page.inputValue('.planner-input:first-child');
  if (val === 'Rapidly typing test') {
      console.log('Value successfully retrieved after reload - debounce is working correctly.');
  } else {
      console.log('Value NOT retrieved after reload:', val);
  }

  await browser.close();
  console.log("Screenshot saved to planner-screenshot.png");
})();
