var base64Image = "";
function loadFile(event) {
    const image = event.target.files[0];
    if (image) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        document.getElementById("inputimg").src = e.target.result;
        document.getElementById("inputimg").width = 400;
        document.getElementById("inputimg").height = 400;
        base64Image = e.target.result.replace("data:image/jpeg;base64,", "")
      };

        reader.readAsDataURL(image);
    }
}

function uploadImage() {
    const file = document.getElementById("file").files[0];
    if (!file) {
        alert("Please select a file");
        return;
    }

    // document.getElementById("outputimg").src = ""
    let obj = {
        userId: "yantralivetest@gmail.com",
        base64: base64Image,
    }
    fetch("https://api.mayamaya.us/uploadImageToGCP", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    }).then(async (GCPresponse) => {
        const GCPData = await GCPresponse.json();
        const prompt = document.getElementById("inputprompt").value;
        console.log(GCPData, "GCPData");
        fetch("https://image-enhancement-backend-raviteja-yl.vercel.app", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ fileUrl: GCPData.result, prompt: prompt }),
        }).then(async (replicate_response) => {
            const replicateData = await replicate_response.json();
            let sentence = "";
            for (let i = 0; i < replicateData.result.length; i++) {
                sentence += replicateData.result[i];
            }
            console.log(replicateData, "replicateData");
            document.getElementById("outputtext").innerHTML = sentence;
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
}