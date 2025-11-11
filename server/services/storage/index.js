const LocalStorageService = require('./LocalStorageService');
const S3StorageService = require('./S3StorageService');

/**
 * Storage Factory
 * Returns the appropriate storage service based on environment configuration
 */
class StorageFactory {
  static getStorageService() {
    const storageType = process.env.STORAGE_TYPE || 'local';

    switch (storageType.toLowerCase()) {
      case 's3':
      case 'aws':
        console.log('Using AWS S3 Storage Service');
        return new S3StorageService();

      case 'local':
      case 'filesystem':
      default:
        console.log('Using Local Storage Service');
        return new LocalStorageService();
    }
  }

  /**
   * Get storage service instance (singleton pattern)
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = this.getStorageService();
    }
    return this.instance;
  }

  /**
   * Reset instance (useful for testing or switching storage types)
   */
  static resetInstance() {
    this.instance = null;
  }
}

// Export singleton instance
module.exports = StorageFactory.getInstance();

// Also export factory and individual services for advanced use
module.exports.StorageFactory = StorageFactory;
module.exports.LocalStorageService = LocalStorageService;
module.exports.S3StorageService = S3StorageService;
