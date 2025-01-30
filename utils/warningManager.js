const fs = require('fs').promises;
const path = require('path');

const WARNINGS_FILE = path.join(__dirname, '../data/warnings.json');

class WarningManager {
  constructor() {
    this.warnings = {};
    this.loadWarnings();
  }

  async loadWarnings() {
    try {
      const data = await fs.readFile(WARNINGS_FILE, 'utf8');
      this.warnings = JSON.parse(data).warnings;
    } catch (error) {
      console.error('경고 데이터 로딩 실패:', error);
      this.warnings = {};
      await this.saveWarnings();
    }
  }

  async saveWarnings() {
    try {
      await fs.writeFile(WARNINGS_FILE, JSON.stringify({ warnings: this.warnings }, null, 2));
    } catch (error) {
      console.error('경고 데이터 저장 실패:', error);
    }
  }

  async addWarning(userId, warning) {
    if (!this.warnings[userId]) {
      this.warnings[userId] = [];
    }
    this.warnings[userId].push({
      ...warning,
      timestamp: new Date().toISOString()
    });
    await this.saveWarnings();
    return this.warnings[userId].length;
  }

  getWarnings(userId) {
    return this.warnings[userId] || [];
  }

  async removeWarning(userId, index) {
    if (this.warnings[userId] && this.warnings[userId][index]) {
      this.warnings[userId].splice(index, 1);
      await this.saveWarnings();
      return true;
    }
    return false;
  }

  async clearWarnings(userId) {
    if (this.warnings[userId]) {
      delete this.warnings[userId];
      await this.saveWarnings();
      return true;
    }
    return false;
  }
}

module.exports = new WarningManager(); 