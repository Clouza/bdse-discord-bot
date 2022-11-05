module.exports = class String {
  constructor(string) {
    this._string = string;
  }

  firstLetterUpperCase() {
    return this._string.charAt(0).toUpperCase() + this._string.slice(1);
  }
};
