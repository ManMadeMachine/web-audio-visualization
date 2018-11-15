export const vertexShaderSource = `
    // an attribute will receive data from the buffer
    attribute vec2 a_position;  // x,y position vector
    uniform vec2 u_resolution;  

    // all shaders have main
    void main(){
        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0-> to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        // gl_Position is a special variable a vertex shader
        // is responsible for setting
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }`;

export const fragmentShaderSource = `
    // fragment shaders don't have a default precision so
    // we need to pick one. mediump is good enough
    precision mediump float;

    uniform vec4 u_color;

    void main(){
        // fragment shader is responsible for gl_FragColor
        gl_FragColor = u_color;
    }`;