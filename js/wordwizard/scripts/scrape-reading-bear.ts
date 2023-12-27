import fs from 'fs';
import https from 'https';
import puppeteer, { ElementHandle, Page } from 'puppeteer';

type PresentationMode = 'image' | 'video';

const SLIDESHOW_MENU_SELECTOR_TEMPLATE = `.PresentationItem .Title a[href$="PresentationID=$$$"]`;
const IMAGE_SLIDESHOW_SELECTOR = '#btnPresentationType_sf';
const VIDEO_SLIDESHOW_SELECTOR = '#btnPresentationType_ss';
const NEXT_SLIDE_SELECTOR = '#btnNextSlide';
const END_OF_PRESENTATION_SELECTOR = '#EndOfPresentationWindow[style]';
const IMAGE_SELECTOR = '.PresentationImageCopyright + img';
const VIDEO_SELECTOR = '#PresentationPlayerContainer video';
const SENTENCE_SELECTOR = '.KaraokeWord';
// const SENTENCE_SELECTOR = 'span.KaraokeChunk';

// ########################
// ##### MAIN
// ########################

async function crawl(
  presentationId: string,
  presentationMode: PresentationMode,
  outputRoot: string,
): Promise<void> {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  // Reading Bear is janky and you get weird behavior without disabling cache
  await page.setCacheEnabled(false);

  // Navigate to Reading Bear homepage.
  await page.goto('https://www.readingbear.org');

  // Navigate to root page for a particular presentation. This is the page from
  // which you select the presentation mode.
  const menuSelector = SLIDESHOW_MENU_SELECTOR_TEMPLATE.replace('$$$', presentationId);
  const slideshowLink = await page.$(menuSelector);
  if (slideshowLink === null) {
    console.log(`No link for presentation ID ${presentationId} present. Exiting.`);
    process.exit();
  }
  await slideshowLink.click();
  console.log(`Navigated to menu for presentation ${presentationId}`);

  // Start and crawl the slideshow
  const presentationOutputRoot = `${outputRoot}/${presentationId}`;
  console.log(`Starting ${presentationMode} slideshow for presentation ${presentationId}`);
  if (presentationMode === 'image') {
    await startSlideshow(page, IMAGE_SLIDESHOW_SELECTOR);
    await crawlImageSlideshow(page, presentationOutputRoot);
  } else if (presentationMode === 'video') {
    await startSlideshow(page, VIDEO_SLIDESHOW_SELECTOR);
    await crawlVideoSlideshow(page, presentationOutputRoot);
  }
  console.log(`Finished crawling ${presentationMode} slideshow for presentation ${presentationId}`);

  // Close the browser
  await browser.close();
}

async function startSlideshow(page: Page, selector: string): Promise<void> {
  // Wait afterwards because sometimes the "next slide" button won't work
  // properly until the first slide has loaded, which can take an unpredictable
  // amount of time.
  await page.locator(selector).click();
  console.log('Waiting 10 seconds for first slide to load...');
  await wait(10000);
  console.log('Finished wait.');
}

async function crawlImageSlideshow(page: Page, outputRoot: string): Promise<void> {
  let isFinished = false;
  while (!isFinished) {
    if (await pageHasElement(page, IMAGE_SELECTOR)) {
      const url = await getMediaUrl(page, IMAGE_SELECTOR);
      console.log('Detected image:', url);
      downloadFile(url, outputRoot);
    }
    await goToNextSlide(page);
    console.log('Navigated to next slide');
    isFinished = await isSlideshowFinished(page);
  }
}

async function crawlVideoSlideshow(page: Page, outputRoot: string): Promise<void> {
  let isFinished = false;
  let currentSentence = '';
  while (!isFinished) {
    if (await pageHasElement(page, SENTENCE_SELECTOR)) {
      currentSentence = await getSentence(page);
      console.log('Detected sentence:', currentSentence);
    } else if (await pageHasElement(page, VIDEO_SELECTOR)) {
      const url = await getMediaUrl(page, VIDEO_SELECTOR);
      console.log('Detected video:', url);
      const lastUrlComponent = url.split('/').pop()!;
      const basename = lastUrlComponent.split('.')[0];
      const word = basename.split('-')[0];
      downloadFile(url, outputRoot);
      writeSentence(currentSentence, word, outputRoot);
    }
    await goToNextSlide(page);
    console.log('Navigated to next slide');
    isFinished = await isSlideshowFinished(page);
  }
}

// ########################
// ##### UTILITIES
// ########################

async function getElement(page: Page, selector: string): Promise<ElementHandle> {
  const element = await page.waitForSelector(selector);
  if (element === null) {
    throw new Error(`Element ${selector} not found`);
  }
  return element;
}

async function pageHasElement(page: Page, selector: string): Promise<boolean> {
  return (await page.$(selector)) !== null;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function getMediaUrl(page: Page, selector: string): Promise<string> {
  const url = await page.evaluate((selector) => {
    const element = document.querySelector(selector) as HTMLImageElement | HTMLVideoElement;
    return element ? element.src : null;
  }, selector);
  return url!;
}

async function getSentence(page: Page): Promise<string> {
  const elements = await page.$$(SENTENCE_SELECTOR);
  const words = await Promise.all(
    elements.map(async (element) => {
      const chunks = await element.$$eval('span', (spans) => spans.map((span) => span.innerText));
      return chunks.join('');
    }),
  );
  return words.join(' ') + '.';
}

async function goToNextSlide(page: Page): Promise<void> {
  const nextSlideButton = await getElement(page, NEXT_SLIDE_SELECTOR);
  await nextSlideButton.click();
}

async function isSlideshowFinished(page: Page): Promise<boolean> {
  try {
    return (await page.waitForSelector(END_OF_PRESENTATION_SELECTOR, { timeout: 2000 })) !== null;
  } catch (error) {
    return false;
  }
}

// ########################
// ##### I/O
// ########################

async function downloadFile(fileUrl: string, outputRoot: string): Promise<void> {
  const filename = `${outputRoot}/${fileUrl.split('/').pop()}`;
  if (fs.existsSync(filename)) {
    console.log(`File already exists at target location, skipping download (${filename})`);
  } else {
    fs.mkdirSync(outputRoot, { recursive: true });
    return new Promise<void>((resolve, reject) => {
      https
        .get(fileUrl, (res) => {
          if (res.statusCode === 200) {
            const fileStream = fs.createWriteStream(filename);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
              fileStream.close();
              console.log('Downloaded file:', filename);
              resolve();
            });
          } else {
            reject(new Error(`Failed to download file. Status code: ${res.statusCode}`));
          }
        })
        .on('error', (e) => {
          console.error(`Got error: ${e.message}`);
          reject(e);
        });
    });
  }
}

function writeSentence(sentence: string, word: string, outputRoot: string): void {
  const filename = `${outputRoot}/${word}.txt`;
  if (fs.existsSync(filename)) {
    console.log(`Sentence file already exists, skipping write (${filename})`);
  } else {
    fs.mkdirSync(outputRoot, { recursive: true });
    fs.writeFileSync(filename, sentence);
    console.log('Wrote sentence file:', filename);
  }
}

// ########################
// ##### PARSE CLI ARGS AND EXECUTE
// ########################

const OUTPUT_ROOT = '/Users/smackesey/stm/desktop/reading-bear-images';

const presentationId = process.argv[process.argv.length - 2];
const presentationMode = process.argv[process.argv.length - 1];

if (isNaN(parseInt(presentationId))) {
  console.log(`Invalid presentation ID: ${presentationId}`);
  process.exit();
} else if (presentationMode !== 'image' && presentationMode !== 'video') {
  console.log(`Invalid presentation mode: ${presentationMode}`);
  process.exit();
}

console.log(`Crawling presentation ${presentationId} in ${presentationMode} mode`);
console.log(`Output root: ${OUTPUT_ROOT}`);
crawl(presentationId, presentationMode as PresentationMode, OUTPUT_ROOT);
