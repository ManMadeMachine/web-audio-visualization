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

const geometry = {
    createRectangle,
    createCircle
};

export default geometry;