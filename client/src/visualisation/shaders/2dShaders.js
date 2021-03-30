export const vertexShaderSource = `#version 300 es

    in vec4 a_position;

    // all shaders have main
    void main(){
        gl_Position = a_position;
    }
`;

export const fragmentShaderSource = `#version 300 es

    // fragment shaders don't have a default precision so
    // we need to pick one. mediump is good enough
    precision mediump float;

    out vec4 outColor;

    void main(){
        outColor = vec4(1, 0, 0.5, 1);
    }
`;