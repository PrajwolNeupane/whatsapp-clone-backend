export default function errorHandler({
    res,
    e,
    title,
    message,
    code,
}) {
    if (e) {
        console.log(`Error on : ${title}`);
        console.log(e);
    }
    return res.status(code).json({
        title,
        message,
        success: false,
    });
}