const ort = require("onnxruntime-node");

const modelPath = "model/knn_model.onnx";

async function predict(jarak, kecepatan, hambatan) {
  try {
    const session = await ort.InferenceSession.create(modelPath);
    const inputName = session.inputNames[0];

    const inputData = [jarak, kecepatan, hambatan];
    const inputTensor = new ort.Tensor("float32", new Float32Array(inputData), [
      1,
      inputData.length,
    ]);

    const feeds = { [inputName]: inputTensor };
    const outputMap = await session.run(feeds);

    const outputName = session.outputNames[0];
    const prediction = outputMap[outputName].data;

    const integerPart = Math.floor(prediction);
    const microsecondPart = Math.floor((prediction - integerPart) * 1e6);
    const epoch = new Date("2024-01-01T00:00:00Z");
    epoch.setSeconds(epoch.getSeconds() + integerPart);
    epoch.setMilliseconds(
      epoch.getMilliseconds() + Math.floor(microsecondPart / 1000)
    );
    const waktu = epoch.toISOString().substr(11, 8); // mengambil HH:MM:SS dari ISO string

    return waktu; // Return the prediction result
  } catch (error) {
    console.error("Error during inference:", error);
    throw error; // Rethrow error to be caught by the calling function
  }
}
const jarak = 3;
const hambatan = 7;
const kecepatan = 20;

// TO DO:
// - hitung jarak sisa
// - hitung kecepatan

module.exports = async (httpRequest, httpResponse) => {
  try {
    const result = await predict(jarak, kecepatan, hambatan);
    httpResponse.json({ result });
  } catch (error) {
    httpResponse.status(500).send("Error during prediction");
    console.log(error);
  }
};
