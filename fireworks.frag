#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define PI2 (PI*2.)

uniform vec2 u_resolution;
uniform float u_time;
 
mat2 rotate2d(float a){
    return mat2(cos(a), -sin(a),
                sin(a),  cos(a));
}

float flowerLayer(vec2 st, int N, float scale, float timeShift){
    
    st /= scale; // Escalamos la capa

    float a = atan(st.x, st.y) + PI; // Calculamos el ángulo
    float r = PI2 / float(N); // Callculamos el tamaño angular de cada pétalo

    float d = cos(floor(0.5 + a/r)*r - a) * (length(st) + mod(a, r)); // Definimos la forma base del pétalo

    float base = 1.0 - smoothstep(0.40, 0.41, d); // Suavizamos el borde del pétalo

    float len = length(st);
    float wave = 0.5 + 0.85 * sin((len*20.0 - u_time*3.0) + timeShift); // Onda para dar animación al patrón

    return base * wave; // Retornamos el resultado final de la capa
}

void main(){
    
    // Normalización de las coordenadas y corrección de aspecto
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    // Visualización en cuadrícula
    float grid = 3.0;
    vec2 gv = uv * grid;  
    vec2 id = floor(gv);
    vec2 st = fract(gv) * 2.0 - 1.0;

    // Rotaciones dispares
    float direction = mod(id.x + id.y, 2.0) * 2.0 - 1.0; 
    float speed = 0.5 + 0.5*mod(id.x + id.y, 2.0); // La velocidad varía según la celda
    float rotation = direction * u_time * speed;
    st = rotate2d(rotation) * st; // Aplicamos la rotación calculada

    // Movimiento lateral para aportar realismo
    float moveDir = direction; 
    float moveSpeed = 0.2;
    st.x += moveDir * sin(u_time*2.0 + id.x + id.y) * moveSpeed;
	
    // Añadimos varias capas para aportar "profundidad"
    float result = 0.0;
    result += flowerLayer(st, 13, 1.0, id.x + id.y);
    result += flowerLayer(st, 13, 1.3, id.x*0.5 + id.y*0.7);
    result += flowerLayer(st, 13, 1.7, id.x*1.0 + id.y*0.3);
    
    // Calculamos el color según la celda
    float t = sin(id.x*12.3 + id.y*7.1);
    vec3 col = vec3(
        0.25 + 0.9*sin(t + 0.5),
        0.05 + 0.5*sin(t + 2.0),
        0.5 + 0.85*sin(t + 4.0)
    ) * result;
    
    gl_FragColor = vec4(col, 1.0); // Asignamos color
}
