class BaseAIModel {
  constructor(config) {
    if (new.target === BaseAIModel) {
      throw new Error('BaseAIModel is an abstract class and cannot be instantiated directly');
    }
    this.config = config;
  }
}

module.exports = BaseAIModel; 