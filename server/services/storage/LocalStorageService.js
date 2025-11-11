const StorageService = require('./StorageService');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

/**
 * Local Storage Service Implementation
 * Stores files on the local filesystem (for development)
 */
class LocalStorageService extends StorageService {
  constructor() {
    super();
    this.baseDir = path.join(__dirname, '../../uploads');
    this.baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    // Ensure base directory exists
    this.ensureBaseDirExists();
  }

  ensureBaseDirExists() {
    if (!fsSync.existsSync(this.baseDir)) {
      fsSync.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Upload a file to local storage
   * @param {Object} file - Multer file object
   * @param {string} folder - Subfolder within uploads
   * @returns {Promise<Object>}
   */
  async uploadFile(file, folder = 'general') {
    try {
      // Create folder if it doesn't exist
      const folderPath = path.join(this.baseDir, folder);
      if (!fsSync.existsSync(folderPath)) {
        await fs.mkdir(folderPath, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const fileName = `${timestamp}-${randomStr}${ext}`;
      const filePath = path.join(folder, fileName);
      const fullPath = path.join(this.baseDir, filePath);

      // Move file to destination (if it's a temporary upload)
      if (file.path) {
        await fs.rename(file.path, fullPath);
      } else if (file.buffer) {
        await fs.writeFile(fullPath, file.buffer);
      }

      // Return standardized response
      return {
        fileUrl: `/uploads/${filePath.replace(/\\/g, '/')}`, // Ensure forward slashes for URLs
        filePath: filePath, // Store relative path for future deletion
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
        storageType: 'local'
      };
    } catch (error) {
      console.error('Local storage upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Delete a file from local storage
   * @param {string} filePath - Relative path to file
   * @returns {Promise<boolean>}
   */
  async deleteFile(filePath) {
    try {
      if (!filePath) return false;

      // Handle both full paths and relative paths
      const fullPath = filePath.startsWith('/uploads/')
        ? path.join(this.baseDir, filePath.replace('/uploads/', ''))
        : path.join(this.baseDir, filePath);

      if (fsSync.existsSync(fullPath)) {
        await fs.unlink(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Local storage delete error:', error);
      return false;
    }
  }

  /**
   * Get public URL for a file
   * @param {string} filePath - Relative path to file
   * @returns {string}
   */
  getFileUrl(filePath) {
    if (!filePath) return null;

    // If already a full URL, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }

    // If starts with /uploads/, construct full URL
    if (filePath.startsWith('/uploads/')) {
      return `${this.baseUrl}${filePath}`;
    }

    // Otherwise, add /uploads/ prefix
    return `${this.baseUrl}/uploads/${filePath}`;
  }

  /**
   * Check if file exists
   * @param {string} filePath - Relative path to file
   * @returns {Promise<boolean>}
   */
  async fileExists(filePath) {
    try {
      if (!filePath) return false;

      const fullPath = filePath.startsWith('/uploads/')
        ? path.join(this.baseDir, filePath.replace('/uploads/', ''))
        : path.join(this.baseDir, filePath);

      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file metadata
   * @param {string} filePath - Relative path to file
   * @returns {Promise<Object>}
   */
  async getFileMetadata(filePath) {
    try {
      const fullPath = filePath.startsWith('/uploads/')
        ? path.join(this.baseDir, filePath.replace('/uploads/', ''))
        : path.join(this.baseDir, filePath);

      const stats = await fs.stat(fullPath);

      return {
        size: stats.size,
        lastModified: stats.mtime,
        created: stats.birthtime
      };
    } catch (error) {
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }

  /**
   * Clean up old files (utility method)
   * @param {number} daysOld - Delete files older than this many days
   * @param {string} folder - Optional folder to clean
   */
  async cleanupOldFiles(daysOld = 30, folder = '') {
    try {
      const targetDir = folder
        ? path.join(this.baseDir, folder)
        : this.baseDir;

      const files = await fs.readdir(targetDir, { withFileTypes: true });
      const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
      let deletedCount = 0;

      for (const file of files) {
        if (file.isFile()) {
          const filePath = path.join(targetDir, file.name);
          const stats = await fs.stat(filePath);

          if (stats.mtime.getTime() < cutoffDate) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        }
      }

      return { success: true, deletedCount };
    } catch (error) {
      console.error('Cleanup error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = LocalStorageService;
