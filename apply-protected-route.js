import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all .jsx files in dashboard directory
function findDashboardPages(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.jsx') && !item.includes('login')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Function to check if a file already has ProtectedRoute
function hasProtectedRoute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('ProtectedRoute');
}

// Function to check if a file uses DashboardLayout
function usesDashboardLayout(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes('DashboardLayout');
}

// Main execution
const dashboardDir = path.join(__dirname, 'src', 'app', 'dashboard');
const pages = findDashboardPages(dashboardDir);



pages.forEach(page => {
  const relativePath = path.relative(__dirname, page);
  const hasProtected = hasProtectedRoute(page);
  const usesLayout = usesDashboardLayout(page);
  
});