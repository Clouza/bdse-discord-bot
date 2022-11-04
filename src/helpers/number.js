module.exports = class Number {
  constructor(num) {
    this._num = num;
  }

  commaSeparator() {
    return this._num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
