/**
 * A simple Firefox OS Script to deal with Pulse Width Modulation, or PWM.
 *
 * PWM can be used for a whole lot of things. Best starters are dimming LED lights or
 * controlling digital servo motors.
 *
 * Pulse Width Modulation is a technique for getting analog results with digital means.
 * Digital control is used to create a square wave, a signal switched between on and off.
 * This on-off pattern can simulate voltages in between full on (3.3 Volts) and off (0 Volts)
 * by changing the portion of the time the signal spends on versus the time that the signal
 * spends off. The duration of "on time" is called the pulse width, or duty cycle. To get
 * varying analog values, you change, or modulate, that pulse width. If you repeat this
 * on-off pattern fast enough with an LED for example, the result is as if the signal is a
 * steady voltage between 0 and 3.3v controlling the brightness of the LED.
 */
window.addEventListener('ready', () => {

    // First we need to set our GPIO pin as PWM output
    navigator.softwarePwm.setPin(2).then(pin2 => {

            /**
             * The period is a consistent time interval in which the on-off pattern is
             * repeated. It's the reverse of the PWM frequency.
             *
             * period [T] = 1 / frequency [F]
             *
             * Regarding a normal servo with a 50Hz signal we would have to set the
             * period to 20 milliseconds, or 20.000.000 nanoseconds. The duty cycle controls
             * the position of the servo. It should be between 0.5 and 2.5 milliseconds.
             * 0% and 100% duty cycle are not valid inputs. 0.5 milliseconds map to full left
             * and 2.5 milliseconds map to full right of the servo. All between controls
             * the angle.
             *
             * If you want to dimm a LED instead of controlling a servo, you should set a
             * much higher frquency. A period of 1 millisecond (1000Hz) should be enough.
             */

            // Set pin PWM period to 1.000.000 nanoseconds (1 millisecond)
            pin2.setPeriod(1000000)
                .then(() => {
                    console.log('period set');
                });

            /**
             * A duty cycle is the percentage of one period in which a signal is on. It's also
             * called pulse width. 100% duty cycle would be the same as setting the voltage to
             * 3.3 Volts (high). 0% duty cycle would be the same as grounding the signal.
             *
             * 50% duty cycle will dimm the LED to 50% brightness.
             */

            // Set pin PWM duty cycle to 50% of period, eq 500.000 nanoseconds (0.5 milliseconds)
            pin2.setDutyCycle(500000)
                .then(() => {
                    console.log('duty cycle set');
                });

            // Enable the PWM signal on this pin
            pin2.enable()
                .then(() => {
                    console.log('enabled');
                });
        })
        .catch(err => {
            console.error(err);
        });
});
