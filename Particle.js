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


class Particle {
    static _idx = 0;

    // Координаты
    X = 0;
    Y = 0;

    // Уникальное значение
    IDX = -1;

    // Радиус для отрисовки
    #R = 5;

    // Радиус для отрисовки начального значения
    static R_ = 5;

    // Скорость
    Velocity = 0;

    // Направление скорости
    Velocity_Vector = new Vector(1, 0);

    // Заряд
    Q = 0;

    // Масса
    Mass = 1;

    constructor(x=0, y=0, v=1, q=0, vector_x=1, vector_y=0, mass = 1, need_to_count = true) {
        if (v < 0) throw new Error("Particle: Velocity is negative");
        this.X = x;
        this.Y = y;
        this.Velocity = v;
        if (v === 0) {
            this.Velocity_Vector = new Vector(0, 0);
        } else {
            this.Velocity_Vector = new Vector(vector_x, vector_y);
            this.Velocity_Vector.normalize();
        }
        this.Q = q;
        this.IDX = Particle._idx;
        if (need_to_count)
            Particle._idx++;
        this.Mass = mass;
    }

    calc_new_position_with_acceleration(e_field, vector_e_dir_down = true, time = 1) {
        // e_field  - напряженность поля

        // vector_e - направление поля
        //  true  -> направлено вниз
        //  false -> направлено вверх

        // Посчитали вектор силы
        let vector_force = (new Vector(0, vector_e_dir_down ? 1 : -1)).multiply(e_field).multiply(this.Q);

        // Нашли вектор ускорения
        let vector_acceleration = Vector.divide(vector_force, this.Mass);
        let acceleration_module = vector_acceleration.length();
        vector_acceleration.normalize();

        // Расчет новой позиции:
        this.X = this.X + (this.Velocity_Vector.x * this.Velocity * time + acceleration_module * vector_acceleration.x * time * time / 2) * 1000;
        this.Y = this.Y + (this.Velocity_Vector.y * this.Velocity * time + acceleration_module * vector_acceleration.y * time * time / 2) * 1000;

        this.Velocity_Vector.multiply(this.Velocity);
        this.Velocity_Vector.x += acceleration_module * vector_acceleration.x * time;
        this.Velocity_Vector.y += acceleration_module * vector_acceleration.y * time;
        this.Velocity = this.Velocity_Vector.length();
        this.Velocity_Vector.normalize();
    }

    calc_new_pos_without_acceleration(time = 1) {
        this.Velocity_Vector.normalize();
        this.X = this.X + this.Velocity_Vector.x * this.Velocity * 1000 * time;
        this.Y = this.Y + this.Velocity_Vector.y * this.Velocity * 1000 * time;
    }

    in_electric_field() {
        // ToDO: параметризовать ширину?
        return (new Point(this.X, this.Y)).inside_rectangle(new Point(canvas.width / 2, 0), new Point(canvas.width, canvas.height));
    }

    next_step(e_field, vector_e_dir_down, time = 1) {
        if (this.Q === 0 || !this.in_electric_field()) {
            this.calc_new_pos_without_acceleration(time);
        } else {
            // Q !== 0
            this.calc_new_position_with_acceleration(e_field, vector_e_dir_down, time);
        }
    }

    draw_arrow_velocity() {

        let tmp_vector = new Vector(this.Velocity_Vector.x, this.Velocity_Vector.y);
        tmp_vector.normalize();
        tmp_vector.multiply(this.Velocity);
        tmp_vector.multiply(20 / Math.pow(10, 6));

        ctx.save();

        ctx.beginPath();
        canvas_arrow(ctx, this.X, this.Y, this.X + tmp_vector.x, this.Y + tmp_vector.y);
        ctx.stroke();

        ctx.restore();
    }

    draw() {
        ctx.save();

        this.draw_arrow_velocity();
        ctx.beginPath();
        ctx.arc(this.X, this.Y, this.#R, 0, 2 * Math.PI, true);

        if (selected_element === this.IDX) {
            ctx.fillStyle = "rgb(255,0,0)";
        }

        ctx.fill();
        ctx.restore();
    }

    in_view() {
        return (new Point(this.X - this.#R, this.Y - this.#R)).inside_rectangle() ||
               (new Point(this.X + this.#R, this.Y - this.#R)).inside_rectangle() ||
               (new Point(this.X - this.#R, this.Y + this.#R)).inside_rectangle() ||
               (new Point(this.X + this.#R, this.Y + this.#R)).inside_rectangle();
    }
}