/*
// Моя попытка написать класс

class Vector {
    // Только направление
    X = 0;
    Y = 0;

    // Значение == модуль
    V = 0;

    constructor(x, y, v) {
        this.X = x;
        this.Y = y;
        this.V = v;
    }

    operator_plus(other) {
        if (typeof this !== typeof other) {
            console.log("This should never happen: vector + not a vector");
            throw new Error("Vector: Trying to add not a vector");
        }


    }
}
*/

// Взято с: https://gist.github.com/winduptoy/a1aa09c3499e09edbd33
// Нужен только для определения направления
// ToDO: руками поддерживать единичную длину

function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

/* INSTANCE METHODS */

Vector.prototype = {
    negative: function() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    },
    add: function(v) {
        if (v instanceof Vector) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    },
    subtract: function(v) {
        if (v instanceof Vector) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= v;
        }
        return this;
    },
    multiply: function(v) {
        if (v instanceof Vector) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    },
    divide: function(v) {
        if (v instanceof Vector) {
            if(v.x !== 0) this.x /= v.x;
            if(v.y !== 0) this.y /= v.y;
        } else {
            if(v !== 0) {
                this.x /= v;
                this.y /= v;
            }
        }
        return this;
    },
    equals: function(v) {
        return this.x === v.x && this.y === v.y;
    },
    dot: function(v) {
        return this.x * v.x + this.y * v.y;
    },
    cross: function(v) {
        return this.x * v.y - this.y * v.x
    },
    length: function() {
        return Math.sqrt(this.dot(this));
    },
    normalize: function() {
        return this.divide(this.length());
    },
    min: function() {
        return Math.min(this.x, this.y);
    },
    max: function() {
        return Math.max(this.x, this.y);
    },
    toAngles: function() {
        return -Math.atan2(-this.y, this.x);
    },
    angleTo: function(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    },
    toArray: function(n) {
        return [this.x, this.y].slice(0, n || 2);
    },
    clone: function() {
        return new Vector(this.x, this.y);
    },
    set: function(x, y) {
        this.x = x; this.y = y;
        return this;
    }
};

/* STATIC METHODS */
Vector.negative = function(v) {
    return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
    if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
    else return new Vector(a.x + b, a.y + b);
};
Vector.subtract = function(a, b) {
    if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
    else return new Vector(a.x - b, a.y - b);
};
Vector.multiply = function(a, b) {
    if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
    else return new Vector(a.x * b, a.y * b);
};
Vector.divide = function(a, b) {
    if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
    else return new Vector(a.x / b, a.y / b);
};
Vector.equals = function(a, b) {
    return a.x === b.x && a.y === b.y;
};
Vector.dot = function(a, b) {
    return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
    return a.x * b.y - a.y * b.x;
};



// ---------------------------------------------------------------------------------------------------------------------



class Particle {
    static _idx = 0;

    // Координаты
    X = 0;
    Y = 0;

    // Уникальное значение
    IDX = -1;

    // Радиус для отрисовки
    #R = 5;

    // Скорость
    Velocity = 0;

    // Направление скорости
    Velocity_Vector = new Vector(1, 0);

    // Заряд
    Q = 0;

    constructor(x=0, y=0, v=0, q=0, vector=new Vector(1, 0)) {
        this.X = x;
        this.Y = y;
        this.Velocity = v;
        this.Velocity_Vector = vector;
        this.Q = q;
        this.IDX = Particle._idx++;
    }

    // ToDO
    calc_new_position(e_field, vector_e) {
        // e_field  - напряженность поля
        // vector_e - направление поля

        if (vector_e.length() - 1.0 < 0.01)
            vector_e.normalize();

    }

    calc_new_pos_without_acceleration(time = 1) {
        this.Velocity_Vector.normalize();
        this.X = this.X + this.Velocity_Vector.x * this.Velocity * time;
        this.Y = this.Y + this.Velocity_Vector.y * this.Velocity * time;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.#R, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    in_view() {
        class Point {
            X = 0;
            Y = 0;

            constructor(x, y) {
                this.X = x;
                this.Y = y;
            }

            inside_rectangle(p1 = new Point(0, 0), p2= new Point(canvas.width - 1, canvas.height - 1)) {
                return this.X >= p1.X && this.X <= p2.X && this.Y >= p1.Y && this.Y <= p2.Y;
            }
        }

        return (new Point(this.X - this.#R, this.Y - this.#R)).inside_rectangle() ||
               (new Point(this.X + this.#R, this.Y - this.#R)).inside_rectangle() ||
               (new Point(this.X - this.#R, this.Y + this.#R)).inside_rectangle() ||
               (new Point(this.X + this.#R, this.Y + this.#R)).inside_rectangle();
    }
}