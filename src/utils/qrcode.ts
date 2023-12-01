import QRCode from "qrcode";

export const generateQR = async (text: string) => {
  try {
    // console.log(await QRCode.toDataURL(text));
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error(err);
  }
};
