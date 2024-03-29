## 3.0.0
- Updated to angular 16  

## 2.9.0
- Feature to share TODO on OS supported media  

## 2.8.0
- Bug fix for incorrect logic behind 'Due next month' label  
- Added new 'Due this month' label  
- Added eslint-plugin-sonarjs plugin with cognitive complexity check  
- More unit and e2e tests  

## 2.7.0
- Improved sorting logic for pending TODOs  
- Added prettier-plugin-tailwindcss plugin  
- UI improvements  

## 2.6.1
- Improved logic for search by arithmetic operators  
- More e2e coverage, split tests into separate files by functionality  

## 2.6.0
- Allow search on past TODOs with negative duedate  
- Fixed search not working for TODOs with label 'Due today'  
- Fixed cypress type errors with new tsconfig.json for cypress  
- Fixed lint-staged not applied only on staged files  

## 2.5.2
- More unit tests  

## 2.5.1
- More e2e tests  
- Dark mode css fixes  

## 2.5.0
- Added feature to show pending todo count  
- More unit and e2e tests  

## 2.4.0
- Added unit tests and cypress e2e to GitHub Actions pipeline  
- Lazy loading of NotFoundComponent to reduce main bundle size  

## 2.3.0
- Added cypress e2e tests  

## 2.2.0
- Added search capability on the performance status of **Completed** TODOs  
- Added unit tests for all components  

## 2.1.2
- Fixed **`Unexpected token 'd', "day" is not valid JSON`** error, caused by missing double quotes  

## 2.1.1
- Named shortcuts for relative path, for easy imports  

## 2.1.0
- Fixed possible infinite loop caused state changes being overwritten by effect  
- Added replacer function to prevent unnecessary attributes being stringified and save storage space  
- Updated unit test cases for dates  

## 2.0.1
- Fixed infinite reload caused by new **@angular/service-worker** API change  
- UI fixes  

## 2.0.0
- Updated to angular 15 (with standalone components, inject function, typed forms)  

## 1.7.1
- Fix for incorrect logic to display feedback for old TODOs  

## 1.7.0
- Added **`later`** label for future TODOs  
- Added default rating for older TODOs in the system  

## 1.6.1
- UI improvements  

## 1.6.0
- Set TODOs as editable only when Incomplete  
- Minor CSS fixes for mobile  

## 1.5.0
- Added feature to track `completedon` and provide feedback  

## 1.4.5
- Fixed zoom-in for input, textarea and select components in iOS  

## 1.4.4
- Updated to latest angular 13  
- Updated pwa icons for iOS  

## 1.4.3
- Set up **lint-staged** with **husky**  

## 1.4.2
- Border for TODOs for better visual
- Added sample unit tests (WIP)  

## 1.4.1
- Bug fixes for dark mode.  

## 1.4.0
- Minor bug fixes.  
- Added support for dark mode.  

## 1.3.0
- UI improvements.  
- Added new badge `Due next month`.  
- Added min date validation.  

## 1.2.0
- Store user action results in localstorage for better UX.  

## 1.1.4
- UI improvements for accessibility.  

## 1.1.3
- Fixed issue of arithmetic operators not working with uppercase search.  

## 1.1.2
- Additional fix for toggle-button background-colour.  

## 1.1.1
- Performance improvement with inline css and font loading.  
- Fixed toggle-button background-colour.  

## 1.1.0
- GitHub Actions automation setup.  
- Tailwind config cleanup and minor UI fix.  

## 1.0.0
- Create, Read, Update and Delete TODOs from browser's LocalStorage.  
- Intelligent search mechanism.  
- PWA software updates.  
