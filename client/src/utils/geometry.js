import { createGzip } from "zlib";

const createRectangle = (ctx, x, y, width, height) => {
    ctx.fillStyle = `rgba(124, 34, 4, ${height / 2})`;
    ctx.fillRect(x, y, width, height);
}

const geometry = {
    createRectangle
};

export default geometry;