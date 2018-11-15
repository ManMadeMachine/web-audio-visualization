const createRectangle = (ctx, x, y, width, height) => {
    ctx.fillStyle = `rgba(124, 34, 4, ${height / 2})`;
    ctx.fillRect(x, y, width, height);
}

const createCircle = (ctx, x, y, radius) => {
    ctx.beginPath();
    ctx.fillStyle = `rgb(1, 156, 196)`;
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
}

/* WebGL Geometry helpers */
const setRectangle = (gl, x, y, width, height) => {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2
    ]), gl.STATIC_DRAW);
}


const geometry = {
    createRectangle,
    createCircle,
    setRectangle
};

export default geometry;