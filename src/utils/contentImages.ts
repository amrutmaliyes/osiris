// src/utils/contentImages.ts

// Import images using ES Modules syntax
// Adjust paths based on your project structure (assuming assets are in src/assets)
import class1 from '../assets/class1.jpg';
import class2 from '../assets/class2.jpg';
import class3 from '../assets/class3.jpg';
import class4 from '../assets/class4.jpg';
import class5 from '../assets/class5.jpg';
import class6 from '../assets/class6.jpg';
import class7 from '../assets/class7.jpg';
import class8 from '../assets/class8.jpg';
import class9 from '../assets/class9.jpg';
import class10 from '../assets/class10.jpg';
import class11 from '../assets/class11.jpg';
import class12 from '../assets/class12.jpg';
import prenursery from '../assets/prenursery.jpg';
import english from '../assets/english.jpg';
import maths from '../assets/maths.jpg';
import science from '../assets/science.jpg';
import socialstudies from '../assets/socialstudies.jpg';
import notebook from '../assets/notebook.jpg';
import biology from '../assets/biology.jpg';
import chemistry from '../assets/chemistry.jpg';
import physics from '../assets/physics.jpg';
import geography from '../assets/geography.jpg';
import history from '../assets/history.jpg';
import civics from '../assets/civics.jpg';
import businessstudies from '../assets/businessstudies.jpg';
import kannada from '../assets/kannada.jpg';
import hindi from '../assets/hindi.jpg';
import politicalscience from '../assets/politicalscience.jpg';
import resourcesDevelopment from '../assets/resourcesDevelopment.jpg';
import sociology from '../assets/sociology.jpg';
import economics from '../assets/economics.jpg';
import socialscience from '../assets/socialscience.jpg';
import democracy from '../assets/democracy.jpg';
import environmentalstudies from '../assets/environmentalstudies.jpg';
import english1 from '../assets/english1.jpg';
import kannada1 from '../assets/kannada1.png';

// Define a type for the images object
interface ImageMap {
  [key: string]: string;
}

const images: ImageMap = {
  class1,
  class2,
  class3,
  class4,
  class5,
  class6,
  class7,
  class8,
  class9,
  class10,
  class11,
  class12,
  prenursery,
  english,
  maths,
  science,
  socialstudies,
  notebook,
  biology,
  chemistry,
  physics,
  geography,
  history,
  civics,
  businessstudies,
  kannada,
  hindi,
  politicalscience,
  resourcesDevelopment,
  sociology,
  economics,
  socialscience,
  democracy,
  environmentalstudies,
  english1,
  kannada1,
};

export const getClassImage = (className: string): string | null => {
  const normalizedClassName = className.toLowerCase().replace(/\s/g, ''); // Remove spaces and lowercase
  switch (normalizedClassName) {
    case 'class1':
      return images.class1;
    case 'class2':
      return images.class2;
    case 'class3':
      return images.class3;
    case 'class4':
      return images.class4;
    case 'class5':
      return images.class5;
    case 'class6':
      return images.class6;
    case 'class7':
      return images.class7;
    case 'class8':
      return images.class8;
    case 'class9':
      return images.class9;
    case 'class10':
      return images.class10;
    case 'class11':
      return images.class11;
    case 'class12':
      return images.class12;
    case 'prenursery':
      return images.prenursery;
    default:
      console.warn(`Image not found for class name: ${className}`);
      return null; // Or a default image
  }
};

export const getSubjectImage = (subjectName: string): string => {
  const normalizedSubjectName = subjectName.toLowerCase().replace(/\s/g, '');
  // console.log(normalizedSubjectName);

  switch (normalizedSubjectName) {
    case 'english':
      return images.english;
    case 'english1':
      return images.english1;
    case 'maths':
    case 'ಗಣಿತ':
      return images.maths;
    case 'science':
    case 'ವಿಜ್ಞಾನ':
      return images.science;
    case 'socialstudies':
    case 'socialscience':
    case 'ಸಮಾಜವಿಜ್ಞಾನ':
      return images.socialscience;
    case 'biology':
      return images.biology;
    case 'chemistry':
    case 'ರಸಾಯನಶಾಸ್ತ್ರ':
      return images.chemistry;
    case 'physics':
    case 'ಭೌತಶಾಸ್ತ್ರ':
      return images.physics;
    case 'geography':
    case 'ಭೂಗೋಳಶಾಸ್ತ್ರ':
    case 'contemporaryindia':
    case 'geographyourenvironment':
    case 'resourceanddevelopment':
      return images.geography;
    case 'history':
    case 'ಇತಿಹಾಸ':
    case 'ourpast':
    case 'indiaandthecontemporaryworld-ii':
      return images.history;
    case 'civics':
    case 'ಪೌರನೀತಿ':
      return images.civics;
    case 'businessstudy':
    case 'businessstudies':
    case 'ವ್ಯಾಪಾರಅಧ್ಯಯನ':
      return images.businessstudies;
    case 'kannada':
    case 'ಕನ್ನಡ':
      return images.kannada;
    case 'kannada1':
      return images.kannada1;
    case 'hindi':
      return images.hindi;
    case 'politicalscience':
    case 'ರಾಜ್ಯಶಾಸ್ತ್ರ':
    case 'democraticpolitics':
    case 'socialandpoliticallife':
      return images.politicalscience;
    case 'resourcesdevelopment':
      return images.resourcesDevelopment;
    case 'sociology':
    case 'ಸಮಾಜಶಾಸ್ತ್ರ':
      return images.sociology;
    case 'economics':
    case 'ಅರ್ಥಶಾಸ್ತ್ರ':
    case 'understandingeconomics':
      return images.economics;
    case 'democracy':
      return images.democracy;
    case 'environmentalstudies':
    case 'ಪರಿಸರ ಅಧ್ಯಯನ':
      return images.environmentalstudies;
    default:
      console.warn(`Image not found for subject name: ${subjectName}`);
      return images.notebook; // Or a default image
  }
};

export const getGenericFolderImage = (): string => images.notebook; // Assuming notebook.jpg can be a generic folder image

export const isFile = (fileName: string): boolean => {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    // Add more file extensions as needed
    return ['pdf', 'mp4', 'mov', 'avi', 'mkv'].includes(fileExtension || '');
};

export const getFileImage = (fileName: string): string => {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    switch (fileExtension) {
        case 'pdf':
            // Return a PDF icon image if you have one, otherwise a default
            return images.notebook; // Placeholder
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
            // Return a video icon image if you have one, otherwise a default
            return images.notebook; // Placeholder
        default:
            return images.notebook; // Default file icon
    }
}; 