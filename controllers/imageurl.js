const handleAPICall = (req, res) => {
  const { input } = req.body; // Assuming the input URL is sent in the request body

  const clarifaiRequest = {
    user_app_id: {
      user_id: "openvino",
      app_id: "face-detection",
    },
    inputs: [
      {
        data: {
          image: {
            url: input,
          },
        },
      },
    ],
  };
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key 3db282eedc3849d38702b00105f16f41",
    },
    body: JSON.stringify(clarifaiRequest),
  };

  fetch(
    `https://api.clarifai.com/v2/models/face-detection/outputs`,
    requestOptions
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the API response data as needed
      res.json(data); // Return the response back to the client
    })
    .catch((error) => {
      console.log("error", error);
      res.status(400).json("Error making API call.");
    });
};

export default handleAPICall;
