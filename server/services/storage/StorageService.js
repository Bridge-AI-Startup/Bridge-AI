/**
 * Storage Service Interface
 * Abstract class that defines the contract for storage services
 */
class StorageService {
  /**
   * Upload a file
   * @param {Object} file - Multer file object
   * @param {string} folder - Folder/prefix for the file
   * @returns {Promise<Object>} - { fileUrl, s3Key/filePath, fileName, fileSize, mimeType }
   */
  async uploadFile(file, folder = 'uploads') {
    throw new Error('uploadFile method must be implemented');
  }

  /**
   * Delete a file
   * @param {string} fileKey - S3 key or file path
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(fileKey) {
    throw new Error('deleteFile method must be implemented');
  }

  /**
   * Get file URL
   * @param {string} fileKey - S3 key or file path
   * @returns {string} - Public URL to access the file
   */
  getFileUrl(fileKey) {
    throw new Error('getFileUrl method must be implemented');
  }

  /**
   * Check if file exists
   * @param {string} fileKey - S3 key or file path
   * @returns {Promise<boolean>} - Exists status
   */
  async fileExists(fileKey) {
    throw new Error('fileExists method must be implemented');
  }

  /**
   * Get file metadata
   * @param {string} fileKey - S3 key or file path
   * @returns {Promise<Object>} - { size, mimeType, lastModified }
   */
  async getFileMetadata(fileKey) {
    throw new Error('getFileMetadata method must be implemented');
  }
}

module.exports = StorageService;
