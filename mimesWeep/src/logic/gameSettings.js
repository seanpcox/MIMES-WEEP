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