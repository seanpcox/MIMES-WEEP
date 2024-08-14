import { isMobile, isTablet, isIPad13 } from 'react-device-detect';

export function getGameSettings(difficulty) {
  var height, width, numOfMimes;

  switch (difficulty) {
    case 2:
      // ~16% Mime Density
      if (isMobile && !(isTablet || isIPad13)) {
        height = 13;
        width = 9;
        numOfMimes = 18;
      } else {
        height = 16;
        width = 16;
        numOfMimes = 40;
      }
      break;
    case 3:
      // ~20% Mime Density
      if (isTablet || isIPad13) {
        height = 20;
        width = 20;
        numOfMimes = 80;
      } else if (isMobile) {
        height = 14;
        width = 9;
        numOfMimes = 25;
      } else {
        height = 16;
        width = 30;
        numOfMimes = 99;
      }
      break;
    default:
      // ~12% Mime Density
      height = 9;
      width = 9;
      numOfMimes = 10;
      break;
  }

  return [height, width, numOfMimes];
}

export function getMaxCustomHeightWidth() {
  // Max that's fits on my Macbook Pro 2021
  // Scrolling left horizontally can cause the page to go backwards
  var maxHeight = 20;
  var maxWidth = 45;

  // Max of 9 squares fit horizontally on smallest phone I had
  // Allow vertical only scroll, as horizontal scroll can cause the page to go backwards
  if (isMobile && !(isTablet || isIPad13)) {
    maxHeight = 100;
    maxWidth = 9;
  }
  // Max of 20 squares fit horizontally on iPad I have
  // Allow vertical only scroll, as horizontal scroll can cause the page to go backwards
  else if (isTablet || isIPad13) {
    maxHeight = 45;
    maxWidth = 20;
  }

  return [maxHeight, maxWidth];
} 