navigator.softwarePwm = {
    _timerUuid: 0,
    _intervals: {},
    _timeouts: {},
    _pins: {},

    _clearInterval: function (id) {
        if (this._intervals[id]) {
            delete this._intervals[id];
        }
    },

    _setInterval: function (callback, delay) {
        let id = ++this._timerUuid,
            start = window.performance.now() * 1000000;

        this._intervals[id] = true;

        let check = () => {
            if (this._intervals[id]) {
                let now = window.performance.now() * 1000000;
                if (now - start > delay) {
                    callback();
                    start = now;
                }
                setTimeout(check, 0);
            }
        };
        setTimeout(check, 0);
        return id;
    },

    _clearTimeout: function (id) {
        if (this._timeouts[id]) {
            delete this._timeouts[id];
        }
    },

    _setTimeout: function (callback, delay) {
        let id = ++this._timerUuid,
            start = window.performance.now() * 1000000;

        this._timeouts[id] = true;

        let check = () => {
            if (this._timeouts[id]) {
                let now = window.performance.now() * 1000000;
                if (now - start > delay) {
                    delete this._timeouts[id];
                    callback();
                    start = now;
                } else {
                    setTimeout(check, 0);
                }
            }
        };
        setTimeout(check, 0);
        return id;
    },

    setPin: function (pinNum) {
        return navigator.gpio
            .setPinMode(pinNum, 'output')
            .then(pin => {
                this._pins[pinNum] = new SoftwarePwmPin(pinNum, pin);
                return this._pins[pinNum];
            })
            .catch(err => {
                console.error('Setting software PWM pin', pinNum, 'failed', err);
                throw err;
            });
    }
};

function SoftwarePwmPin(pinNum, pin) {
    this.pinNum = pinNum;
    this.pin = pin;
    this.period = 0;
    this.dutyCycle = 0;
    this.periodId = 0;
    this.dutyCycleId = 0;
}

SoftwarePwmPin.prototype.enable = function () {
    return Promise.resolve().then(() => {
        this.periodId = navigator.softwarePwm._setInterval(() => {
            this.pin.writeDigital(1);
            this.dutyCycleId = navigator.softwarePwm._setTimeout(() => {
                this.pin.writeDigital(0);
            }, this.dutyCycle);
        }, this.period);
    });
};

SoftwarePwmPin.prototype.disable = function () {
    return Promise.resolve().then(() => {
        navigator.softwarePwm._clearInterval(this.periodId);
        navigator.softwarePwm.clearTimeout(this.dutyCycleId);
        this.periodId = 0;
        this.dutyCycleId = 0;
    });
};

SoftwarePwmPin.prototype.isEnabled = function () {
    return Promise.resolve(this.periodId !== 0);
};

SoftwarePwmPin.prototype.setDutyCycle = function (nanoseconds) {
    return Promise.resolve().then(() => {
        this.dutyCycle = nanoseconds;
    });
};

SoftwarePwmPin.prototype.getDutyCycle = function () {
    return Promise.resolve(this.dutyCycle);
};

SoftwarePwmPin.prototype.setPeriod = function (nanoseconds) {
    return Promise.resolve().then(() => {
        this.period = nanoseconds;
    });
};

SoftwarePwmPin.prototype.getPeriod = function () {
    return Promise.resolve(this.period);
};

SoftwarePwmPin.prototype.release = function () {
    return Promise.resolve().then(() => {
        this.disable();
        this.pin.release();
    });
};
