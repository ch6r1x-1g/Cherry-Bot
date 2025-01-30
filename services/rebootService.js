const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class RebootService {
  static async performSoftReboot() {
    await execAsync('pm2 reload warning-bot');
  }

  static async performHardReboot() {
    await execAsync('pm2 restart warning-bot');
  }

  static async reboot(type) {
    if (type === 'soft') {
      await this.performSoftReboot();
    } else {
      await this.performHardReboot();
    }
  }
}

module.exports = RebootService; 